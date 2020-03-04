const createOrderResponse = ({ ok, order = null, errors = null }) => ({
  ok,
  order,
  errors
});

module.exports = { createOrderResponse };
