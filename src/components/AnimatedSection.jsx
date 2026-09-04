import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedSection Wrapper
 * Provides smooth, interactive entry reveal animations for sections as user scrolls
 * Uses IntersectionObserver for 60fps compositor-friendly transform and opacity transitions.
 */
export default function AnimatedSection({ children, className = '' }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.02,
        rootMargin: '120px 0px 50px 0px'
      }
    );

    const currentEl = sectionRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-12 blur-[1px]'
      } ${className}`}
    >
      {children}
    </div>
  );
}
