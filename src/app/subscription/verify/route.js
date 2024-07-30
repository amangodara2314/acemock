import { connectToDatabase } from "@/lib/database";
import client from "@/lib/paypal";
import Subscription from "@/models/subscription.model";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";

const createOrUpdateSubscription = async (userId, amount) => {
  try {
    const currentDate = new Date();
    let endDate;

    switch (amount) {
      case 1:
        endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + 1);
        break;
      case 5:
        endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + 7);
        break;
      case 15:
        endDate = new Date(currentDate);
        endDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
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
};

export async function POST(req) {
  const { orderID, userID } = await req.json();

  if (!orderID || !userID) {
    return NextResponse.json(
      {
        success: false,
        message: "Please Provide Order ID and User ID",
      },
      { status: 400 }
    );
  }

  await connectToDatabase();

  try {
    const PaypalClient = client();
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const response = await PaypalClient.execute(request);
    if (!response) {
      return NextResponse.json(
        {
          success: false,
          message: "Some Error Occurred at backend",
        },
        { status: 500 }
      );
    }

    const captures = response.result.purchase_units[0]?.payments?.captures;
    if (!captures || captures.length === 0) {
      console.log("No captures found in response");
      return NextResponse.json(
        {
          success: false,
          message: "No payment captures found",
        },
        { status: 500 }
      );
    }
    if (captures[0].status != "COMPLETED") {
      console.log("failed");
      return NextResponse.json(
        {
          success: false,
          message: "Payment Failed",
        },
        { status: 500 }
      );
    }

    const amount = parseFloat(captures[0]?.amount?.value);
    console.log(amount);

    // Update user subscription
    const subscription = await createOrUpdateSubscription(userID, amount);

    return NextResponse.json(
      {
        success: true,
        data: { order: response.result, subscription },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Err at Capture Order: ", err);
    return NextResponse.json(
      {
        success: false,
        message: "Could Not Capture the order",
      },
      { status: 500 }
    );
  }
}
