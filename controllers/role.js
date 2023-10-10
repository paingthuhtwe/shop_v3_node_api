const DB = require("../models/role");
const Permit_DB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (rsq, res, next) => {
  const roles = await DB.find().populate('permits', '_id name');
  Helper.fMsg(res, "All Roles", roles);
};

const add = async (req, res, next) => {
  const dbRole = await DB.findOne({ name: req.body.name }).populate('permits', '_id name');
  if (dbRole) {
    const error = new Error("Role name is already in used!");
    error.status = 409;
    next(error);
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
    const error = new Error(`No Records for id - ${req.params.id}`);
    error.status = 400;
    next(error);
  }
};

const patch = async (req, res, next) => {
  const dbRole = await DB.findById(req.params.id);
  if (dbRole) {
    await DB.findByIdAndUpdate(dbRole._id, req.body);
    const result = await DB.findById(dbRole._id);
    Helper.fMsg(res, "Successful role upadated!", result);
  } else {
    const error = new Error(`No Records for id - ${req.params.id}`);
    error.status = 400;
    next(error);
  }
};

const drop = async (req, res, next) => {
  const dbRole = await DB.findById(req.params.id);
  if (dbRole) {
    await DB.findByIdAndDelete(dbRole._id);
    Helper.fMsg(res, "Successful role deleted!");
  } else {
    const error = new Error(`No Records for id - ${req.params.id}`);
    error.status = 400;
    next(error);
  }
};

const roleAddPermit = async (req, res, next) => {
    const dbRole = await DB.findById(req.body.role_id);
    const dbPermit = await Permit_DB.findById(req.body.permit_id);
    if (dbRole && dbPermit) {
        await DB.findByIdAndUpdate(dbRole._id, {$push: {permits: dbPermit._id}});
        const result = await DB.findById(dbRole._id);
        Helper.fMsg(res, 'Successful Permit add to Role.', result)
    } else {
        const error = new Error('Role id and Permit id need to be vailed.');
        error.status = 400
        next(error)
    }
}

const roleRemovePermit = async (req, res, next) => {
    const dbRole = await DB.findById(req.body.role_id);
    if (dbRole) {
        await DB.findOneAndUpdate(dbRole._id, {$pull: {permits: req.body.permit_id}});
        const result = await DB.findById(dbRole._id);
        Helper.fMsg(res, 'Successful Permit remove from Role.', result)
    } else {
        const error = new Error('Role id need to be vailed.');
        error.status = 400
        next(error)
    }
}

module.exports = { all, add, get, patch, drop, roleAddPermit, roleRemovePermit };
