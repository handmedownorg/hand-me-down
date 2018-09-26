const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const statusSchema = new Schema({
  currentLocation: String,
  giverID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  takerID: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  currentHolderID: { type: Schema.Types.ObjectId, ref: 'User' },
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

