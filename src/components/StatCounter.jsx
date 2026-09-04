import React, { useState, useEffect, useRef } from 'react';

export default function StatCounter({
  numericValue = 0,
  prefix = '',
  suffix = '',
  decimals = null,
  duration = 1600
}) {
  const [currentValue, setCurrentValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  const targetNum = typeof numericValue === 'number'
    ? numericValue
    : (parseFloat(numericValue) || 0);

  // Automatically determine decimal places if not explicitly passed
  const decimalPlaces = decimals !== null
    ? decimals
    : (targetNum.toString().split('.')[1] || '').length;

  const startAnimation = () => {
    let startTimestamp = null;
    const startVal = 0;
    const endVal = targetNum;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth easeOutCubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const val = startVal + (endVal - startVal) * easeProgress;
      setCurrentValue(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrentValue(endVal);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startAnimation();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [numericValue, duration]);

  const handleMouseEnter = () => {
    startAnimation();
  };

  return (
    <div
      ref={elementRef}
      onMouseEnter={handleMouseEnter}
      className="inline-flex items-baseline font-mono tracking-tight transition-transform duration-200 group-hover:scale-105 select-none"
    >
      {prefix && (
        <span className="text-xl sm:text-2xl font-bold text-sky-400/90 mr-0.5">
          {prefix}
        </span>
      )}
      <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
        {currentValue.toFixed(decimalPlaces)}
      </span>
      {suffix && (
        <span className="text-xl sm:text-2xl font-bold text-sky-400 ml-0.5">
          {suffix}
        </span>
      )}
    </div>
  );
}
