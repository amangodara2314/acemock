import { connectToDatabase } from "@/lib/database";
import Submit from "@/models/submit.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params.id;
  try {
    await connectToDatabase();
    const interviews = await Submit.find({ userId: id }).populate(
      "interview_id"
    );
    if (!interviews) {
      return NextResponse.json({ message: "No interviews found" });
    }
    const sanitizedInterviews = interviews.map((interview) => {
      const interviewObject = interview.toObject();
      delete interviewObject.details;
      return interviewObject;
    });

    return NextResponse.json(sanitizedInterviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
