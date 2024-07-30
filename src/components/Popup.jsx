"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useState } from "react";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getInterview, saveInterview } from "@/lib/actions";
import { useSession } from "next-auth/react";

function Popup({ setShowPopup }) {
  const { setQuestions, setLoading, loading } = useGlobalContext();
  const { data } = useSession();
  const [visibleDiv, setVisibleDiv] = useState("div1");

  const router = useRouter();
  const [formData, setFormData] = useState({
    jobRole: "",
    experience: "",
    techStack: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(data.user);
      const response = await fetch("/subscription/verify/" + data.user.id, {
        method: "GET",
      });
      const result = await response.json();
      if (result.status != 200) {
        toast.error(result.msg);
        return;
      }
      const res = await getInterview({
        jobRole: formData.jobRole,
        experience: formData.experience,
        techStack: formData.techStack,
      });
      console.log(res);
      if (res.interview) {
        router.push(`/dashboard/interview/${res.interview}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong !!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (divName) => {
    setVisibleDiv(divName);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 max-w-lg overflow-hidden relative">
        <div className="h-full min-w-full p-6">
          <h3 className="text-xl font-bold mb-4">
            Tell us more about your job for more precise interview
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Job Role/Position</label>
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                placeholder="Ex. Backend Developer"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-gray-700">Tech Stack</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="Ex. Nodejs, Expressjs, MongoDb"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-gray-700">
                Experience (in years)
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Ex. 2 years"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleClosePopup}
                disabled={loading}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 ${
                  loading
                    ? "flex items-center gap-2 text-gray-300"
                    : "text-white"
                }`}
              >
                {loading ? (
                  <>
                    Generating <Loader size={"w-5 h-5"} />
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Popup;
