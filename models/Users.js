const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
  name: String,
  userid: String,
  email: String,
  password: String,
  address: String,
  tel: String,
  projects:{type: Schema.ObjectId, ref: 'Project'},
  role:{type: String, required: true, enum: ['User', 'Admin', 'Contractor'], default: 'User'},

  updated_at: { type: Date, default: Date.now }

});

UserSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};

//UserSchema.statics.findOrCreate = require("find-or-create");
//UserSchema.statics.findOrCreate = require("mongoose-findorcreate");
UserSchema.plugin(findOrCreate);
//UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
