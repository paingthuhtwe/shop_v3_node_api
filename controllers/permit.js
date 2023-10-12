const DB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  try {
    const permits = await DB.find();
    Helper.fMsg(res, "All Permissions", permits);
  } catch (error) {
    Helper.sendError(500, `Error fetching permissions: ${error.message}`, next);
  }
};

const add = async (req, res, next) => {
  try {
    const dbPermit = await DB.findOne({ name: req.body.name });
    if (dbPermit) {
      Helper.sendError(409, "Permission name is already in use.", next);
    } else {
      const result = await new DB(req.body).save();
      Helper.fMsg(res, "Permission saved successfully!", result);
    }
  } catch (error) {
    Helper.sendError(500, `Error adding permission: ${error.message}`, next);
  }
};

const get = async (req, res, next) => {
  try {
    const permit = await DB.findById(req.params.id);
    if (permit) {
      Helper.fMsg(res, `Permission for id - ${req.params.id}`, permit);
    } else {
      Helper.sendError(
        404,
        `No Records found for requested id - ${req.params.id}`,
        next
      );
    }
  } catch (error) {
    Helper.sendError(500, `Error fetching permission: ${error.message}`, next);
  }
};

const patch = async (req, res, next) => {
  try {
    const dbPermit = await DB.findById(req.params.id);
    if (dbPermit) {
      await DB.findByIdAndUpdate(dbPermit._id, req.body);
      const result = await DB.findById(dbPermit._id);
      Helper.fMsg(res, "Permission updated successfully!", result);
    } else {
      Helper.sendError(
        404,
        `No Records found for requested id - ${req.params.id}`,
        next
      );
    }
  } catch (error) {
    Helper.sendError(500, `Error updating permission: ${error.message}`, next);
  }
};

const drop = async (req, res, next) => {
  try {
    const dbPermit = await DB.findById(req.params.id);
    if (dbPermit) {
      await DB.findByIdAndDelete(dbPermit._id);
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

module.exports = { all, add, get, patch, drop };
