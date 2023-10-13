const DB = require("../models/category");
const { saveSingleFile } = require("../utils/file");
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
        Helper.sendError(409, 'Category name is already in use.', next);
        return;
    }
    saveSingleFile('image', req);
    await new DB(req.body).save();
    const result = await DB.findOne({ name: req.body.name });
    Helper.fMsg(res, "Category added successfully.", result);
  } catch (error) {
    Helper.sendError(500, `Error adding category: ${error.message}`, next);
  }
};

module.exports = { all, add};
