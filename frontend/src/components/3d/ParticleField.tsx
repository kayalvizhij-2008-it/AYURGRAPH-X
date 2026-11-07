"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ParticleFieldProps {
  className?: string;
  count?: number;
  interactive?: boolean;
}

export default function ParticleField({
  className = "",
  count = 90,
  interactive = true,
}: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Positions & Colors Buffer
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    const palette = [
      new THREE.Color("#C8833E"), // Amber
      new THREE.Color("#5D7A68"), // Sage
      new THREE.Color("#8BA794"), // Light Sage
      new THREE.Color("#B45309"), // Deep Copper
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i * 3] = (Math.random() - 0.5) * 0.015;
      velocities[i * 3 + 1] = Math.random() * 0.02 + 0.005; // Gentle upward drift
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Circular soft particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,0.9)");
      grad.addColorStop(0.4, "rgba(255,255,255,0.4)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1.2,
      map: texture,
      transparent: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Mouse movement response
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        arr[i * 3] += velocities[i * 3];
        arr[i * 3 + 1] += velocities[i * 3 + 1];
        arr[i * 3 + 2] += velocities[i * 3 + 2];

        // Wrap around vertically
        if (arr[i * 3 + 1] > 16) {
          arr[i * 3 + 1] = -16;
          arr[i * 3] = (Math.random() - 0.5) * 40;
        }
      }
      posAttr.needsUpdate = true;

      pointCloud.rotation.y += 0.0008;
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [count, interactive]);

  return <div ref={containerRef} className={`pointer-events-none ${className}`} />;
}

