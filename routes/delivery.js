const router = require('express').Router();
const controller = require('../controllers/delivery');
const { DeliverySchema, AllSchema } = require('../utils/schema');
const { validateBody, validateFile, validateParams, validateToken } = require('../utils/validator');

router.get('/', controller.all);
router.post('/', validateToken(), validateFile(AllSchema.image, 'image'), validateBody(DeliverySchema.add), controller.add);
router.route('/:id')
    .get(validateParams(AllSchema.id, 'id'), controller.get)
    .patch(validateToken(), validateParams(AllSchema.id, 'id'), controller.patch)
    .delete(validateToken(), validateParams(AllSchema.id, 'id'), controller.drop)

module.exports = router;