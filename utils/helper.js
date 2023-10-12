const bcrypt = require("bcryptjs");
const Redis = require("async-redis").createClient();
const jwt = require("jsonwebtoken");

module.exports = {
  encode: (payload) => bcrypt.hashSync(payload),
  verifyPassword: (plain, dbPass) => bcrypt.compareSync(plain, dbPass),
  fMsg: (res, message = "", data = []) => {
    return res.status(200).json({ success: 1, message, data });
  },
  redisSet: async (id, value) =>
    await Redis.set(id.toString(), JSON.stringify(value)),
  redisGet: async (id) => JSON.parse(await Redis.get(id.toString())),
  redisDrop: async (id) => await Redis.del(id.toString()),
  generateToken: (payload) =>
    jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" }),
  sendError: (status, message, next) => {
    const error = new Error(message);
    (error.status = status), next(error);
  },
};
