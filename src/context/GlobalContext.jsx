"use client";
const { createContext, useContext, useState } = require("react");
import toast, { Toaster } from "react-hot-toast";

const MainContext = createContext();

function GlobalContext({ children }) {
  const [interviews, setInterviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);

  return (
    <MainContext.Provider
      value={{
        toast,
        setInterviews,
        interviews,
        loading,
        setLoading,
        questions,
        setQuestions,
      }}
    >
      {children}
      <Toaster position="bottom-center" reverseOrder={false} />
    </MainContext.Provider>
  );
}

export default GlobalContext;

export const useGlobalContext = () => {
  return useContext(MainContext);
};
