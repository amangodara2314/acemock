import { connectToDatabase } from "@/lib/database";
import Submit from "@/models/submit.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  await connectToDatabase();
  try {
    const submit = await Submit.findById(id);
    if (!submit) {
      return NextResponse.json({ error: "Results not found" }, { status: 404 });
    }

    return NextResponse.json({ details: submit.details }, { status: 200 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
