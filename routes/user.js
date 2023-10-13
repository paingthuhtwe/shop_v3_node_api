const router = require('express').Router();
const controller = require('../controllers/user');
const { validateBody, validateToken, validateRole } = require('../utils/validator');
const { UserSchema } = require('../utils/schema');

router.post('/register', validateBody(UserSchema.register), controller.register);
router.post('/login', validateBody(UserSchema.login), controller.login);
router.get('/users', validateToken(), validateRole(['Owner', 'Manager', 'Supervisor']), controller.all);
router.post('/add/role', validateToken(), validateRole(['Owner']), validateBody(UserSchema.addRole), controller.addRole);
router.delete('/remove/role', validateToken(), validateRole(['Owner']), validateBody(UserSchema.removeRole), controller.removeRole);
router.post('/add/permit', validateToken(), validateRole(['Owner']), validateBody(UserSchema.addPermit), controller.addPermit);
router.delete('/remove/permit', validateToken(), validateRole(['Owner']), validateBody(UserSchema.removePermit), controller.removePermit);

module.exports = router;