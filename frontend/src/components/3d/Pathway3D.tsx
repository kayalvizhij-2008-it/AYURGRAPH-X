"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Pathway3DProps {
  steps: any[];
  currentStepIndex: number;
  onSelectStage: (index: number) => void;
  className?: string;
}

const STAGE_COLORS = [
  "#C8833E", // Stage 1: Traditional Use (Amber)
  "#153A2A", // Stage 2: Medicinal Plant (Forest Green)
  "#5D7A68", // Stage 3: Plant Part (Sage)
  "#E09F3E", // Stage 4: Phytochemical (Golden Amber)
  "#2B6CB0", // Stage 5: Biological Target (Cobalt Blue)
  "#6B46C1", // Stage 6: Pathway (Violet)
  "#9B2C2C", // Stage 7: Disease Evidence (Crimson)
  "#319795", // Stage 8: Research Hypothesis (Teal)
];

export default function Pathway3D({
  steps,
  currentStepIndex,
  onSelectStage,
  className = "",
}: Pathway3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container || !steps || steps.length === 0) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 12);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "default" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeHitboxes: THREE.Mesh[] = [];
    const curvePoints: THREE.Vector3[] = [];

    // Create 8 nodes arranged along an elegant 3D undulating S-curve trajectory
    const totalSteps = steps.length;
    const spanX = 14;

    for (let i = 0; i < totalSteps; i++) {
      const t = i / (totalSteps - 1);
      const x = (t - 0.5) * spanX;
      const y = Math.sin(t * Math.PI * 2) * 1.3;
      const z = Math.cos(t * Math.PI) * 1.8;
      const pos = new THREE.Vector3(x, y, z);
      curvePoints.push(pos);

      // Node Geometry: faceted Octahedron or Dodecahedron
      const isCurrent = i === currentStepIndex;
      const geo = new THREE.DodecahedronGeometry(isCurrent ? 0.55 : 0.42, 0);
      const nodeColor = new THREE.Color(STAGE_COLORS[i % STAGE_COLORS.length]);

      const mat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        roughness: 0.25,
        metalness: 0.65,
        emissive: nodeColor,
        emissiveIntensity: isCurrent ? 0.6 : 0.15,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      mesh.userData = { index: i, step: steps[i] };
      scene.add(mesh);
      nodeMeshes.push(mesh);

      // Outer glow ring for active step
      if (isCurrent) {
        const ringGeo = new THREE.RingGeometry(0.65, 0.75, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color("#C8833E"),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.name = "glowRing";
        mesh.add(ring);
      }

      // Invisible larger sphere hitbox for easy clicking
      const hitGeo = new THREE.SphereGeometry(0.7, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(pos);
      hitMesh.userData = { index: i, step: steps[i] };
      scene.add(hitMesh);
      nodeHitboxes.push(hitMesh);
    }

    // Connect nodes with a smooth 3D glowing spline tube
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#5D7A68"),
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.6,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tubeMesh);

    // Energy pulse particle traveling along the spline
    const pulseGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#C8833E") });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    scene.add(pulseMesh);

    // Ambient & Directional Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);

    const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dir1.position.set(5, 10, 8);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xC8833E, 0.8);
    dir2.position.set(-5, -5, 5);
    scene.add(dir2);

    // Raycasting for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getMouseCoords = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 + 1),
      };
    };

    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const delta = e.clientX - prevMouseX;
        targetRotationY += delta * 0.005;
        prevMouseX = e.clientX;
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeHitboxes);
      if (intersects.length > 0) {
        const hit = intersects[0].object.userData;
        setHoveredNode(hit);
        container.style.cursor = "pointer";
      } else {
        setHoveredNode(null);
        container.style.cursor = "default";
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeHitboxes);
      if (intersects.length > 0) {
        const idx = intersects[0].object.userData.index;
        onSelectStage(idx);
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("click", onClick);

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

      // Smooth camera drag rotation
      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.06;

      // Animate nodes gentle rotation
      nodeMeshes.forEach((mesh, idx) => {
        mesh.rotation.y += delta * 0.5;
        mesh.rotation.x += delta * 0.3;

        const ring = mesh.getObjectByName("glowRing");
        if (ring) {
          ring.rotation.z += delta * 1.2;
          const s = 1.0 + Math.sin(time * 3) * 0.08;
          ring.scale.set(s, s, s);
        }
      });

      // Animate pulse position along curve
      const pulseT = (time * 0.18) % 1;
      const pulsePos = curve.getPointAt(pulseT);
      pulseMesh.position.copy(pulsePos);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }

      tubeGeo.dispose();
      tubeMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
        else m.material.dispose();
      });
      nodeHitboxes.forEach((h) => {
        h.geometry.dispose();
        if (Array.isArray(h.material)) h.material.forEach((mat) => mat.dispose());
        else h.material.dispose();
      });
    };
  }, [steps, currentStepIndex, onSelectStage]);

  return (
    <div className={`relative rounded-xl overflow-hidden bg-botanical-forest-deep border border-botanical-forest-mid ${className}`}>
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-72 sm:h-80" />

      {/* Floating Info Overlay */}
      <div className="absolute top-3 left-3 z-10 text-[10px] font-mono text-botanical-sage-light/80 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-botanical-amber animate-pulse" />
        <span>3D Evidence Trajectory (Drag to Rotate • Click Stage Node to Inspect)</span>
      </div>

      {hoveredNode && (
        <div className="absolute bottom-3 left-3 z-10 bg-botanical-forest/95 backdrop-blur-md border border-botanical-amber/50 px-3 py-1.5 rounded-md text-xs text-botanical-parchment shadow-lg pointer-events-none">
          <span className="text-[10px] font-mono text-botanical-amber block">
            STAGE {hoveredNode.step.stage_index}: {hoveredNode.step.stage_name}
          </span>
          <span className="font-semibold text-botanical-parchment">{hoveredNode.step.entity_name}</span>
        </div>
      )}
    </div>
  );
}

