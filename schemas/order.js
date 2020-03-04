const { gql } = require('apollo-server-express');

const typeDef = gql`
  scalar Date

  type Order {
    _id: ID!
    stripeId: String!
    orderDate: String!
    orderAmount: Float!
    createdAt: String!
    updatedAt: String
  }

  type Error {
    message: String
  }

  type OrderResponse {
    ok: Boolean!
    order: Order
    errors: [Error!]
  }

  input CreateOrderInput {
    orderAmount: Float!
  }

  input UpdateOrderInput {
    orderId: String!
  }

  input OrderInput {
    orderId: String!
  }

  type Query {
    getOrder(input: OrderInput!): OrderResponse
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): OrderResponse
    updateOrder(input: UpdateOrderInput!): OrderResponse
  }
`;

module.exports = typeDef;
