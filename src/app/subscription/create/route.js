import client from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";

import { NextResponse } from "next/server";

export async function POST(req) {
  const { order_price, user_id } = await req.json();

  if (!order_price || !user_id) {
    return NextResponse.json(
      {
        success: false,
        message: "Please provide order_price and user_id",
      },
      { status: 400 }
    );
  }

  try {
    const PaypalClient = client();
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers["prefer"] = "return=representation";
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: order_price + "",
          },
        },
      ],
    });

    const response = await PaypalClient.execute(request);
    if (response.statusCode !== 201) {
      console.log("RES: ", response);
      return NextResponse.json(
        {
          success: false,
          message: "Some error occurred at backend",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { order: response.result },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Err at Create Order: ", err);
    return NextResponse.json(
      {
        success: false,
        message: "Could not create the order",
      },
      { status: 500 }
    );
  }
}
