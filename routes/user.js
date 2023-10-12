const router = require('express').Router();
const controller = require('../controllers/user');
const { validateBody, validateToken, validateIsOwnerToken } = require('../utils/validator');
const { UserSchema } = require('../utils/schema');

router.post('/register', validateBody(UserSchema.register), controller.register);
router.post('/login', validateBody(UserSchema.login), controller.login);
router.get('/users', validateToken(), controller.all);
router.post('/add/role', validateIsOwnerToken(), controller.addRole);
router.post('/remove/role', validateIsOwnerToken(), controller.removeRole);

module.exports = router;