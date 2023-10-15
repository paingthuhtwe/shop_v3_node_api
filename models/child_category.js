const mongoose = require("mongoose");
const helper = require("../utils/helper");
const { Schema } = mongoose;

const ChildCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  created_at: { type: Date, default: helper.currentDate() },
  updated_at: { type: Date, default: helper.currentDate() }
});

const ChildCategory = mongoose.model("child_category", ChildCategorySchema);

module.exports = ChildCategory;
