const mongoose = require("mongoose");
const helper = require("../utils/helper");
const { Schema } = mongoose;

const SubCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  child_categories: [{ type: Schema.Types.ObjectId, ref: 'child_category' }],
  created_at: { type: Date, default: helper.currentDate() },
  updated_at: { type: Date, default: helper.currentDate() }
});

const SubCategory = mongoose.model("sub_category", SubCategorySchema);

module.exports = SubCategory;
