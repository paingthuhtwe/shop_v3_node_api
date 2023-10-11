const router = require('express').Router();
const controller = require('../controllers/user');
const { validateBody, validateToken } = require('../utils/validator');
const { UserSchema } = require('../utils/schema');

router.post('/register', validateBody(UserSchema.register), controller.register);
router.post('/login', validateBody(UserSchema.login), controller.login);
router.get('/users', validateToken(), controller.all);

module.exports = router;