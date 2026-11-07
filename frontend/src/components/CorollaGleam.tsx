"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface CorollaGleamProps {
  className?: string;
  bladeCount?: number;
  interactive?: boolean;
}

export default function CorollaGleam({
  className = "",
  bladeCount = 24,
  interactive = true,
}: CorollaGleamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isLowPower, setIsLowPower] = useState<boolean>(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsLowPower(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Test WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // Setup Three.js Scene
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      return;
    }

    // Custom Iridescent Shader Material
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;

      vec3 spectral(float t) {
        // Thin-film iridescent rainbow dispersion
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.0, 0.33, 0.67);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.2);

        // Thin-film interference simulation based on view angle and time
        float shift = fresnel + sin(uTime * 0.4 + vUv.y * 3.14) * 0.15;
        vec3 iridescence = spectral(shift);

        // Botanical emerald-copper grounding tones
        vec3 baseTone = vec3(0.08, 0.22, 0.15); // forest green
        vec3 copperTint = vec3(0.85, 0.55, 0.25); // warm amber/copper

        vec3 color = mix(baseTone, iridescence, fresnel * 0.85);
        color = mix(color, copperTint, 0.12);

        float alpha = clamp(0.35 + fresnel * 0.55, 0.0, 0.9);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
    };

    const iridescentMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    // Create the rotating ring of iridescent glass-like blades
    const corollaGroup = new THREE.Group();
    const bladeGeo = new THREE.PlaneGeometry(0.35, 1.7, 16, 16);

    // Bend the geometry slightly to resemble botanical corolla petals
    const pos = bladeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const curve = Math.sin((y + 0.85) / 1.7 * Math.PI) * 0.15;
      pos.setZ(i, curve);
    }
    bladeGeo.computeVertexNormals();

    const radius = 1.35;
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2;
      const blade = new THREE.Mesh(bladeGeo, iridescentMaterial);
      blade.position.x = Math.cos(angle) * radius;
      blade.position.y = Math.sin(angle) * radius;
      blade.rotation.z = angle + Math.PI / 2;
      blade.rotation.x = 0.45; // Petal tilt angle
      blade.rotation.y = Math.sin(angle * 2) * 0.2;
      corollaGroup.add(blade);
    }

    scene.add(corollaGroup);

    // Pointer response
    let targetRotX = 0;
    let targetRotY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.4;
      targetRotX = y * -0.3;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      uniforms.uTime.value = time;

      // Smooth continuous rotation & breathing oscillation
      corollaGroup.rotation.z += delta * 0.22;
      const breath = 1.0 + Math.sin(time * 1.2) * 0.04;
      corollaGroup.scale.set(breath, breath, breath);

      // Dampened mouse tilt
      corollaGroup.rotation.x += (targetRotX - corollaGroup.rotation.x) * 0.05;
      corollaGroup.rotation.y += (targetRotY - corollaGroup.rotation.y) * 0.05;

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
    };
  }, [bladeCount, interactive]);

  // Graceful CSS/SVG Fallback for non-WebGL or reduced motion
  if (!webglSupported || isLowPower) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-64 h-64 rounded-full border border-botanical-amber/30 relative flex items-center justify-center animate-[spin_20s_linear_infinite]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-6 h-28 rounded-full opacity-60 mix-blend-screen"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-32px)`,
                background: "linear-gradient(180deg, rgba(200, 131, 62, 0.6) 0%, rgba(93, 122, 104, 0.4) 50%, rgba(14, 40, 29, 0.8) 100%)",
                filter: "blur(1px)",
              }}
            />
          ))}
          <div className="w-20 h-20 rounded-full bg-botanical-forest/80 backdrop-blur-sm border border-botanical-amber/40 shadow-inner" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{ minHeight: "340px", minWidth: "340px" }}
    />
  );
}
