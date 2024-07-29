"use client";
import { useState } from "react";
import { TbBrandCpp } from "react-icons/tb";
import { FaJava } from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io5";
import { FaPython } from "react-icons/fa";
import { useGlobalContext } from "@/context/GlobalContext";
import toast from "react-hot-toast";

const Compiler = ({ selectedQuestion }) => {
  const { questions } = useGlobalContext();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!language) {
      toast.error("Please Select A Language");
      return;
    }
    if (code == "") {
      toast.error("Write Code To Compile");
      return;
    }
    setLoading(true);
    try {
      const { name, version } = language;

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: name,
          files: [
            {
              name: `main.${
                name === "javascript"
                  ? "js"
                  : name === "python"
                  ? "py"
                  : name === "java"
                  ? "java"
                  : "cpp"
              }`,
              content: code,
            },
          ],
          version: version,
        }),
      });

      const data = await response.json();
      console.log(data);
      setOutput(data.run.output || data.compile.output);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setLoading(false);
  };

  const languageOptions = [
    {
      id: "54",
      name: "c++",
      version: "10.2.0",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width={32}
          height={32}
          viewBox="0 0 48 48"
          style={{ fill: language?.name === "c++" ? "#805ad5" : "#718096" }}
        >
          <path
            fill={`${language?.name === "c++" ? "#805ad5" : "#718096"}`}
            fillRule="evenodd"
            d="M22.903,3.286c0.679-0.381,1.515-0.381,2.193,0 c3.355,1.883,13.451,7.551,16.807,9.434C42.582,13.1,43,13.804,43,14.566c0,3.766,0,15.101,0,18.867 c0,0.762-0.418,1.466-1.097,1.847c-3.355,1.883-13.451,7.551-16.807,9.434c-0.679,0.381-1.515,0.381-2.193,0 c-3.355-1.883-13.451-7.551-16.807-9.434C5.418,34.899,5,34.196,5,33.434c0-3.766,0-15.101,0-18.867 c0-0.762,0.418-1.466,1.097-1.847C9.451,10.837,19.549,5.169,22.903,3.286z"
            clipRule="evenodd"
          />
          <path
            fill={`${language?.name === "c++" ? "#805ad5" : "#718096"}`}
            fillRule="evenodd"
            d="M5.304,34.404C5.038,34.048,5,33.71,5,33.255 c0-3.744,0-15.014,0-18.759c0-0.758,0.417-1.458,1.094-1.836c3.343-1.872,13.405-7.507,16.748-9.38 c0.677-0.379,1.594-0.371,2.271,0.008c3.343,1.872,13.371,7.459,16.714,9.331c0.27,0.152,0.476,0.335,0.66,0.576L5.304,34.404z"
            clipRule="evenodd"
          />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M24,10c7.727,0,14,6.273,14,14s-6.273,14-14,14 s-14-6.273-14-14S16.273,10,24,10z M24,17c3.863,0,7,3.136,7,7c0,3.863-3.137,7-7,7s-7-3.137-7-7C17,20.136,20.136,17,24,17z"
            clipRule="evenodd"
          />
          <path
            fill={`${language?.name === "c++" ? "#805ad5" : "#718096"}`}
            fillRule="evenodd"
            d="M42.485,13.205c0.516,0.483,0.506,1.211,0.506,1.784 c0,3.795-0.032,14.589,0.009,18.384c0.004,0.396-0.127,0.813-0.323,1.127L23.593,24L42.485,13.205z"
            clipRule="evenodd"
          />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M31 21H33V27H31zM38 21H40V27H38z"
            clipRule="evenodd"
          />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M29 23H35V25H29zM36 23H42V25H36z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    { id: "62", name: "java", icon: <FaJava />, version: "15.0.2" },
    { id: "71", name: "python", icon: <FaPython />, version: "3.10.0" },
    {
      id: "63",
      name: "javascript",
      icon: <IoLogoJavascript />,
      version: "18.15.0",
    },
  ];

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex justify-center mb-6">
          {languageOptions.map((lang) => (
            <div
              key={lang.id}
              className={`p-3 cursor-pointer text-3xl ${
                language?.name === lang.name
                  ? "text-purple-600"
                  : "text-gray-500"
              }`}
              onClick={() => setLanguage(lang)}
            >
              {lang.icon}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          className="w-full h-48 p-3 rounded-lg mb-4 bg-[#212121] text-md text-white font-thin outline-none"
        />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="p-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700"
          >
            {loading ? "Compiling..." : "Compile"}
          </button>
          {questions?.length - 1 == selectedQuestion ? (
            <button className="p-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700">
              Next
            </button>
          ) : (
            <button className="p-3 bg-green-600 text-white font-bold rounded hover:bg-green-700">
              Submit
            </button>
          )}
        </div>
      </form>
      {output && (
        <div className="mt-2 px-6">
          <h2 className="text-sm font-semibold mb-2">Output</h2>
          <div className="h-[200px] overflow-y-scroll">
            <pre className="whitespace-pre-wrap text-sm">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compiler;
