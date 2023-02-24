const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  price:Number,
  slot:String,  
  name:String,
  quality:String,
  description:String,
  dateStart:Date,
  dateEnd:Date,
  limited:Boolean,
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
