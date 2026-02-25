// components/Slideshow.js
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["/student.jpg", "/iit building.jpg", "/cur.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((currentSlide + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  return (
    <div className="relative h-96">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide}
            alt={`Slide ${index + 1}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      ))}
    </div>
  );
};

export default Slideshow;


