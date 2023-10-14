const DB = require("../models/sub_category");
const { saveSingleFile, deleteFile } = require("../utils/file");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  try {
    const sub_categories = await DB.find();
    Helper.fMsg(res, "All Sub Categories", sub_categories);
  } catch (error) {
    Helper.sendError(
      500,
      `Error fetching sub categories: ${error.message}`,
      next
    );
  }
};

const add = async (req, res, next) => {
  try {
    const dbSubCategory = await DB.findOne({ name: req.body.name });
    if (dbSubCategory) {
      Helper.sendError(409, "Sub category name is already in use.", next);
      return;
    }
    saveSingleFile("image", req);
    await new DB(req.body).save();
    const result = await DB.findOne({ name: req.body.name });
    Helper.fMsg(res, "Sub category added successfully.", result);
  } catch (error) {
    Helper.sendError(500, `Error adding sub category: ${error.message}`, next);
  }
};

const get = async (req, res, next) => {
  try {
    const subCategory = await DB.findById(req.params.id);
    if (!subCategory) {
      Helper.sendError(
        404,
        `No Records Found for request ID - ${req.params.id}`,
        next
      );
      return;
    }
    Helper.fMsg(
      res,
      `Sub category for request ID - ${req.params.id}`,
      subCategory
    );
  } catch (error) {
    Helper.sendError(
      500,
      `Error fetching sub category: ${error.message}`,
      next
    );
  }
};

const patch = async (req, res, next) => {
    try {
      const dbSubCategory = await DB.findById(req.params.id);
      if (!dbSubCategory) {
        Helper.sendError(
          404,
          `No Records found for requested id - ${req.params.id}`,
          next
        );
        return;
      }
      if (!req.body.name && !req.files) {
        Helper.sendError(400, "Provide data ( name or image ) to update.", next);
        return;
      }
      if (req.body.name && req.files) {
        if (
          req.body.name === dbSubCategory.name &&
          req.files.image &&
          req.files.image.name === dbSubCategory.image
        ) {
          Helper.sendError(400, "Sub category is up to date.", next);
          return;
        }
      } else {
        if (
          req.body.name === dbSubCategory.name ||
          (req.files &&
            req.files.image &&
            req.files.image.name === dbSubCategory.image)
        ) {
          Helper.sendError(400, "Sub category is up to date.", next);
          return;
        }
      }
      const updateData = { updated_at: Helper.currentDate() };
      if (req.body.name) {
        updateData["name"] = req.body.name;
      }
      if (req.files && req.files.image) {
        deleteFile(dbSubCategory.image);
        saveSingleFile("image", req);
        updateData["image"] = req.files.image.name;
      }
      await DB.findByIdAndUpdate(dbSubCategory._id, updateData);
      const result = await DB.findById(dbSubCategory._id);
      Helper.fMsg(res, "Sub category updated successfully!", result);
    } catch (error) {
      Helper.sendError(500, `Error updating sub category: ${error.message}`, next);
    }
  };

const drop = async (req, res, next) => {
  try {
    const dbSubCategory = await DB.findById(req.params.id);
    if (!dbSubCategory) {
      Helper.sendError(
        404,
        `No Records Found for request ID - ${req.params.id}`,
        next
      );
      return;
    }
    await DB.findByIdAndDelete(dbSubCategory._id);
    deleteFile(dbSubCategory.image);
    Helper.fMsg(res, `Sub category deleted successfully.`);
  } catch (error) {
    Helper.sendError(
      500,
      `Error deleding sub category: ${error.message}`,
      next
    );
  }
};

module.exports = { all, add, get, patch, drop };
