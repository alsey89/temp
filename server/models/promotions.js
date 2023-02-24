const mongoose = require("mongoose");
const { db } = require("./user");

const PromotionsSchema = new mongoose.Schema({
  item:{type: Schema.Types.ObjectId, ref: 'Item'},
  keywords:[String],
  startDate:Date,
  endDate:Date,
  description:String,
  title:String,
  image:String,
  thumbnail:String,
  discount:Boolean,
  discountPercent:Number,

});

const Promotions = mongoose.model("Promotions", PromotionsSchema);
module.exports = Promotions;
