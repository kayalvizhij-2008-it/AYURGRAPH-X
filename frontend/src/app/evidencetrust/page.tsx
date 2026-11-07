"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Filter,
  CheckCircle2,
  Info,
  Scale
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const EvidenceTrust3D = dynamic(() => import("@/components/3d/EvidenceTrust3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-2xl bg-botanical-forest/20 border border-botanical-sage/20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-botanical-amber/30 border-t-botanical-amber rounded-full animate-spin" />
      <span className="text-xs font-mono text-botanical-sage mt-2">Loading 3D Evidence Pyramid...</span>
    </div>
  ),
});

const TIERS = [
  { level: "Tier 1", label: "Direct Experimental Evidence", desc: "In vitro, in vivo, or crystallographic binding affinities from peer-reviewed assays.", grade: "Grade A" },
  { level: "Tier 2", label: "Curated Database Evidence", desc: "Manually curated scientific records from ChEMBL, PubChem, or IMPPAT 3.0.", grade: "Grade B" },
  { level: "Tier 3", label: "Peer-Reviewed Literature Association", desc: "Mechanistic or observational correlations reported in indexed biomedical journals.", grade: "Grade B" },
  { level: "Tier 4", label: "Computational Prediction", desc: "Target predictions, molecular docking scores, or QSAR machine learning models.", grade: "Grade C" },
  { level: "Tier 5", label: "Machine-Extracted Candidate", desc: "NLP-extracted relationship awaiting researcher verification loop.", grade: "Grade D" },
  { level: "Tier 6", label: "Unverified Hypothesis", desc: "Translational research proposal generated for wet-lab evaluation.", grade: "Grade E" },
];

export default function EvidenceTrustPage() {
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTier3D, setSelectedTier3D] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/evidence`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setEvidenceList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Evidence fetch error:", err);
        setLoading(false);
      });
  }, []);

  const filteredEvidence = evidenceList.filter((ev) => {
    if (selectedTier3D !== null) {
      const tierNum = parseInt(ev.tier?.replace(/\D/g, "") || "0");
      if (tierNum !== selectedTier3D) return false;
    }
    if (selectedCategory === "ALL") return true;
    return ev.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-forest/10 border border-botanical-forest/20 text-botanical-forest text-[11px] font-mono uppercase tracking-wider mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Module 7 — EvidenceTrust</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
            Evidence Provenance & Scientific Audit Panel
          </h1>
          <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-xl leading-relaxed">
            AYURGRAPH-X enforces an auditable 6-tier classification framework so researchers can distinguish direct wet-lab binding from computational predictions and historical lore.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-botanical-charcoal shrink-0">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-botanical-parchment border border-botanical-parchment-border rounded-md px-3 py-2 text-botanical-forest font-medium outline-none focus:border-botanical-amber"
          >
            <option value="ALL">All Evidence Categories</option>
            <option value="Direct Experimental Evidence">Tier 1: Direct Experimental Evidence</option>
            <option value="Curated Database Evidence">Tier 2: Curated Database Evidence</option>
            <option value="Peer-Reviewed Literature Association">Tier 3: Peer-Reviewed Literature</option>
            <option value="Computational Prediction">Tier 4: Computational Prediction</option>
            <option value="Machine Candidate">Tier 5: Machine-Extracted Candidate</option>
            <option value="Unverified Hypothesis">Tier 6: Unverified Hypothesis</option>
          </select>
        </div>
      </div>

      {/* 3D Evidence Pyramid Strata */}
      <EvidenceTrust3D
        selectedTier={selectedTier3D}
        onSelectTier={(tier) => setSelectedTier3D(tier)}
        className="w-full h-80 rounded-2xl"
      />

      {/* 6-Tier Evidence Classification Taxonomy Grid */}
      <div className="space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-botanical-charcoal-muted font-semibold">
          6-Tier Scientific Evidence Classification Hierarchy
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIERS.map((tier) => (
            <div
              key={tier.level}
              className="p-4 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-2 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-botanical-amber-deep">
                    {tier.level}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-botanical-forest text-botanical-parchment font-semibold">
                    {tier.grade}
                  </span>
                </div>
                <div className="font-serif font-bold text-sm text-botanical-forest mt-1">
                  {tier.label}
                </div>
                <p className="text-botanical-charcoal-muted mt-1 text-[11px] leading-relaxed">
                  {tier.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audited Evidence Records Table */}
      <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border">
          <div>
            <h3 className="font-serif text-lg font-bold text-botanical-forest">
              Audited Evidence Records Registry
            </h3>
            <p className="text-xs text-botanical-charcoal-muted mt-0.5">
              Traceable primary citations with explicit contradiction notes and data licences.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-botanical-forest text-botanical-parchment">
            {filteredEvidence.length} Records Verified
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-botanical-charcoal-muted">
            Loading evidence provenance logs...
          </div>
        ) : filteredEvidence.length === 0 ? (
          <div className="p-8 text-center text-xs text-botanical-charcoal-muted bg-botanical-parchment rounded-lg border border-botanical-parchment-border">
            No records match the selected evidence category filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvidence.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-botanical-parchment-border">
                  <div>
                    <span className="text-[10px] font-mono text-botanical-amber-deep font-semibold">
                      {ev.id} • {ev.identifier}
                    </span>
                    <a
                      href={ev.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-serif text-sm font-bold text-botanical-forest hover:text-botanical-amber flex items-center gap-1.5 mt-0.5"
                    >
                      <span>{ev.source_name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                      Grade {ev.confidence_grade}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-botanical-forest text-botanical-parchment">
                      {ev.category}
                    </span>
                  </div>
                </div>

                {/* Supporting Text */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                    Verified Supporting Text
                  </span>
                  <p className="italic text-botanical-charcoal leading-relaxed">
                    &quot;{ev.supporting_text}&quot;
                  </p>
                </div>

                {/* Contradictory Findings & Limitations */}
                {ev.contradictory_findings && (
                  <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-800 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Contradiction / Cautionary Flag (e.g. PAINS Alert)</span>
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {ev.contradictory_findings}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-botanical-parchment-border text-[11px] text-botanical-charcoal-muted font-mono">
                  <div>Directness: <strong className="text-botanical-forest">{ev.directness}</strong></div>
                  <div>Origin: <strong className="text-botanical-forest">{ev.origin}</strong></div>
                  <div>Licence: <strong className="text-botanical-forest">{ev.licence_info}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Source Licences & Attribution Matrix */}
      <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-botanical-forest" />
          <h3 className="font-serif text-lg font-bold text-botanical-forest">
            Integrated Data Sources & Attribution Licences
          </h3>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-botanical-parchment-border text-[10px] font-mono uppercase text-botanical-charcoal-muted">
                <th className="py-2.5 px-3">Data Repository</th>
                <th className="py-2.5 px-3">Licence / Terms</th>
                <th className="py-2.5 px-3">Scope in AYURGRAPH-X</th>
                <th className="py-2.5 px-3">Attribution Notice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-botanical-parchment-border">
              <tr className="hover:bg-botanical-parchment-surface">
                <td className="py-2.5 px-3 font-semibold text-botanical-forest">PubChem (NCBI / NLM)</td>
                <td className="py-2.5 px-3 font-mono">Public Domain (US Gov)</td>
                <td className="py-2.5 px-3">Chemical structures, CIDs, SMILES, 2D depictions</td>
                <td className="py-2.5 px-3 text-botanical-charcoal-muted">Kim et al., Nucleic Acids Res. 2023</td>
              </tr>
              <tr className="hover:bg-botanical-parchment-surface">
                <td className="py-2.5 px-3 font-semibold text-botanical-forest">ChEMBL 34 (EMBL-EBI)</td>
                <td className="py-2.5 px-3 font-mono">CC BY-SA 3.0</td>
                <td className="py-2.5 px-3">Experimental bioactivity metrics (IC50, Ki) and target IDs</td>
                <td className="py-2.5 px-3 text-botanical-charcoal-muted">Zdrazil et al., Nucleic Acids Res. 2024</td>
              </tr>
              <tr className="hover:bg-botanical-parchment-surface">
                <td className="py-2.5 px-3 font-semibold text-botanical-forest">GBIF Global Biodiversity</td>
                <td className="py-2.5 px-3 font-mono">CC BY 4.0 / CC0</td>
                <td className="py-2.5 px-3">Species occurrence coordinates & taxonomy match</td>
                <td className="py-2.5 px-3 text-botanical-charcoal-muted">GBIF Secretariat, Denmark 2026</td>
              </tr>
              <tr className="hover:bg-botanical-parchment-surface">
                <td className="py-2.5 px-3 font-semibold text-botanical-forest">PubMed / NCBI</td>
                <td className="py-2.5 px-3 font-mono">Open Access / Fair Use</td>
                <td className="py-2.5 px-3">Peer-reviewed biomedical literature abstracts & PMIDs</td>
                <td className="py-2.5 px-3 text-botanical-charcoal-muted">National Library of Medicine</td>
              </tr>
              <tr className="hover:bg-botanical-parchment-surface">
                <td className="py-2.5 px-3 font-semibold text-botanical-forest">IMPPAT 3.0 Reference</td>
                <td className="py-2.5 px-3 font-mono">CC BY-NC-ND 4.0 (Non-commercial)</td>
                <td className="py-2.5 px-3">Classical Ayurvedic text reference citations</td>
                <td className="py-2.5 px-3 text-botanical-charcoal-muted">Mohanraj et al., Sci Rep. 2018</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
