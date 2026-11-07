"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ScientificGraph3DProps {
  nodes: any[];
  edges: any[];
  selectedEntityId?: string;
  filterType?: string;
  onSelectNode: (node: any) => void;
  className?: string;
}

const ENTITY_HEX: Record<string, number> = {
  Plant: 0x153A2A,          // Forest Green
  PlantPart: 0x5D7A68,      // Sage Green
  TraditionalUse: 0x718096, // Slate
  Compound: 0xC8833E,       // Amber
  Target: 0x2B6CB0,         // Blue
  Pathway: 0x6B46C1,        // Violet
  Disease: 0x9B2C2C,        // Crimson
};

export default function ScientificGraph3D({
  nodes,
  edges,
  selectedEntityId,
  filterType = "ALL",
  onSelectNode,
  className = "",
}: ScientificGraph3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container || !nodes || nodes.length === 0) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "default" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const nodeObjectMap = new Map<string, THREE.Mesh>();
    const nodeHitboxes: THREE.Mesh[] = [];
    const nodeGroup = new THREE.Group();
    const edgeGroup = new THREE.Group();
    scene.add(edgeGroup);
    scene.add(nodeGroup);

    // Filter nodes
    const filteredNodes = nodes.filter((n) => filterType === "ALL" || n.entity_type === filterType);
    const validIds = new Set(filteredNodes.map((n) => n.id));

    // Position nodes procedurally in 3D fibonacci sphere
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const count = filteredNodes.length;
    const radius = 9.5;

    filteredNodes.forEach((node, i) => {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const isSelected = selectedEntityId === node.id;
      const colorHex = ENTITY_HEX[node.entity_type] || 0xC8833E;

      const geo = new THREE.SphereGeometry(isSelected ? 0.65 : 0.42, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.3,
        metalness: 0.5,
        emissive: colorHex,
        emissiveIntensity: isSelected ? 0.7 : 0.2,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { node };
      nodeGroup.add(mesh);
      nodeObjectMap.set(node.id, mesh);

      // Hitbox
      const hitGeo = new THREE.SphereGeometry(0.75, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(x, y, z);
      hitMesh.userData = { node };
      nodeHitboxes.push(hitMesh);
      scene.add(hitMesh);
    });

    // Create 3D lines for edges between valid nodes
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x5D7A68,
      transparent: true,
      opacity: 0.35,
    });

    const linePoints: THREE.Vector3[] = [];
    edges.forEach((edge) => {
      if (validIds.has(edge.source) && validIds.has(edge.target)) {
        const srcMesh = nodeObjectMap.get(edge.source);
        const tgtMesh = nodeObjectMap.get(edge.target);
        if (srcMesh && tgtMesh) {
          linePoints.push(srcMesh.position);
          linePoints.push(tgtMesh.position);
        }
      }
    });

    if (linePoints.length > 0) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      edgeGroup.add(lines);
    }

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(amb);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotX = 0;
    let rotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        rotY += deltaX * 0.005;
        rotX += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeHitboxes);
      if (intersects.length > 0) {
        setHoveredNode(intersects[0].object.userData.node);
        container.style.cursor = "pointer";
      } else {
        setHoveredNode(null);
        container.style.cursor = "grab";
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
        const node = intersects[0].object.userData.node;
        onSelectNode(node);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(8, Math.min(30, camera.position.z + e.deltaY * 0.015));
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

      // Continuous gentle idle orbit rotation
      if (!isDragging) {
        rotY += delta * 0.12;
      }

      nodeGroup.rotation.y = rotY;
      nodeGroup.rotation.x = rotX;
      edgeGroup.rotation.y = rotY;
      edgeGroup.rotation.x = rotX;

      // Update hitboxes positions to match rotation
      nodeHitboxes.forEach((hit) => {
        const origMesh = nodeObjectMap.get(hit.userData.node.id);
        if (origMesh) {
          const worldPos = new THREE.Vector3();
          origMesh.getWorldPosition(worldPos);
          hit.position.copy(worldPos);
        }
      });

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

      nodeGroup.children.forEach((c: any) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
      edgeGroup.children.forEach((c: any) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
    };
  }, [nodes, edges, selectedEntityId, filterType, onSelectNode]);

  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden bg-botanical-forest-deep ${className}`}>
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: "540px" }} />

      {/* Floating 3D Controls hint */}
      <div className="absolute top-3 left-3 z-10 text-[10px] font-mono text-botanical-sage-light/80 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-botanical-amber animate-pulse" />
        <span>3D Knowledge Constellation (Drag to Orbit • Scroll to Zoom • Click Node)</span>
      </div>

      {hoveredNode && (
        <div className="absolute bottom-3 left-3 z-10 bg-botanical-forest/95 backdrop-blur-md border border-botanical-amber/50 px-3 py-1.5 rounded-md text-xs text-botanical-parchment shadow-lg pointer-events-none">
          <span className="text-[10px] font-mono text-botanical-amber block uppercase font-semibold">
            {hoveredNode.entity_type}
          </span>
          <span className="font-semibold text-botanical-parchment">{hoveredNode.label}</span>
        </div>
      )}
    </div>
  );
}

