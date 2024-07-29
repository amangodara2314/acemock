"use client";
import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";

import Loader from "@/components/Loader";

const ResultsPage = ({ params }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/interview/details/${params.id}`);
        const data = await response.json();
        if (!data.details) {
          toast.error("Internal Server Error");
          return;
        }
        setResults(data.details);
      } catch (error) {
        toast.error("Error fetching results");
      }
    };
    if (params.id) {
      fetchResults();
    }
  }, [params]);

  if (!results) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto max-w-5xl">
      <h1 className="text-4xl font-semibold mb-6 text-black text-center">
        Interview Results
      </h1>
      <div className="space-y-8">
        {results.map((result, index) => (
          <div className="w-full" key={index}>
            <div className="font-semibold text-xl">{result.question}</div>
            <div className={`mb-4 font-semibold text-purple-700 `}>
              Your Answer:{" "}
              <span
                className={`${result.userAnswer == "" ? "text-red-500" : ""}`}
              >
                {result.userAnswer == "" ? "Empty" : result.userAnswer}
              </span>
            </div>
            <div className="flex justify-center gap-0 sm:gap-4 sm:flex-row flex-col">
              <div className="bg-blue-300 p-4 rounded-lg shadow-lg flex mb-4 flex-1">
                <div>
                  <p className="text-blue-900 font-semibold">Correct Answer:</p>
                  <p className="text-blue-900">{result.correctAnswer}</p>
                </div>
              </div>
              <div className="bg-yellow-300 p-4 rounded-lg shadow-lg flex mb-4 flex-1">
                <div>
                  <p className="text-yellow-900 font-semibold">
                    Field of improvement:
                  </p>
                  <p className="text-yellow-900">{result.improvement}</p>
                </div>
              </div>{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
