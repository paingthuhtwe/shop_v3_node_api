const Helper = require("../utils/helper");
const UserDB = require("../models/user");
const RoleDB = require("../models/role");
const PermitDB = require("../models/permit");

const register = async (req, res, next) => {
  try {
    const dbUserEmail = await UserDB.findOne({ email: req.body.email });
    if (dbUserEmail) {
      Helper.sendError(
        409,
        `Email already in use. Please choose a different email.`,
        next
      );
    }
    const dbUserPhone = await UserDB.findOne({ phone: req.body.phone });
    if (dbUserPhone) {
      Helper.sendError(
        409,
        `Phone already in use. Please choose a different phone number.`,
        next
      );
    }
    req.body.password = Helper.encode(req.body.password);
    const result = await new UserDB(req.body).save();
    Helper.fMsg(res, "Registration successful", result);
  } catch (error) {
    Helper.sendError(500, `Registration failed: ${error.message}`, next);
  }
};

const login = async (req, res, next) => {
  try {
    const dbUser = await UserDB.findOne({ phone: req.body.phone })
      .populate({path: 'role', select: '-__v', populate: {path: 'permits', select: '-__v'}})
      .populate({path: 'permits', select: '-__v'})
      .select("-__v");
    if (dbUser) {
      if (Helper.verifyPassword(req.body.password, dbUser.password)) {
        Helper.redisGet(dbUser._id) && Helper.redisDrop(dbUser._id)
        let user = dbUser.toObject();
        delete user.password;
        user.token = Helper.generateToken(user);
        Helper.redisSet(user._id, user);
        Helper.fMsg(res, "Login successful", user);
      } else {
        Helper.sendError(
          400,
          "Incorrect password. Please check your password and try again.",
          next
        );
      }
    } else {
      Helper.sendError(
        400,
        "Login credentials are incorrect. Please check your phone number and try again.",
        next
      );
    }
  } catch (error) {
    Helper.sendError(500, `Login failed: ${error.message}`, next);
  }
};

const all = async (req, res, next) => {
  try {
    const users = await UserDB.find()
      .populate({path: 'role', select: '-__v', populate: {path: 'permits', select: '-__v'}})
      .populate({path: 'permits', select: '-__v'})
      .select("-__v -password");
    Helper.fMsg(res, "All Users", users);
  } catch (error) {
    Helper.sendError(500, `Error fetching user data: ${error.message}`, next);
  }
};

const addRole = async (req, res, next) => {
  try {
    const [dbUser, dbRole] = [
      await UserDB.findById(req.body.user_id),
      await RoleDB.findById(req.body.role_id),
    ];
    if (!dbUser || !dbRole) {
      Helper.sendError(400, "Invalid user or role.", next);
      return;
    }
    if (dbUser?.role?.toString() === dbRole._id.toString()) {
      Helper.sendError(
        400,
        "The role has already been added to the user.",
        next
      );
      return;
    }
    Helper.redisGet(dbUser._id) && Helper.redisDrop(dbUser._id)
    await UserDB.findByIdAndUpdate(dbUser._id, { role: dbRole._id, updated_at: Helper.currentDate() });
    const result = await UserDB.findById(dbUser._id)
      .populate("role permits", "-__v")
      .select("-__v -password");
    Helper.fMsg(res, "Role added successfully", result);
  } catch (error) {
    Helper.sendError(500, `Error adding the role: ${error.message}`, next);
  }
};

const removeRole = async (req, res, next) => {
  try {
    const dbUser = await UserDB.findById(req.body.user_id);
    if (!dbUser) {
      Helper.sendError(400, "Invalid user_id.", next);
      return;
    }
    if (dbUser?.role?.toString() !== req.body.role_id.toString()) {
      Helper.sendError(
        400,
        "The role has already been removed from the user.",
        next
      );
      return;
    }
    Helper.redisGet(dbUser._id) && Helper.redisDrop(dbUser._id)
    await UserDB.findByIdAndUpdate(dbUser._id, {
      $unset: { role: 1 },
      updated_at: Helper.currentDate()
    });
    const result = await UserDB.findById(dbUser._id)
      .populate("role permits", "-__v")
      .select("-__v -password");
    Helper.fMsg(res, "Role removed successfully", result);
  } catch (error) {
    Helper.sendError(500, `Error removing the role: ${error.message}`, next);
  }
};

const addPermit = async (req, res, next) => {
  try {
    const [dbUser, dbPermit] = [
      await UserDB.findById(req.body.user_id),
      await PermitDB.findById(req.body.permit_id),
    ];
    if (!dbUser || !dbPermit) {
      Helper.sendError(400, "Invalid user or permit.", next);
      return;
    }
    const checkExist = dbUser.permits.includes(dbPermit._id);
    if (checkExist) {
      Helper.sendError(
        400,
        "The permit has already been added to the user.",
        next
      );
      return;
    }
    Helper.redisGet(dbUser._id) && Helper.redisDrop(dbUser._id)
    await UserDB.findByIdAndUpdate(dbUser._id, { $push: { permits: dbPermit._id }, updated_at: Helper.currentDate() });
    const result = await UserDB.findById(dbUser._id)
      .populate("role permits", "-__v")
      .select("-__v -password");
    Helper.fMsg(res, "Permit added successfully", result);
  } catch (error) {
    Helper.sendError(500, `Error adding the permit: ${error.message}`, next);
  }
};

const removePermit = async (req, res, next) => {
  try {
    const dbUser = await UserDB.findById(req.body.user_id);
    if (!dbUser) {
      Helper.sendError(400, "Invalid user_id.", next);
      return;
    }
    const checkExist = dbUser.permits.includes(req.body.permit_id);
    if (!checkExist) {
      Helper.sendError(
        400,
        "The permit has already been removed from the user.",
        next
      );
      return;
    }
    Helper.redisGet(dbUser._id) && Helper.redisDrop(dbUser._id)
    await UserDB.findByIdAndUpdate(dbUser._id, {
      $pull: { permits: req.body.permit_id },
      updated_at: Helper.currentDate()
    });
    const result = await UserDB.findById(dbUser._id)
      .populate("role permits", "-__v")
      .select("-__v -password");
    Helper.fMsg(res, "Permit removed successfully", result);
  } catch (error) {
    Helper.sendError(500, `Error removing the permit: ${error.message}`, next);
  }
};

module.exports = { register, login, all, addRole, removeRole, addPermit, removePermit };
