const mongoose = require('mongoose');
const helper = require('../utils/helper');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: Array, required: true  },
    brand: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', default: null },
    sub_category: { type: Schema.Types.ObjectId, ref: 'sub_category', default: null },
    child_category: { type: Schema.Types.ObjectId, ref: 'child_category', default: null },
    tag: { type: Schema.Types.ObjectId, ref: 'tag' },
    discount: { type: Number, min: 0, default: 0 },
    features: { type: Array, required: true },
    description: { type: String, required: true },
    detail: { type: String, required: true },
    stock: { type: Number, min: 0, default: 0 },
    status: { type: Boolean, default: true },
    deliveries: [{ type: Schema.Types.ObjectId, ref: 'delivery' }],
    warranties: [{ type: Schema.Types.ObjectId, ref: 'warranty' }],
    colors: { type: Array, required: true  },
    size: { type: String, required: true  },
    rating: { type: String, required: true  },
    created_at: { type: Date, default: helper.currentDate() }, 
    updated_at: { type: Date, default: helper.currentDate() }, 
})

const Product = mongoose.model('product', productSchema);

module.exports = Product;