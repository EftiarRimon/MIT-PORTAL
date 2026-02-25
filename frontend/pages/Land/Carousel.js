// components/Carousel.jsx
import React, { useState } from "react";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ["/iit.jpg"];

  const handlePrevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? images.length - 1 : currentSlide - 1);
  };

  const handleNextSlide = () => {
    setCurrentSlide(currentSlide === images.length - 1 ? 0 : currentSlide + 1);
  };

  return (
    <section className="relative">
      <div className="carousel-slide">
        <img
          src={images[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full h-96 object-cover"
        />
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={handlePrevSlide}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-r"
        >
          Prev
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={handleNextSlide}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-l"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Carousel;
