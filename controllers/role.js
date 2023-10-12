const DB = require("../models/role");
const Permit_DB = require("../models/permit");
const Helper = require("../utils/helper");

const all = async (rsq, res, next) => {
  try {
    const roles = await DB.find().populate("permits", "_id name");
    Helper.fMsg(res, "All Roles", roles);
  } catch (error) {
    Helper.sendError(500, `Internal Server Error: ${error.message}`, next);
  }
};

const add = async (req, res, next) => {
  try {
    const dbRole = await DB.findOne({ name: req.body.name }).populate(
      "permits",
      "_id name"
    );
    if (dbRole) {
      Helper.sendError(409, `Role name is already in use.`, next);
    } else {
      const result = await new DB(req.body).save();
      Helper.fMsg(res, "Role Saved Successfully!", result);
    }
  } catch (error) {
    Helper.sendError(500, `Internal Server Error: ${error.message}`, next);
  }
};

const get = async (req, res, next) => {
  try {
    const permit = await DB.findById(req.params.id);
    if (permit) {
      Helper.fMsg(res, `Role for id - ${req.params.id}`, permit);
    } else {
      Helper.sendError(
        404,
        `No Records Found for Requested ID - ${req.params.id}`,
        next
      );
    }
  } catch (error) {
    Helper.sendError(500, `Internal Server Error: ${error.message}`, next);
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
      Helper.sendError(
        404,
        `No Records Found for Requested ID - ${req.params.id}`,
        next
      );
    }
  } catch (error) {
    Helper.sendError(500, `Internal Server Error: ${error.message}`, next);
  }
};

const drop = async (req, res, next) => {
  try {
    const dbRole = await DB.findById(req.params.id);
    if (dbRole) {
      await DB.findByIdAndDelete(dbRole._id);
      Helper.fMsg(res, "Role Deleted Successfully!");
    } else {
      Helper.sendError(
        404,
        `No Records Found for Requested ID - ${req.params.id}`,
        next
      );
    }
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
    Helper.sendError(500, `Error duing add permit: ${error.message}`, next);
  }
};

const roleRemovePermit = async (req, res, next) => {
  try {
    const dbRole = await DB.findById(req.body.role_id);
    if (!dbRole) {
      Helper.sendError(400, "Invalid role_id", next);
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
    Helper.sendError(500, `Error during remove permit: ${error.message}`, next);
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
