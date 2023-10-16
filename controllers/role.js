const DB = require("../models/role");
const Permit_DB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (rsq, res, next) => {
  try {
    const roles = await DB.find().populate("permits", "_id name");
    Helper.fMsg(res, "All Roles", roles);
  } catch (error) {
    Helper.sendError(500, `Error fetching roles: ${error.message}`, next);
  }
};

const add = async (req, res, next) => {
  try {
    const dbRole = await DB.findOne({ name: req.body.name });
    if (dbRole) {
      Helper.sendError(409, `Role name is already in use.`, next);
      return;
    }
    const result = await new DB(req.body).save();
    Helper.fMsg(res, "Role Saved Successfully!", result);
  } catch (error) {
    Helper.sendError(500, `Error adding role: ${error.message}`, next);
  }
};

const get = async (req, res, next) => {
  try {
    const permit = await DB.findById(req.params.id);
    if (!permit) {
      Helper.sendError(404, `Role does not exist`, next);
      return;
    }
    Helper.fMsg(res, `Role for id - ${req.params.id}`, permit);
  } catch (error) {
    Helper.sendError(500, `Error fetching role: ${error.message}`, next);
  }
};

const patch = async (req, res, next) => {
  try {
    const dbRole = await DB.findById(req.params.id);
    if (dbRole) {
      await DB.findByIdAndUpdate(dbRole._id, req.body);
      const result = await DB.findById(dbRole._id);
      Helper.fMsg(res, "Role Updated Successfully!", result);
    } else {
      Helper.sendError(404, `Role does not exist`, next);
    }
  } catch (error) {
    Helper.sendError(500, `Error updating role: ${error.message}`, next);
  }
};

const drop = async (req, res, next) => {
  try {
    const dbRole = await DB.findById(req.params.id);
    if (!dbRole) {
      Helper.sendError(404, `Role does not exist`, next);
      return;
    }
    await DB.findByIdAndDelete(dbRole._id);
    Helper.fMsg(res, "Role Deleted Successfully!");
  } catch (error) {
    Helper.sendError(500, `Internal Server Error: ${error.message}`, next);
  }
};

const roleAddPermit = async (req, res, next) => {
  try {
    const [dbRole, dbPermit] = [
      await DB.findById(req.body.role_id),
      await Permit_DB.findById(req.body.permit_id),
    ];
    if (!dbRole || !dbPermit) {
      Helper.sendError(400, "Invalid role or permit", next);
      return;
    }
    const checkExist = dbRole.permits.includes(dbPermit._id);
    if (checkExist) {
      Helper.sendError(
        400,
        "The permit has already been added to the role.",
        next
      );
      return;
    }
    await DB.findByIdAndUpdate(dbRole._id, {
      $push: { permits: dbPermit._id },
    });
    const result = await DB.findById(dbRole._id);
    Helper.fMsg(res, "Permit Added to Role Successfully.", result);
  } catch (error) {
    Helper.sendError(500, `Error adding permit to role: ${error.message}`, next);
  }
};

const roleRemovePermit = async (req, res, next) => {
  try {
    const dbRole = await DB.findById(req.body.role_id);
    if (!dbRole) {
      Helper.sendError(400, "Invalid role", next);
      return;
    }
    const checkExist = dbRole.permits.includes(req.body.permit_id);
    if (!checkExist) {
      Helper.sendError(
        400,
        "The permit has already been removed from the role.",
        next
      );
      return;
    }
    await DB.findOneAndUpdate(dbRole._id, {
      $pull: { permits: req.body.permit_id },
    });
    const result = await DB.findById(dbRole._id);
    Helper.fMsg(res, "Permit Removed from Role Successfully.", result);
  } catch (error) {
    Helper.sendError(500, `Error removing permit from role: ${error.message}`, next);
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
