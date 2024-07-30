import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

const PayPalProvider = ({ children }) => {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
