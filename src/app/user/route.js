import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    const user = await new User({
      email,
      name,
      subscription: {
        endDate: new Date(),
        startDate: new Date(),
        status: false,
      },
    });
    await user.save();
    return NextResponse.json({ status: 201, msg: "Created Successfully" });
  } catch (error) {
    return NextResponse.json({ status: 500, msg: "Internal Server Error" });
  }
}
