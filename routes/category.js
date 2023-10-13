const router = require('express').Router();
const controller = require('../controllers/category');
const { CategorySchema, AllSchema } = require('../utils/schema');
const { validateBody, validateFile, validateParams } = require('../utils/validator');

router.get('/', controller.all);
router.post('/', validateFile(CategorySchema.image, 'image'), validateBody(CategorySchema.add), controller.add);
router.route('/:id')
    .get(validateParams(AllSchema.id, 'id'), controller.get)
    .delete(validateParams(AllSchema.id, 'id'), controller.drop)

module.exports = router;