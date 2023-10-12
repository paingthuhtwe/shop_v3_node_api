const Helper = require("../utils/helper");
const DB = require("../models/user");
const RoleDB = require("../models/role");

const register = async (req, res, next) => {
  try {
    const dbUserEmail = await DB.findOne({ email: req.body.email });
    if (dbUserEmail) {
      Helper.sendError(409, `Email already in use. Please choose a different email.`, next);
    }
    const dbUserPhone = await DB.findOne({ phone: req.body.phone });
    if (dbUserPhone) {
      Helper.sendError(409, `Phone already in use. Please choose a different phone number.`, next);
    }
    req.body.password = Helper.encode(req.body.password);
    const result = await new DB(req.body).save();
    Helper.fMsg(res, "Registration successful", result);
  } catch (error) {
    Helper.sendError(500, `Registration failed: ${error.message}`, next);
  }
};

const login = async (req, res, next) => {
  try {
    const dbUser = await DB.findOne({ phone: req.body.phone })
      .populate("role permits", "-__v")
      .select("-__v");
    if (dbUser) {
      if (Helper.verifyPassword(req.body.password, dbUser.password)) {
        let user = dbUser.toObject();
        delete user.password;
        user.token = Helper.generateToken(user);
        Helper.redisSet(user._id, user);
        Helper.fMsg(res, "Login successful", user);
      } else {
        Helper.sendError(400, "Incorrect password. Please check your password and try again.", next);
      }
    } else {
      Helper.sendError(400, "Login credentials are incorrect. Please check your phone number and try again.", next);
    }
  } catch (error) {
    Helper.sendError(500, `Login failed: ${error.message}`, next);
  }
};

const all = async (req, res, next) => {
  try {
    const roles = await DB.find()
      .populate("role permits", "-__v")
      .select("-__v -password");
    Helper.fMsg(res, "All Users", roles);
  } catch (error) {
    Helper.sendError(500, `Error fetching user data: ${error.message}`, next);
  }
};

const addRole = async (req, res, next) => {
  try {
    const [dbUser, dbRole] = [
      await DB.findById(req.body.user_id),
      await RoleDB.findById(req.body.role_id),
    ];
    if (!dbUser || !dbRole) {
      Helper.sendError(400, "Invalid user or role.", next);
      return;
    }
    const checkExist = dbUser.role.includes(dbRole._id);
    if (checkExist) {
      Helper.sendError(400, "The role has already been added to the user.", next);
      return;
    }
    await DB.findByIdAndUpdate(dbUser._id, { $push: { role: dbRole._id } });
    const result = await DB.findById(dbUser._id)
      .populate("role permits", "-__v")
      .select("-__v -password");
    Helper.fMsg(res, "Role added successfully", result);
  } catch (error) {
    Helper.sendError(500, `Error adding the role: ${error.message}`, next);
  }
};

const removeRole = async (req, res, next) => {
  try {
    const [dbUser, dbRole] = [
      await DB.findById(req.body.user_id),
      await RoleDB.findById(req.body.role_id),
    ];
    if (!dbUser || !dbRole) {
      Helper.sendError(400, "Invalid user or role.", next);
      return;
    }
    const checkExist = dbUser.role.includes(dbRole._id);
    if (!checkExist) {
      Helper.sendError(400, "The role has already been removed from the user.", next);
      return;
    }
    await DB.findByIdAndUpdate(dbUser._id, { $pull: { role: dbRole._id } });
    const result = await DB.findById(dbUser._id)
      .populate("role permits", "-__v")
      .select("-__v -password");
    Helper.fMsg(res, "Role removed successfully", result);
  } catch (error) {
    Helper.sendError(500, `Error removing the role: ${error.message}`, next);
  }
};

module.exports = { register, login, all, addRole, removeRole };
