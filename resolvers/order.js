const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const uuidv4 = require('uuid/v4');
const { convertStripeError, convertError } = require('../utils/convertErrors');
const { createOrderResponse } = require('../utils/createOrderResponse');
const connectDatabase = require('../models/connectDatabase');
const Order = require('../models/Order');

module.exports = {
  Query: {
    getOrder: async (parent, { input }, { db }) => {
      try {
        await connectDatabase();
        const order = await Order.findOne({ _id: input.orderId });

        if (!order) throw new Error('Order not found.');

        const charge = await stripe.charges.retrieve(order.stripeId);
        console.info('charge', charge);

        return createOrderResponse({ ok: true, order });
      } catch (error) {
        return createOrderResponse({
          ok: false,
          order: null,
          errors: convertError(error)
        });
      }
    }
  },
  Mutation: {
    updateOrder: async (parent, { input }) => {
      try {
        await connectDatabase();
        const order = await Order.findOne({ _id: input.orderId });

        if (!order) throw new Error('Order not found.');

        // update stripe
        await stripe.charges.update(order.stripeId, {
          metadata: { orderId: input.orderId, updated: Date.now().toString() }
        });

        // update database
        const updatedOrder = await Order.findOneAndUpdate(
          { _id: input.orderId },
          { ...input, updatedAt: Date.now().toString() },
          { upsert: false }
        );

        return createOrderResponse({ ok: true, order: updatedOrder });
      } catch (error) {
        return createOrderResponse({
          ok: false,
          order: null,
          errors: error.type ? convertStripeError(error) : convertError(error)
        });
      }
    },
    createOrder: async (parent, { input }) => {
      try {
        // create stripe order
        const idempotencyKey = uuidv4();

        const charge = await stripe.charges.create(
          {
            amount: input.orderAmount,
            currency: 'usd',
            source: 'tok_visa', // obtained with Stripe.js
            description: `Order for ${input.orderDate}`
          },
          {
            idempotencyKey
          }
        );

        // create database record
        await connectDatabase();
        const order = await Order.create({
          ...input,
          stripeId: charge.id
        });

        return createOrderResponse({
          ok: true,
          order
        });
      } catch (error) {
        return createOrderResponse({
          ok: false,
          order: null,
          errors: error.type ? convertStripeError(error) : convertError(error)
        });
      }
    }
  }
};
