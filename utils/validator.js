const jwt = require("jsonwebtoken");
const Helper = require("./helper");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      let result = schema.validate(req.body);
      if (result.error) {
        Helper.sendError(
          400,
          `Validation Error: ${result.error.details[0].message}`,
          next
        );
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
        Helper.sendError(
          400,
          `Validation Error: ${result.error.details[0].message}`,
          next
        );
      } else {
        next();
      }
    };
  },
  validateFile: (schema, name) => {
    return (req, res, next) => {
      let obj = {};
      if (!req.files) {
        Helper.sendError(400, `Validation Error: ${name} is required.`, next);
        return;
      }
      obj[name] = req.files[name];
      if (!obj[name].mimetype.startsWith("image/")) {
        Helper.sendError(
          400,
          `Validation Error: ${name} must be an image.`,
          next
        );
        return;
      }
      let result = schema.validate(obj);
      if (result.error) {
        Helper.sendError(
          400,
          `Validation Error: ${result.error.details[0].message}`,
          next
        );
      } else {
        req.body[name] = obj[name].name;
        next();
      }
    };
  },
  validateToken: () => {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          Helper.sendError(401, "Authorization Token Required", next);
          return;
        }
        if (!token.startsWith("Bearer ")) {
          Helper.sendError(401, "Invalid Token Format", next);
          return;
        }
        const realToken = token.split(" ")[1];
        const decode = jwt.verify(realToken, process.env.SECRET_KEY);
        if (!decode) {
          Helper.sendError(401, "Invalid Token", next);
          return;
        }
        const redisUserData = await Helper.redisGet(decode._id);
        if (!redisUserData) {
          Helper.sendError(401, "Token Authorization Failed", next);
          return;
        }
        req.user = redisUserData;
        next();
      } catch (err) {
        Helper.sendError(401, `Token Verification Error: ${err.message}`, next);
      }
    };
  },
  validateRole: (payload = []) => {
    return async (req, res, next) => {
      try {
        const reqRole = req.user.role.find((role) =>
          payload.includes(role.name)
        );
        if (reqRole) {
          next();
        } else {
          Helper.sendError(
            401,
            "Access Denied: You do not have the necessary permissions.",
            next
          );
        }
      } catch (err) {
        Helper.sendError(
          401,
          "Access Denied: You do not have the necessary permissions.",
          next
        );
      }
    };
  },
  validatePermit: (payload = []) => {
    return async (req, res, next) => {
      try {
        console.log(req.user);
        const reqPermit = req.user.permits.filter((permit) =>
          payload.includes(permit.name)
        );
        if (reqPermit) {
          next();
        } else {
          Helper.sendError(
            401,
            "Access Denied: You do not have the necessary permissions.",
            next
          );
        }
      } catch (err) {
        Helper.sendError(
          401,
          "Access Denied: You do not have the necessary permissions.",
          next
        );
      }
    };
  },
};
