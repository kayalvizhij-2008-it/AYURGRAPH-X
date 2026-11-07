"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  FlaskConical,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Network
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function PlantDetailPage() {
  const params = useParams();
  const plantId = params.id as string;

  const [plant, setPlant] = useState<any>(null);
  const [compounds, setCompounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plantId) return;
    setLoading(true);

    Promise.all([
      fetch(`${API_BASE}/plants/${plantId}`).then((r) => {
        if (!r.ok) throw new Error("Plant record not found");
        return r.json();
      }),
      fetch(`${API_BASE}/plants/${plantId}/compounds`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([pData, cData]) => {
        setPlant(pData);
        setCompounds(cData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load plant entity details");
        setLoading(false);
      });
  }, [plantId]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-botanical-charcoal-muted">
        Loading verified botanical entity details...
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="p-8 max-w-xl mx-auto rounded-xl bg-amber-50 border border-amber-200 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-700 mx-auto" />
        <h2 className="font-serif text-lg font-bold text-amber-900">Plant Entity Not Found</h2>
        <p className="text-xs text-amber-800">{error || "No record matches this botanical identifier."}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-botanical-forest text-botanical-parchment text-xs font-medium"
        >
          Return to Overview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-botanical-forest-deep text-botanical-parchment border border-botanical-forest-mid shadow-botanical">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-botanical-amber/20 text-botanical-amber border border-botanical-amber/40 uppercase">
                Botanical Taxon
              </span>
              <span className="text-xs font-mono text-botanical-sage-light">
                Family: {plant.family}
              </span>
            </div>

            <h1 className="font-serif italic text-3xl sm:text-4xl font-bold text-botanical-parchment">
              {plant.scientific_name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-botanical-sage-light/90">
              <span className="font-medium">Common Names:</span>
              <span>{plant.common_names?.join(", ") || "N/A"}</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-botanical-forest text-emerald-300 border border-botanical-forest-light font-semibold">
              IUCN: {plant.conservation?.status_label || "Least Concern"}
            </span>
            <div className="flex gap-2 mt-2">
              <Link
                href={`/pathway?plant=${plant.id}`}
                className="px-3 py-1.5 rounded bg-botanical-amber text-botanical-forest-deep text-xs font-semibold hover:bg-botanical-amber-glow transition-colors"
              >
                Launch Pathway
              </Link>
              <Link
                href="/ethnograph"
                className="px-3 py-1.5 rounded bg-botanical-forest border border-botanical-forest-mid text-botanical-parchment text-xs font-medium hover:bg-botanical-forest-light transition-colors"
              >
                View in Graph
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Traditional Lore & Synonyms (Left 6 cols) vs Phytochemistry (Right 6 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          {/* Traditional Names & Indications */}
          <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
            <h2 className="font-serif text-lg font-bold text-botanical-forest flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-botanical-amber" />
              <span>Documented Traditional Uses & Names</span>
            </h2>

            {/* Traditional Vernacular Names */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                Historical Vernacular Nomenclature
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {plant.traditional_names?.map((tn: any, idx: number) => (
                  <div key={idx} className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border">
                    <span className="text-[10px] text-botanical-charcoal-muted block font-mono">{tn.language}:</span>
                    <span className="font-semibold text-botanical-forest">{tn.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traditional Uses */}
            <div className="space-y-3 pt-2 border-t border-botanical-parchment-border">
              <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                Classical Indications & Citations
              </span>
              {plant.traditional_uses?.map((tu: any) => (
                <div key={tu.id} className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-botanical-forest">{tu.use_name}</span>
                    <span className="text-[10px] font-mono text-botanical-amber-deep">{tu.system}</span>
                  </div>
                  <p className="text-botanical-charcoal-muted leading-relaxed">
                    {tu.traditional_indication}
                  </p>
                  <div className="text-[10px] font-mono text-botanical-charcoal-muted pt-1 border-t border-botanical-parchment-border">
                    Citation: {tu.source_citation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botanical Synonyms & POWO Identity */}
          <div className="p-5 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-3">
            <h3 className="font-serif text-sm font-bold text-botanical-forest">
              Botanical Synonymy & Kew POWO Record
            </h3>
            <div className="space-y-1.5 text-xs">
              {plant.synonyms?.map((syn: any, idx: number) => (
                <div key={idx} className="p-2 rounded bg-botanical-parchment border border-botanical-parchment-border flex items-center justify-between">
                  <span className="italic font-medium text-botanical-forest">{syn.name}</span>
                  <span className="text-[10px] font-mono text-botanical-charcoal-muted">{syn.status}</span>
                </div>
              ))}
            </div>
            {plant.powo_id && (
              <div className="text-[10px] font-mono text-botanical-charcoal-muted pt-1">
                IPNI / POWO LSID: <span className="font-semibold text-botanical-forest">{plant.powo_id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Phytochemicals & Conservation (6 cols) */}
        <div className="md:col-span-6 space-y-6">
          {/* Linked Phytochemicals */}
          <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-botanical-forest flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-botanical-amber" />
                <span>Constituent Phytochemicals</span>
              </h2>
              <span className="text-xs font-mono text-botanical-charcoal-muted">
                {compounds.length} Linked
              </span>
            </div>

            <div className="space-y-2.5">
              {compounds.map((cmp) => (
                <div
                  key={cmp.id}
                  className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-botanical-forest">{cmp.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-botanical-parchment-surface border border-botanical-parchment-border text-botanical-charcoal-muted">
                      CID: {cmp.pubchem_cid || "N/A"}
                    </span>
                  </div>
                  <div className="text-[11px] text-botanical-charcoal-muted">
                    Class: {cmp.chemical_class || "Natural Product"} • MW: {cmp.properties?.molecular_weight || "N/A"}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-botanical-charcoal-muted">
                      {cmp.bioactivities?.length || 0} Target Binding Records
                    </span>
                    <Link
                      href={`/phytodiscover?compound=${cmp.id}`}
                      className="text-botanical-amber-deep hover:text-botanical-forest font-semibold flex items-center gap-1"
                    >
                      <span>Inspect Bioactivity</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conservation Assessment */}
          <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-3">
            <h3 className="font-serif text-base font-bold text-botanical-forest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Biodiversity & Cultivation Policy</span>
            </h3>
            <p className="text-xs text-botanical-charcoal-muted leading-relaxed">
              {plant.conservation?.threat_summary}
            </p>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
              <span className="font-semibold block mb-0.5">Policy Recommendation:</span>
              <span>{plant.conservation?.cultivation_recommendation}</span>
            </div>
            <div className="text-[10px] font-mono text-botanical-charcoal-muted pt-1">
              Regional Range: {plant.geographic_distribution?.join(", ") || "Global Tropics"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
