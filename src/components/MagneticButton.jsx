import React, { useRef, useState } from 'react';

export default function MagneticButton({
  children,
  onClick,
  href,
  target,
  rel,
  className = '',
  strength = 0.32,
  variant = 'primary'
}) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-transform duration-200 ease-out micro-bounce select-none cursor-pointer overflow-hidden";

  const variantStyles = variant === 'primary'
    ? "bg-gradient-to-r from-sky-500 via-blue-600 to-sky-600 text-white shadow-lg shadow-sky-600/25 hover:shadow-sky-500/40 border border-sky-400/40"
    : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.12] backdrop-blur-md shadow-sm";

  const content = (
    <span
      className="inline-flex items-center gap-2.5 z-10 transition-transform duration-150"
      style={{
        transform: `translate(${position.x * 0.4}px, ${position.y * 0.4}px)`
      }}
    >
      {children}
    </span>
  );

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    willChange: 'transform'
  };

  if (href) {
    return (
      <a
        ref={buttonRef}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-150%] hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-150%] hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
      {content}
    </button>
  );
}
