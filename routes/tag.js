const router = require('express').Router();
const controller = require('../controllers/tag');
const { TagSchema, AllSchema } = require('../utils/schema');
const { validateBody, validateFile, validateParams, validateToken, validatePermit } = require('../utils/validator');

router.get('/', controller.all);
router.post('/', validateToken(), validatePermit('Create_Category'), validateFile(AllSchema.image, 'image'), validateBody(TagSchema.add), controller.add);
router.route('/:id')
    .get(validateParams(AllSchema.id, 'id'), controller.get)
    .patch(validateToken(), validatePermit('Edit_Category'), validateParams(AllSchema.id, 'id'), controller.patch)
    .delete(validateToken(), validatePermit('Delete_Category'), validateParams(AllSchema.id, 'id'), controller.drop)

module.exports = router;