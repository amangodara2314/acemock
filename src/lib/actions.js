"use server";

import Interview from "@/models/interview.model";
import User from "@/models/user.model";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import mongoose from "mongoose";
import { connectToDatabase } from "./database";
import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: process.env.GROQ_KEY,
});

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const checkInterviewAvailability = async (userId) => {
  console.log("called check");
  await connectToDatabase();
  const user = await User.findById(userId);

  const today = new Date().toISOString().slice(0, 10);
  const lastInterviewDate = user.lastInterviewDate
    ? user.lastInterviewDate.toISOString().slice(0, 10)
    : null;

  if (lastInterviewDate !== today) {
    user.interviewCount = 0;
    user.lastInterviewDate = new Date();
  }

  if (user.interviewCount > 2) {
    console.log("false", user.interviewCount);
    return false;
  }

  user.interviewCount += 1;
  console.log(user);
  await user.save();
  return true;
};

export async function createUserInDB({ email, name }) {
  try {
    await connectToDatabase();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }

    const user = new User({
      subscriptionDetails: {
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: false,
      },
      email,
      name,
    });

    console.log("User to be saved:", user);

    const savedUser = await user.save();
    console.log("Saved user:", savedUser);
    return savedUser;
  } catch (error) {
    console.error("Error saving user:", error.message);
    throw new Error(`Error saving user: ${error.message}`);
  }
}

export async function findUserByEmail(email) {
  console.log("finding one with email :", email);
  return await User.findOne({ email: email });
}

export async function saveInterview(questions, jobRole, experience, techStack) {
  try {
    console.log("Parameters:", { jobRole, experience, techStack });

    await connectToDatabase();

    const newInterview = new Interview({
      title: jobRole,
      techStack: techStack,
      experience: experience,
      questions: questions,
    });

    const savedInterview = await newInterview.save();
    console.log("Interview saved successfully", savedInterview);

    return { interview: savedInterview._id };
  } catch (error) {
    console.error("Error saving interview:", error);
    throw new Error("Failed to save interview");
  }
}

export async function getInterview({ jobRole, experience, techStack }) {
  const randomElement = Math.random().toString(36).substring(7);
  const experienceContext = `
  - If the experience is 1-2 years, the questions should cover basic and intermediate concepts.
  - If the experience is 3-5 years, the questions should cover intermediate to advanced concepts.
  - If the experience is more than 5 years, the questions should cover advanced concepts and problem-solving.
  `;
  const prompt = `
  Generate a list of 30 interview questions for a ${jobRole} role with a tech stack of ${techStack} and ${experience} years of experience. The questions should be appropriate for someone with ${experience} years of experience. Each question should be represented in JSON format with a field named "question". Include the code: ${randomElement}.
  ${experienceContext}
  Provide only the JSON content, without any additional text or explanation.
  `;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional interviewer. Respond only with valid JSON, without any additional text or explanation.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.8,
      max_tokens: 1500,
      top_p: 0.9,
      stream: false,
    });

    let responseText = chatCompletion.choices[0]?.message.content || "";

    if (responseText.startsWith("```") && responseText.endsWith("```")) {
      responseText = responseText.slice(3, -3).trim();
    }

    const questions = JSON.parse(responseText);
    if (questions) {
      const newInterview = await saveInterview(
        questions,
        jobRole,
        experience,
        techStack
      );
      return newInterview;
    }
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    throw new Error("Failed to fetch interview questions");
  }
}

export const createOrder = async (amount) => {
  const order_id = uuidv4();

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: order_id,
    };

    const razorpay_order = await instance.orders.create(options);

    return {
      msg: "Payment Successful",
      status: 200,
      id: order_id,
      razorpay_order,
      amount: options.amount,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return { msg: "Internal Server Error", status: 500 };
  }
};

export async function verifyPayment(order_id, response = null, user) {
  try {
    const secret = "wgTVEx9VWx0XXvgIFC8nJx4X";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(response.razorpay_order_id + "|" + response.razorpay_payment_id)
      .digest("hex");

    if (generated_signature === response.razorpay_signature) {
      await connectToDatabase();
      const currentUser = await User.findById(user._id);

      if (currentUser) {
        const currentDate = new Date();
        const endDate = new Date(currentDate);
        endDate.setMonth(currentDate.getMonth() + 1);

        currentUser.subscriptionDetails = {
          startDate: currentDate,
          endDate: endDate,
        };

        await currentUser.save();

        return {
          msg: "Payment Verified and Subscription Updated",
          status: 1,
          currentUser,
        };
      } else {
        return {
          msg: "User not found",
          status: 0,
        };
      }
    } else {
      return {
        msg: "Payment verification failed",
        status: 0,
      };
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      msg: "Internal Server Error",
      status: 0,
    };
  }
}
