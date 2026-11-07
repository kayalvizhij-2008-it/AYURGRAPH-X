"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  Network,
  Activity,
  Layers,
  FlaskConical
} from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function TargetDetailPage() {
  const params = useParams();
  const targetId = params.id as string;

  const [target, setTarget] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetId) return;
    setLoading(true);

    fetch(`${API_BASE}/targets/${targetId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Target record not found");
        return r.json();
      })
      .then((data) => {
        setTarget(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load target details");
        setLoading(false);
      });
  }, [targetId]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-botanical-charcoal-muted">
        Loading verified biological target details...
      </div>
    );
  }

  if (error || !target) {
    return (
      <div className="p-8 max-w-xl mx-auto rounded-xl bg-amber-50 border border-amber-200 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-700 mx-auto" />
        <h2 className="font-serif text-lg font-bold text-amber-900">Target Entity Not Found</h2>
        <p className="text-xs text-amber-800">{error || "No record matches this target identifier."}</p>
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
      {/* Target Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-botanical-forest-deep text-botanical-parchment border border-botanical-forest-mid shadow-botanical">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
                Biological Target
              </span>
              <span className="text-xs font-mono text-botanical-sage-light">
                Organism: {target.organism}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-botanical-parchment">
              {target.gene_symbol}
            </h1>

            <p className="text-sm text-botanical-sage-light/90 max-w-xl">
              {target.full_name}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 text-xs font-mono">
            {target.uniprot_id && (
              <a
                href={`https://www.uniprot.org/uniprotkb/${target.uniprot_id}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-botanical-forest border border-botanical-forest-light text-botanical-sage-light hover:text-botanical-parchment flex items-center gap-1"
              >
                <span>UniProt: {target.uniprot_id}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {target.chembl_target_id && (
              <a
                href={`https://www.ebi.ac.uk/chembl/target_report_card/${target.chembl_target_id}/`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded bg-botanical-forest border border-botanical-forest-light text-botanical-amber hover:underline flex items-center gap-1"
              >
                <span>ChEMBL: {target.chembl_target_id}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Associated Pathways & Diseases */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Associated Diseases (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
            <h2 className="font-serif text-lg font-bold text-botanical-forest flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-700" />
              <span>Associated Preclinical Disease Phenotypes</span>
            </h2>

            <div className="space-y-2.5 text-xs">
              {target.associated_diseases?.map((dis: any) => (
                <div
                  key={dis.disease_id}
                  className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold text-botanical-forest block">{dis.name}</span>
                    <span className="text-[10px] font-mono text-botanical-charcoal-muted">
                      Identifier: {dis.disease_id}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                    {dis.evidence_count} Citations
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pathways & Actions (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
            <h2 className="font-serif text-lg font-bold text-botanical-forest flex items-center gap-2">
              <Layers className="w-4 h-4 text-botanical-amber" />
              <span>Biological Pathway Cascades</span>
            </h2>

            <div className="space-y-2 text-xs">
              {target.pathway_ids?.map((pwId: string) => (
                <div
                  key={pwId}
                  className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border flex items-center justify-between"
                >
                  <span className="font-semibold text-botanical-forest">
                    {pwId === "PW_001" ? "NF-kappa B Signaling Cascade" :
                     pwId === "PW_002" ? "Cellular Stress Response & Hsp90 Cycle" :
                     pwId === "PW_003" ? "Cholinergic Synaptic Clearance" :
                     pwId === "PW_004" ? "Arachidonic Acid & Eicosanoid Biosynthesis" :
                     "Nociceptive Sensory Ion Flux"}
                  </span>
                  <span className="text-[10px] font-mono text-botanical-charcoal-muted">
                    {pwId}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-botanical-parchment-border flex gap-3">
              <Link
                href="/ethnograph"
                className="flex-1 py-2 px-3 rounded-md bg-botanical-forest text-botanical-parchment text-xs font-medium text-center hover:bg-botanical-forest-mid transition-colors"
              >
                Inspect in Knowledge Graph
              </Link>
              <Link
                href="/phytodiscover"
                className="flex-1 py-2 px-3 rounded-md bg-botanical-amber text-botanical-forest-deep text-xs font-semibold text-center hover:bg-botanical-amber-glow transition-colors"
              >
                Inspect Phytochemicals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
