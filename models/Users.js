const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
  name:{
  type: String,
  required: true,
  lowercase: true
  },
  userid:{
  type: String,
  required: true,
    },
  email:{
  type: String,
  match:/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    },
  password:{
  type: String,

  },
  address:{
  type: String,
  default:''
  },
  tel:{
  type: String,
  default:''
  },
  picture: {
  type: String,
  required: true,
  match: /^http:\/\//i
  },

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
