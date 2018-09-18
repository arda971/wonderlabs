const mongoose = require('mongoose');


var findOrCreate = require('mongoose-findorcreate')

const commentSchema = new mongoose.Schema({

    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: String,
        required: true
    },
    authorId:String,
}, {
    timestamps: true
});


const ProjectSchema = new mongoose.Schema({
  tittle: String,
  description: String,
  bill: String,
  contractor: String,
  deadline:Date,
  type:String,
  userid:String,
  status:{type: String, required: true, enum: ['created', 'assigned', 'complete','paid','closed'], default: 'created'},
  costs: [{
  product: {
    type: mongoose.Schema.Types.ObjectId,ref:'Product'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  status:{type: String, required: true, enum: ['Approved', 'Not Approved'], default: 'Not Approved'},
 }],
 comments:[commentSchema],

  updated_at: { type: Date, default: Date.now }

});



ProjectSchema.plugin(findOrCreate);

module.exports = mongoose.model('Project', ProjectSchema);
