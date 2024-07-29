"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "@/context/GlobalContext";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

function PreviousInterviews() {
  const { interviews, setInterviews } = useGlobalContext();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          const response = await fetch(`/interview/submits/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setInterviews(data);
          } else {
            toast.error("Error fetching interview data:");
          }
        } catch (error) {
          toast.error("Error fetching interview data:", error);
        }
      };
      fetchData();
    }
  }, [status, session]);

  if (!interviews) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="">
      <h2 className="text-2xl font-bold mb-6 lg:text-left text-center">
        Previous Interviews
      </h2>
      <div className="flex flex-wrap gap-6 lg:justify-start justify-center">
        {interviews.length == 0 ? (
          <div className="text-gray-600 text-sm">
            You Haven't Given A Interview Yet Click On Create Button And Get
            Started With Your First Interview...
          </div>
        ) : (
          interviews?.map((interview) => (
            <div
              key={interview._id}
              className="shadow-lg p-4 rounded-lg space-y-4 w-[315px] bg-[#f8f8f8]"
            >
              <div>
                <h3 className="text-xl font-semibold">
                  {interview.interview_id.title}
                </h3>
                <p className="">
                  {interview.interview_id.experience} years of experience
                </p>
                <p className="text-sm text-gray-600">
                  Created At - {console.log(interview.interview_id)}
                  {new Date(
                    interview.interview_id.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    router.push(
                      "/dashboard/interview/details/" + interview._id
                    );
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    router.push(
                      "/dashboard/interview/" + interview.interview_id._id
                    );
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Retake
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default PreviousInterviews;
