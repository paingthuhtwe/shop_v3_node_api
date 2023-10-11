const DB = require("../models/user");
const Helper = require("../utils/helper");

const register = async (req, res, next) => {
  const dbUserEmail = await DB.findOne({email: req.body.email})
  if (dbUserEmail) {
    const error = new Error('Email is already in used!')
    error.status = 400;
    next(error);
    return;
  }
  const dbUserPhone = await DB.findOne({phone: req.body.phone})
  if (dbUserPhone) {
    const error = new Error('Phone is already in used!')
    error.status = 400;
    next(error);
    return;
  }
  req.body.password = Helper.encode(req.body.password);
  const result = await new DB(req.body).save();
  Helper.fMsg(res, 'Register successful', result);
};

module.exports = { register };
