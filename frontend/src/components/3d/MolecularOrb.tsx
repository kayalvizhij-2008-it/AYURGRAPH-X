"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface MolecularOrbProps {
  className?: string;
  size?: number;
  color?: string;
  subColor?: string;
  interactive?: boolean;
}

export default function MolecularOrb({
  className = "",
  size = 180,
  color = "#C8833E",
  subColor = "#5D7A68",
  interactive = true,
}: MolecularOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = size;
    const height = size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Outer wireframe cage: Icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Inner crystalline sphere: Octahedron
    const innerGeo = new THREE.OctahedronGeometry(0.75, 2);
    const innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(subColor),
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.6,
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Orbital atom beads
    const atomsGroup = new THREE.Group();
    const beadGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const beadMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });

    const pos = outerGeo.attributes.position;
    for (let i = 0; i < Math.min(pos.count, 14); i += 2) {
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.position.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      atomsGroup.add(bead);
    }
    outerMesh.add(atomsGroup);

    // Subtle lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    const pointLight = new THREE.PointLight(new THREE.Color(color), 2.5, 10);
    pointLight.position.set(2, 2, 3);
    scene.add(pointLight);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      outerMesh.rotation.y += delta * 0.45;
      outerMesh.rotation.x += delta * 0.25;

      innerMesh.rotation.y -= delta * 0.6;
      innerMesh.rotation.z += delta * 0.35;

      const scale = 1.0 + Math.sin(time * 1.5) * 0.04;
      innerMesh.scale.set(scale, scale, scale);

      outerMesh.rotation.x += (mouseY * 0.4 - outerMesh.rotation.x) * 0.05;
      outerMesh.rotation.y += (mouseX * 0.4 - outerMesh.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      beadGeo.dispose();
      beadMat.dispose();
    };
  }, [size, color, subColor, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}

