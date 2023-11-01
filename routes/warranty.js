const router = require('express').Router();
const controller = require('../controllers/warranty');
const { AllSchema, WarrantySchema } = require('../utils/schema');
const { validateFile, validateBody, validateParams, validateToken, validateRole } = require('../utils/validator');

router.get('/', controller.all);
router.post('/', validateToken(), validateRole(['Owner', 'Manager', 'Supervisor']), validateFile(AllSchema.image, 'image'), validateBody(WarrantySchema.add), controller.add);
router.route('/:id')
    .get( validateParams(AllSchema.id, 'id'), controller.get)
    .patch( validateToken(), validateRole(['Owner', 'Manager', 'Supervisor']), validateParams(AllSchema.id, 'id'), controller.patch)
    .delete( validateToken(), validateRole(['Owner', 'Manager', 'Supervisor']), validateParams(AllSchema.id, 'id'), controller.drop)

module.exports = router;