"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import { createOrder } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import useRazorpay from "react-razorpay";
import Loader from "./Loader";

function Choose({ plan }) {
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
      const order = await createOrder(plan);
      if (order?.status !== 200) {
        toast.error(order.msg ? order.msg : "Something went wrong");
        return;
      }

      const options = {
        key: "rzp_test_x05ld753Ga9eFk",
        amount: order.amount,
        currency: "USD",
        name: "AcePrep",
        description: "",
        order_id: order.razorpay_order.id,
        handler: async (response) => {
          try {
            setLoading(true);
            const verifyResponse = await fetch("/subscription/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: data.user,
                response: response,
                amount: plan,
              }),
            });

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
    <>
      {loading && (
        <div className="fixed w-full h-full flex justify-center items-center bg-white bg-opacity-50">
          <Loader />
        </div>
      )}
      <button
        onClick={handleSubscribe}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded absolute bottom-4 left-[30%]"
      >
        Choose Plan
      </button>
    </>
  );
}

export default Choose;
