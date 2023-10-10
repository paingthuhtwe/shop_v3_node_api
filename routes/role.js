const router = require('express').Router();
const controller = require('../controllers/role');
const { RoleSchema, AllSchema } = require('../utils/schema')
const { validateBody, validateParams } = require('../utils/validator')

router.get('/', controller.all)
router.post('/', validateBody(RoleSchema.add), controller.add)
router.post('/add/permit', validateBody(RoleSchema.addPermit), controller.roleAddPermit)
router.delete('/remove/permit', validateBody(RoleSchema.addPermit), controller.roleRemovePermit)

router.route('/:id')
    .get(validateParams(AllSchema.id, 'id'), controller.get)
    .patch(validateBody(RoleSchema.add), validateParams(AllSchema.id, 'id'), controller.patch)
    .delete(validateParams(AllSchema.id, 'id'), controller.drop)

module.exports = router;