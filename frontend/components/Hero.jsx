// components/Hero.jsx
import React from "react";

const Hero = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="container mx-auto text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to MIT</h1>
        <p className="text-xl mb-8">Learn, Grow, and Succeed</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Apply Now
        </button>
      </div>
    </section>
  );
};

export default Hero;
