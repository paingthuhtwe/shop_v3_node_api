const DB = require("../models/warranty");
const { saveSingleFile, deleteFile } = require("../utils/file");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  try {
    const warranty = await DB.find().select("-__v");
    Helper.fMsg(res, "All Warranty", warranty);
  } catch (error) {
    Helper.sendError(500, `Error fetching warranty: ${error.message}`, next);
  }
};

const add = async (req, res, next) => {
  try {
    const dbWarranty = await DB.findOne({ name: req.body.name });
    if (dbWarranty) {
      Helper.sendError(409, "Warranty already exists", next);
      return;
    }
    saveSingleFile("image", req);
    const warranty = await new DB(req.body).save();
    Helper.fMsg(res, "Warranty added successfully.", warranty);
  } catch (error) {
    Helper.sendError(500, `Error adding warranty: ${error.message}`, next);
  }
};

const get = async (req, res, next) => {
  try {
    const warranty = await DB.findById(req.params.id).select("-__v");
    if (!warranty) {
      Helper.sendError(404, "Warranty not found", next);
      return;
    }
    Helper.fMsg(res, `Warranty for id - ${req.params.id}`, warranty);
  } catch (error) {
    Helper.sendError(500, `Error fetching warranty: ${error.message}`, next);
  }
};

const patch = async (req, res, next) => {
  try {
    const warranty = await DB.findById(req.params.id);
    if (!warranty) {
      Helper.sendError(404, "Warranty not found", next);
      return;
    }
    const updatedData = {
      updated_at: Helper.currentDate(),
    };
    if (req.body.name) updatedData["name"] = req.body.name;
    if (req.files && req.files.image) {
      saveSingleFile("image", req);
      deleteFile(warranty.image);
      updatedData["image"] = req.body.image;
    }
    if (req.body.remark) updatedData["remark"] = req.body.remark;
    const { name, image, remark } = req.body;
    if (!name && !image && !remark) {
      Helper.sendError(400, "Provide data to update.", next);
      return;
    }
    await DB.findByIdAndUpdate(warranty._id, updatedData);
    const result = await DB.findById(warranty._id).select("-__v");
    Helper.fMsg(res, "Warranty updated successfully.", result);
  } catch (error) {
    Helper.sendError(500, `Error updating warranty: ${error.message}`, next);
  }
};

const drop = async (req, res, next) => {
  try {
    const warranty = await DB.findById(req.params.id);
    if (!warranty) {
      Helper.sendError(404, "Warranty not found", next);
      return;
    }
    await DB.findByIdAndDelete(warranty._id);
    Helper.fMsg(res, "Warranty deleted successfully.");
  } catch (error) {
    Helper.sendError(500, `Error deleting warranty: ${error.message}`, next);
  }
};

module.exports = { all, add, get, patch, drop };
