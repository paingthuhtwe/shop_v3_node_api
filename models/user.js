const mongoose = require("mongoose");
const helper = require("../utils/helper");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "role" },
  permits: [{ type: Schema.Types.ObjectId, ref: "permit" }],
  created_at: { type: Date, default: helper.currentDate() },
  updated_at: { type: Date, default: helper.currentDate() },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
