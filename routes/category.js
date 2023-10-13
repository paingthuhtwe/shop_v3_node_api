const router = require('express').Router();
const controller = require('../controllers/category');
const { saveSingleFile } = require('../utils/file');
const { CategorySchema } = require('../utils/schema');
const { validateBody, validateFile } = require('../utils/validator');

router.get('/', controller.all);
router.post('/', validateFile(CategorySchema.image, 'image'), validateBody(CategorySchema.add), controller.add);

module.exports = router;