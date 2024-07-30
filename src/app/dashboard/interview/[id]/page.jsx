"use client";

import Loader from "@/components/Loader";
import Questions from "@/components/QuestionsSection";
import SpeechToTextButton from "@/components/SpeechToText";
import { useGlobalContext } from "@/context/GlobalContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

function Page({ params }) {
  const { questions, setQuestions, loading, setLoading } = useGlobalContext();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubscriptionValid, setIsSubscriptionValid] = useState(null);
  const [answers, setAnswers] = useState(null);
  const { data, error, isLoading } = useSWR("/interview/" + params.id, fetcher);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  useEffect(() => {
    async function confirmSubscription() {
      if (!session || !session.user) {
        router.replace("/signin");
        return;
      }
      try {
        const response = await fetch(
          "/subscription/verify/" + session.user.id,
          {
            method: "GET",
          }
        );
        const result = await response.json();
        if (result.status !== 200) {
          toast.error(result.msg);
          setIsSubscriptionValid(false);
          router.replace("/dashboard");
        } else {
          setIsSubscriptionValid(true);
        }
      } catch (error) {
        toast.error("Error checking subscription status.");
        setIsSubscriptionValid(false);
      }
    }

    confirmSubscription();
  }, [session, router]);

  useEffect(() => {
    if (isSubscriptionValid === true && data) {
      if (data.status === 200) {
        setQuestions(data.interviews.questions);
        setAnswers(
          data.interviews.questions?.map((question) => ({
            question: question.question,
            userAnswer: "",
          }))
        );
      } else {
        toast.error("Error loading data: " + data.msg);
      }
    }
  }, [isSubscriptionValid, data]);

  if (isLoading && !answers)
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-16 font-bold text-xl">
        Error loading data: {error.message}
      </div>
    );

  const handleAnswerChange = (e) => {
    const updatedAnswers = answers.map((a, i) => {
      if (i === selectedQuestion) {
        return { ...a, userAnswer: e.target.value };
      }
      return a;
    });
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/interview/" + params.id, {
        method: "POST",
        body: JSON.stringify({
          answers: answers,
          user: session.user,
          interview_id: params.id,
        }),
      });
      const data = await response.json();
      if (data.status === 200) {
        toast.success("Submit Successful");
        router.replace("/dashboard/interview/details/" + data.details_id);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error("Error submitting answers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    answers && (
      <div className="w-full h-full py-5 lg:py-10 flex lg:flex-row flex-col gap-2 lg:gap-8 justify-center px-5 lg:px-16">
        <Questions
          questions={questions}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
        <div className="lg:w-[60%] w-[100%] bg-white flex-shrink-0 p-4">
          <textarea
            className="w-full h-40 p-2 text-sm text-gray-700 border"
            placeholder="Write your answer"
            value={answers[selectedQuestion]?.userAnswer || ""}
            onChange={handleAnswerChange}
          ></textarea>
          <div className="bg-blue-300 p-4 rounded-lg shadow-lg flex items-start space-x-1 my-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-  h-8 text-blue-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            <div>
              <p className="text-blue-900 font-semibold">Tip:</p>
              <p className="text-blue-900">
                Please use the microphone button to answer the question
                verbally. Once you have finished speaking, click the pause
                button. For optimal accuracy, ensure clarity in your speech.
              </p>
            </div>
          </div>
          <div className="bg-yellow-300 p-4 rounded-lg shadow-lg flex items-start space-x-1 my-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-yellow-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            <div>
              <p className="text-yellow-900 font-semibold">Note:</p>
              <p className="text-yellow-900">
                If the microphone is not working, please ensure that you have
                enabled microphone permissions in your browser settings.
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center mt-2">
            <SpeechToTextButton
              setAnswer={(text) => {
                console.log(text);
                const updatedAnswers = answers.map((a, i) => {
                  if (i === selectedQuestion) {
                    return { ...a, userAnswer: text };
                  }
                  return a;
                });
                setAnswers(updatedAnswers);
              }}
            />
            {selectedQuestion == questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 ml-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <span className="mr-2 text-gray-300">Loading...</span>{" "}
                    <Loader size={"w-5 h-5"} />
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedQuestion(selectedQuestion + 1);
                }}
                className="bg-purple-600 ml-4 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default Page;
