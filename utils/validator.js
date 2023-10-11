const jwt = require("jsonwebtoken");
const Helper = require("./helper");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      let result = schema.validate(req.body);
      if (result.error) {
        const error = new Error(result.error.details[0].message);
        error.status = 400;
        next(error);
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
        const error = new Error(result.error.details[0].message);
        error.status = 400;
        next(error);
      } else {
        next();
      }
    };
  },
  validateToken: () => {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (token && token.startsWith('Bearer ')) { 
          const realToken = token.split(' ')[1];
          const decode = jwt.verify(realToken, process.env.SECRET_KEY);
          if (decode) {
            const redisUserData = await Helper.redisGet(decode._id);
            if (redisUserData) {
              req.user = redisUserData;
              next();
            } else {
              const error = new Error('Token authorization failed');
              error.status = 401;
              next(error);
            }
          } else {
            const error = new Error('Invalid token');
            error.status = 401;
            next(error);
          }
        } else {
          const error = new Error('Invalid token format');
          error.status = 401;
          next(error);
        }
      } catch (err) {
        const error = new Error(err.message);
        error.status = 401;
        next(error);
      }
    };
  },
};
