const router = require('express').Router();
const controller = require('../controllers/user');
const { validateBody, validateToken, validateIsOwnerToken } = require('../utils/validator');
const { UserSchema } = require('../utils/schema');

router.post('/register', validateBody(UserSchema.register), controller.register);
router.post('/login', validateBody(UserSchema.login), controller.login);
router.get('/users', validateToken(), controller.all);
router.post('/add/role', validateIsOwnerToken(), validateBody(UserSchema.addRole), controller.addRole);
router.post('/remove/role', validateIsOwnerToken(), validateBody(UserSchema.removeRole), controller.removeRole);

module.exports = router;