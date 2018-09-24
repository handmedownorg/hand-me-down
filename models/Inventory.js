const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const inventorySchema = new Schema({
  gived: [],
  keeping: [],
  waiting: [],
  having: []
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;