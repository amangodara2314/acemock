"use client";
import Compiler from "@/components/Compiler";
import Questions from "@/components/QuestionsSection";
import { useGlobalContext } from "@/context/GlobalContext";
import { useState } from "react";

export default function Page() {
  const { questions, setQuestions } = useGlobalContext();
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  return (
    <div className="w-full h-full py-10 flex gap-8 justify-center px-16">
      <div className="w-[60%]">
        <Questions
          questions={[
            {
              question:
                "what is aman HWO IS THE N NUMBER FO THEIAON OAIHIDFHOW ODIHFA",
            },
          ]}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      </div>
      <div className="w-[40%] bg-white flex-1">
        <Compiler selectedQuestion={selectedQuestion} />
      </div>
    </div>
  );
}
