const DB = require("../models/category");
const { saveSingleFile, deleteFile } = require("../utils/file");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  try {
    const categories = await DB.find();
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
    const result = await DB.findOne({ name: req.body.name });
    Helper.fMsg(res, "Category added successfully.", result);
  } catch (error) {
    Helper.sendError(500, `Error adding category: ${error.message}`, next);
  }
};

const get = async (req, res, next) => {
  try {
    const category = await DB.findById(req.params.id);
    if (category) {
      Helper.fMsg(res, `Category for id - ${req.params.id}`, category);
    } else {
      Helper.sendError(
        404,
        `No Records found for requested id - ${req.params.id}`,
        next
      );
    }
  } catch (error) {
    Helper.sendError(500, `Error fetching category: ${error.message}`, next);
  }
};

const drop = async (req, res, next) => {
  try {
    const dbCategory = await DB.findById(req.params.id);
    if (dbCategory) {
      await DB.findByIdAndDelete(dbCategory._id);
      deleteFile(dbCategory.image);
      Helper.fMsg(res, "Permission deleted successfully!");
    } else {
      Helper.sendError(
        404,
        `No Records found for requested id - ${req.params.id}`,
        next
      );
    }
  } catch (error) {
    Helper.sendError(500, `Error deleting permission: ${error.message}`, next);
  }
};

module.exports = { all, add, get, drop };
