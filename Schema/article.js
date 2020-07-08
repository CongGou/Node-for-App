const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let articleSchema = new Schema({
  title: { type: String, required: true },
  label: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  reading: { type: Number, min: 0 },
  getLike: { type: Number, min: 0 },
  coverImg: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "user" },
  comments: { type: Schema.Types.ObjectId, ref: "comments" },
});
module.exports = mongoose.model("article", articleSchema);
