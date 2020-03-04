module.exports.convertError = e => {
  return e.errors ? e.errors : [{ message: e.message || String(e) }];
};

module.exports.convertStripeError = e => {
  let message;
  switch (e.type) {
    case 'StripeCardError':
      // A declined card error
      message = "Your card's expiration year is invalid.";
      break;
    case 'StripeRateLimitError':
      // Too many requests made to the API too quickly
      message = 'Too many requests';
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      message = e.raw.message;
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      message = 'API Error';
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      message = 'Connection Error';
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      message = 'Authentication Error';
      break;
    default:
      // Handle any other types of unexpected errors
      message = 'Unknown Error';
      break;
  }

  return [{ message }];
};
