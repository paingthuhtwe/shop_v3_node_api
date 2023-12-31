const mongoose = require("mongoose");
const helper = require("../utils/helper");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  sub_categories: [{ type: Schema.Types.ObjectId, ref: 'sub_category' }],
  created_at: { type: Date, default: helper.currentDate() },
  updated_at: { type: Date, default: helper.currentDate() }
});

const Category = mongoose.model("category", CategorySchema);

module.exports = Category;
