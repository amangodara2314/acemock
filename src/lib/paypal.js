import paypal from "@paypal/checkout-server-sdk";

const configureEnvironment = function () {
  // const clientId = process.env.PAYPAL_CLIENT_ID;
  // const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return process.env.NODE_ENV === "production"
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
};

const client = function () {
  return new paypal.core.PayPalHttpClient(configureEnvironment());
};

export default client;
