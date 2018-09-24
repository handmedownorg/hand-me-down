const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const itemSchema = new Schema({
  name: String,
  tag: String,
  statusID: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
