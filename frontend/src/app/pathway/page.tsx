"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Info,
  CheckCircle2,
  FileText,
  FlaskConical,
  X,
  ChevronRight,
  Layers
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const Pathway3D = dynamic(() => import("@/components/3d/Pathway3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-2xl bg-forest/40 border border-sage/20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-amber/30 border-t-amber rounded-full animate-spin" />
      <span className="text-xs font-mono text-sage mt-2">Loading 3D Evidence Ribbon...</span>
    </div>
  ),
});

function EvidencePathwayContent() {
  const searchParams = useSearchParams();
  const urlPlant = searchParams.get("plant");
  const urlDisease = searchParams.get("disease");

  const [selectedPlant, setSelectedPlant] = useState(urlPlant || "PLANT_001");
  const [selectedDisease, setSelectedDisease] = useState(urlDisease || "DIS_001");
  const [pathwayData, setPathwayData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [selectedEdgeIndex, setSelectedEdgeIndex] = useState<number | null>(null);
  const [show3DRibbon, setShow3DRibbon] = useState<boolean>(true);

  useEffect(() => {
    if (urlPlant) {
      setSelectedPlant(urlPlant);
      if (!urlDisease) {
        if (urlPlant === "PLANT_002") setSelectedDisease("DIS_002");
        else if (urlPlant === "PLANT_005") setSelectedDisease("DIS_007");
        else setSelectedDisease("DIS_001");
      }
    }
    if (urlDisease) {
      setSelectedDisease(urlDisease);
    }
  }, [urlPlant, urlDisease]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/graph/pathway?plant_id=${selectedPlant}&disease_id=${selectedDisease}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setPathwayData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Pathway fetch error:", err);
        setLoading(false);
      });
  }, [selectedPlant, selectedDisease]);

  const activeStep = pathwayData && selectedStageIndex !== null && selectedStageIndex < pathwayData.steps.length
    ? pathwayData.steps[selectedStageIndex]
    : null;

  // If an edge is explicitly selected, use it; otherwise use the corresponding edge for the active stage
  const activeEdge = pathwayData
    ? selectedEdgeIndex !== null
      ? pathwayData.edges[selectedEdgeIndex]
      : selectedStageIndex < pathwayData.edges.length
      ? pathwayData.edges[selectedStageIndex]
      : pathwayData.edges[pathwayData.edges.length - 1]
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Title & Case Study Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-amber/10 border border-botanical-amber/30 text-botanical-amber-deep text-[11px] font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Feature</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
            Evidence-to-Discovery Pathway Explorer
          </h1>
          <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-2xl leading-relaxed">
            Trace the unbroken lineage of evidence from ancient pharmacopeial indication through isolated phytochemicals and binding kinetics to translational disease hypotheses.
          </p>
        </div>

        {/* Case Study Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <label className="text-xs font-semibold text-botanical-charcoal shrink-0">
            Case Study:
          </label>
          <select
            value={selectedPlant}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedPlant(val);
              if (val === "PLANT_002") setSelectedDisease("DIS_002");
              else if (val === "PLANT_005") setSelectedDisease("DIS_007");
              else setSelectedDisease("DIS_001");
              setSelectedStageIndex(0);
              setSelectedEdgeIndex(null);
            }}
            className="text-xs bg-botanical-parchment border border-botanical-parchment-border rounded-md px-3 py-2 text-botanical-forest font-medium outline-none focus:border-botanical-amber"
          >
            <option value="PLANT_001">Withania somnifera (Ashwagandha) → Neuroinflammation</option>
            <option value="PLANT_002">Curcuma longa (Turmeric) → Arthritic Inflammation</option>
            <option value="PLANT_005">Zingiber officinale (Ginger) → Neuropathic Nociception</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-botanical-charcoal-muted">
          Loading verified evidence pathway records...
        </div>
      ) : !pathwayData ? (
        <div className="p-8 text-center text-xs text-amber-700 bg-amber-50 rounded-xl border border-amber-200">
          Failed to load pathway data. Ensure the backend API is running.
        </div>
      ) : (
        <>
          {/* Interactive 8-Stage Pathway Stepper Track */}
          <div className="p-6 rounded-xl bg-botanical-forest-deep text-botanical-parchment border border-botanical-forest-mid shadow-botanical space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-botanical-amber font-semibold">
                  Interactive 8-Stage Pathway Chain
                </span>
                <button
                  type="button"
                  onClick={() => setShow3DRibbon(!show3DRibbon)}
                  className="px-2.5 py-1 rounded bg-botanical-forest text-[10px] font-mono text-botanical-amber hover:bg-botanical-forest-light border border-botanical-amber/30 transition-all flex items-center gap-1.5"
                >
                  <Layers className="w-3 h-3" />
                  <span>{show3DRibbon ? "Hide 3D Ribbon" : "Show 3D Ribbon"}</span>
                </button>
              </div>
              <span className="text-[11px] font-mono text-botanical-sage-light">
                Confidence: <span className="text-emerald-400 font-semibold">{pathwayData.overall_confidence}</span>
              </span>
            </div>

            {/* 3D Spline Ribbon View */}
            {show3DRibbon && (
              <div className="w-full">
                <Pathway3D
                  steps={pathwayData.steps}
                  currentStepIndex={selectedStageIndex}
                  onSelectStage={(idx) => {
                    setSelectedStageIndex(idx);
                    setSelectedEdgeIndex(null);
                  }}
                  className="w-full h-72 rounded-xl"
                />
              </div>
            )}

            {/* Stepper Grid / Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative">
              {pathwayData.steps.map((step: any, idx: number) => {
                const isSelected = selectedStageIndex === idx && selectedEdgeIndex === null;
                return (
                  <button
                    key={step.stage_index}
                    onClick={() => {
                      setSelectedStageIndex(idx);
                      setSelectedEdgeIndex(null);
                    }}
                    className={`p-3 rounded-lg text-left transition-all relative flex flex-col justify-between border ${
                      isSelected
                        ? "bg-botanical-forest border-botanical-amber ring-2 ring-botanical-amber/50 shadow-lg scale-105 z-10"
                        : "bg-botanical-forest/60 border-botanical-forest-mid hover:bg-botanical-forest-light/60 hover:border-botanical-sage"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-botanical-sage-light">
                        <span>STAGE {step.stage_index}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-botanical-amber" />}
                      </div>
                      <div className="text-[11px] font-bold text-botanical-amber mt-1 line-clamp-1">
                        {step.stage_name}
                      </div>
                      <div className="text-xs font-semibold text-botanical-parchment mt-1 line-clamp-2">
                        {step.entity_name}
                      </div>
                    </div>

                    <div className="text-[9px] font-mono text-botanical-sage-light/70 mt-3 pt-2 border-t border-botanical-forest-mid truncate">
                      {step.entity_type}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Transition Edges Quick Selector Bar */}
            <div className="mt-4 pt-3 border-t border-botanical-forest-mid flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-botanical-sage-light/80 mr-1">
                Inspect Transition Edges:
              </span>
              {pathwayData.edges.map((edge: any, eIdx: number) => {
                const isEdgeSelected = selectedEdgeIndex === eIdx;
                return (
                  <button
                    key={eIdx}
                    onClick={() => {
                      setSelectedEdgeIndex(eIdx);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                      isEdgeSelected
                        ? "bg-botanical-amber text-botanical-forest-deep border-botanical-amber font-semibold shadow-sm"
                        : "bg-botanical-forest border-botanical-forest-mid text-botanical-sage-light hover:border-botanical-amber/50"
                    }`}
                  >
                    Edge {eIdx + 1}: {edge.source_stage.split(" ")[0]} → {edge.target_stage.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Evidence Inspection Drawer / Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Stage Detail View (Left / 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {activeStep && (
                <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-botanical-amber-deep font-semibold">
                        Stage {activeStep.stage_index} Exploration
                      </span>
                      <h2 className="font-serif text-xl font-bold text-botanical-forest">
                        {activeStep.stage_name}: {activeStep.entity_name}
                      </h2>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-botanical-parchment-surface border border-botanical-parchment-border text-botanical-charcoal">
                      {activeStep.entity_type}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-botanical-charcoal-muted">
                      Entity Attributes & Preclinical Rationale
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(activeStep.metadata || {}).map(([k, v]) => (
                        <div key={k} className="p-2.5 rounded bg-botanical-parchment border border-botanical-parchment-border">
                          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                            {k.replace(/_/g, " ")}
                          </span>
                          <span className="font-semibold text-botanical-forest mt-0.5 block">
                            {String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connected Outgoing / Incoming Transition Indicator */}
                  {activeEdge && (
                    <div className="mt-4 p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-botanical-amber-deep font-semibold uppercase block">
                          Associated Transition Edge
                        </span>
                        <span className="text-xs font-medium text-botanical-charcoal">
                          {activeEdge.source_stage} → {activeEdge.target_stage} ({activeEdge.relationship})
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                        {activeEdge.is_experimental ? "Wet-Lab Verified" : "Literature Link"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Missing Connections & Caveats Box */}
              <div className="p-5 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-botanical-forest">
                  <AlertCircle className="w-4 h-4 text-botanical-amber" />
                  <span>Documented Research Limitations & Missing Links</span>
                </div>
                <div className="space-y-2">
                  {(pathwayData.limitations || []).map((lim: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-botanical-charcoal-muted">
                      <span className="text-botanical-amber font-mono shrink-0">•</span>
                      <span>{lim}</span>
                    </div>
                  ))}
                  {(pathwayData.missing_links || []).map((mis: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Missing Clinical Connection:</span>
                        <span>{mis}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Traceable Evidence Record Card (Right / 5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4 sticky top-20">
                <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-botanical-amber" />
                    <h3 className="font-serif text-sm font-bold text-botanical-forest">
                      Traceable Provenance Audit
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                    Grade A Evidence
                  </span>
                </div>

                {activeEdge && activeEdge.evidence ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                        Source & Publication
                      </span>
                      <a
                        href={activeEdge.evidence.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-botanical-forest hover:text-botanical-amber flex items-center gap-1 mt-0.5"
                      >
                        <span>{activeEdge.evidence.source_name}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <div className="font-mono text-[10px] text-botanical-amber-deep">
                        {activeEdge.evidence.identifier} • {activeEdge.evidence.publication_date}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                        Supporting Scientific Text
                      </span>
                      <p className="italic text-botanical-charcoal leading-relaxed">
                        &quot;{activeEdge.evidence.supporting_text}&quot;
                      </p>
                    </div>

                    {activeEdge.evidence.contradictory_findings && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1 text-amber-900">
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-800 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Contradictory / Cautionary Finding</span>
                        </span>
                        <p className="leading-relaxed">
                          {activeEdge.evidence.contradictory_findings}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-botanical-parchment-border space-y-1 text-[11px] text-botanical-charcoal-muted">
                      <div className="flex justify-between">
                        <span>Evidence Category:</span>
                        <span className="font-medium text-botanical-forest">{activeEdge.evidence.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Directness:</span>
                        <span className="font-medium text-botanical-forest">{activeEdge.evidence.directness}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Licence:</span>
                        <span className="font-mono text-botanical-forest">{activeEdge.evidence.licence_info}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border">
                      <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block mb-1">
                        Select a Pathway Stage
                      </span>
                      <p className="text-botanical-charcoal-muted leading-relaxed">
                        Click on any stage in the ribbon above to audit its preclinical attributes, citations, and transition evidence.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function EvidencePathwayPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-botanical-charcoal-muted font-mono">
          Loading Evidence Pathway Engine...
        </div>
      }
    >
      <EvidencePathwayContent />
    </Suspense>
  );
}
