"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Download,
  FileText,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Printer,
  Filter
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const HypothesisRadar3D = dynamic(() => import("@/components/3d/HypothesisRadar3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-2xl bg-botanical-forest/20 border border-botanical-sage/20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-botanical-amber/30 border-t-botanical-amber rounded-full animate-spin" />
      <span className="text-xs font-mono text-botanical-sage mt-2">Morphing 3D Scoring Polyhedron...</span>
    </div>
  ),
});

export default function HypothesisStudioPage() {
  const [hypotheses, setHypotheses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHypothesis, setSelectedHypothesis] = useState<any>(null);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [dossierData, setDossierData] = useState<any>(null);
  const [generatingDossier, setGeneratingDossier] = useState(false);
  const [plantFilter, setPlantFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch(`${API_BASE}/hypotheses`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setHypotheses(data);
        if (data.length > 0) {
          setSelectedHypothesis(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hypotheses error:", err);
        setLoading(false);
      });
  }, []);

  const filteredHypotheses = hypotheses.filter((h) => {
    if (plantFilter === "ALL") return true;
    return h.plant_id === plantFilter;
  });

  const handleOpenDossier = async (hyp: any) => {
    setGeneratingDossier(true);
    setShowDossierModal(true);
    try {
      const res = await fetch(`${API_BASE}/dossier/generate?plant_id=${hyp.plant_id}&disease_id=${hyp.disease_id}`);
      if (res.ok) {
        const data = await res.json();
        setDossierData(data);
      }
    } catch (err) {
      console.error("Dossier generation error:", err);
    } finally {
      setGeneratingDossier(false);
    }
  };

  const handleDownloadJson = async (hyp: any) => {
    try {
      const res = await fetch(`${API_BASE}/dossier/generate?plant_id=${hyp.plant_id}&disease_id=${hyp.disease_id}`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ayurgraph_dossier_${hyp.plant_id}_${hyp.compound_name.replace(/\s+/g, "_")}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Dossier download error:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Title Header */}
      <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-amber/10 border border-botanical-amber/30 text-botanical-amber-deep text-[11px] font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Module 8 — Hypothesis Studio</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
            Explainable Research Hypothesis Generation & Ranking
          </h1>
          <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-2xl leading-relaxed">
            Transparent multi-factor ranking algorithm evaluating source quality, directness of experimental binding, taxonomic confidence, and PAINS contradiction penalties.
          </p>
        </div>

        {/* Filter by Plant */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label className="text-xs font-semibold text-botanical-charcoal shrink-0">
            Filter Botanical:
          </label>
          <select
            value={plantFilter}
            onChange={(e) => {
              const val = e.target.value;
              setPlantFilter(val);
              const matched = hypotheses.filter((h) => val === "ALL" || h.plant_id === val);
              if (matched.length > 0) setSelectedHypothesis(matched[0]);
            }}
            className="text-xs bg-botanical-parchment border border-botanical-parchment-border rounded-md px-3 py-2 text-botanical-forest font-medium outline-none focus:border-botanical-amber"
          >
            <option value="ALL">All Botanical Taxa</option>
            <option value="PLANT_001">Withania somnifera (Ashwagandha)</option>
            <option value="PLANT_002">Curcuma longa (Turmeric)</option>
            <option value="PLANT_005">Zingiber officinale (Ginger)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-botanical-charcoal-muted">
          Evaluating multi-factor hypothesis scorecards...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Ranked Candidates List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-botanical-charcoal-muted px-1 flex justify-between">
              <span>Ranked Hypotheses ({filteredHypotheses.length})</span>
              <span>Sorted by Evidence Score</span>
            </div>

            <div className="space-y-3">
              {filteredHypotheses.map((hyp, idx) => {
                const isSelected = selectedHypothesis?.id === hyp.id;
                return (
                  <button
                    key={hyp.id}
                    onClick={() => setSelectedHypothesis(hyp)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-botanical-forest text-botanical-parchment border-botanical-amber shadow-sm"
                        : "bg-botanical-parchment-card border-botanical-parchment-border hover:bg-botanical-parchment-surface"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-serif font-bold text-sm leading-snug">
                        #{idx + 1}: {hyp.compound_name} → {hyp.target_name.split("(")[0]}
                      </span>
                      <div className="text-right shrink-0">
                        <div
                          className={`font-mono text-base font-bold ${
                            isSelected ? "text-botanical-amber" : "text-emerald-800"
                          }`}
                        >
                          {hyp.score}
                        </div>
                        <div
                          className={`text-[9px] font-mono ${
                            isSelected ? "text-botanical-sage-light" : "text-botanical-charcoal-muted"
                          }`}
                        >
                          Score / 100
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-xs mt-2 line-clamp-2 ${
                        isSelected ? "text-botanical-parchment/90" : "text-botanical-charcoal"
                      }`}
                    >
                      {hyp.hypothesis_statement}
                    </div>

                    <div
                      className={`pt-2.5 mt-2.5 border-t text-[10px] font-mono flex items-center justify-between ${
                        isSelected
                          ? "border-botanical-forest-light text-botanical-sage-light"
                          : "border-botanical-parchment-border text-botanical-charcoal-muted"
                      }`}
                    >
                      <span>{hyp.plant_name.split("(")[0]}</span>
                      <span className={isSelected ? "text-botanical-amber" : "text-emerald-700"}>
                        {hyp.score_grade}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Explainable Scorecard & Dossier Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedHypothesis ? (
              <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-6">
                {/* Header & Score Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-botanical-parchment-border">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-botanical-amber-deep font-semibold">
                      Candidate Rationale {selectedHypothesis.id}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-botanical-forest mt-0.5">
                      {selectedHypothesis.compound_name} targeting {selectedHypothesis.target_name}
                    </h2>
                    <div className="text-xs text-botanical-charcoal-muted mt-0.5">
                      Plant: {selectedHypothesis.plant_name} • Disease: {selectedHypothesis.disease_name}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDossier(selectedHypothesis)}
                      className="px-3 py-1.5 rounded-md bg-botanical-forest text-botanical-parchment text-xs font-medium hover:bg-botanical-forest-mid flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Dossier</span>
                    </button>
                    <button
                      onClick={() => handleDownloadJson(selectedHypothesis)}
                      className="px-3 py-1.5 rounded-md bg-botanical-amber text-botanical-forest-deep text-xs font-semibold hover:bg-botanical-amber-glow flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON</span>
                    </button>
                  </div>
                </div>

                {/* Hypothesis Statement */}
                <div className="p-4 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-botanical-charcoal-muted block">
                    Formulated Scientific Hypothesis
                  </span>
                  <p className="font-serif italic text-sm text-botanical-forest leading-relaxed">
                    &quot;{selectedHypothesis.hypothesis_statement}&quot;
                  </p>
                </div>

                {/* Explainable Factor Breakdown (Why this score?) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-sm font-bold text-botanical-forest">
                      Explainable Scoring Decomposition
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      Total: {selectedHypothesis.score} / 100
                    </span>
                  </div>

                  {/* 3D Scoring Radar Polyhedron */}
                  <HypothesisRadar3D
                    metrics={{
                      mechanisticPlausibility: Math.min(1.0, (selectedHypothesis.factors?.[0]?.score_contribution || 25) / 28),
                      traditionalConsistency: Math.min(1.0, (selectedHypothesis.factors?.[1]?.score_contribution || 22) / 25),
                      noveltyScore: Math.min(1.0, (selectedHypothesis.factors?.[2]?.score_contribution || 16) / 20),
                      chemicalTractability: Math.min(1.0, (selectedHypothesis.factors?.[3]?.score_contribution || 12) / 15),
                      crossSpeciesConservation: 0.84,
                      safetyClearance: 0.92,
                    }}
                    hypothesisTitle={selectedHypothesis.hypothesis_statement}
                    compositeScore={selectedHypothesis.score}
                    className="w-full h-72 rounded-xl mb-3"
                  />

                  <div className="space-y-2">
                    {selectedHypothesis.factors?.map((factor: any, fIdx: number) => (
                      <div
                        key={fIdx}
                        className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-botanical-forest">{factor.factor_name}</span>
                          <span className="font-mono text-botanical-amber-deep font-bold">
                            +{factor.contribution} pts (wt: {factor.weight})
                          </span>
                        </div>
                        <div className="w-full bg-botanical-parchment-surface h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-botanical-amber h-full rounded-full transition-all"
                            style={{ width: `${factor.score * 100}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-botanical-charcoal-muted">
                          {factor.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposed Future Wet-Lab Validation Protocols */}
                <div className="space-y-2">
                  <h3 className="font-serif text-sm font-bold text-botanical-forest">
                    Proposed Preclinical Experimental Validation
                  </h3>
                  <div className="space-y-1.5">
                    {selectedHypothesis.experimental_test_proposals?.map((prop: string, pIdx: number) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>{prop}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Responsible Use Disclaimer */}
                <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {selectedHypothesis.responsible_use_disclaimer}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Printable Research Dossier Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-botanical-parchment max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-botanical-parchment-border shadow-2xl p-6 sm:p-8 space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-botanical-parchment-border">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-botanical-amber" />
                <h3 className="font-serif text-xl font-bold text-botanical-forest">
                  AYURGRAPH-X Preclinical Research Dossier
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-botanical-forest text-botanical-parchment text-xs font-medium hover:bg-botanical-forest-mid flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => setShowDossierModal(false)}
                  className="px-3 py-1.5 rounded bg-botanical-parchment-surface border border-botanical-parchment-border text-xs text-botanical-charcoal hover:bg-botanical-parchment"
                >
                  Close
                </button>
              </div>
            </div>

            {generatingDossier || !dossierData ? (
              <div className="p-12 text-center text-xs text-botanical-charcoal-muted">
                Compiling multi-source provenance dossier...
              </div>
            ) : (
              <div className="space-y-6 text-xs text-botanical-charcoal">
                <div className="p-4 rounded-xl bg-botanical-parchment-surface border border-botanical-parchment-border space-y-1">
                  <div className="text-[10px] font-mono text-botanical-amber-deep">
                    Dossier ID: {dossierData.dossier_id} • Generated: {new Date(dossierData.generated_at).toLocaleDateString()}
                  </div>
                  <div className="font-serif text-base font-bold text-botanical-forest">
                    {dossierData.research_question}
                  </div>
                </div>

                {/* 8-Stage Pathway Summary Table */}
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-bold text-botanical-forest">
                    Evidence-to-Discovery Transition Sequence
                  </h4>
                  <div className="border border-botanical-parchment-border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-botanical-parchment-surface text-[10px] font-mono uppercase text-botanical-charcoal-muted">
                        <tr>
                          <th className="py-2 px-3">Stage</th>
                          <th className="py-2 px-3">Entity</th>
                          <th className="py-2 px-3">Classification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-botanical-parchment-border">
                        {dossierData.pathway?.steps?.map((st: any) => (
                          <tr key={st.stage_index} className="hover:bg-botanical-parchment-surface/50">
                            <td className="py-2 px-3 font-mono text-[10px] text-botanical-amber-deep">
                              Stage {st.stage_index}: {st.stage_name}
                            </td>
                            <td className="py-2 px-3 font-semibold text-botanical-forest">
                              {st.entity_name}
                            </td>
                            <td className="py-2 px-3 font-mono text-[10px] text-botanical-charcoal-muted">
                              {st.entity_type}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sources & Licences */}
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-bold text-botanical-forest">
                    Audited Primary Sources & Licences
                  </h4>
                  <div className="space-y-1">
                    {dossierData.sources_and_licences?.map((src: any, sIdx: number) => (
                      <div key={sIdx} className="p-2.5 rounded bg-botanical-parchment-surface border border-botanical-parchment-border flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-botanical-forest">{src.source}</span>
                        <span className="font-mono text-botanical-charcoal-muted">{src.licence}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Disclaimer */}
                <div className="p-4 rounded-xl bg-botanical-forest text-botanical-parchment text-[11px] leading-relaxed">
                  <span className="font-bold text-botanical-amber block mb-1">
                    Research Governance & Responsible Use:
                  </span>
                  {dossierData.disclaimer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
