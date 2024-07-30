"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { createOrder } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import useRazorpay from "react-razorpay";

const RazorpayButton = ({ amount, userId }) => {
  const { setLoading, loading } = useGlobalContext();
  const { data, update } = useSession();
  const [Razorpay] = useRazorpay();
  const router = useRouter();

  const handleSubscribe = () => {
    if (!data.user) {
      router.push("/signin");
    } else {
      handlePayment();
    }
  };

  const handlePayment = useCallback(async () => {
    try {
      console.log(amount, amount * 83);
      const order = await createOrder(amount);
      if (order?.status !== 200) {
        toast.error(order.msg ? order.msg : "Something went wrong");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "AceMock",
        description: "",
        order_id: order.razorpay_order.id,
        handler: async (response) => {
          try {
            setLoading(true);
            const verifyResponse = await fetch(
              "/subscription/verify/razorpay",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  user: data.user.id,
                  response: response,
                  amount: amount,
                }),
              }
            );

            const result = await verifyResponse.json();

            if (!result || result.status !== 200) {
              console.error("Payment verification failed:", result);

              toast.error(result.msg ? result.msg : "Failed to verify payment");
            } else {
              toast.success("Purchase confirmed, enjoy!");
              router.push("/dashboard");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Failed to verify payment");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
        },
        theme: {
          color: "#7E22CE",
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  }, [Razorpay, router]);

  return (
    <button
      onClick={handleSubscribe}
      className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-[7px] px-4 rounded w-full mb-[14px] cursor-pointer"
    >
      Pay with INR
    </button>
  );
};

export default RazorpayButton;
