const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  sub_categories: [{ type: Schema.Types.ObjectId, ref: 'sub_category' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Category = mongoose.model("category", CategorySchema);

module.exports = Category;
