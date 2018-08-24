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
  password:String,
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

  },
  stats:{
   projects:[],
   created: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
      },
   assigned: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
      },
   completed: {
        type: Number,
        default: 0,
        min: 0,
        required: true,
      }
  },

  role:{type: String, required: true, enum: ['User', 'Admin', 'Contractor'], default: 'User'},

  updated_at: { type: Date, default: Date.now }

});

UserSchema.methods.validPassword = function( pwd ) {

   return ( this.password === pwd );
};


UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
