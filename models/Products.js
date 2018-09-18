const mongoose = require('mongoose');


var findOrCreate = require('mongoose-findorcreate')

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price:{
      type: Number,
      required: true,
    },
  description:String,
  updated_at: { type: Date, default: Date.now }

});



ProductSchema.plugin(findOrCreate);

module.exports = mongoose.model('Product', ProductSchema);
