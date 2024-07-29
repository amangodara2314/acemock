import { connectToDatabase } from "@/lib/database";
import Subscription from "@/models/subscription.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const subscription = await Subscription.findOne({ userId: params.id });

    if (!subscription) {
      return NextResponse.json({
        msg: "No subscription found. Please purchase a subscription.",
        status: 404,
      });
    }

    // Check if the subscription is expired
    const currentDate = new Date();
    if (currentDate > subscription.endDate) {
      return NextResponse.json({
        msg: "Subscription expired. Please renew your subscription.",
        status: 410,
      });
    }

    return NextResponse.json({
      msg: "Subscription found",
      status: 200,
      subscription,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json({
      msg: "Internal Server Error",
      status: 500,
    });
  }
}
