import TextToSpeechButton from "./TextToSpeechButton";

function Questions({ questions, setSelectedQuestion, selectedQuestion }) {
  return (
    <div className="bg-white p-2 sm:p-4 w-full">
      <h2 className="text-lg text-gray-400 mb-2">Questions :-</h2>
      <div className="question-list flex flex-wrap gap-2 mb-4">
        {questions &&
          questions.map((question, index) => {
            return (
              <div
                onClick={() => {
                  setSelectedQuestion(index);
                }}
                key={index}
                className={`question flex justify-center items-center w-10 h-10 ${
                  index == selectedQuestion
                    ? "bg-purple-500 text-white"
                    : "bg-gray-300 text-black"
                } rounded-full cursor-pointer`}
              >
                <span className="text-sm">#{index + 1}</span>
              </div>
            );
          })}
      </div>
      <p className="text-lg mb-2 mt-12">
        {questions[selectedQuestion]?.question}
      </p>
      <TextToSpeechButton text={questions[selectedQuestion]?.question} />
    </div>
  );
}

export default Questions;
