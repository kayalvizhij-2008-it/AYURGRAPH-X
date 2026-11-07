"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Layers,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  X,
  SlidersHorizontal
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const FormulaLab3D = dynamic(() => import("@/components/3d/FormulaLab3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-2xl bg-botanical-forest/20 border border-botanical-sage/20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-botanical-amber/30 border-t-botanical-amber rounded-full animate-spin" />
      <span className="text-xs font-mono text-botanical-sage mt-2">Loading 3D Polyherbal Constellation...</span>
    </div>
  ),
});

function FormulaLabContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  const [formulations, setFormulations] = useState<any[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>(urlId || "FORM_001");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Excluded ingredient simulation state
  const [excludedIngredient, setExcludedIngredient] = useState<string | null>(null);

  // Custom Formulation Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [availablePlants, setAvailablePlants] = useState<any[]>([]);
  const [newFormName, setNewFormName] = useState("");
  const [newFormIndication, setNewFormIndication] = useState("");
  const [newFormReference, setNewFormReference] = useState("");
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([]);

  const fetchFormulations = () => {
    fetch(`${API_BASE}/formulations`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setFormulations(data);
      })
      .catch((err) => console.error("Error fetching formulations:", err));
  };

  useEffect(() => {
    fetchFormulations();
    fetch(`${API_BASE}/plants`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setAvailablePlants(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (urlId) {
      setSelectedFormId(urlId);
    }
  }, [urlId]);

  useEffect(() => {
    if (!selectedFormId) return;
    setLoading(true);
    setExcludedIngredient(null);
    fetch(`${API_BASE}/formulations/${selectedFormId}/analysis`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading analysis:", err);
        setLoading(false);
      });
  }, [selectedFormId]);

  const handleCreateFormulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormName.trim() || selectedPlantIds.length < 2) return;

    try {
      const res = await fetch(`${API_BASE}/formulations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFormName,
          traditional_system: "Ayurveda / Research Formulation",
          reference_text: newFormReference || "Preclinical Protocol Specification",
          traditional_indications: [newFormIndication || "General Synergy Hypothesis"],
          plant_ids: selectedPlantIds,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setShowAddModal(false);
        setNewFormName("");
        setNewFormIndication("");
        setNewFormReference("");
        setSelectedPlantIds([]);
        fetchFormulations();
        setSelectedFormId(created.id);
      }
    } catch (err) {
      console.error("Error creating formulation:", err);
    }
  };

  const togglePlantSelection = (id: string) => {
    setSelectedPlantIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Simulated active impact if an ingredient is clicked
  const activeExclusionImpact =
    excludedIngredient && analysis?.remove_one_matrix
      ? analysis.remove_one_matrix.find((m: any) => m.ingredient_removed.includes(excludedIngredient) || excludedIngredient.includes(m.ingredient_removed))
      : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Title & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-amber/10 border border-botanical-amber/30 text-botanical-amber-deep text-[11px] font-mono uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Module 4 — FormulaLab</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
            Polyherbal Formulation & Constituent Matrix
          </h1>
          <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-xl leading-relaxed">
            Deconstruct multi-ingredient Ayurvedic recipes, compare phytochemical overlaps, and evaluate the remove-one-ingredient impact matrix.
          </p>
        </div>

        {/* Controls: Select + Add Custom */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-botanical-charcoal shrink-0">
              Formulation:
            </label>
            <select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="text-xs bg-botanical-parchment border border-botanical-parchment-border rounded-md px-3 py-2 text-botanical-forest font-medium outline-none focus:border-botanical-amber"
            >
              {formulations.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.traditional_system})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 rounded-md bg-botanical-forest text-botanical-parchment text-xs font-medium hover:bg-botanical-forest-mid flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-botanical-amber" />
            <span>New Custom Recipe</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-botanical-charcoal-muted">
          Deconstructing polyherbal constituent matrix...
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Formulation Overview Header Card */}
          <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-botanical-parchment-border">
              <div>
                <h2 className="font-serif text-2xl font-bold text-botanical-forest">
                  {analysis.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-botanical-charcoal-muted mt-1">
                  <span>Constituent Plants: <strong className="text-botanical-forest">{analysis.ingredients.length}</strong></span>
                  <span>•</span>
                  <span>Unique Phytochemicals: <strong className="text-botanical-forest">{analysis.total_unique_compounds}</strong></span>
                </div>
              </div>

              {/* Shared Classes */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted mr-1">
                  Shared Classes:
                </span>
                {analysis.shared_bioactive_classes?.map((sc: string) => (
                  <span
                    key={sc}
                    className="px-2 py-0.5 rounded bg-botanical-amber/10 border border-botanical-amber/30 text-botanical-amber-deep text-xs font-mono font-medium"
                  >
                    {sc}
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Polyherbal Formulation Constellation */}
            <div className="mt-4">
              <FormulaLab3D
                herbs={analysis.ingredients.map((ing: any, i: number) => {
                  const palette = [0x4caf50, 0x81c784, 0xc8833e, 0xdd6b20, 0x5d7a68];
                  return {
                    id: ing.name,
                    name: ing.name,
                    sanskrit: ing.scientific_name,
                    role: ing.role || "Formulation Herb",
                    color: palette[i % palette.length],
                    hexCode: `#${palette[i % palette.length].toString(16).padStart(6, '0')}`,
                    compounds: ing.compounds_count || 4,
                  };
                })}
                removedHerbId={excludedIngredient}
                onSelectHerb={(herbName) => {
                  setExcludedIngredient(excludedIngredient === herbName ? null : herbName);
                }}
                className="w-full h-72 rounded-xl mb-4"
              />
            </div>

            {/* Ingredients Cards Grid with Interactive "Simulate Exclusion" Toggle */}
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-mono uppercase text-botanical-charcoal-muted flex flex-col sm:flex-row sm:justify-between gap-1">
                <span>Constituent Ingredients</span>
                <span className="text-botanical-amber-deep">Click &quot;Simulate Removal&quot; to test ingredient perturbation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {analysis.ingredients.map((ing: any) => {
                  const isExcluded = excludedIngredient === ing.name;
                  return (
                    <div
                      key={ing.plant_id}
                      className={`p-4 rounded-lg border space-y-2 text-xs transition-all ${
                        isExcluded
                          ? "bg-rose-50 border-rose-300 opacity-80"
                          : "bg-botanical-parchment border-botanical-parchment-border"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-serif font-bold text-sm text-botanical-forest">
                          {ing.name}
                        </div>
                        {isExcluded && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 font-bold uppercase">
                            Simulated Omission
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-botanical-charcoal-muted">
                        Part Used: <strong className="text-botanical-charcoal">{ing.part}</strong>
                      </div>
                      <div className="pt-2 border-t border-botanical-parchment-border flex items-center justify-between">
                        <span className="text-[10px] font-mono text-botanical-amber-deep">
                          {ing.compounds?.length || 0} Bioactives
                        </span>
                        <button
                          onClick={() => setExcludedIngredient(isExcluded ? null : ing.name)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded transition-colors ${
                            isExcluded
                              ? "bg-botanical-forest text-botanical-parchment"
                              : "bg-botanical-parchment-surface border border-botanical-parchment-border text-botanical-charcoal hover:bg-rose-100 hover:text-rose-800"
                          }`}
                        >
                          {isExcluded ? "Restore Ingredient" : "Simulate Removal"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Exclusion Summary Alert */}
            {activeExclusionImpact && (
              <div className="mt-4 p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>Perturbation Impact: Excluding {activeExclusionImpact.ingredient_removed}</span>
                  <span className="font-mono text-rose-800">
                    Loss: {activeExclusionImpact.lost_compounds_count} Unique Compounds
                  </span>
                </div>
                <p className="text-[11px] text-rose-800">
                  Compounds completely lost from formulation: <strong>{activeExclusionImpact.lost_compounds.join(", ") || "None (Buffered by other herbs)"}</strong>
                </p>
                <div className="text-[10px] font-mono text-rose-700">
                  Assessment: {activeExclusionImpact.significance_assessment}
                </div>
              </div>
            )}
          </div>

          {/* Remove-One Ingredient Impact Matrix Table */}
          <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-botanical-amber-deep font-semibold">
                Sensitivity & In Silico Perturbation
              </div>
              <h3 className="font-serif text-lg font-bold text-botanical-forest">
                Complete Remove-One Ingredient Impact Matrix
              </h3>
              <p className="text-xs text-botanical-charcoal-muted mt-0.5">
                Simulate the systematic elimination of each constituent to observe which unique bioactives disappear from the total pharmacological spectrum.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-botanical-parchment-border text-[10px] font-mono uppercase text-botanical-charcoal-muted">
                    <th className="py-2.5 px-3">Removed Ingredient</th>
                    <th className="py-2.5 px-3">Lost Unique Compounds</th>
                    <th className="py-2.5 px-3">Compounds Lost</th>
                    <th className="py-2.5 px-3">Pharmacological Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-botanical-parchment-border">
                  {analysis.remove_one_matrix?.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-botanical-parchment-surface">
                      <td className="py-3 px-3 font-serif font-bold text-botanical-forest">
                        {row.ingredient_removed}
                      </td>
                      <td className="py-3 px-3 font-mono text-xs font-semibold text-rose-700">
                        -{row.lost_compounds_count}
                      </td>
                      <td className="py-3 px-3 text-xs text-botanical-charcoal">
                        {row.lost_compounds?.length > 0 ? row.lost_compounds.join(", ") : "None (Fully overlapping)"}
                      </td>
                      <td className="py-3 px-3 text-xs text-botanical-charcoal-muted font-medium">
                        {row.significance_assessment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mandatory Scientific Synergy Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-900 block">
                EthnoHack Scientific Synergy Boundary Notice:
              </span>
              <p className="leading-relaxed">
                {analysis.synergy_disclaimer}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-botanical-charcoal-muted">
          Formulation data not found.
        </div>
      )}

      {/* Custom Formulation Builder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateFormulation} className="bg-botanical-parchment max-w-lg w-full rounded-xl border border-botanical-parchment-border shadow-2xl p-6 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-botanical-charcoal-muted hover:text-botanical-charcoal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-botanical-amber" />
              <h3 className="font-serif text-lg font-bold text-botanical-forest">
                Create Research Polyherbal Formulation
              </h3>
            </div>

            <p className="text-xs text-botanical-charcoal-muted">
              Select 2 or more constituent medicinal plants to simulate combinatorial bioactives and sensitivity perturbations.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-botanical-forest block mb-1">
                  Formulation Name:
                </label>
                <input
                  type="text"
                  required
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  placeholder="e.g. Ashwagandha-Turmeric Composite"
                  className="w-full bg-botanical-parchment-card border border-botanical-parchment-border rounded px-3 py-1.5 text-xs outline-none focus:border-botanical-amber"
                />
              </div>

              <div>
                <label className="font-semibold text-botanical-forest block mb-1">
                  Traditional Reference / Protocol Source:
                </label>
                <input
                  type="text"
                  value={newFormReference}
                  onChange={(e) => setNewFormReference(e.target.value)}
                  placeholder="e.g. Preclinical Protocol Axis-2"
                  className="w-full bg-botanical-parchment-card border border-botanical-parchment-border rounded px-3 py-1.5 text-xs outline-none focus:border-botanical-amber"
                />
              </div>

              <div>
                <label className="font-semibold text-botanical-forest block mb-1">
                  Select Constituent Plants ({selectedPlantIds.length} selected, min 2):
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded bg-botanical-parchment-card border border-botanical-parchment-border">
                  {availablePlants.map((p) => {
                    const isChecked = selectedPlantIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-botanical-parchment cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePlantSelection(p.id)}
                          className="rounded text-botanical-amber focus:ring-botanical-amber"
                        />
                        <span className="font-serif italic font-medium text-botanical-forest">{p.scientific_name}</span>
                        <span className="text-botanical-charcoal-muted">({p.common_names?.[0]})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-botanical-parchment-border flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded bg-botanical-parchment border border-botanical-parchment-border text-xs text-botanical-charcoal"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedPlantIds.length < 2 || !newFormName.trim()}
                className="px-4 py-1.5 rounded bg-botanical-forest text-botanical-parchment text-xs font-semibold hover:bg-botanical-forest-mid disabled:opacity-50"
              >
                Assemble & Analyze
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function FormulaLabPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-botanical-charcoal-muted">Loading FormulaLab...</div>}>
      <FormulaLabContent />
    </Suspense>
  );
}
