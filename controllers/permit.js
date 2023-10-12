const DB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (rsq, res, next) => {
  const permits = await DB.find();
  Helper.fMsg(res, "All Permissions", permits);
};

const add = async (req, res, next) => {
  const dbPermit = await DB.findOne({ name: req.body.name });
  if (dbPermit) {
    Helper.sendError(409, "Permission name is already in use.", next);
  } else {
    const result = await new DB(req.body).save();
    Helper.fMsg(res, "Successful permission saved!", result);
  }
};

const get = async (req, res, next) => {
  const permit = await DB.findById(req.params.id);
  if (permit) {
    Helper.fMsg(res, `Permission for id - ${req.params.id}`, permit);
  } else {
    Helper.sendError(400, `No Records for request id - ${req.params.id}`, next);
  }
};

const patch = async (req, res, next) => {
  const dbPermit = await DB.findById(req.params.id);
  if (dbPermit) {
    await DB.findByIdAndUpdate(dbPermit._id, req.body);
    const result = await DB.findById(dbPermit._id);
    Helper.fMsg(res, "Successful permission upadated!", result);
  } else {
    Helper.sendError(400, `No Records for request id - ${req.params.id}`, next);
  }
};

const drop = async (req, res, next) => {
  const dbPermit = await DB.findById(req.params.id);
  if (dbPermit) {
    await DB.findByIdAndDelete(dbPermit._id);
    Helper.fMsg(res, "Successful permission deleted!");
  } else {
    Helper.sendError(400, `No Records for request id - ${req.params.id}`, next);
  }
};

module.exports = { all, add, get, patch, drop };
