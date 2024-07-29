"use client";
import { useState } from "react";
import Popup from "./Popup";

function CreateButton() {
  const [showPopup, setShowPopup] = useState(false);
  const handleCreateClick = () => {
    setShowPopup(true);
  };

  return (
    <>
      {showPopup && <Popup setShowPopup={setShowPopup} />}
      <button
        onClick={handleCreateClick}
        className="bg-purple-600 text-white p-16 rounded text-lg shadow-lg hover:bg-purple-700 w-full md:w-[40%] lg:w-[30%]"
      >
        Create +
      </button>
    </>
  );
}

export default CreateButton;
