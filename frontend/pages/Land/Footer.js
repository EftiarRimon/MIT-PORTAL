// components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About MIT</h3>
            <p className="text-justify">
              Executive Master in Information Technology is one of the fastest
              growing Institute at University of Dhaka. The study at this
              Institute is based on three core values: professionalism,
              excellence and respect. By establishing these principles, MIT
              ensures that graduates from this Institute can effectively
              contribute in the industry.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Vision</h3>
            <p className="text-justify">
              MIT, University of Dhaka aims to be the producer of future leaders
              in Software Engineering. In this course, it is intended to open up
              new horizons and advance the frontiers of knowledge in Software
              Engineering.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <p>
              MIT, University of Dhaka
              <br />
              Dhaka, Bangladesh
              <br />
              Phone: 8801779482994
              <br />
              Email:iit.@iit.du.ac.bd
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

