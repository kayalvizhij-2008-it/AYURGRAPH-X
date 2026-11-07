"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface HerbNode3D {
  id: string;
  name: string;
  sanskrit: string;
  role: string;
  color: number;
  hexCode: string;
  compounds: number;
}

interface FormulaLab3DProps {
  herbs?: HerbNode3D[];
  removedHerbId?: string | null;
  onSelectHerb?: (herbId: string) => void;
  className?: string;
}

const DEFAULT_HERBS: HerbNode3D[] = [
  { id: "PLANT_001", name: "Ashwagandha", sanskrit: "Withania somnifera", role: "Principal Rasayana", color: 0x4caf50, hexCode: "#4CAF50", compounds: 6 },
  { id: "PLANT_002", name: "Guduchi", sanskrit: "Tinospora cordifolia", role: "Immunomodulator", color: 0x81c784, hexCode: "#81C784", compounds: 4 },
  { id: "PLANT_003", name: "Amalaki", sanskrit: "Phyllanthus emblica", role: "Antioxidant / Vehicle", color: 0xc8833e, hexCode: "#C8833E", compounds: 5 },
  { id: "PLANT_004", name: "Pippali", sanskrit: "Piper longum", role: "Bioavailability Enhancer", color: 0xdd6b20, hexCode: "#DD6B20", compounds: 3 },
  { id: "PLANT_005", name: "Haritaki", sanskrit: "Terminalia chebula", role: "Synergistic Adjuvant", color: 0x5d7a68, hexCode: "#5D7A68", compounds: 4 },
];

export default function FormulaLab3D({
  herbs = DEFAULT_HERBS,
  removedHerbId = null,
  onSelectHerb,
  className = "w-full h-80 rounded-2xl overflow-hidden",
}: FormulaLab3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredHerb, setHoveredHerb] = useState<HerbNode3D | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e281d, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfbf9f4, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc8833e, 1.8);
    dirLight.position.set(8, 14, 10);
    scene.add(dirLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Central Crucible / Synergy Nexus
    const nexusGeo = new THREE.TorusGeometry(3.5, 0.08, 16, 64);
    const nexusMat = new THREE.MeshStandardMaterial({
      color: 0xc8833e,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x4a2a10,
    });
    const nexusRing = new THREE.Mesh(nexusGeo, nexusMat);
    nexusRing.rotation.x = Math.PI / 2.5;
    rootGroup.add(nexusRing);

    // Secondary inner ring
    const innerRingGeo = new THREE.TorusGeometry(2.0, 0.04, 16, 48);
    const innerRing = new THREE.Mesh(innerRingGeo, nexusMat);
    innerRing.rotation.x = -Math.PI / 3;
    rootGroup.add(innerRing);

    // Central Core Orb (Synergy Reservoir)
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x5d7a68,
      transmission: 0.7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x1f4633,
      emissiveIntensity: 0.4,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(core);

    // Botanical Gemstone Herb Nodes
    const herbMeshes: {
      mesh: THREE.Mesh;
      halo: THREE.Mesh;
      herb: HerbNode3D;
      basePos: THREE.Vector3;
      driftPos: THREE.Vector3;
    }[] = [];

    const activeHerbsList = herbs && herbs.length > 0 ? herbs : DEFAULT_HERBS;
    const count = activeHerbsList.length;
    const radius = 4.2;

    activeHerbsList.forEach((herb, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(idx * 1.5) * 0.8;
      const basePos = new THREE.Vector3(x, y, z);
      const driftPos = new THREE.Vector3(x * 1.8, y + 2.5, z * 1.8);

      const isRemoved = removedHerbId === herb.id;

      // Herb Orb
      const orbGeo = new THREE.DodecahedronGeometry(0.65, 0);
      const orbMat = new THREE.MeshStandardMaterial({
        color: isRemoved ? 0x666666 : herb.color,
        metalness: 0.6,
        roughness: 0.25,
        emissive: isRemoved ? 0x331111 : herb.color,
        emissiveIntensity: isRemoved ? 0.1 : 0.4,
        transparent: true,
        opacity: isRemoved ? 0.35 : 0.95,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.copy(isRemoved ? driftPos : basePos);
      orb.userData = { herb };
      rootGroup.add(orb);

      // Halo ring
      const haloGeo = new THREE.TorusGeometry(0.85, 0.04, 8, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: isRemoved ? 0xef5350 : herb.color,
        transparent: true,
        opacity: isRemoved ? 0.2 : 0.6,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(orb.position);
      rootGroup.add(halo);

      herbMeshes.push({ mesh: orb, halo, herb, basePos, driftPos });
    });

    // Synergistic Connection Web between active herbs
    const linesGroup = new THREE.Group();
    rootGroup.add(linesGroup);

    const rebuildConnections = () => {
      while (linesGroup.children.length > 0) {
        linesGroup.remove(linesGroup.children[0]);
      }

      for (let i = 0; i < herbMeshes.length; i++) {
        for (let j = i + 1; j < herbMeshes.length; j++) {
          const h1 = herbMeshes[i];
          const h2 = herbMeshes[j];
          if (h1.herb.id === removedHerbId || h2.herb.id === removedHerbId) continue;

          const points = [h1.mesh.position, h2.mesh.position];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const lineMat = new THREE.LineBasicMaterial({
            color: 0x81c784,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
          });
          linesGroup.add(new THREE.Line(lineGeo, lineMat));
        }

        // Also connect to center core if not removed
        const h = herbMeshes[i];
        if (h.herb.id !== removedHerbId) {
          const points = [h.mesh.position, new THREE.Vector3(0, 0, 0)];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const lineMat = new THREE.LineBasicMaterial({
            color: 0xc8833e,
            transparent: true,
            opacity: 0.35,
          });
          linesGroup.add(new THREE.Line(lineGeo, lineMat));
        }
      }
    };
    rebuildConnections();

    // Interaction
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
      const meshes = herbMeshes.map((h) => h.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        container.style.cursor = "pointer";
        const found = intersects[0].object.userData.herb as HerbNode3D;
        setHoveredHerb(found);
      } else {
        container.style.cursor = isDragging ? "grabbing" : "grab";
        setHoveredHerb(null);
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const meshes = herbMeshes.map((h) => h.mesh);
      const intersects = raycaster.intersectObjects(meshes);
      if (intersects.length > 0) {
        const found = intersects[0].object.userData.herb as HerbNode3D;
        if (onSelectHerb) onSelectHerb(found.id);
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

      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.08 + 0.0015;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.08;

      nexusRing.rotation.z = elapsed * 0.1;
      innerRing.rotation.z = -elapsed * 0.15;
      core.rotation.y = elapsed * 0.2;

      // Animate herb positions (smoothly interpolate towards base or drift)
      herbMeshes.forEach(({ mesh, halo, herb, basePos, driftPos }, idx) => {
        const isRemoved = herb.id === removedHerbId;
        const targetPos = isRemoved ? driftPos : basePos;
        mesh.position.lerp(targetPos, 0.05);
        halo.position.copy(mesh.position);

        halo.rotation.x = elapsed * 0.5 + idx;
        halo.rotation.y = elapsed * 0.3;

        mesh.rotation.x = elapsed * 0.3;
        mesh.rotation.y = elapsed * 0.4;
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
      container.removeEventListener("click", onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      nexusGeo.dispose();
      nexusMat.dispose();
      innerRingGeo.dispose();
      coreGeo.dispose();
      coreMat.dispose();
    };
  }, [herbs, removedHerbId, onSelectHerb]);

  return (
    <div className={`relative ${className} bg-charcoal/70 border border-sage/20 shadow-2xl`}>
      <div ref={containerRef} className="w-full h-full cursor-grab" />

      {/* Floating 3D Badge Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${removedHerbId ? "bg-rose-500 animate-ping" : "bg-amber"}`} />
        <span className="text-xs font-mono font-medium text-parchment/80 uppercase tracking-widest bg-forest/80 px-2.5 py-1 rounded-full border border-sage/30 backdrop-blur-md">
          {removedHerbId ? "Synergy Perturbation Active (Ingredient Withdrawn)" : "3D Polyherbal Synergy Constellation"}
        </span>
      </div>

      {hoveredHerb && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-xs p-3.5 rounded-xl bg-forest/95 border border-sage/40 shadow-xl backdrop-blur-md pointer-events-none transition-all">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="font-bold text-amber">{hoveredHerb.name}</span>
            <span className="text-parchment/70 italic text-[11px]">{hoveredHerb.sanskrit}</span>
          </div>
          <div className="text-xs text-parchment/90 font-medium">{hoveredHerb.role}</div>
          <div className="text-[11px] font-mono text-sage mt-1">
            {hoveredHerb.compounds} documented bio-active constituents
          </div>
        </div>
      )}
    </div>
  );
}
