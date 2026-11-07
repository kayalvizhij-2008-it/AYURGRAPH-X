"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Network,
  Filter,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Info,
  X,
  ExternalLink,
  Layers,
  ArrowRight
} from "lucide-react";
import cytoscape from "cytoscape";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const ScientificGraph3D = dynamic(() => import("@/components/3d/ScientificGraph3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[580px] flex flex-col items-center justify-center bg-botanical-forest/20 rounded-xl">
      <div className="w-10 h-10 border-2 border-botanical-amber/30 border-t-botanical-amber rounded-full animate-spin" />
      <span className="text-xs font-mono text-botanical-sage mt-2">Loading 3D Knowledge Constellation...</span>
    </div>
  ),
});

const ENTITY_COLORS: Record<string, string> = {
  Plant: "#153A2A",          // Forest Green
  PlantPart: "#5D7A68",      // Sage Green
  TraditionalUse: "#4A5568", // Slate
  Compound: "#C8833E",       // Amber / Gold
  Target: "#2B6CB0",         // Cobalt Blue
  Pathway: "#6B46C1",        // Violet
  Disease: "#9B2C2C",        // Crimson
};

export default function EthnoGraphPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [selectedEdge, setSelectedEdge] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [nodeSearchQuery, setNodeSearchQuery] = useState("");
  const [currentLayout, setCurrentLayout] = useState<string>("cose");
  const [viewDimension, setViewDimension] = useState<"2D" | "3D">("3D");

  useEffect(() => {
    fetch(`${API_BASE}/graph`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setGraphData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Graph fetch error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!graphData || !containerRef.current) return;

    // Convert API nodes & edges to Cytoscape format
    const elements: cytoscape.ElementDefinition[] = [];

    // Filter nodes
    const validNodeIds = new Set<string>();
    graphData.nodes.forEach((node: any) => {
      if (filterType !== "ALL" && node.entity_type !== filterType) {
        return;
      }
      validNodeIds.add(node.id);
      elements.push({
        data: {
          id: node.id,
          label: node.label,
          entity_type: node.entity_type,
          color: ENTITY_COLORS[node.entity_type] || "#4A5568",
          raw: node,
        },
      });
    });

    // Add edges connecting valid nodes
    graphData.edges.forEach((edge: any) => {
      if (validNodeIds.has(edge.source) && validNodeIds.has(edge.target)) {
        elements.push({
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.target,
            label: edge.relationship,
            raw: edge,
          },
        });
      }
    });

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            label: "data(label)",
            "font-size": "10px",
            color: "#151D19",
            "text-valign": "bottom",
            "text-margin-y": 4,
            "text-background-color": "#FBF9F4",
            "text-background-opacity": 0.85,
            "text-background-padding": "2px",
            width: "36px",
            height: "36px",
            "border-width": 2,
            "border-color": "#FFFFFF",
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 4,
            "border-color": "#C8833E",
            width: "44px",
            height: "44px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#A8B6AF",
            "target-arrow-color": "#A8B6AF",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "font-size": "8px",
            label: "data(label)",
            color: "#5A6560",
            "text-background-color": "#FBF9F4",
            "text-background-opacity": 0.8,
            "text-background-padding": "1px",
          },
        },
        {
          selector: "edge:selected",
          style: {
            width: 3,
            "line-color": "#C8833E",
            "target-arrow-color": "#C8833E",
          },
        },
      ],
      layout: {
        name: currentLayout as any,
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
      },
    });

    cy.on("tap", "node", (evt) => {
      const node = evt.target;
      setSelectedEntity(node.data("raw"));
      setSelectedEdge(null);
    });

    cy.on("tap", "edge", (evt) => {
      const edge = evt.target;
      setSelectedEdge(edge.data("raw"));
      setSelectedEntity(null);
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        setSelectedEntity(null);
        setSelectedEdge(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [graphData, filterType, currentLayout]);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleResetLayout = () => {
    cyRef.current?.layout({ name: currentLayout as any, fit: true, padding: 30 } as any).run();
  };

  const handleNodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cyRef.current || !nodeSearchQuery.trim()) return;

    const query = nodeSearchQuery.toLowerCase().trim();
    const matched = cyRef.current.nodes().filter((n) => {
      const label = (n.data("label") || "").toLowerCase();
      const id = (n.data("id") || "").toLowerCase();
      return label.includes(query) || id.includes(query);
    });

    if (matched.length > 0) {
      const targetNode = matched.first();
      cyRef.current.nodes().unselect();
      targetNode.select();
      cyRef.current.animate({
        center: { eles: targetNode },
        zoom: 1.5,
      });
      setSelectedEntity(targetNode.data("raw"));
      setSelectedEdge(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Title & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-forest/10 border border-botanical-forest/20 text-botanical-forest text-[11px] font-mono uppercase tracking-wider mb-2">
            <Network className="w-3.5 h-3.5" />
            <span>Module 1 — Knowledge Graph</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
            EthnoGraph Explorer
          </h1>
          <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-xl leading-relaxed">
            Interactive multi-relational network connecting verified medicinal taxa, plant parts, phytochemical isolates, molecular targets, biological pathways, and disease phenotypes.
          </p>
        </div>

        {/* In-Graph Search Bar */}
        <form onSubmit={handleNodeSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={nodeSearchQuery}
            onChange={(e) => setNodeSearchQuery(e.target.value)}
            placeholder="Focus node in graph..."
            className="text-xs bg-botanical-parchment border border-botanical-parchment-border rounded-md px-3 py-1.5 outline-none focus:border-botanical-amber text-botanical-forest"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-md bg-botanical-forest text-botanical-parchment text-xs font-medium hover:bg-botanical-forest-mid"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Filter Ribbon & Layout Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-botanical-parchment-card border border-botanical-parchment-border text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted mr-1">Filter Type:</span>
          {["ALL", "Plant", "Compound", "Target", "Pathway", "Disease"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                filterType === type
                  ? "bg-botanical-forest text-botanical-parchment shadow-sm"
                  : "bg-botanical-parchment text-botanical-charcoal-muted hover:text-botanical-forest border border-botanical-parchment-border"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Dimension Toggle */}
          <div className="flex items-center gap-1 bg-botanical-forest/10 p-0.5 rounded-lg border border-botanical-forest/20">
            <button
              onClick={() => setViewDimension("3D")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewDimension === "3D"
                  ? "bg-botanical-forest text-botanical-parchment shadow-sm"
                  : "text-botanical-charcoal hover:text-botanical-forest"
              }`}
            >
              3D Constellation
            </button>
            <button
              onClick={() => setViewDimension("2D")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewDimension === "2D"
                  ? "bg-botanical-forest text-botanical-parchment shadow-sm"
                  : "text-botanical-charcoal hover:text-botanical-forest"
              }`}
            >
              2D Graph
            </button>
          </div>

          {viewDimension === "2D" && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted mr-1">Layout:</span>
              {[
                { id: "cose", label: "CoSE Force" },
                { id: "concentric", label: "Concentric" },
                { id: "circle", label: "Circular" },
                { id: "breadthfirst", label: "Hierarchical" }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setCurrentLayout(l.id)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                    currentLayout === l.id
                      ? "bg-botanical-amber text-botanical-forest-deep font-semibold"
                      : "bg-botanical-parchment text-botanical-charcoal-muted border border-botanical-parchment-border"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Cytoscape Graph Canvas & Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Area (8 cols) */}
        <div className="lg:col-span-8 bg-botanical-parchment-card rounded-xl border border-botanical-parchment-border overflow-hidden relative shadow-botanical flex flex-col" style={{ minHeight: "560px" }}>
          {viewDimension === "2D" && (
            <>
              {/* Canvas Floating Controls */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-botanical-parchment/90 backdrop-blur-sm p-1 rounded-md border border-botanical-parchment-border shadow-sm">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 text-botanical-charcoal hover:bg-botanical-parchment-surface rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 text-botanical-charcoal hover:bg-botanical-parchment-surface rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetLayout}
                  className="p-1.5 text-botanical-charcoal hover:bg-botanical-parchment-surface rounded"
                  title="Re-layout Graph"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Color Legend */}
              <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2 bg-botanical-parchment/90 backdrop-blur-sm px-2.5 py-1.5 rounded-md border border-botanical-parchment-border text-[10px] font-mono shadow-sm">
                {Object.entries(ENTITY_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-botanical-charcoal">{type}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Graph View Rendering */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-botanical-charcoal-muted">
              Rendering multi-relational graph topology...
            </div>
          ) : viewDimension === "3D" && graphData ? (
            <div className="flex-1 w-full h-[580px]">
              <ScientificGraph3D
                nodes={graphData.nodes || []}
                edges={graphData.edges || []}
                selectedEntityId={selectedEntity?.id}
                filterType={filterType}
                onSelectNode={(node) => {
                  setSelectedEntity(node);
                  setSelectedEdge(null);
                }}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div ref={containerRef} className="flex-1 w-full h-[580px] bg-parchment-grid" />
          )}
        </div>

        {/* Inspector Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen min-h-[300px]">
            {selectedEntity ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-botanical-amber-deep font-semibold">
                      Selected Entity
                    </span>
                    <h3 className="font-serif text-lg font-bold text-botanical-forest">
                      {selectedEntity.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="text-botanical-charcoal-muted hover:text-botanical-charcoal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs space-y-2">
                  <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                        Entity Classification
                      </span>
                      <span className="font-semibold text-botanical-forest mt-0.5 block">
                        {selectedEntity.entity_type}
                      </span>
                    </div>
                    {/* Deep-link to entity detail if plant or target */}
                    {selectedEntity.entity_type === "Plant" && (
                      <Link
                        href={`/plants/${selectedEntity.id}`}
                        className="px-2 py-1 rounded bg-botanical-forest text-botanical-parchment text-[10px] font-medium flex items-center gap-1 hover:bg-botanical-forest-mid"
                      >
                        <span>Full Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                    {selectedEntity.entity_type === "Target" && (
                      <Link
                        href={`/targets/${selectedEntity.id}`}
                        className="px-2 py-1 rounded bg-botanical-forest text-botanical-parchment text-[10px] font-medium flex items-center gap-1 hover:bg-botanical-forest-mid"
                      >
                        <span>Target Card</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                      Indexed Attributes
                    </span>
                    {Object.entries(selectedEntity.attributes || {}).map(([k, v]) => {
                      if (k === "label" || k === "entity_type") return null;
                      return (
                        <div key={k} className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border text-[11px]">
                          <span className="text-[9px] font-mono text-botanical-charcoal-muted uppercase block">
                            {k}
                          </span>
                          <span className="text-botanical-charcoal font-medium break-words">
                            {Array.isArray(v) ? v.join(", ") : String(v)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : selectedEdge ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-botanical-amber-deep font-semibold">
                      Selected Relationship
                    </span>
                    <h3 className="font-serif text-base font-bold text-botanical-forest">
                      {selectedEdge.relationship}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedEdge(null)}
                    className="text-botanical-charcoal-muted hover:text-botanical-charcoal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs space-y-2">
                  <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                    <span className="text-[10px] font-mono text-botanical-charcoal-muted block">Source Node</span>
                    <span className="font-semibold text-botanical-forest">{selectedEdge.source}</span>
                  </div>
                  <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                    <span className="text-[10px] font-mono text-botanical-charcoal-muted block">Target Node</span>
                    <span className="font-semibold text-botanical-forest">{selectedEdge.target}</span>
                  </div>
                  <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                    <span className="text-[10px] font-mono text-botanical-charcoal-muted block">Evidence Grade</span>
                    <span className="font-mono font-semibold text-emerald-700">{selectedEdge.evidence_grade || "Grade B"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Info className="w-8 h-8 text-botanical-sage mb-2 opacity-60" />
                <h4 className="font-serif text-sm font-semibold text-botanical-forest">
                  Graph Inspector Ready
                </h4>
                <p className="text-xs text-botanical-charcoal-muted mt-1 leading-relaxed">
                  Click on any node or relationship edge in the graph canvas, or use the search box above to locate specific targets and compounds.
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats Panel */}
          {graphData && graphData.stats && (
            <div className="p-4 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border text-xs space-y-2">
              <div className="font-serif font-bold text-botanical-forest">
                Topology Coverage
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-botanical-charcoal-muted">
                <div>Nodes: <span className="font-bold text-botanical-forest">{graphData.stats.node_count}</span></div>
                <div>Edges: <span className="font-bold text-botanical-forest">{graphData.stats.edge_count}</span></div>
                <div>Plants: <span className="font-bold text-botanical-forest">{graphData.stats.plant_count}</span></div>
                <div>Compounds: <span className="font-bold text-botanical-forest">{graphData.stats.compound_count}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
