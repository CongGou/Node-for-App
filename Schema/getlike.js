const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let getlikeSchema = new Schema({
  author : {type: Schema.Types.ObjectId,ref:"user"}
  ,date : {type:Date,default:Date.now()}
  ,getLikeID: {type:String,required:true}
});

module.exports = mongoose.model("getlike",getlikeSchema);
