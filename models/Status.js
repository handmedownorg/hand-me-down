const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const statusSchema = new Schema({
  currentLocation: String,
  giverID: String,
  takerID: String,
  currentHolderID: String,
  indications: String, //notes for pick up
  tradeHistory: []
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;

