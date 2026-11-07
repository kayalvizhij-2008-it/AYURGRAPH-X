"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface TimelineEpoch {
  id: string;
  year: string;
  title: string;
  category: "Classical" | "Taxonomic" | "Chemical" | "Genomic" | "Computational";
  description: string;
}

interface TimeLens3DProps {
  selectedEpochId?: string;
  onSelectEpoch?: (epochId: string) => void;
  className?: string;
}

const DEFAULT_EPOCHS: TimelineEpoch[] = [
  { id: "vedic", year: "~700 BCE", title: "Charaka & Sushruta Samhita", category: "Classical", description: "Codification of Rasayana botanical therapies and tri-dosha pharmacology" },
  { id: "linnaeus", year: "1753 CE", title: "Species Plantarum", category: "Taxonomic", description: "Linnaean binomial botanical nomenclature applied to Indian medicinal flora" },
  { id: "isolation", year: "1852 CE", title: "Early Phytochemical Extraction", category: "Chemical", description: "Isolation of crystalline plant alkaloids and bitter tonics from root extracts" },
  { id: "elucidation", year: "1965 CE", title: "Structure Elucidation", category: "Chemical", description: "NMR confirmation of Withaferin A steroidal lactone and Curcuminoid isomers" },
  { id: "target", year: "2001 CE", title: "Receptor Target Deconvolution", category: "Genomic", description: "Molecular docking and NF-kB/Hsp90 chaperone binding assay discoveries" },
  { id: "systems", year: "2009 CE", title: "Ayurvedic Systems Biology", category: "Computational", description: "Reverse pharmacology network medicine establishing multi-target synergy" },
  { id: "ayurgraph", year: "2026 CE", title: "AYURGRAPH-X Knowledge Engine", category: "Computational", description: "Multi-modal biocultural intelligence connecting classical texts to ChEMBL assays" },
];

export default function TimeLens3D({
  selectedEpochId,
  onSelectEpoch,
  className = "w-full h-80 rounded-2xl overflow-hidden",
}: TimeLens3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredEpoch, setHoveredEpoch] = useState<TimelineEpoch | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e281d, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xfbf9f4, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc8833e, 1.5);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x5d7a68, 2, 25);
    pointLight.position.set(-8, -4, 5);
    scene.add(pointLight);

    // Central Time Axis - Spiral / Helix Curve
    const group = new THREE.Group();
    scene.add(group);

    const points: THREE.Vector3[] = [];
    const numSteps = 200;
    const helixRadius = 4.5;
    const helixHeight = 12;

    for (let i = 0; i <= numSteps; i++) {
      const t = i / numSteps;
      const angle = t * Math.PI * 3.5 - Math.PI * 1.75;
      const x = Math.cos(angle) * helixRadius;
      const y = (t - 0.5) * helixHeight;
      const z = Math.sin(angle) * helixRadius;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 160, 0.07, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x5d7a68,
      metalness: 0.6,
      roughness: 0.3,
      emissive: 0x1a3d2c,
      transparent: true,
      opacity: 0.75,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tubeMesh);

    // Ambient floating dust particles
    const particleCount = 120;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      partPos[i] = (Math.random() - 0.5) * 16;
      partPos[i + 1] = (Math.random() - 0.5) * 14;
      partPos[i + 2] = (Math.random() - 0.5) * 16;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xc8833e,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(partGeo, partMat);
    group.add(particles);

    // Create Epoch Discs along the helix
    const epochMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; epoch: TimelineEpoch }[] = [];

    DEFAULT_EPOCHS.forEach((epoch, idx) => {
      const t = idx / (DEFAULT_EPOCHS.length - 1);
      const pt = curve.getPointAt(t);

      const isSelected = epoch.id === selectedEpochId;
      const discColor = isSelected ? 0xc8833e : 0x5d7a68;

      // Outer ring
      const ringGeo = new THREE.TorusGeometry(0.85, 0.06, 12, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: discColor,
        metalness: 0.7,
        roughness: 0.2,
        emissive: isSelected ? 0x8a4512 : 0x0e281d,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pt);
      ringMesh.rotation.x = Math.PI / 4;
      ringMesh.userData = { epoch };
      group.add(ringMesh);

      // Core Gemstone Sphere
      const sphereGeo = new THREE.IcosahedronGeometry(0.4, 2);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xffb74d : 0x81c784,
        roughness: 0.1,
        metalness: 0.8,
        emissive: isSelected ? 0xc8833e : 0x2e7d32,
        emissiveIntensity: 0.4,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.copy(pt);
      sphereMesh.userData = { epoch };
      group.add(sphereMesh);

      epochMeshes.push({ mesh: sphereMesh, halo: ringMesh, epoch });
    });

    // Raycasting for interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
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
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      // Check hover
      raycaster.setFromCamera(mouse, camera);
      const interactables = epochMeshes.map((m) => m.mesh);
      const intersects = raycaster.intersectObjects(interactables);

      if (intersects.length > 0) {
        container.style.cursor = "pointer";
        const found = intersects[0].object.userData.epoch as TimelineEpoch;
        setHoveredEpoch(found);
      } else {
        container.style.cursor = isDragging ? "grabbing" : "grab";
        setHoveredEpoch(null);
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const interactables = epochMeshes.map((m) => m.mesh);
      const intersects = raycaster.intersectObjects(interactables);
      if (intersects.length > 0) {
        const found = intersects[0].object.userData.epoch as TimelineEpoch;
        if (onSelectEpoch) onSelectEpoch(found.id);
      }
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    container.addEventListener("click", onClick);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Inertial rotation
      group.rotation.y += (targetRotY - group.rotation.y) * 0.08 + 0.002;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.08;

      // Pulse rings
      epochMeshes.forEach(({ halo }, idx) => {
        halo.rotation.z = elapsed * 0.5 + idx;
        const scale = 1 + Math.sin(elapsed * 2 + idx) * 0.06;
        halo.scale.set(scale, scale, scale);
      });

      // Gently drift particles
      particles.rotation.y = -elapsed * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
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
      container.removeEventListener("click", onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      tubeGeo.dispose();
      tubeMat.dispose();
      partGeo.dispose();
      partMat.dispose();
    };
  }, [selectedEpochId, onSelectEpoch]);

  return (
    <div className={`relative ${className} bg-charcoal/70 border border-sage/20 shadow-2xl`}>
      <div ref={containerRef} className="w-full h-full cursor-grab" />

      {/* Floating 3D Badge Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber animate-pulse" />
        <span className="text-xs font-mono font-medium text-parchment/80 uppercase tracking-widest bg-forest/80 px-2.5 py-1 rounded-full border border-sage/30 backdrop-blur-md">
          Interactive Chronological Helix (Drag to Rotate)
        </span>
      </div>

      {hoveredEpoch && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-xs p-3.5 rounded-xl bg-forest/95 border border-amber/40 shadow-xl backdrop-blur-md pointer-events-none transition-all">
          <div className="flex items-center justify-between text-xs font-mono text-amber mb-1">
            <span className="font-bold">{hoveredEpoch.year}</span>
            <span className="px-1.5 py-0.5 rounded bg-sage/20 text-parchment/80">{hoveredEpoch.category}</span>
          </div>
          <div className="text-sm font-semibold text-parchment">{hoveredEpoch.title}</div>
          <p className="text-xs text-parchment/70 mt-1 line-clamp-2 leading-relaxed">
            {hoveredEpoch.description}
          </p>
        </div>
      )}
    </div>
  );
}
