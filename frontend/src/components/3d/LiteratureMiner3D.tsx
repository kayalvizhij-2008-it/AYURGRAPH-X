"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LiteratureMiner3DProps {
  isScanning?: boolean;
  plantCount?: number;
  compoundCount?: number;
  targetCount?: number;
  diseaseCount?: number;
  className?: string;
}

export default function LiteratureMiner3D({
  isScanning = false,
  plantCount = 4,
  compoundCount = 7,
  targetCount = 5,
  diseaseCount = 3,
  className = "w-full h-80 rounded-2xl overflow-hidden",
}: LiteratureMiner3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEntity, setActiveEntity] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e281d, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfbf9f4, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xc8833e, 1.8);
    mainLight.position.set(5, 12, 8);
    scene.add(mainLight);

    const backLight = new THREE.PointLight(0x5d7a68, 2, 20);
    backLight.position.set(-6, -4, -6);
    scene.add(backLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Central Multi-faceted Research Prism (Bipyramid / Octahedron)
    const prismGeo = new THREE.OctahedronGeometry(2.2, 0);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbf9f4,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.52,
      thickness: 1.5,
      emissive: 0x153526,
      emissiveIntensity: 0.3,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    rootGroup.add(prism);

    // Wireframe edge highlight for the crystal
    const edgeGeo = new THREE.EdgesGeometry(prismGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xc8833e, transparent: true, opacity: 0.7 });
    const prismEdges = new THREE.LineSegments(edgeGeo, edgeMat);
    prism.add(prismEdges);

    // Refraction Beams - 4 Entity Channels radiating outwards
    const entityChannels = [
      { name: "Botanical Entity", color: 0x4caf50, dir: new THREE.Vector3(-3.8, 1.8, 1.5), count: plantCount },
      { name: "Phytochemical", color: 0xc8833e, dir: new THREE.Vector3(3.8, 2.0, 1.2), count: compoundCount },
      { name: "Protein Target", color: 0x42a5f5, dir: new THREE.Vector3(-3.2, -2.2, 1.8), count: targetCount },
      { name: "Disease Indication", color: 0xef5350, dir: new THREE.Vector3(3.4, -1.9, 1.6), count: diseaseCount },
    ];

    const entityNodes: THREE.Mesh[] = [];

    entityChannels.forEach((ch) => {
      // Beam line from center to destination
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        ch.dir,
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: ch.color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const beamLine = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(beamLine);

      // Endpoint Orb
      const orbGeo = new THREE.IcosahedronGeometry(0.55, 2);
      const orbMat = new THREE.MeshStandardMaterial({
        color: ch.color,
        roughness: 0.2,
        metalness: 0.6,
        emissive: ch.color,
        emissiveIntensity: 0.5,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.copy(ch.dir);
      orb.userData = { name: ch.name, count: ch.count };
      rootGroup.add(orb);
      entityNodes.push(orb);

      // Floating small satelite particles around each orb
      for (let s = 0; s < 4; s++) {
        const satGeo = new THREE.SphereGeometry(0.12, 8, 8);
        const satMat = new THREE.MeshBasicMaterial({ color: ch.color });
        const sat = new THREE.Mesh(satGeo, satMat);
        const angle = (s / 4) * Math.PI * 2;
        sat.position.set(
          ch.dir.x + Math.cos(angle) * 0.9,
          ch.dir.y + Math.sin(angle) * 0.9,
          ch.dir.z + (Math.random() - 0.5) * 0.5
        );
        rootGroup.add(sat);
      }
    });

    // Orbiting Literature Abstract Sheets / Floating Glyphs
    const sheetCount = 8;
    const sheets: THREE.Mesh[] = [];
    const sheetGeo = new THREE.PlaneGeometry(0.8, 1.1);

    for (let i = 0; i < sheetCount; i++) {
      const sheetMat = new THREE.MeshStandardMaterial({
        color: 0xfbf9f4,
        roughness: 0.4,
        metalness: 0.1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const sheet = new THREE.Mesh(sheetGeo, sheetMat);
      rootGroup.add(sheet);
      sheets.push(sheet);
    }

    // Drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const speedMultiplier = isScanning ? 2.5 : 1.0;

      // Rotate prism
      prism.rotation.y = elapsed * 0.4 * speedMultiplier;
      prism.rotation.x = Math.sin(elapsed * 0.3) * 0.2;

      // Smooth camera orbit
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.08 + 0.001;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.08;

      // Orbit abstract sheets
      sheets.forEach((sheet, idx) => {
        const angle = elapsed * 0.35 * speedMultiplier + (idx / sheetCount) * Math.PI * 2;
        const radius = 5.2 + Math.sin(elapsed + idx) * 0.4;
        sheet.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle * 1.5) * 1.5,
          Math.sin(angle) * radius
        );
        sheet.rotation.y = -angle + Math.PI / 2;
        sheet.rotation.z = Math.sin(elapsed + idx) * 0.3;
      });

      // Pulse entity orbs
      entityNodes.forEach((node, idx) => {
        const pulse = 1 + Math.sin(elapsed * 3 + idx) * 0.08;
        node.scale.set(pulse, pulse, pulse);
      });

      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw > 0 && nh > 0) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      prismGeo.dispose();
      prismMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      sheetGeo.dispose();
    };
  }, [isScanning, plantCount, compoundCount, targetCount, diseaseCount]);

  return (
    <div className={`relative ${className} bg-charcoal/70 border border-sage/20 shadow-2xl`}>
      <div ref={containerRef} className="w-full h-full cursor-grab" />

      {/* Floating 3D Badge Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? "bg-amber animate-ping" : "bg-sage"}`} />
        <span className="text-xs font-mono font-medium text-parchment/80 uppercase tracking-widest bg-forest/80 px-2.5 py-1 rounded-full border border-sage/30 backdrop-blur-md">
          {isScanning ? "Refracting Literature Entities (BioBERT Active)" : "3D Literature Extraction Prism"}
        </span>
      </div>

      {/* Entity Pill Breakdown */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none">
        <span className="px-2.5 py-1 rounded-full bg-forest/90 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 backdrop-blur-md">
          Botanicals ({plantCount})
        </span>
        <span className="px-2.5 py-1 rounded-full bg-forest/90 border border-amber/40 text-[11px] font-mono text-amber-300 backdrop-blur-md">
          Compounds ({compoundCount})
        </span>
        <span className="px-2.5 py-1 rounded-full bg-forest/90 border border-blue-500/40 text-[11px] font-mono text-blue-300 backdrop-blur-md">
          Targets ({targetCount})
        </span>
        <span className="px-2.5 py-1 rounded-full bg-forest/90 border border-rose-500/40 text-[11px] font-mono text-rose-300 backdrop-blur-md">
          Diseases ({diseaseCount})
        </span>
      </div>
    </div>
  );
}
