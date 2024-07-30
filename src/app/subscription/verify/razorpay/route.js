import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/database";
import Subscription from "@/models/subscription.model";
import User from "@/models/user.model";

export async function POST(req) {
  try {
    const { response, user, amount } = await req.json();
    const secret = process.env.RAZORPAY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(response.razorpay_order_id + "|" + response.razorpay_payment_id)
      .digest("hex");

    if (generated_signature === response.razorpay_signature) {
      await connectToDatabase();

      const currentUser = await User.findById(user);

      if (currentUser) {
        const subscription = await createOrUpdateSubscription(
          currentUser._id,
          amount
        );

        return NextResponse.json({
          msg: "Payment Verified and Subscription Updated",
          status: 200,
          subscription,
        });
      } else {
        return NextResponse.json({
          msg: "User not found",
          status: 0,
        });
      }
    } else {
      return NextResponse.json({
        msg: "Payment verification failed",
        status: 0,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({
      msg: "Internal Server Error",
      status: 0,
    });
  }
}

async function createOrUpdateSubscription(userId, amount) {
  try {
    const currentDate = new Date();
    let endDate;

    if (amount === 1 * 83) {
      endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 1);
    } else if (amount === 5 * 83) {
      endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 7);
    } else if (amount === 15 * 83) {
      endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + 1);
    } else {
      throw new Error("Invalid amount");
    }

    let subscription = await Subscription.findOne({ userId });

    if (subscription) {
      subscription.startDate = currentDate;
      subscription.endDate = endDate;
    } else {
      subscription = new Subscription({
        userId,
        startDate: currentDate,
        endDate,
        status: true,
      });
    }

    const savedSubscription = await subscription.save();
    console.log("Saved subscription:", savedSubscription);

    return savedSubscription;
  } catch (error) {
    console.error("Error creating/updating subscription:", error.message);
    throw new Error(`Error creating/updating subscription: ${error.message}`);
  }
}
