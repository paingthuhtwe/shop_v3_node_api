const DB = require("../models/sub_category");
const CategoryDB = require("../models/category");
const ChildCategoryDB = require("../models/child_category");
const { saveSingleFile, deleteFile } = require("../utils/file");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  try {
    const sub_categories = await DB.find().populate("child_categories", "-__v");
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
    const [dbSubCategory, dbCategory] = [
      await DB.findOne({ name: req.body.name }),
      await CategoryDB.findById(req.body.category_id),
    ];
    if (dbSubCategory) {
      Helper.sendError(409, "Sub category name is already in use.", next);
      return;
    }
    if (!dbCategory) {
      Helper.sendError(404, "Category not found.", next);
      return;
    }
    saveSingleFile("image", req);
    const { name, image } = req.body;
    const sub_category = await new DB({
      name,
      image,
    }).save();
    await CategoryDB.findByIdAndUpdate(dbCategory._id, {
      $push: { sub_categories: sub_category._id },
      updated_at: Helper.currentDate(),
    });
    const result = await DB.findOne({ name: req.body.name });
    Helper.fMsg(res, "Sub category added successfully.", result);
  } catch (error) {
    Helper.sendError(500, `Error adding sub category: ${error.message}`, next);
  }
};

const get = async (req, res, next) => {
  try {
    const subCategory = await DB.findById(req.params.id).populate(
      "child_categories",
      "-__v"
    );
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
    if (
      req.body.name &&
      req.files &&
      req.body.name === dbSubCategory.name &&
      req.files.image &&
      req.files.image.name === dbSubCategory.image
    ) {
      Helper.sendError(400, "Sub category is up to date.", next);
      return;
    }
    const updateData = { updated_at: Helper.currentDate() };
    if (req.body.name) {
      updateData["name"] = req.body.name;
    }
    if (req.files && req.files.image) {
      deleteFile(dbSubCategory.image);
      saveSingleFile("image", req);
      updateData["image"] = req.body.image;
    }
    await DB.findByIdAndUpdate(dbSubCategory._id, updateData);
    const result = await DB.findById(dbSubCategory._id);
    Helper.fMsg(res, "Sub category updated successfully!", result);
  } catch (error) {
    Helper.sendError(
      500,
      `Error updating sub category: ${error.message}`,
      next
    );
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
    await CategoryDB.updateMany(
      { sub_categories: req.params.id },
      {
        $pull: { sub_categories: req.params.id },
        updated_at: Helper.currentDate(),
      }
    );
    Helper.fMsg(res, `Sub category deleted successfully.`);
  } catch (error) {
    Helper.sendError(
      500,
      `Error deleding sub category: ${error.message}`,
      next
    );
  }
};

const addChildCategory = async (req, res, next) => {
  try {
    const [dbSubCategory, dbChildCategory] = [
      await DB.findById(req.body.sub_category_id),
      await ChildCategoryDB.findById(req.body.child_category_id),
    ];
    if (!dbSubCategory || !dbChildCategory) {
      Helper.sendError(
        404,
        "Invalid sub category id or child category id",
        next
      );
      return;
    }
    const checkExist = dbSubCategory.child_categories.includes(
      dbChildCategory._id
    );
    if (checkExist) {
      Helper.sendError(409, "Child category already added.", next);
      return;
    }
    await DB.findByIdAndUpdate(dbSubCategory._id, {
      $push: { child_categories: dbChildCategory._id },
      updated_at: Helper.currentDate(),
    });
    const result = await DB.findById(dbSubCategory._id);
    Helper.fMsg(res, "Child category added successfully!", result);
  } catch (error) {
    Helper.sendError(
      500,
      `Error adding child category: ${error.message}`,
      next
    );
  }
};

const removeChildCategory = async (req, res, next) => {
  try {
    const dbSubCategory = await DB.findById(req.body.sub_category_id);
    if (!dbSubCategory) {
      Helper.sendError(404, "Invalid sub category id.", next);
      return;
    }
    const checkExist = dbSubCategory.child_categories.includes(
      req.body.child_category_id
    );
    if (!checkExist) {
      Helper.sendError(409, "Child category does not exists.", next);
      return;
    }
    await DB.findByIdAndUpdate(dbSubCategory._id, {
      $pull: { child_categories: req.body.child_category_id },
      updated_at: Helper.currentDate(),
    });
    const result = await DB.findById(dbSubCategory._id);
    Helper.fMsg(res, "Child category removed successfully!", result);
  } catch (error) {
    Helper.sendError(
      500,
      `Error deleding child category: ${error.message}`,
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
  addChildCategory,
  removeChildCategory,
};
