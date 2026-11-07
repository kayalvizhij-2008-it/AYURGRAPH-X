"use client";

import React, { useRef, useState } from "react";

interface DepthCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glowColor?: string;
}

export default function DepthCard({
  children,
  className = "",
  depth = 12,
  glowColor = "rgba(200, 131, 62, 0.15)",
}: DepthCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -depth;
    const rY = ((x - centerX) / centerX) * depth;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out preserve-3d ${className}`}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Dynamic Specular Glare */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl z-20 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor} 0%, transparent 60%)`,
          }}
        />
      )}
      <div style={{ transform: isHovered ? "translateZ(8px)" : "translateZ(0px)", transition: "transform 0.2s ease-out" }}>
        {children}
      </div>
    </div>
  );
}

