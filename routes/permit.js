const router = require('express').Router();
const controller = require('../controllers/permit');
const { PermitSchema, AllSchema } = require('../utils/schema')
const { validateBody, validateParams } = require('../utils/validator')

router.get('/', controller.all)
router.post('/', validateBody(PermitSchema.add), controller.add)

router.route('/:id')
    .get(validateParams(AllSchema.id, 'id'), controller.get)
    .patch(validateBody(PermitSchema.add), validateParams(AllSchema.id, 'id'), controller.patch)
    .delete(validateParams(AllSchema.id, 'id'), controller.drop)

module.exports = router;