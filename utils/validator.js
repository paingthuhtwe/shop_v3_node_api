const jwt = require("jsonwebtoken");
const Helper = require("./helper");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      let result = schema.validate(req.body);
      if (result.error) {
        Helper.sendError(400, result.error.details[0].message, next);
      } else {
        next();
      }
    };
  },
  validateParams: (schema, name) => {
    return (req, res, next) => {
      let obj = {};
      obj[`${name}`] = req.params[`${name}`];
      let result = schema.validate(obj);
      if (result.error) {
        Helper.sendError(400, result.error.details[0].message, next);
      } else {
        next();
      }
    };
  },
  validateToken: () => {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization;
        !token &&
          Helper.sendError(401, "Authorization token is required", next);
        if (token && token.startsWith("Bearer ")) {
          const realToken = token.split(" ")[1];
          const decode = jwt.verify(realToken, process.env.SECRET_KEY);
          if (decode) {
            const redisUserData = await Helper.redisGet(decode._id);
            if (redisUserData) {
              req.user = redisUserData;
              next();
            } else {
              Helper.sendError(401, "Token authorization failed.", next);
            }
          } else {
            Helper.sendError(401, "Invalid token", next);
          }
        } else {
          Helper.sendError(401, "Invalid token format", next);
        }
      } catch (err) {
        Helper.sendError(401, err.message, next);
      }
    };
  },
  validateIsOwnerToken: () => {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization;
        !token &&
          Helper.sendError(401, "Authorization token is required", next);
        if (token && token.startsWith("Bearer ")) {
          const realToken = token.split(" ")[1];
          const decode = jwt.verify(realToken, process.env.SECRET_KEY);
          if (decode.role[0].name !== "Owner") {
            Helper.sendError(
              401,
              "Access denied: You do not have the necessary permissions.",
              next
            );
          }
          if (decode) {
            const redisUserData = await Helper.redisGet(decode._id);
            if (redisUserData) {
              req.user = redisUserData;
              next();
            } else {
              Helper.sendError(401, "Token authorization failed.", next);
            }
          } else {
            Helper.sendError(401, "Invalid token", next);
          }
        } else {
          Helper.sendError(401, "Invalid token format", next);
        }
      } catch (err) {
        Helper.sendError(401, err.message, next);
      }
    };
  },
};
