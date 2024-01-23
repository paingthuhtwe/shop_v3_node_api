const router = require('express').Router();
const controller = require('../controllers/product');
const { ProductSchema } = require('../utils/schema');
const { validateBody } = require('../utils/validator');

router.get('/', controller.all);
router.post('/', validateBody(ProductSchema.add), controller.add);

module.exports = router;