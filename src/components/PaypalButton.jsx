import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

const PayPalButton = ({ amount, userId }) => {
  const paypalCreateOrder = async () => {
    try {
      const response = await fetch("/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          order_price: amount,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error("Failed to create PayPal order");
        return null;
      }
      // toast.success("PayPal order created successfully");
      return data.data.order.id;
    } catch (err) {
      console.error("Error creating PayPal order:", err);
      toast.error("Error creating PayPal order");
      return null;
    }
  };

  const paypalCaptureOrder = async (orderID) => {
    try {
      const response = await fetch("/subscription/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID,
          userID: userId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Purchase successfull, Enjoy");
        console.log("Order captured:", data.data.wallet);
      } else {
        toast.error("Failed to capture PayPal order");
      }
    } catch (err) {
      console.error("Error capturing PayPal order:", err);
      toast.error("Error capturing PayPal order");
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ color: "gold", shape: "rect", label: "pay", height: 40 }}
        createOrder={async (data, actions) => {
          const orderId = await paypalCreateOrder();
          return orderId;
        }}
        onApprove={async (data, actions) => {
          await paypalCaptureOrder(data.orderID);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
