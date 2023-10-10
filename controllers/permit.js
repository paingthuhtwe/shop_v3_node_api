const DB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (rsq, res, next) => {
  const permits = await DB.find();
  Helper.fMsg(res, "All Permissions", permits);
};

const add = async (req, res, next) => {
  const dbPermit = await DB.findOne({ name: req.body.name });
  if (dbPermit) {
    const error = new Error("Permission name is already in used!");
    error.status = 409;
    next(error);
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
    const error = new Error(`No Records for id - ${req.params.id}`);
    error.status = 400;
    next(error);
  }
};

const patch = async (req, res, next) => {
  const dbPermit = await DB.findById(req.params.id);
  if (dbPermit) {
    await DB.findByIdAndUpdate(dbPermit._id, req.body);
    const result = await DB.findById(dbPermit._id);
    Helper.fMsg(res, "Successful permission upadated!", result);
  } else {
    const error = new Error(`No Records for id - ${req.params.id}`);
    error.status = 400;
    next(error);
  }
};

const drop = async (req, res, next) => {
  const dbPermit = await DB.findById(req.params.id);
  if (dbPermit) {
    await DB.findByIdAndDelete(dbPermit._id);
    Helper.fMsg(res, "Successful permission deleted!");
  } else {
    const error = new Error(`No Records for id - ${req.params.id}`);
    error.status = 400;
    next(error);
  }
};

module.exports = { all, add, get, patch, drop };
