import React, { useEffect, useRef } from 'react';

export default function MeshGradientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Multi-layered fluid wave orbs with valid CSS rgba strings
    const orbs = [
      {
        x: width * 0.25,
        y: height * 0.2,
        radius: 460,
        vx: 0.15,
        vy: 0.12,
        color: 'rgba(2, 132, 199, 0.18)',
        midColor: 'rgba(2, 132, 199, 0.08)'
      },
      {
        x: width * 0.75,
        y: height * 0.35,
        radius: 520,
        vx: -0.12,
        vy: 0.18,
        color: 'rgba(56, 189, 248, 0.14)',
        midColor: 'rgba(56, 189, 248, 0.06)'
      },
      {
        x: width * 0.5,
        y: height * 0.75,
        radius: 480,
        vx: 0.18,
        vy: -0.14,
        color: 'rgba(37, 99, 235, 0.12)',
        midColor: 'rgba(37, 99, 235, 0.05)'
      },
      {
        x: width * 0.85,
        y: height * 0.85,
        radius: 420,
        vx: -0.1,
        vy: -0.1,
        color: 'rgba(14, 165, 233, 0.11)',
        midColor: 'rgba(14, 165, 233, 0.04)'
      },
    ];

    let t = 0;

    const render = () => {
      try {
        t += 0.005;
        ctx.fillStyle = '#08090a';
        ctx.fillRect(0, 0, width, height);

        // Render smooth blur mesh
        orbs.forEach((orb, i) => {
          orb.x += Math.sin(t + i) * orb.vx * 2;
          orb.y += Math.cos(t + i * 1.5) * orb.vy * 2;

          const gradient = ctx.createRadialGradient(
            orb.x,
            orb.y,
            0,
            orb.x,
            orb.y,
            orb.radius
          );
          gradient.addColorStop(0, orb.color);
          gradient.addColorStop(0.5, orb.midColor);
          gradient.addColorStop(1, 'rgba(8, 9, 10, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
      } catch (err) {
        console.warn('MeshGradient render loop caught:', err);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-80"
        style={{ filter: 'blur(60px)' }}
      />
      {/* Linear Precision Grid Mask */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_15%,#000_65%,transparent_100%)] opacity-60" 
      />
      {/* Top subtle rim beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
    </div>
  );
}
