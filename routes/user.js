const router = require('express').Router();
const controller = require('../controllers/user');
const { validateBody, validateToken, validateRole } = require('../utils/validator');
const { UserSchema } = require('../utils/schema');

router.post('/register', validateBody(UserSchema.register), controller.register);
router.post('/login', validateBody(UserSchema.login), controller.login);
router.get('/users', validateToken(), controller.all);
router.post('/add/role', validateToken(), validateRole('Owner'), validateBody(UserSchema.addRole), controller.addRole);
router.post('/remove/role', validateToken(), validateRole('Owner'), validateBody(UserSchema.removeRole), controller.removeRole);

module.exports = router;