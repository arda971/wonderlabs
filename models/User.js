const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
  name: String,
  userid: String,
  email: String,
  password: String

  updated_at: { type: Date, default: Date.now },
  validPassword: function( pwd ) {
      // EXAMPLE CODE!
      return ( this.password === pwd );
  }
});



//UserSchema.statics.findOrCreate = require("find-or-create");
//UserSchema.statics.findOrCreate = require("mongoose-findorcreate");
UserSchema.plugin(findOrCreate);
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
