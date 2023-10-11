const router = require('express').Router();
const controller = require('../controllers/role');
const { RoleSchema, AllSchema } = require('../utils/schema')
const { validateBody, validateParams, validateToken } = require('../utils/validator')

router.get('/', validateToken(), controller.all)
router.post('/', validateToken(), validateBody(RoleSchema.add), controller.add)
router.post('/add/permit', validateToken(), validateBody(RoleSchema.addPermit), controller.roleAddPermit)
router.delete('/remove/permit', validateToken(), validateBody(RoleSchema.addPermit), controller.roleRemovePermit)

router.route('/:id')
    .get(validateToken(), validateParams(AllSchema.id, 'id'), controller.get)
    .patch(validateToken(), validateBody(RoleSchema.add), validateParams(AllSchema.id, 'id'), controller.patch)
    .delete(validateToken(), validateParams(AllSchema.id, 'id'), controller.drop)

module.exports = router;