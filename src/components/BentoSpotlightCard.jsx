import React, { useRef } from 'react';

export default function BentoSpotlightCard({
  children,
  className = '',
  onClick,
  style = {}
}) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--mouse-x', `-500px`);
    card.style.setProperty('--mouse-y', `-500px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`linear-bento-card group ${className}`}
    >
      <div className="linear-rim-beam opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {children}
    </div>
  );
}
