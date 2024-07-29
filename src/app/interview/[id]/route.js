import { connectToDatabase } from "@/lib/database";
import Interview from "@/models/interview.model";
import Submit from "@/models/submit.model";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
const groq = new Groq({
  apiKey: process.env.GROQ_KEY,
});

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const id = params.id;
    if (!id || id === "undefined") {
      return NextResponse.json({
        status: 400,
        msg: "No interview ID provided",
      });
    }
    const interviews = await Interview.findById(id);
    if (interviews) {
      return NextResponse.json({ status: 200, interviews });
    } else {
      return NextResponse.json({
        status: 404,
        msg: "Unable To Find Interview",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}

export async function POST(request, { params }) {
  await connectToDatabase();
  const { answers, user, interview_id } = await request.json();
  try {
    if (user.id) {
      const prompt = `
      Evaluate the following interview answers. For each answer, provide:
      - "question": The interview question.
      - "userAnswer": The answer given by the user.
      - "correctAnswer": The correct answer in complete detail.
      - "rating": A rating of the user's answer out of 5.
      - "improvement": General suggestions for improving the answer (in 2 to 4 lines).      
      Provide the response in valid JSON format.
    
      ${answers
        .map(
          (qa) => `
          {
            "question": "${qa.question}",
            "userAnswer": "${qa.userAnswer}"
          }`
        )
        .join(",\n")}
    `;

      try {
        const chatCompletion = await groq.chat.completions.create({
          model: "llama-3.1-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "Respond only with valid JSON, without any additional text or explanation.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 8000,
          n: 1,
          stop: null,
          temperature: 0.5,
        });

        let res = chatCompletion.choices[0]?.message.content || "";

        if (res.startsWith("```") && res.endsWith("```")) {
          res = res.slice(3, -3).trim();
        }
        const data = JSON.parse(res);

        const existingSubmit = await Submit.findOne({
          interview_id: interview_id,
        });
        let submit;
        if (existingSubmit) {
          submit = await Submit.findByIdAndUpdate(existingSubmit, {
            details: data,
          });
        } else {
          submit = new Submit({
            user_id: user.id,
            interview_id: interview_id,
            details: data,
          });
          await submit.save();
        }

        return NextResponse.json({
          status: 200,
          msg: "Submit Successfull",
          details_id: submit._id,
        });
      } catch (error) {
        console.error("Error evaluating interview answers:", error);
        throw new Error("Failed to evaluate interview answers");
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
}
