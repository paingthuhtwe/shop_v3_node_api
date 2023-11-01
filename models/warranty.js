const mongoose = require("mongoose");
const helper = require("../utils/helper");
const { Schema } = mongoose;

const WarrantySchema = new Schema({
  name: { type: String, required: true, unique: true  },
  image: { type: String, required: true },
  remark: { type: String, default: null },
  created_at: { type: Date, default: helper.currentDate() },
  updated_at: { type: Date, default: helper.currentDate() },
});

const Warranty = mongoose.model("warranty", WarrantySchema);

module.exports = Warranty;
