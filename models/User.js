const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  userid: String,
  email: String,

  updated_at: { type: Date, default: Date.now },
});

//UserSchema.statics.findOrCreate = require("find-or-create");
UserSchema.statics.findOrCreate = require("mongoose-findorcreate");


module.exports = mongoose.model('User', UserSchema);
