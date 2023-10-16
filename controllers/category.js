const DB = require("../models/category");
const SubCategoryDB = require("../models/sub_category");
const { saveSingleFile, deleteFile } = require("../utils/file");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  try {
    const categories = await DB.find()
      .populate({path: "sub_categories", select: '-__v', populate: { path: "child_categories", select: '-__v'}})
      .select("-__v");
    Helper.fMsg(res, "All Categories", categories);
  } catch (error) {
    Helper.sendError(500, `Error fetching categories: ${error.message}`, next);
  }
};

const add = async (req, res, next) => {
  try {
    const dbCategory = await DB.findOne({ name: req.body.name });
    if (dbCategory) {
      Helper.sendError(409, "Category name is already in use.", next);
      return;
    }
    saveSingleFile("image", req);
    await new DB(req.body).save();
    const result = await DB.findOne({ name: req.body.name })
      .populate("sub_categories", "-__v")
      .select("-__v");
    Helper.fMsg(res, "Category added successfully.", result);
  } catch (error) {
    Helper.sendError(500, `Error adding category: ${error.message}`, next);
  }
};

const get = async (req, res, next) => {
  try {
    const category = await DB.findById(req.params.id)
      .populate("sub_categories", "-__v")
      .select("-__v");
    if (!category) {
      Helper.sendError(
        404,
        `No Records found for requested id - ${req.params.id}`,
        next
      );
      return;
    }
    Helper.fMsg(res, `Category for id - ${req.params.id}`, category);
  } catch (error) {
    Helper.sendError(500, `Error fetching category: ${error.message}`, next);
  }
};

const patch = async (req, res, next) => {
  try {
    const dbCategory = await DB.findById(req.params.id);
    if (!dbCategory) {
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
        req.body.name === dbCategory.name &&
        req.files.image &&
        req.files.image.name === dbCategory.image
      ) {
        Helper.sendError(400, "Category is up to date.", next);
        return;
      }
    } else {
      if (
        req.body.name === dbCategory.name ||
        (req.files &&
          req.files.image &&
          req.files.image.name === dbCategory.image)
      ) {
        Helper.sendError(400, "Category is up to date.", next);
        return;
      }
    }
    const updateData = { updated_at: Helper.currentDate() };
    if (req.body.name) {
      updateData["name"] = req.body.name;
    }
    if (req.files && req.files.image) {
      deleteFile(dbCategory.image);
      saveSingleFile("image", req);
      updateData["image"] = req.files.image.name;
    }
    await DB.findByIdAndUpdate(dbCategory._id, updateData);
    const result = await DB.findById(dbCategory._id)
      .populate("sub_categories", "-__v")
      .select("-__v");
    Helper.fMsg(res, "Category updated successfully!", result);
  } catch (error) {
    Helper.sendError(500, `Error updating category: ${error.message}`, next);
  }
};

const drop = async (req, res, next) => {
  try {
    const dbCategory = await DB.findById(req.params.id);
    if (dbCategory) {
      await DB.findByIdAndDelete(dbCategory._id);
      deleteFile(dbCategory.image);
      Helper.fMsg(res, "Category deleted successfully!");
    } else {
      Helper.sendError(
        404,
        `No Records found for requested id - ${req.params.id}`,
        next
      );
    }
  } catch (error) {
    Helper.sendError(500, `Error deleting category: ${error.message}`, next);
  }
};

const addSubCategory = async (req, res, next) => {
  try {
    const [dbCategory, dbSubCategory] = [
      await DB.findById(req.body.category_id),
      await SubCategoryDB.findById(req.body.sub_category_id),
    ];
    if (!dbCategory || !dbSubCategory) {
      Helper.sendError(404, "Invalid category or sub category", next);
      return;
    }
    const checkExist = dbCategory.sub_categories.includes(dbSubCategory._id);
    if (checkExist) {
      Helper.sendError(
        400,
        "The sub category has already been added to the category.",
        next
      );
      return;
    }
    await DB.findByIdAndUpdate(dbCategory._id, {
      $push: { sub_categories: dbSubCategory._id },
      updated_at: Helper.currentDate(),
    });
    const result = await DB.findById(dbCategory._id)
      .populate("sub_categories", "-__v")
      .select("-__v");
    Helper.fMsg(res, "Sub category added successfully!", result);
  } catch (error) {
    Helper.sendError(500, `Error adding sub category: ${error.message}`, next);
  }
};

const removeSubCategory = async (req, res, next) => {
  try {
    const dbCategory = await DB.findById(req.body.category_id);
    if (!dbCategory) {
      Helper.sendError(404, "Invalid category id.", next);
      return;
    }
    const checkExist = dbCategory.sub_categories.includes(
      req.body.sub_category_id
    );
    if (!checkExist) {
      Helper.sendError(409, "Sub category does not exists.", next);
      return;
    }
    await DB.findByIdAndUpdate(dbCategory._id, {
      $pull: { sub_categories: req.body.sub_category_id },
      updated_at: Helper.currentDate(),
    });
    const result = await DB.findById(dbCategory._id)
      .populate("sub_categories", "-__v")
      .select("-__v");
    Helper.fMsg(res, "Sub category removed successfully!", result);
  } catch (error) {
    Helper.sendError(
      500,
      `Error removing sub category: ${error.message}`,
      next
    );
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
  addSubCategory,
  removeSubCategory,
};
