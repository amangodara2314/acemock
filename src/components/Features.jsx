"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    title: "Get Your Personalized AI Powered Interview",
    text: "Provide your job role, tech stack, and experience to receive a customized interview tailored to your skills and career aspirations.",
    imgSrc: "demo1.png",
  },
  {
    id: 2,
    title: "Answer The Questions",
    text: "Answer the interview questions presented to you. Your responses will be recorded for further analysis and feedback.",
    imgSrc: "demo2.png",
  },
  {
    id: 3,
    title: "Get Detailed Feedback",
    text: "Receive detailed feedback based on your answers, highlighting your strengths and areas for improvement to help you prepare better.",
    imgSrc: "demo3.png",
  },
];

const Features = () => {
  useEffect(() => {
    // Apply GSAP animation to each .feature element individually
    gsap.utils.toArray(".feature").forEach((feature) => {
      gsap.fromTo(
        feature,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.3,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: feature,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 1,
          },
        }
      );
    });
  }, []);

  return (
    <div
      id="features"
      className="product-demo pt-12 pb-8 bg-black sm:bg-inherit flex flex-col items-center"
    >
      {features.map((feature, index) => (
        <div
          key={feature.id}
          className={`feature flex items-center w-full sm:w-4/5 mb-12 opacity-0 translate-y-12 ${
            index % 2 === 0
              ? "flex-col sm:flex-row-reverse"
              : "flex-col sm:flex-row"
          }`}
        >
          <div className="text-container w-1/2 p-6">
            <h2 className="text-white font-bold text-2xl mb-1">
              {feature.title}
            </h2>
            <p className="text-slate-200 text-lg font-light">{feature.text}</p>
          </div>
          <div className="image-container w-4/5 sm:w-1/2 p-1 sm:p-6">
            <img
              src={feature.imgSrc}
              alt={`Feature ${feature.id}`}
              className="w-full h-auto object-cover rounded-lg aspect-video"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;
