"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface EvidenceTier3D {
  tier: number;
  grade: string;
  label: string;
  color: number;
  hexCode: string;
  description: string;
  weight: number;
}

const EVIDENCE_TIERS: EvidenceTier3D[] = [
  {
    tier: 1,
    grade: "Grade A",
    label: "Human Clinical Trials (RCTs & Systematic Reviews)",
    color: 0x4caf50,
    hexCode: "#4CAF50",
    description: "Highest scientific weight. Placebo-controlled, peer-reviewed human trials in registered clinical registries.",
    weight: 1.0,
  },
  {
    tier: 2,
    grade: "Grade B",
    label: "In Vivo Animal Pharmacology Models",
    color: 0x81c784,
    hexCode: "#81C784",
    description: "Rodent & mammalian disease models validating pharmacodynamics and organ toxicity.",
    weight: 0.85,
  },
  {
    tier: 3,
    grade: "Grade B-",
    label: "In Vitro & Enzymatic Assays",
    color: 0x5d7a68,
    hexCode: "#5D7A68",
    description: "Direct binding affinity, IC50, Ki, and cellular target validation from ChEMBL and PubChem assays.",
    weight: 0.7,
  },
  {
    tier: 4,
    grade: "Grade C",
    label: "Computational & In Silico Predictions",
    color: 0xc8833e,
    hexCode: "#C8833E",
    description: "Molecular docking, AlphaFold protein-ligand co-folding, and network pharmacology synergy scores.",
    weight: 0.55,
  },
  {
    tier: 5,
    grade: "Grade D+",
    label: "Classical Ayurvedic Canon & Materia Medica",
    color: 0xdd6b20,
    hexCode: "#DD6B20",
    description: "Centuries-validated classical texts (Charaka Samhita, Sushruta Samhita, Astanga Hridaya).",
    weight: 0.45,
  },
  {
    tier: 6,
    grade: "Grade E",
    label: "Ethnobotanical & Folk Lore Surveys",
    color: 0x9e9e9e,
    hexCode: "#9E9E9E",
    description: "Regional field ethnobotany and tribal oral traditions (hypothesis generation origin).",
    weight: 0.3,
  },
];

interface EvidenceTrust3DProps {
  selectedTier?: number | null;
  onSelectTier?: (tier: number | null) => void;
  className?: string;
}

export default function EvidenceTrust3D({
  selectedTier,
  onSelectTier,
  className = "w-full h-80 rounded-2xl overflow-hidden",
}: EvidenceTrust3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTier, setHoveredTier] = useState<EvidenceTier3D | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e281d, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfbf9f4, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc8833e, 1.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const bottomLight = new THREE.PointLight(0x5d7a68, 2, 20);
    bottomLight.position.set(-5, -6, 5);
    scene.add(bottomLight);

    // Stratum Group
    const group = new THREE.Group();
    scene.add(group);

    const layerMeshes: { mesh: THREE.Mesh; edgeMesh: THREE.LineSegments; tier: EvidenceTier3D }[] = [];

    // Build stratified transparent glass slabs from bottom (Tier 6) to top (Tier 1)
    const totalTiers = EVIDENCE_TIERS.length;
    const stratumHeight = 0.6;
    const spacing = 1.35;
    const baseY = -((totalTiers - 1) * spacing) / 2;

    EVIDENCE_TIERS.forEach((tier, index) => {
      // Index 0 is Tier 1 (top), Index 5 is Tier 6 (bottom)
      const tierRank = totalTiers - index; // 6 down to 1
      const y = baseY + tierRank * spacing;
      // Width widens toward bottom: top tier is small, bottom tier is large
      const slabWidth = 3.5 + (index * 1.3);
      const slabDepth = 2.4 + (index * 0.9);

      const isSelected = selectedTier === tier.tier;

      // Slab Geometry
      const boxGeo = new THREE.BoxGeometry(slabWidth, stratumHeight, slabDepth);
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: tier.color,
        transmission: 0.6,
        opacity: isSelected ? 0.95 : 0.7,
        transparent: true,
        roughness: 0.15,
        metalness: 0.2,
        emissive: tier.color,
        emissiveIntensity: isSelected ? 0.5 : 0.15,
      });

      const slabMesh = new THREE.Mesh(boxGeo, boxMat);
      slabMesh.position.set(0, y, 0);
      slabMesh.userData = { tier };
      group.add(slabMesh);

      // Edge wireframe glow
      const wireframeGeo = new THREE.EdgesGeometry(boxGeo);
      const wireframeMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0xffffff : tier.color,
        linewidth: 2,
        transparent: true,
        opacity: isSelected ? 1 : 0.5,
      });
      const edgeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
      edgeMesh.position.set(0, y, 0);
      group.add(edgeMesh);

      layerMeshes.push({ mesh: slabMesh, edgeMesh, tier });
    });

    // Central Pillar / Energy Axis Beam
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.08, 12, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xc8833e,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    group.add(beam);

    // Orbiting particle rings around the strata
    const partCount = 90;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount; i++) {
      const angle = (i / partCount) * Math.PI * 4;
      const radius = 5 + Math.sin(i) * 1.5;
      partPos[i * 3] = Math.cos(angle) * radius;
      partPos[i * 3 + 1] = (i / partCount - 0.5) * 10;
      partPos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x81c784,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(partGeo, partMat);
    group.add(particles);

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.3;
    let targetRotX = 0.15;

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
      const meshes = layerMeshes.map((l) => l.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        container.style.cursor = "pointer";
        const found = intersects[0].object.userData.tier as EvidenceTier3D;
        setHoveredTier(found);
      } else {
        container.style.cursor = isDragging ? "grabbing" : "grab";
        setHoveredTier(null);
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const meshes = layerMeshes.map((l) => l.mesh);
      const intersects = raycaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        const found = intersects[0].object.userData.tier as EvidenceTier3D;
        if (onSelectTier) {
          onSelectTier(selectedTier === found.tier ? null : found.tier);
        }
      }
    };

    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    container.addEventListener("click", onClick);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      group.rotation.y += (targetRotY - group.rotation.y) * 0.08 + 0.002;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.08;

      // Subtle breathing pulse for each slab
      layerMeshes.forEach(({ mesh, tier }) => {
        const isHovered = hoveredTier?.tier === tier.tier;
        const isSel = selectedTier === tier.tier;
        const scaleBoost = isHovered ? 1.05 : isSel ? 1.03 : 1;
        mesh.scale.set(scaleBoost, 1, scaleBoost);
      });

      particles.rotation.y = elapsed * 0.05;

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
      container.removeEventListener("click", onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      partGeo.dispose();
      partMat.dispose();
    };
  }, [selectedTier, hoveredTier, onSelectTier]);

  return (
    <div className={`relative ${className} bg-charcoal/70 border border-sage/20 shadow-2xl`}>
      <div ref={containerRef} className="w-full h-full cursor-grab" />

      {/* Floating 3D Badge Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono font-medium text-parchment/80 uppercase tracking-widest bg-forest/80 px-2.5 py-1 rounded-full border border-sage/30 backdrop-blur-md">
          3D Evidence Pyramid Strata (Click Tier to Filter)
        </span>
      </div>

      {hoveredTier && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-xs p-3.5 rounded-xl bg-forest/95 border border-sage/40 shadow-xl backdrop-blur-md pointer-events-none transition-all">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="font-bold px-2 py-0.5 rounded text-charcoal font-semibold" style={{ backgroundColor: hoveredTier.hexCode }}>
              {hoveredTier.grade} • Tier {hoveredTier.tier}
            </span>
            <span className="text-parchment/70 font-mono text-xs">Weight: {(hoveredTier.weight * 100).toFixed(0)}%</span>
          </div>
          <div className="text-sm font-semibold text-parchment">{hoveredTier.label}</div>
          <p className="text-xs text-parchment/70 mt-1 line-clamp-2 leading-relaxed">
            {hoveredTier.description}
          </p>
        </div>
      )}
    </div>
  );
}

