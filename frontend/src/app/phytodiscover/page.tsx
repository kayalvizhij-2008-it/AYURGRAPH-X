"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FlaskConical,
  ExternalLink,
  ShieldCheck,
  Info,
  CheckCircle2,
  Atom,
  Layers,
  ChevronRight,
  Search
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const FloatingMolecule = dynamic(() => import("@/components/3d/FloatingMolecule"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 flex flex-col items-center justify-center bg-botanical-forest/20 rounded-lg">
      <div className="w-8 h-8 border-2 border-botanical-amber/30 border-t-botanical-amber rounded-full animate-spin" />
      <span className="text-[10px] font-mono text-botanical-sage mt-2">Generating 3D Conformer...</span>
    </div>
  ),
});

function PhytoDiscoverContent() {
  const searchParams = useSearchParams();
  const queryCompoundId = searchParams.get("compound");

  const [plants, setPlants] = useState<any[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string>("PLANT_001");
  const [compounds, setCompounds] = useState<any[]>([]);
  const [selectedCompound, setSelectedCompound] = useState<any>(null);
  const [bioactivityData, setBioactivityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [compoundSearch, setCompoundSearch] = useState("");
  const [structMode, setStructMode] = useState<"3D" | "2D">("3D");

  // Load plants on mount
  useEffect(() => {
    fetch(`${API_BASE}/plants`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setPlants(data);
      })
      .catch((err) => console.error("Error loading plants:", err));
  }, []);

  // Handle URL query parameter ?compound=...
  useEffect(() => {
    if (queryCompoundId) {
      fetch(`${API_BASE}/compounds/${queryCompoundId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setSelectedCompound(data);
            if (data.plant_sources?.length > 0) {
              setSelectedPlantId(data.plant_sources[0]);
            }
          }
        })
        .catch(() => {});
    }
  }, [queryCompoundId]);

  // Load compounds when plant changes
  useEffect(() => {
    if (!selectedPlantId) return;
    setLoading(true);
    fetch(`${API_BASE}/plants/${selectedPlantId}/compounds`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCompounds(data);
        if (!queryCompoundId && data.length > 0) {
          setSelectedCompound(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading compounds:", err);
        setLoading(false);
      });
  }, [selectedPlantId, queryCompoundId]);

  // Load bioactivity when compound changes
  useEffect(() => {
    if (!selectedCompound) {
      setBioactivityData(null);
      return;
    }

    fetch(`${API_BASE}/compounds/${selectedCompound.id}/bioactivity`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setBioactivityData(data);
      })
      .catch((err) => console.error("Error loading bioactivity:", err));
  }, [selectedCompound]);

  const filteredCompounds = compounds.filter((c) =>
    c.name.toLowerCase().includes(compoundSearch.toLowerCase()) ||
    (c.chemical_class || "").toLowerCase().includes(compoundSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Title & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-amber/10 border border-botanical-amber/30 text-botanical-amber-deep text-[11px] font-mono uppercase tracking-wider mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Module 3 — PhytoDiscover</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
            Phytochemical & Molecular Target Intelligence
          </h1>
          <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-xl leading-relaxed">
            Resolve botanical constituents to verified chemical structures and query experimentally validated biological targets from ChEMBL and PubChem.
          </p>
        </div>

        {/* Botanical Plant Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-botanical-charcoal shrink-0">
            Select Plant:
          </label>
          <select
            value={selectedPlantId}
            onChange={(e) => setSelectedPlantId(e.target.value)}
            className="text-xs bg-botanical-parchment border border-botanical-parchment-border rounded-md px-3 py-2 text-botanical-forest font-medium outline-none focus:border-botanical-amber"
          >
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.scientific_name} ({p.common_names[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-botanical-charcoal-muted">
          Loading phytochemical profiles...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Compound Search & List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            {/* Compound Filter Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-botanical-charcoal-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter compounds by name or class..."
                value={compoundSearch}
                onChange={(e) => setCompoundSearch(e.target.value)}
                className="w-full bg-botanical-parchment border border-botanical-parchment-border rounded-md pl-8 pr-3 py-1.5 text-xs outline-none focus:border-botanical-amber"
              />
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-botanical-charcoal-muted px-1">
              Phytochemical Isolates ({filteredCompounds.length})
            </div>
            <div className="space-y-2">
              {filteredCompounds.map((cmp) => {
                const isSelected = selectedCompound?.id === cmp.id;
                return (
                  <button
                    key={cmp.id}
                    onClick={() => setSelectedCompound(cmp)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-botanical-forest text-botanical-parchment border-botanical-amber shadow-sm"
                        : "bg-botanical-parchment-card border-botanical-parchment-border hover:bg-botanical-parchment-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm">{cmp.name}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? "bg-botanical-forest-light text-botanical-amber"
                            : "bg-botanical-parchment text-botanical-charcoal-muted border border-botanical-parchment-border"
                        }`}
                      >
                        CID: {cmp.pubchem_cid || "N/A"}
                      </span>
                    </div>
                    <div
                      className={`text-xs mt-1 truncate ${
                        isSelected ? "text-botanical-sage-light" : "text-botanical-charcoal-muted"
                      }`}
                    >
                      {cmp.chemical_class || "Natural Product"}
                    </div>
                    <div
                      className={`text-[10px] font-mono mt-2 pt-1 border-t ${
                        isSelected ? "border-botanical-forest-light text-botanical-amber" : "border-botanical-parchment-border text-botanical-charcoal-muted"
                      }`}
                    >
                      MW: {cmp.properties?.molecular_weight || "N/A"} • LogP: {cmp.properties?.logp || "N/A"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chemical Structure & Bioactivity Card (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedCompound ? (
              <>
                {/* Compound Identity & 2D Structure */}
                <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* 3D Conformer / 2D Structure Visual (5 cols) */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-lg bg-white border border-botanical-parchment-border shadow-inner relative overflow-hidden">
                      {/* Structure View Toggle */}
                      <div className="w-full flex items-center justify-between mb-2 pb-2 border-b border-botanical-parchment-border">
                        <span className="text-[10px] font-mono font-medium text-botanical-charcoal-muted uppercase">
                          {structMode === "3D" ? "3D Rotating Conformer" : "PubChem 2D Depiction"}
                        </span>
                        <div className="flex items-center gap-1 bg-botanical-parchment p-0.5 rounded border border-botanical-parchment-border">
                          <button
                            type="button"
                            onClick={() => setStructMode("3D")}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              structMode === "3D" ? "bg-botanical-forest text-botanical-parchment font-semibold" : "text-botanical-charcoal"
                            }`}
                          >
                            3D Model
                          </button>
                          <button
                            type="button"
                            onClick={() => setStructMode("2D")}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                              structMode === "2D" ? "bg-botanical-forest text-botanical-parchment font-semibold" : "text-botanical-charcoal"
                            }`}
                          >
                            2D Skeletal
                          </button>
                        </div>
                      </div>

                      {structMode === "3D" ? (
                        <div className="w-full h-52">
                          <FloatingMolecule compound={selectedCompound} className="w-full h-full" />
                        </div>
                      ) : (
                        <div className="h-52 flex flex-col items-center justify-center">
                          {selectedCompound.pubchem_cid ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${selectedCompound.pubchem_cid}/PNG`}
                              alt={selectedCompound.name}
                              className="max-h-44 max-w-full object-contain"
                            />
                          ) : (
                            <div className="h-44 flex items-center justify-center text-xs text-botanical-charcoal-muted">
                              Structure depiction pending
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-[9px] font-mono text-botanical-charcoal-muted mt-1 text-center">
                        {structMode === "3D" ? "Drag to Orbit • Wheel to Zoom • CPK Shaded" : "PubChem Compound Identity Database"}
                      </div>
                    </div>

                    {/* Chemical Identity Metadata (7 cols) */}
                    <div className="md:col-span-7 space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-serif text-2xl font-bold text-botanical-forest">
                            {selectedCompound.name}
                          </h2>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-botanical-forest text-botanical-parchment">
                            {selectedCompound.data_source_state || "VERIFIED"}
                          </span>
                        </div>
                        <p className="text-xs text-botanical-charcoal-muted mt-0.5 italic">
                          {selectedCompound.iupac_name || "IUPAC nomenclature curated"}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">MW</span>
                          <span className="font-semibold text-botanical-forest">{selectedCompound.properties?.molecular_weight || "N/A"} g/mol</span>
                        </div>
                        <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">cLogP</span>
                          <span className="font-semibold text-botanical-forest">{selectedCompound.properties?.logp || "N/A"}</span>
                        </div>
                        <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">TPSA</span>
                          <span className="font-semibold text-botanical-forest">{selectedCompound.properties?.tpsa || "N/A"} Å²</span>
                        </div>
                        <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">H-Donors</span>
                          <span className="font-semibold text-botanical-forest">{selectedCompound.properties?.h_bond_donors ?? "N/A"}</span>
                        </div>
                        <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">H-Acceptors</span>
                          <span className="font-semibold text-botanical-forest">{selectedCompound.properties?.h_bond_acceptors ?? "N/A"}</span>
                        </div>
                        <div className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">Rotatable</span>
                          <span className="font-semibold text-botanical-forest">{selectedCompound.properties?.rotatable_bonds ?? "N/A"}</span>
                        </div>
                      </div>

                      {/* SMILES Representation */}
                      {selectedCompound.canonical_smiles && (
                        <div className="p-2.5 rounded bg-botanical-parchment border border-botanical-parchment-border">
                          <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">Canonical SMILES</span>
                          <div className="font-mono text-[10px] text-botanical-forest break-all select-all mt-0.5">
                            {selectedCompound.canonical_smiles}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experimental Target Bioactivity Table */}
                <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-botanical-forest">
                        Experimental Bioactivity & Target Binding
                      </h3>
                      <p className="text-xs text-botanical-charcoal-muted mt-0.5">
                        Measured laboratory affinities from ChEMBL and peer-reviewed assays.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-botanical-forest text-botanical-parchment">
                      {bioactivityData?.source_state || "VERIFIED"}
                    </span>
                  </div>

                  {bioactivityData?.curated_bioactivities?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-botanical-parchment-border text-[10px] font-mono uppercase text-botanical-charcoal-muted">
                            <th className="py-2 px-2">Biological Target</th>
                            <th className="py-2 px-2">Assay Type</th>
                            <th className="py-2 px-2">Activity Metric</th>
                            <th className="py-2 px-2">Measured Value</th>
                            <th className="py-2 px-2">Citation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-botanical-parchment-border">
                          {bioactivityData.curated_bioactivities.map((act: any) => (
                            <tr key={act.id} className="hover:bg-botanical-parchment-surface">
                              <td className="py-2.5 px-2 font-medium text-botanical-forest">
                                {act.target_name}
                              </td>
                              <td className="py-2.5 px-2 font-mono text-[11px] text-botanical-charcoal">
                                {act.assay_type}
                              </td>
                              <td className="py-2.5 px-2 font-mono text-[11px] font-semibold text-botanical-amber-deep">
                                {act.activity_type}
                              </td>
                              <td className="py-2.5 px-2 font-mono text-xs font-bold text-emerald-800">
                                {act.relation} {act.activity_value} {act.activity_unit}
                              </td>
                              <td className="py-2.5 px-2 font-mono text-[10px] text-botanical-charcoal-muted">
                                {act.pubmed_id ? (
                                  <a
                                    href={`https://pubmed.ncbi.nlm.nih.gov/${act.pubmed_id}/`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-botanical-forest hover:underline flex items-center gap-1"
                                  >
                                    <span>PMID: {act.pubmed_id}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ) : (
                                  <span>Curated</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-botanical-charcoal-muted bg-botanical-parchment rounded-lg border border-botanical-parchment-border">
                      No direct binding records currently indexed for this constituent. Missing results are displayed as unavailable rather than fabricated.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-xs text-botanical-charcoal-muted bg-botanical-parchment-card rounded-xl border border-botanical-parchment-border">
                Select a phytochemical from the list to view its chemical structure and bioactivities.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PhytoDiscoverPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-botanical-charcoal-muted">Loading PhytoDiscover...</div>}>
      <PhytoDiscoverContent />
    </Suspense>
  );
}
