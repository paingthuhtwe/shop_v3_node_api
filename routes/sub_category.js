const router = require('express').Router();
const controller = require('../controllers/sub_category');
const { SubCategorySchema, AllSchema } = require('../utils/schema');
const { validateBody, validateFile, validateParams, validateToken, validatePermit } = require('../utils/validator');

router.get('/', controller.all);
router.post('/', validateToken(), validatePermit(['Create_Category']), validateFile(AllSchema.image, 'image'), validateBody(SubCategorySchema.add), controller.add);
router.route('/:id')
    .get(validateParams(AllSchema.id, 'id'), controller.get)
    .patch(validateToken(), validatePermit(['Edit_Category']), validateParams(AllSchema.id, 'id'), controller.patch)
    .delete(validateToken(), validatePermit(['Delete_Category']), validateParams(AllSchema.id, 'id'), controller.drop)
router.post('/add/child-category', validateBody(SubCategorySchema.addChild), controller.addChildCategory);
router.delete('/remove/child-category', validateBody(SubCategorySchema.removeChild), controller.removeChildCategory);

module.exports = router;