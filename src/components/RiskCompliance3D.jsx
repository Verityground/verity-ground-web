import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Activity, Scale, RotateCw } from 'lucide-react';

export default function RiskCompliance3D() {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeTelemetry, setActiveTelemetry] = useState('Surveillance Active');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Master Pivot Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central Asset Core (Icosahedron with wireframe + glowing points)
    const coreGeometry = new THREE.IcosahedronGeometry(1.3, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    masterGroup.add(coreMesh);

    // Inner glowing solid crystal
    const innerSolidGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const innerSolidMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.35,
    });
    const innerSolidMesh = new THREE.Mesh(innerSolidGeo, innerSolidMat);
    masterGroup.add(innerSolidMesh);

    // 2. Concentric Audit & Compliance Rings
    const createRing = (radius, tube, color, rotX, rotY) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.65,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    };

    // Ring 1: Internal Audit & Governance
    const ring1 = createRing(2.1, 0.018, 0x38bdf8, Math.PI / 4, 0);
    masterGroup.add(ring1);

    // Ring 2: Regulatory Compliance (OJK, BI, ISO)
    const ring2 = createRing(2.6, 0.015, 0x0284c7, -Math.PI / 3, Math.PI / 6);
    masterGroup.add(ring2);

    // Ring 3: Enterprise Risk Mitigation Boundary
    const ring3 = createRing(3.1, 0.012, 0x60a5fa, Math.PI / 6, -Math.PI / 4);
    masterGroup.add(ring3);

    // 3. Orbiting Compliance Nodes (Spheres that orbit the rings)
    const nodeGeometry = new THREE.SphereGeometry(0.09, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    
    const nodes = [];
    const nodeCount = 5;
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      masterGroup.add(node);
      nodes.push({
        mesh: node,
        radius: 2.1 + (i % 3) * 0.5,
        speed: 0.8 + i * 0.25,
        offset: (i * Math.PI * 2) / nodeCount,
        axis: (i % 2 === 0) ? 'x' : 'y'
      });
    }

    // 4. Data Streams / Risk Telemetry Particles
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    masterGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3.5, 50);
    pointLight.position.set(4, 5, 4);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x0284c7, 3, 50);
    blueLight.position.set(-4, -4, 3);
    scene.add(blueLight);

    // Smooth Drag-to-Rotate / Orbit Controls with Inertia
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.2;
    let targetRotationY = 0.4;
    let currentRotationX = 0.2;
    let currentRotationY = 0.4;
    let velocityX = 0;
    let velocityY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      setActiveTelemetry('Audit Inspector: Orbit Control Active');
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      velocityX = deltaX * 0.005;
      velocityY = deltaY * 0.005;

      targetRotationY += velocityX;
      targetRotationX += velocityY;

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
      setTimeout(() => setActiveTelemetry('Surveillance Active: Real-Time Audit'), 1200);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElem.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 400;
      height = container.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let prevTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;
      const elapsedTime = now / 1000;

      // Ambient Idle Rotation
      if (!isDragging) {
        targetRotationY += 0.0025;
        targetRotationX += Math.sin(elapsedTime * 0.5) * 0.0005;
      }

      // Smooth dampening interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      masterGroup.rotation.x = currentRotationX;
      masterGroup.rotation.y = currentRotationY;

      // Independent sub-rotations for realistic compliance ecosystem feeling
      coreMesh.rotation.y -= delta * 0.2;
      innerSolidMesh.rotation.x += delta * 0.3;

      ring1.rotation.z += delta * 0.35;
      ring2.rotation.z -= delta * 0.28;
      ring3.rotation.z += delta * 0.22;

      // Animate orbiting nodes
      nodes.forEach((n) => {
        const angle = elapsedTime * n.speed + n.offset;
        n.mesh.position.x = Math.cos(angle) * n.radius;
        n.mesh.position.z = Math.sin(angle) * n.radius;
        n.mesh.position.y = Math.sin(angle * 2) * 0.45;
      });

      // Animate particles
      particles.rotation.y += delta * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElem.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[480px] rounded-3xl bg-slate-950/40 border border-white/[0.08] overflow-hidden flex flex-col justify-between p-5 backdrop-blur-xl group">
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs font-mono bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-full text-slate-300 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-[11px] font-medium">{activeTelemetry}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <RotateCw className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">3D Drag / Orbit</span>
        </div>
      </div>

      {/* Canvas Mount */}
      <div
        ref={containerRef}
        className={`w-full h-full absolute inset-0 cursor-grab ${
          isInteracting ? 'cursor-grabbing' : ''
        }`}
        title="Klik dan geser untuk memutar model 3D ekosistem risiko & audit"
      />

      {/* Bottom Ecosystem Legend Indicators */}
      <div className="z-10 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] bg-slate-950/60 p-3 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Audit Core</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Compliance Shield</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Risk Perimeter</span>
          </span>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          Real-Time Orbit Control
        </span>
      </div>
    </div>
  );
}
