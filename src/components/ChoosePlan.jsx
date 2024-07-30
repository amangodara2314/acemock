"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import PayPalButton from "./PaypalButton";
import RazorpayButton from "./RazorpayButton";

function Choose({ plan }) {
  const { loading } = useGlobalContext();
  const { data } = useSession();

  return (
    <>
      {loading && (
        <div className="fixed w-full h-full flex justify-center items-center bg-white bg-opacity-50">
          <Loader />
        </div>
      )}

      {data && data.user && (
        <>
          <RazorpayButton amount={plan * 83} userId={data.user.id} />
          <PayPalButton amount={plan} userId={data.user.id} />
        </>
      )}
    </>
  );
}

export default Choose;
