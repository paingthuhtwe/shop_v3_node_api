const DB = require("../models/child_category");
const SubCategoryDB = require("../models/sub_category");
const { saveSingleFile, deleteFile } = require("../utils/file");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  try {
    const sub_categories = await DB.find().select("-__v");
    Helper.fMsg(res, "All Child Categories", sub_categories);
  } catch (error) {
    Helper.sendError(
      500,
      `Error fetching child categories: ${error.message}`,
      next
    );
  }
};

const add = async (req, res, next) => {
  try {
    const [dbChildCategory, dbSubCategory] = [
      await DB.findOne({ name: req.body.name }),
      await SubCategoryDB.findById(req.body.sub_category_id),
    ];
    if (dbChildCategory) {
      Helper.sendError(409, "Child category name is already in use.", next);
      return;
    }
    if (!dbSubCategory) {
      Helper.sendError(404, "Child category does not exist.", next);
      return;
    }
    saveSingleFile("image", req);
    const { name, image } = req.body;
    const child_category = await new DB({
      name,
      image,
    }).save();
    await SubCategoryDB.findByIdAndUpdate(dbSubCategory._id, {
      $push: { child_categories: child_category._id },
      updated_at: Helper.currentDate(),
    });
    const result = await DB.findOne({ name: req.body.name });
    Helper.fMsg(res, "Child Category added successfully.", result);
  } catch (error) {
    Helper.sendError(
      500,
      `Error adding child category: ${error.message}`,
      next
    );
  }
};

const get = async (req, res, next) => {
  try {
    const childCategory = await DB.findById(req.params.id).select("-__v");
    if (!childCategory) {
      Helper.sendError(404, "Child category does not exist.", next);
      return;
    }
    Helper.fMsg(res, "Child Category", childCategory);
  } catch (error) {
    Helper.sendError(500, `Error getting child category: ${error.message}`, next);
  }
}

const patch = async (req, res, next) => {
  try {
    const dbChildCategory = await DB.findById(req.params.id);
    if (!dbChildCategory) {
      Helper.sendError(404, "Child category does not exist.", next);
      return;
    }
    if (!req.body.name && !req.files) {
      Helper.sendError(400, "Provide data ( name or image ) to update.", next);
      return;
    }
    if (
      req.body.name &&
      req.files &&
      req.body.name === dbChildCategory.name &&
      req.files.image &&
      req.files.image.name === dbChildCategory.image
    ) {
      Helper.sendError(400, "Child category is up to date.", next);
      return;
    }
    const updateData = { updated_at: Helper.currentDate() };
    if (req.body.name) {
      updateData["name"] = req.body.name;
    }
    if (req.files && req.files.image) {
      deleteFile(dbChildCategory.image);
      saveSingleFile("image", req);
      updateData["image"] = req.body.image;
    }
    await DB.findByIdAndUpdate(dbChildCategory._id, updateData);
    const result = await DB.findById(dbChildCategory._id).select("-__v");
    Helper.fMsg(res, "Child category updated successfully", result);
  } catch (error) {
    Helper.sendError(
      500,
      `Error updating child category: ${error.message}`,
      next
    );
  }
};

const drop = async (req, res, next) => {
  try {
    const dbChildCategory = await DB.findById(req.params.id);
    if (!dbChildCategory) {
      Helper.sendError(404, "Child category does not exist.", next);
      return;
    }
    await DB.findByIdAndDelete(dbChildCategory._id);
    await SubCategoryDB.updateMany({ child_categories: req.params.id }, { $pull: { child_categories: req.params.id }, updated_at: Helper.currentDate()});
    deleteFile(dbChildCategory.image);
    Helper.fMsg(res, "Child category deleted successfully");
  } catch (error) {
    Helper.sendError(500, `Error deleting child category: ${error.message}`, next);
  }
}

module.exports = { all, add, get, patch, drop };
