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
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentEl = sectionRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
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
