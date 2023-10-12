const DB = require("../models/role");
const Permit_DB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (rsq, res, next) => {
  const roles = await DB.find().populate("permits", "_id name");
  Helper.fMsg(res, "All Roles", roles);
};

const add = async (req, res, next) => {
  const dbRole = await DB.findOne({ name: req.body.name }).populate(
    "permits",
    "_id name"
  );
  if (dbRole) {
    Helper.sendError(409, `Role name is already in use.`, next);
  } else {
    const result = await new DB(req.body).save();
    Helper.fMsg(res, "Successful role saved!", result);
  }
};

const get = async (req, res, next) => {
  const permit = await DB.findById(req.params.id);
  if (permit) {
    Helper.fMsg(res, `Role for id - ${req.params.id}`, permit);
  } else {
    Helper.sendError(400, `No Records for request id - ${req.params.id}`, next);
  }
};

const patch = async (req, res, next) => {
  const dbRole = await DB.findById(req.params.id);
  if (dbRole) {
    await DB.findByIdAndUpdate(dbRole._id, req.body);
    const result = await DB.findById(dbRole._id);
    Helper.fMsg(res, "Successful role upadated!", result);
  } else {
    Helper.sendError(400, `No Records for request id - ${req.params.id}`, next);
  }
};

const drop = async (req, res, next) => {
  const dbRole = await DB.findById(req.params.id);
  if (dbRole) {
    await DB.findByIdAndDelete(dbRole._id);
    Helper.fMsg(res, "Successful role deleted!");
  } else {
    Helper.sendError(400, `No Records for request id - ${req.params.id}`, next);
  }
};

const roleAddPermit = async (req, res, next) => {
  const dbRole = await DB.findById(req.body.role_id);
  const dbPermit = await Permit_DB.findById(req.body.permit_id);
  if (dbRole && dbPermit) {
    await DB.findByIdAndUpdate(dbRole._id, {
      $push: { permits: dbPermit._id },
    });
    const result = await DB.findById(dbRole._id);
    Helper.fMsg(res, "Successful Permit add to Role.", result);
  } else {
    Helper.sendError(400, `No Records for request id - ${req.params.id}`, next);
  }
};

const roleRemovePermit = async (req, res, next) => {
  const dbRole = await DB.findById(req.body.role_id);
  if (dbRole) {
    await DB.findOneAndUpdate(dbRole._id, {
      $pull: { permits: req.body.permit_id },
    });
    const result = await DB.findById(dbRole._id);
    Helper.fMsg(res, "Successful Permit remove from Role.", result);
  } else {
    Helper.sendError(400, `No Records for request id - ${req.params.id}`, next);
  }
};

module.exports = {
  all,
  add,
  get,
  patch,
  drop,
  roleAddPermit,
  roleRemovePermit,
};
