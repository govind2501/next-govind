'use client'

import React, { useEffect, useState } from 'react';

// Add or remove image paths here anytime - the slideshow will automatically
// include however many images are listed
const SLIDE_IMAGES = [
  '/images/home-front.jpg',
  '/images/home-family.jpg',
  '/images/Happy-1.jpg',
  '/images/Happy-2.jpg',
  '/images/Happy-4.jpg',
  '/images/hero-bg.jpg',
];

const SLIDE_DURATION_MS = 20000; // 20 seconds

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDE_IMAGES.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {SLIDE_IMAGES.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}