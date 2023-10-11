const DB = require("../models/user");
const Helper = require("../utils/helper");

const register = async (req, res, next) => {
  const dbUserEmail = await DB.findOne({ email: req.body.email });
  if (dbUserEmail) {
    const error = new Error("Email is already in used!");
    error.status = 400;
    next(error);
    return;
  }
  const dbUserPhone = await DB.findOne({ phone: req.body.phone });
  if (dbUserPhone) {
    const error = new Error("Phone is already in used!");
    error.status = 400;
    next(error);
    return;
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
      user.token = Helper.generateToken(user)
      Helper.redisSet(user._id, user);
      Helper.fMsg(res, "Login successful!", user);
    } else {
      const error = new Error("Password is incorrect!");
      error.status = 400;
      next(error);
      return;
    }
  } else {
    const error = new Error("Creditial Error!");
    error.status = 400;
    next(error);
    return;
  }
};

const all = async (rsq, res, next) => {
  const roles = await DB.find()
    .populate("role permits", "-__v")
    .select("-__v -password");
  Helper.fMsg(res, "All Users", roles);
};

module.exports = { register, login, all };
