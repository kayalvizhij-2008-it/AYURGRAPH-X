"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface FloatingMoleculeProps {
  compound: any;
  className?: string;
}

// Atom color definitions according to CPK / Botanical research palette
const ATOM_COLORS: Record<string, number> = {
  C: 0x232D28, // Dark charcoal
  O: 0xC53030, // Oxygen crimson
  N: 0x2B6CB0, // Nitrogen cobalt
  H: 0xE2E8F0, // Hydrogen soft ivory
};

export default function FloatingMolecule({
  compound,
  className = "",
}: FloatingMoleculeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredAtom, setHoveredAtom] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "default" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const molGroup = new THREE.Group();
    scene.add(molGroup);

    // Procedural 3D Ball-and-Stick generation based on compound structure
    // Generate a characteristic steroidal lactone, polyphenol, or alkaloid 3D ring scaffold
    const atoms: { pos: THREE.Vector3; element: string; label: string }[] = [];
    const bonds: [number, number][] = [];

    const isLactone = (compound?.chemical_class || "").toLowerCase().includes("lactone") || (compound?.name || "").includes("Withaferin");
    const isPolyphenol = (compound?.name || "").includes("Curcumin") || (compound?.chemical_class || "").toLowerCase().includes("heptanoid");
    const isGinger = (compound?.name || "").includes("Shogaol") || (compound?.name || "").includes("Gingerol");

    if (isLactone) {
      // 4 fused rings (Steroidal ergostane core: 6-6-6-5) + lactone ring
      // Ring A (6)
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        atoms.push({ pos: new THREE.Vector3(Math.cos(a) * 0.9 - 2.0, Math.sin(a) * 0.9, (i % 2) * 0.25), element: i === 0 ? "O" : "C", label: `C${i + 1}` });
      }
      for (let i = 0; i < 6; i++) bonds.push([i, (i + 1) % 6]);

      // Ring B (6)
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI;
        atoms.push({ pos: new THREE.Vector3(Math.cos(a) * 0.9 - 0.7, Math.sin(a) * 0.9 + 0.2, (i % 2) * -0.25), element: "C", label: `C${i + 7}` });
      }
      bonds.push([1, 6], [6, 7], [7, 8], [8, 9], [9, 2]);

      // Ring C (6)
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI;
        atoms.push({ pos: new THREE.Vector3(Math.cos(a) * 0.9 + 0.6, Math.sin(a) * 0.9, (i % 2) * 0.25), element: "C", label: `C${i + 11}` });
      }
      bonds.push([8, 10], [10, 11], [11, 12], [12, 13], [13, 7]);

      // Lactone Ring D (5)
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI;
        atoms.push({ pos: new THREE.Vector3(Math.cos(a) * 0.8 + 1.9, Math.sin(a) * 0.8 + 0.3, (i % 2) * -0.2), element: i === 1 ? "O" : "C", label: `L${i + 1}` });
      }
      bonds.push([12, 14], [14, 15], [15, 16], [16, 11]);

      // Carbonyl oxygens
      atoms.push({ pos: new THREE.Vector3(2.5, 1.2, 0.4), element: "O", label: "O=C (Lactone)" });
      bonds.push([15, 17]);
    } else if (isPolyphenol) {
      // Symmetrical diarylheptanoid (Curcumin): 2 phenolic rings connected by conjugated heptadiene diketone chain
      // Left Ring (6)
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        atoms.push({ pos: new THREE.Vector3(Math.cos(a) * 0.85 - 2.5, Math.sin(a) * 0.85, (i % 2) * 0.15), element: i === 0 ? "O" : "C", label: `Ph1_${i + 1}` });
      }
      for (let i = 0; i < 6; i++) bonds.push([i, (i + 1) % 6]);

      // Conjugated bridge chain (7 carbons)
      for (let i = 0; i < 7; i++) {
        const x = -1.6 + (i * 0.52);
        const y = Math.sin(i * 1.1) * 0.5;
        const isCarbonyl = (i === 2 || i === 4);
        atoms.push({ pos: new THREE.Vector3(x, y, 0), element: isCarbonyl ? "O" : "C", label: `Chain_${i + 1}` });
      }
      bonds.push([1, 6]);
      for (let i = 6; i < 12; i++) bonds.push([i, i + 1]);

      // Right Ring (6)
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        atoms.push({ pos: new THREE.Vector3(Math.cos(a) * 0.85 + 2.5, Math.sin(a) * 0.85, (i % 2) * -0.15), element: i === 0 ? "O" : "C", label: `Ph2_${i + 1}` });
      }
      for (let i = 13; i < 19; i++) bonds.push([i, i === 18 ? 13 : i + 1]);
      bonds.push([12, 14]);
    } else {
      // Default: Standard natural product aromatic ring with flexible aliphatic tail
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        atoms.push({ pos: new THREE.Vector3(Math.cos(a) * 0.9 - 1.5, Math.sin(a) * 0.9, (i % 2) * 0.15), element: i === 0 ? "O" : "C", label: `Arom_${i + 1}` });
      }
      for (let i = 0; i < 6; i++) bonds.push([i, (i + 1) % 6]);

      // Aliphatic side chain
      for (let i = 0; i < 6; i++) {
        atoms.push({ pos: new THREE.Vector3(-0.6 + i * 0.65, Math.sin(i * 1.2) * 0.45, Math.cos(i) * 0.25), element: i === 1 ? "O" : "C", label: `Tail_${i + 1}` });
      }
      bonds.push([1, 6]);
      for (let i = 6; i < 11; i++) bonds.push([i, i + 1]);
    }

    // Build Spheres for Atoms
    const atomMeshes: THREE.Mesh[] = [];
    atoms.forEach((atom) => {
      const radius = atom.element === "O" ? 0.28 : (atom.element === "N" ? 0.27 : 0.25);
      const color = ATOM_COLORS[atom.element] || 0x232D28;
      const geo = new THREE.SphereGeometry(radius, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.25,
        metalness: 0.65,
        emissive: color,
        emissiveIntensity: 0.18,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(atom.pos);
      mesh.userData = { label: atom.label, element: atom.element };
      molGroup.add(mesh);
      atomMeshes.push(mesh);
    });

    // Build Cylinders for Bonds
    bonds.forEach(([idxA, idxB]) => {
      if (idxA < atoms.length && idxB < atoms.length) {
        const posA = atoms[idxA].pos;
        const posB = atoms[idxB].pos;
        const distance = posA.distanceTo(posB);

        const cylGeo = new THREE.CylinderGeometry(0.065, 0.065, distance, 8);
        const cylMat = new THREE.MeshStandardMaterial({
          color: 0xA8B6AF,
          roughness: 0.4,
          metalness: 0.4,
          transparent: true,
          opacity: 0.85,
        });
        const cylMesh = new THREE.Mesh(cylGeo, cylMat);

        // Position at midpoint and orient along vector
        cylMesh.position.copy(posA).add(posB).multiplyScalar(0.5);
        cylMesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          posB.clone().sub(posA).normalize()
        );
        molGroup.add(cylMesh);
      }
    });

    // Subtle ambient lighting & directional accents
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(amb);

    const dir1 = new THREE.DirectionalLight(0xffffff, 1.3);
    dir1.position.set(4, 6, 6);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xC8833E, 0.9);
    dir2.position.set(-4, -4, 4);
    scene.add(dir2);

    // Pointer Interaction (Rotate & Zoom)
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotY = 0;
    let rotX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        rotY += dx * 0.008;
        rotX += dy * 0.008;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onMouseUp = () => (isDragging = false);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(4, Math.min(14, camera.position.z + e.deltaY * 0.01));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
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

      if (!isDragging) {
        rotY += delta * 0.35;
      }

      molGroup.rotation.y = rotY;
      molGroup.rotation.x = rotX;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }

      molGroup.children.forEach((c: any) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
    };
  }, [compound]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-white/80 border border-botanical-parchment-border shadow-inner ${className}`}>
      <div ref={containerRef} className="w-full h-48 sm:h-56 cursor-grab active:cursor-grabbing" />
      <div className="absolute top-2 left-2.5 z-10 text-[9px] font-mono text-botanical-charcoal-muted uppercase tracking-wider flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-botanical-amber animate-pulse" />
        <span>3D Molecular Model (Drag to Rotate • Scroll to Zoom)</span>
      </div>
    </div>
  );
}

