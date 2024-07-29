"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import React, { useState, useEffect, useCallback } from "react";

const SpeechToTextButton = ({ setAnswer }) => {
  const { toast } = useGlobalContext();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event) => {
      console.log("Recognition Result Event:", event);
      if (event.results.length > 0) {
        const transcript =
          event.results[event.results.length - 1][0].transcript;
        console.log("Transcript:", transcript);
        setAnswer(transcript);
      } else {
        console.log("No results found.");
      }
    };

    recognitionInstance.onerror = (event) => {
      toast.error(`Error: ${event.error}`);
      console.error("Recognition Error:", event);
    };

    recognitionInstance.onstart = () => {
      console.log("Speech recognition started");
    };

    recognitionInstance.onend = () => {
      console.log("Speech recognition ended");
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [toast, setAnswer]);

  const toggleListening = useCallback(() => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    } else {
      console.error("Speech recognition instance is not initialized.");
    }
  }, [isListening, recognition]);

  return (
    <button
      onClick={toggleListening}
      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
    >
      {isListening ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25v13.5m-7.5-13.5v13.5"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
          />
        </svg>
      )}
    </button>
  );
};

export default SpeechToTextButton;
