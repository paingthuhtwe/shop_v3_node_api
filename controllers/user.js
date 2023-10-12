const DB = require("../models/user");
const Helper = require("../utils/helper");

const register = async (req, res, next) => {
  const dbUserEmail = await DB.findOne({ email: req.body.email });
  if (dbUserEmail) {
    Helper.sendError(409, `Email is already in use.`, next);
  }
  const dbUserPhone = await DB.findOne({ phone: req.body.phone });
  if (dbUserPhone) {
    Helper.sendError(409, `Phone is already in use.`, next);
  }
  req.body.password = Helper.encode(req.body.password);
  const result = await new DB(req.body).save();
  Helper.fMsg(res, "Register successful", result);
};

const login = async (req, res, next) => {
  const dbUser = await DB.findOne({ phone: req.body.phone })
    .populate("role permits", "-__v")
    .select("-__v");
  if (dbUser) {
    if (Helper.verifyPassword(req.body.password, dbUser.password)) {
      let user = dbUser.toObject();
      delete user.password;
      user.token = Helper.generateToken(user);
      Helper.redisSet(user._id, user);
      Helper.fMsg(res, "Login successful!", user);
    } else {
      Helper.sendError(400, `Password is incorrect.`, next);
    }
  } else {
    Helper.sendError(400, `Creditial Error!`, next);
  }
};

const all = async (req, res, next) => {
  const roles = await DB.find()
    .populate("role permits", "-__v")
    .select("-__v -password");
  Helper.fMsg(res, "All Users", roles);
};

const addRole = async (req, res, next) => {
  await DB.findByIdAndUpdate(req.body.user_id, {
    $push: { role: req.body.role_id },
  });
  const result = await DB.findById(req.body.user_id)
    .populate("role permits", "-__v")
    .select("-__v -password");
  Helper.fMsg(res, "Add role successful", result);
};

const removeRole = async (req, res, next) => {
  await DB.findByIdAndUpdate(req.body.user_id, {
    $pull: { role: req.body.role_id },
  });
  const result = await DB.findById(req.body.user_id)
    .populate("role permits", "-__v")
    .select("-__v -password");
  Helper.fMsg(res, "Remove role successful", result);
};

module.exports = { register, login, all, addRole, removeRole };
