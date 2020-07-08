const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let focusSchema = new Schema({
   author : {type: Schema.Types.ObjectId,ref:"user"}
  ,date : {type:Date,default:Date.now()}
  ,focusID: {type:String,required:true}
  ,focusObj: {type: Schema.Types.ObjectId,ref:"user"}
});

module.exports = mongoose.model("focus",focusSchema);
