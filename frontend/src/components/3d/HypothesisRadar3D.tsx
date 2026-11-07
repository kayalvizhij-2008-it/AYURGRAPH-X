"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface HypothesisMetrics {
  mechanisticPlausibility: number; // 0..1
  traditionalConsistency: number; // 0..1
  noveltyScore: number; // 0..1
  chemicalTractability: number; // 0..1
  crossSpeciesConservation: number; // 0..1
  safetyClearance: number; // 0..1
}

interface HypothesisRadar3DProps {
  metrics?: HypothesisMetrics;
  hypothesisTitle?: string;
  compositeScore?: number;
  className?: string;
}

const DEFAULT_METRICS: HypothesisMetrics = {
  mechanisticPlausibility: 0.88,
  traditionalConsistency: 0.94,
  noveltyScore: 0.76,
  chemicalTractability: 0.82,
  crossSpeciesConservation: 0.79,
  safetyClearance: 0.91,
};

const AXES = [
  { key: "mechanisticPlausibility", label: "Mechanistic Plausibility", short: "Mechanism" },
  { key: "traditionalConsistency", label: "Traditional Canon Fit", short: "Canon Fit" },
  { key: "noveltyScore", label: "Novelty Index", short: "Novelty" },
  { key: "chemicalTractability", label: "Chemical Tractability", short: "Tractability" },
  { key: "crossSpeciesConservation", label: "Target Conservation", short: "Conservation" },
  { key: "safetyClearance", label: "Safety Risk Clearance", short: "Safety" },
];

export default function HypothesisRadar3D({
  metrics = DEFAULT_METRICS,
  hypothesisTitle = "HSP90 Chaperone Inhibition Hypothesis",
  compositeScore = 86.4,
  className = "w-full h-80 rounded-2xl overflow-hidden",
}: HypothesisRadar3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredAxis, setHoveredAxis] = useState<{ label: string; score: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e281d, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfbf9f4, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc8833e, 1.8);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Reference Rings (20%, 40%, 60%, 80%, 100%)
    const ringRadii = [1.0, 2.0, 3.0, 4.0];
    ringRadii.forEach((r) => {
      const ringGeo = new THREE.RingGeometry(r - 0.02, r, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x5d7a68,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      rootGroup.add(ringMesh);
    });

    // Outer Equator Ring
    const equatorGeo = new THREE.TorusGeometry(4.0, 0.03, 16, 64);
    const equatorMat = new THREE.MeshStandardMaterial({
      color: 0xc8833e,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.6,
    });
    const equator = new THREE.Mesh(equatorGeo, equatorMat);
    equator.rotation.x = Math.PI / 2;
    rootGroup.add(equator);

    // 6 Dimensional Spoke Axes
    const axisPoints: THREE.Vector3[] = [];
    const maxRadius = 4.0;
    const axisNodes: THREE.Mesh[] = [];

    AXES.forEach((axis, idx) => {
      const angle = (idx / AXES.length) * Math.PI * 2;
      const x = Math.cos(angle) * maxRadius;
      const z = Math.sin(angle) * maxRadius;

      // Spoke line
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, 0, z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x5d7a68,
        transparent: true,
        opacity: 0.5,
      });
      rootGroup.add(new THREE.Line(lineGeo, lineMat));

      // Current Metric position
      const score = (metrics as unknown as Record<string, number>)[axis.key] ?? 0.75;
      const ptX = Math.cos(angle) * maxRadius * score;
      const ptZ = Math.sin(angle) * maxRadius * score;
      axisPoints.push(new THREE.Vector3(ptX, (score - 0.5) * 1.2, ptZ));

      // Endpoint Bead
      const beadGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const beadMat = new THREE.MeshStandardMaterial({
        color: 0xffb74d,
        emissive: 0xc8833e,
        emissiveIntensity: 0.6,
      });
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.position.set(ptX, (score - 0.5) * 1.2, ptZ);
      bead.userData = { label: axis.label, score };
      rootGroup.add(bead);
      axisNodes.push(bead);
    });

    // 3D Faceted Crystal Polyhedron (Apex Top & Bottom connected to the 6 axis points)
    const topApex = new THREE.Vector3(0, 2.2, 0);
    const bottomApex = new THREE.Vector3(0, -2.2, 0);

    const vertices: number[] = [];
    const n = axisPoints.length;

    // Top triangles: TopApex -> Pt[i] -> Pt[i+1]
    for (let i = 0; i < n; i++) {
      const p1 = axisPoints[i];
      const p2 = axisPoints[(i + 1) % n];
      vertices.push(topApex.x, topApex.y, topApex.z);
      vertices.push(p1.x, p1.y, p1.z);
      vertices.push(p2.x, p2.y, p2.z);
    }

    // Bottom triangles: BottomApex -> Pt[i+1] -> Pt[i]
    for (let i = 0; i < n; i++) {
      const p1 = axisPoints[i];
      const p2 = axisPoints[(i + 1) % n];
      vertices.push(bottomApex.x, bottomApex.y, bottomApex.z);
      vertices.push(p2.x, p2.y, p2.z);
      vertices.push(p1.x, p1.y, p1.z);
    }

    const crystalGeo = new THREE.BufferGeometry();
    crystalGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    crystalGeo.computeVertexNormals();

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x81c784,
      transmission: 0.75,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      emissive: 0x1e4620,
      emissiveIntensity: 0.3,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    rootGroup.add(crystalMesh);

    // Crystal Wireframe outline
    const wireGeo = new THREE.WireframeGeometry(crystalGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xc8833e,
      transparent: true,
      opacity: 0.6,
    });
    const wire = new THREE.LineSegments(wireGeo, wireMat);
    rootGroup.add(wire);

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.4;
    let targetRotX = 0.25;

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

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(axisNodes);
      if (intersects.length > 0) {
        container.style.cursor = "pointer";
        const data = intersects[0].object.userData as { label: string; score: number };
        setHoveredAxis(data);
      } else {
        container.style.cursor = isDragging ? "grabbing" : "grab";
        setHoveredAxis(null);
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

      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.08 + 0.002;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.08;

      crystalMesh.rotation.y = Math.sin(elapsed * 0.5) * 0.05;

      // Pulse beads
      axisNodes.forEach((node, idx) => {
        const pulse = 1 + Math.sin(elapsed * 3 + idx) * 0.12;
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
      crystalGeo.dispose();
      crystalMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
    };
  }, [metrics]);

  return (
    <div className={`relative ${className} bg-charcoal/70 border border-sage/20 shadow-2xl`}>
      <div ref={containerRef} className="w-full h-full cursor-grab" />

      {/* Floating 3D Badge Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber animate-pulse" />
        <span className="text-xs font-mono font-medium text-parchment/80 uppercase tracking-widest bg-forest/80 px-2.5 py-1 rounded-full border border-sage/30 backdrop-blur-md">
          3D Multi-Factor Score Polyhedron
        </span>
      </div>

      <div className="absolute top-4 right-4 pointer-events-none text-right">
        <div className="text-[11px] font-mono text-sage uppercase tracking-wider">Composite Score</div>
        <div className="text-xl font-bold font-mono text-amber">{compositeScore.toFixed(1)}/100</div>
      </div>

      {hoveredAxis ? (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 p-3 rounded-xl bg-forest/95 border border-amber/40 shadow-xl backdrop-blur-md pointer-events-none">
          <div className="text-xs font-mono text-amber font-semibold">{hoveredAxis.label}</div>
          <div className="text-base font-bold font-mono text-parchment mt-0.5">
            {(hoveredAxis.score * 100).toFixed(1)}% Weight
          </div>
        </div>
      ) : (
        <div className="absolute bottom-3 left-4 right-4 text-center pointer-events-none text-[11px] font-mono text-parchment/60">
          Rotate 3D Crystal to inspect 6-factor explainable scoring vectors
        </div>
      )}
    </div>
  );
}
