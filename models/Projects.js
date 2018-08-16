const mongoose = require('mongoose');


var findOrCreate = require('mongoose-findorcreate')

const ProjectSchema = new mongoose.Schema({
  tittle: String,
  description: String,
  bill: String,
  contractor: String,
  deadline:date,
  type:String,
  userid:String,
  status:{type: String, required: true, enum: ['created', 'Assigned', 'Not Approved', 'Approved','Complete','Paid','Closed'], default: 'created'},

  updated_at: { type: Date, default: Date.now }

});



ProjectSchema.plugin(findOrCreate);

module.exports = mongoose.model('Project', ProjectSchema);
