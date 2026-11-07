"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface BioGlobe3DProps {
  occurrences: any[];
  isSensitiveSpecies?: boolean;
  selectedOcc?: any;
  onSelectOcc?: (occ: any) => void;
  className?: string;
}

export default function BioGlobe3D({
  occurrences = [],
  isSensitiveSpecies = false,
  selectedOcc,
  onSelectOcc,
  className = "",
}: BioGlobe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPin, setHoveredPin] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "default" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const globeRadius = 1.55;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Initial globe orientation focused toward South Asia / Indian subcontinent
    globeGroup.rotation.y = -Math.PI * 0.45;
    globeGroup.rotation.x = 0.25;

    // 1. Core Sphere (Dark botanical forest translucent)
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x0E281D,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // 2. Latitudinal & Longitudinal Wireframe Rings
    const wireGeo = new THREE.SphereGeometry(globeRadius * 1.002, 24, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x5D7A68,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // 3. Sensitive Species Protective Halo
    let haloMesh: THREE.Mesh | null = null;
    if (isSensitiveSpecies) {
      const haloGeo = new THREE.SphereGeometry(globeRadius * 1.08, 24, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xC8833E,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      haloMesh = new THREE.Mesh(haloGeo, haloMat);
      globeGroup.add(haloMesh);
    }

    // 4. Project Coordinates onto Sphere
    const latLonToVector3 = (lat: number, lon: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const pinHitboxes: THREE.Mesh[] = [];
    const pinMeshes: THREE.Mesh[] = [];

    occurrences.forEach((occ, idx) => {
      if (typeof occ.latitude === "number" && typeof occ.longitude === "number") {
        const pos = latLonToVector3(occ.latitude, occ.longitude, globeRadius * 1.01);

        // Pin Beacon Sphere
        const pinGeo = new THREE.SphereGeometry(0.045, 12, 12);
        const pinMat = new THREE.MeshBasicMaterial({
          color: selectedOcc?.key === occ.key ? 0xC8833E : (isSensitiveSpecies ? 0xC8833E : 0x48BB78),
        });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.copy(pos);
        pinMesh.userData = occ;
        globeGroup.add(pinMesh);
        pinMeshes.push(pinMesh);

        // Outer pulse ring on each pin
        const pulseRingGeo = new THREE.RingGeometry(0.05, 0.08, 16);
        const pulseRingMat = new THREE.MeshBasicMaterial({
          color: isSensitiveSpecies ? 0xC8833E : 0x48BB78,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
        pulseRing.position.copy(pos);
        pulseRing.lookAt(new THREE.Vector3(0, 0, 0));
        globeGroup.add(pulseRing);

        // Hitbox
        const hitGeo = new THREE.SphereGeometry(0.12, 8, 8);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hit = new THREE.Mesh(hitGeo, hitMat);
        hit.position.copy(pos);
        hit.userData = occ;
        globeGroup.add(hit);
        pinHitboxes.push(hit);
      }
    });

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(amb);

    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(5, 4, 6);
    scene.add(sun);

    // Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        globeGroup.rotation.y += deltaX * 0.006;
        globeGroup.rotation.x += deltaY * 0.006;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinHitboxes);
      if (intersects.length > 0) {
        setHoveredPin(intersects[0].object.userData);
        container.style.cursor = "pointer";
      } else {
        setHoveredPin(null);
        container.style.cursor = "grab";
      }
    };

    const onMouseUp = () => (isDragging = false);

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinHitboxes);
      if (intersects.length > 0 && onSelectOcc) {
        onSelectOcc(intersects[0].object.userData);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(2.8, Math.min(8.5, camera.position.z + e.deltaY * 0.008));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("click", onClick);
    container.addEventListener("wheel", onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!isDragging) {
        globeGroup.rotation.y += delta * 0.08; // Gentle planetary spin
      }

      if (haloMesh) {
        haloMesh.rotation.y -= delta * 0.15;
        const s = 1.0 + Math.sin(time * 2) * 0.02;
        haloMesh.scale.set(s, s, s);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("click", onClick);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }

      sphereGeo.dispose();
      sphereMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      globeGroup.children.forEach((c: any) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
    };
  }, [occurrences, isSensitiveSpecies, selectedOcc, onSelectOcc]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-botanical-forest-deep border border-botanical-forest-mid ${className}`}>
      <div ref={containerRef} className="w-full h-64 cursor-grab active:cursor-grabbing" />

      {/* Protective Badge Overlay */}
      <div className="absolute top-2 left-2 z-10 text-[9px] font-mono text-botanical-sage-light/80 uppercase tracking-wider flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D Biodiversity Globe (Drag to Spin • Scroll to Zoom • Click Pin)</span>
      </div>

      {isSensitiveSpecies && (
        <div className="absolute top-2 right-2 z-10 text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 pointer-events-none">
          3D Protective Boundary Shimmer
        </div>
      )}

      {hoveredPin && (
        <div className="absolute bottom-2 left-2 z-10 bg-botanical-forest/95 backdrop-blur-md border border-botanical-amber/50 px-2.5 py-1 rounded text-[11px] text-botanical-parchment shadow-md pointer-events-none">
          <span className="font-semibold text-botanical-amber">{hoveredPin.state_province || "Region"}, {hoveredPin.country}</span>
          <span className="text-botanical-sage-light ml-2 font-mono text-[10px]">{hoveredPin.latitude}°, {hoveredPin.longitude}°</span>
        </div>
      )}
    </div>
  );
}

