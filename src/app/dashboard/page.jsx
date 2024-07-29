import CreateButton from "@/components/CreateButton";
import DashHeader from "@/components/DashboardHeader";
import PreviousInterviews from "@/components/PreviousInterviews";
import React from "react";

const Dashboard = () => {
  return (
    <div className="">
      <main className="container mx-auto">
        <section className="flex md:flex-row flex-col justify-between items-center w-[100%] sm:w-[80%] mx-auto my-16">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-center">
            Create and start <br /> your personalized AI interview
          </h2>
          <CreateButton />
        </section>
        <PreviousInterviews />
      </main>
    </div>
  );
};

export default Dashboard;
