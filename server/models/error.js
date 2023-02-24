var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ErrorSchema = new Schema({
  error:String,
  errorLocation:String,
  errorLevel:Number,
  errorType:String,
  
});

mongoose.model('Error', ErrorSchema);