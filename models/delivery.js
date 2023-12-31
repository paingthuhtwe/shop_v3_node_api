const mongoose = require("mongoose");
const helper = require("../utils/helper");
const { Schema } = mongoose;

const DeliverySchema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  duration: { type: String, required: true },
  image: { type: String, required: true },
  remark: { type: String , default: null },
  created_at: { type: Date, default: helper.currentDate() },
  updated_at: { type: Date, default: helper.currentDate() }
});

const Delivery = mongoose.model("delivery", DeliverySchema);

module.exports = Delivery;
