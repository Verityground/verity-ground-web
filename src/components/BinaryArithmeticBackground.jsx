import React, { useEffect, useRef } from 'react';

export default function BinaryArithmeticBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    // Rich character pools: Binary byte digits, boolean logic, and arithmetic operators
    const binaryDigits = ['0', '1'];
    const arithmeticSymbols = [
      '+', '-', '×', '÷', '=', '≠', '≈', '∑', '√', 'π', 'Δ', '∫',
      '%', '^', '&', '|', '⊕', '<<', '>>', '≡', '≤', '≥', '∞'
    ];
    const byteHexFormulas = [
      '01', '10', '11', '00', '0x1F', '0xFF', '0b101', 'b[8]',
      'if(byte)', '2ⁿ', '1010', '0101', '1100', '0011', '1111', 'else', 'return'
    ];

    const getRandChar = () => {
      const rand = Math.random();
      if (rand < 0.72) {
        // 72% chance of 0 or 1
        return binaryDigits[Math.floor(Math.random() * binaryDigits.length)];
      } else if (rand < 0.88) {
        // 16% chance of arithmetic symbols
        return arithmeticSymbols[Math.floor(Math.random() * arithmeticSymbols.length)];
      } else {
        // 12% chance of byte/hex chunks
        return byteHexFormulas[Math.floor(Math.random() * byteHexFormulas.length)];
      }
    };

    const fontSize = 13;
    let drops = [];
    let floatingFormulas = [];

    const initCanvasSize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.offsetWidth : window.innerWidth;
      height = parent ? parent.offsetHeight : window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const colSpacing = fontSize * 1.6;
      const totalCols = Math.ceil(width / colSpacing);
      drops = [];

      for (let i = 0; i < totalCols; i++) {
        // Layering depth (background slow, foreground faster)
        const depth = Math.random();
        const speed = depth < 0.5 ? 0.7 + Math.random() * 0.9 : 1.5 + Math.random() * 2.2;
        const length = Math.floor(8 + Math.random() * 20);

        drops.push({
          x: i * colSpacing + (Math.random() * 4 - 2),
          y: Math.random() * -150 - Math.random() * height,
          speed,
          length,
          chars: Array.from({ length: 30 }, () => getRandChar()),
          depth, // 0 to 1
          opacity: 0.12 + Math.random() * 0.45,
          colorTheme: Math.random() > 0.8 ? 'cyan' : 'emerald',
          mutationFreq: 0.02 + Math.random() * 0.04
        });
      }

      // Mathematical & binary floating equations across the canvas
      floatingFormulas = [
        { text: '01001000 + 01101001 = CODE', x: width * 0.12, y: height * 0.22, vx: 0.15, vy: -0.06, baseAlpha: 0.22 },
        { text: '∑ (2ⁿ × bₙ) → 1011001₂', x: width * 0.68, y: height * 0.32, vx: -0.1, vy: 0.08, baseAlpha: 0.2 },
        { text: 'f(bit) = (x ⊕ y) ∧ 0xFF', x: width * 0.18, y: height * 0.78, vx: 0.09, vy: 0.05, baseAlpha: 0.25 },
        { text: '1010₂ + 0101₂ = 1111₂ (15₁₀)', x: width * 0.62, y: height * 0.82, vx: -0.08, vy: -0.1, baseAlpha: 0.26 },
        { text: 'BYTE[0..7] = {0,1,1,0,1,0,0,1}', x: width * 0.48, y: height * 0.14, vx: -0.05, vy: 0.05, baseAlpha: 0.18 },
        { text: 'lim_{n→∞} (1 + 1/n)ⁿ = e', x: width * 0.82, y: height * 0.6, vx: 0.06, vy: 0.08, baseAlpha: 0.18 },
        { text: '0b11110000 >> 4 = 0b00001111', x: width * 0.08, y: height * 0.52, vx: 0.07, vy: -0.04, baseAlpha: 0.2 }
      ];
    };

    initCanvasSize();

    const handleResize = () => {
      initCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    // Track mouse for interactive glow ripple
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      // Clear with trail fade on light bluish-white
      ctx.fillStyle = 'rgba(248, 251, 255, 0.32)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
      ctx.textAlign = 'center';

      // 1. Draw Binary and Arithmetic Columns
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];

        // Mutate random characters periodically
        if (Math.random() < drop.mutationFreq) {
          const randIdx = Math.floor(Math.random() * drop.chars.length);
          drop.chars[randIdx] = getRandChar();
        }

        // Distance from mouse for interactive brightening
        const distToMouse = Math.hypot(drop.x - mouse.x, drop.y - mouse.y);
        const isNearMouse = distToMouse < 180;
        const mouseBoost = isNearMouse ? (1 - distToMouse / 180) * 0.35 : 0;

        for (let j = 0; j < drop.length; j++) {
          const charY = drop.y - j * (fontSize * 1.35);
          if (charY < -10 || charY > height + 20) continue;

          const isHead = j === 0;
          const isSecond = j === 1;

          if (isHead) {
            // Bright high-contrast leading character for light mode
            ctx.fillStyle = drop.colorTheme === 'cyan' ? '#0284c7' : '#059669';
            ctx.shadowColor = drop.colorTheme === 'cyan' ? '#38bdf8' : '#34d399';
            ctx.shadowBlur = 6;
          } else if (isSecond) {
            ctx.fillStyle = drop.colorTheme === 'cyan' ? '#0369a1' : '#047857';
            ctx.shadowBlur = 3;
          } else {
            // Fading trail
            const trailRatio = 1 - j / drop.length;
            const alpha = (drop.opacity + mouseBoost) * trailRatio * 0.7;
            ctx.fillStyle = drop.colorTheme === 'cyan'
              ? `rgba(2, 132, 199, ${Math.min(alpha, 0.65)})`
              : `rgba(5, 150, 105, ${Math.min(alpha, 0.65)})`;
            ctx.shadowBlur = 0;
          }

          const char = drop.chars[j % drop.chars.length];
          ctx.fillText(char, drop.x, charY);
        }

        // Move drop downwards
        drop.y += drop.speed + (isNearMouse ? 0.8 : 0);

        // Reset drop when exceeding screen height
        if (drop.y - drop.length * (fontSize * 1.35) > height) {
          drop.y = Math.random() * -60;
          drop.speed = drop.depth < 0.5 ? 0.7 + Math.random() * 0.9 : 1.5 + Math.random() * 2.2;
        }
      }

      // 2. Draw Floating Arithmetic Formulas
      ctx.shadowBlur = 0;
      ctx.font = `600 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      floatingFormulas.forEach((formula) => {
        formula.x += formula.vx;
        formula.y += formula.vy;

        // Wrap edges
        if (formula.x < -150) formula.x = width + 80;
        if (formula.x > width + 150) formula.x = -80;
        if (formula.y < -40) formula.y = height + 30;
        if (formula.y > height + 40) formula.y = -30;

        ctx.fillStyle = `rgba(14, 116, 144, ${formula.baseAlpha * 1.5})`;
        ctx.fillText(formula.text, formula.x, formula.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-60 mix-blend-multiply"
      />
      {/* Vignette & Radial Glow masks for light bluish-white theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8fbff]/85 via-transparent to-[#f8fbff] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_40%,transparent_0%,rgba(248,251,255,0.9)_100%)] pointer-events-none" />
    </div>
  );
}
