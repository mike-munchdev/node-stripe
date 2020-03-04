const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  stripeId: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  orderAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
