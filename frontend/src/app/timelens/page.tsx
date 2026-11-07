"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  History,
  Calendar,
  BookOpen,
  FlaskConical,
  Award,
  ExternalLink,
  ChevronRight
} from "lucide-react";

const TimeLens3D = dynamic(() => import("@/components/3d/TimeLens3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-2xl bg-botanical-forest/20 border border-botanical-sage/20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-botanical-amber/30 border-t-botanical-amber rounded-full animate-spin" />
      <span className="text-xs font-mono text-botanical-sage mt-2">Loading 3D Chronological Helix...</span>
    </div>
  ),
});

interface TimelineEvent {
  year: string;
  era: string;
  title: string;
  source: string;
  category: "Classical Treatise" | "Botanical Taxonomy" | "Phytochemical Isolation" | "Molecular Genomics";
  description: string;
  provenance_id?: string;
}

const CHRONOLOGY_EVENTS: TimelineEvent[] = [
  {
    year: "~700 BCE",
    era: "Vedic & Classical Ayurvedic Codification",
    title: "Codification of Medhya Rasayana Therapy in Charaka Samhita",
    source: "Charaka Samhita Chikitsasthana 1.1",
    category: "Classical Treatise",
    description: "Earliest systematic documentation of Withania somnifera (Ashwagandha) and Curcuma longa (Haridra) as foremost restorative and anti-inflammatory remedies for cognitive preservation and vitality.",
    provenance_id: "IMPPAT-PLANT: 412"
  },
  {
    year: "1753",
    era: "Linnaean Botanical Systematics",
    title: "Initial Binomial Classification as Physalis somnifera by Carl Linnaeus",
    source: "Species Plantarum, ed. 1: 182",
    category: "Botanical Taxonomy",
    description: "Carl Linnaeus classified the taxon under the genus Physalis based on its inflated calyx morphology, establishing the earliest modern botanical basionym.",
    provenance_id: "POWO: 821634-1"
  },
  {
    year: "1852",
    era: "Solanaceae Monographic Revision",
    title: "Reclassification to Withania somnifera by Michel Félix Dunal",
    source: "Prodromus Systematis Naturalis Regni Vegetabilis 13(1): 453",
    category: "Botanical Taxonomy",
    description: "Botanist Michel Félix Dunal established the distinct genus Withania in honor of British paleobotanist Henry Witham, establishing the accepted binomial used worldwide today.",
    provenance_id: "IPNI: urn:lsid:ipni.org:names:821634-1"
  },
  {
    year: "1965",
    era: "Natural Products Phytochemistry",
    title: "Isolation and Structural Elucidation of Withaferin A",
    source: "Lavie D., Glotter E., Shvo Y. - Journal of the Chemical Society",
    category: "Phytochemical Isolation",
    description: "First structural determination of Withaferin A as a prototype ergostane-type steroidal lactone (withanolide) exhibiting selective anti-tumor and cytotoxic properties in vitro.",
    provenance_id: "PubChem CID: 265237"
  },
  {
    year: "2001",
    era: "Molecular Target Pharmacology",
    title: "Elucidation of Curcuminoid Dual PTGS2 / ALOX5 Inhibition",
    source: "Cancer Research / Biochemical Pharmacology",
    category: "Molecular Genomics",
    description: "Direct binding assays revealed nanomolar-to-micromolar inhibition of cyclooxygenase-2 and 5-lipoxygenase, providing a mechanistic molecular explanation for traditional anti-arthritic indications.",
    provenance_id: "PMID: 11751489"
  },
  {
    year: "2009",
    era: "Chaperone & Proteasome Biology",
    title: "Discovery of Withaferin A Hsp90 and IKK Complex Target Engagement",
    source: "Biochemical Pharmacology / ChEMBL",
    category: "Molecular Genomics",
    description: "Surface plasmon resonance demonstrated high-affinity direct binding of Withaferin A to HSP90AA1 (Ki = 240 nM) and targeted inhibition of IKK phosphorylation, suppressing NF-kB driven neuroinflammation.",
    provenance_id: "PMID: 19800773"
  },
  {
    year: "2024",
    era: "Translational BioCultural Intelligence",
    title: "AYURGRAPH-X Unified Evidence-to-Discovery Platform",
    source: "EthnoHack Platform Initiative",
    category: "Molecular Genomics",
    description: "Integration of 3,000 years of ethnobotanical documentation with modern ChEMBL bioactivity assays, GBIF conservation data, and explainable multi-factor hypothesis generation.",
    provenance_id: "AX-2026-CORE"
  }
];

export default function TimeLensPage() {
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const filteredEvents = CHRONOLOGY_EVENTS.filter(
    (ev) => filterCategory === "ALL" || ev.category === filterCategory
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-forest/10 border border-botanical-forest/20 text-botanical-forest text-[11px] font-mono uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Module 6 — TimeLens</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
            Ethnobotanical Chronology & Synonym Evolution
          </h1>
          <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-xl leading-relaxed">
            Examine how traditional knowledge transformed from Vedic aphorisms through 18th-century taxonomy to 21st-century molecular target pharmacology.
          </p>
        </div>

        {/* Timeline Filter */}
        <div className="flex flex-wrap gap-1.5 bg-botanical-parchment p-1 rounded-lg border border-botanical-parchment-border">
          {["ALL", "Classical Treatise", "Botanical Taxonomy", "Phytochemical Isolation", "Molecular Genomics"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                filterCategory === cat
                  ? "bg-botanical-forest text-botanical-parchment shadow-sm"
                  : "text-botanical-charcoal-muted hover:text-botanical-forest"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Chronological Helix Visualizer */}
      <TimeLens3D className="w-full h-80 rounded-2xl" />

      {/* Vertical Interactive Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-botanical-parchment-border space-y-8">
        {filteredEvents.map((ev, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Node Marker */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-botanical-parchment border-2 border-botanical-amber group-hover:scale-125 group-hover:bg-botanical-amber transition-all shadow-sm" />

            {/* Event Card */}
            <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-3 hover:border-botanical-amber transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-botanical-amber-deep">
                    {ev.year}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-botanical-forest text-botanical-parchment">
                    {ev.category}
                  </span>
                </div>
                <span className="text-xs font-mono text-botanical-charcoal-muted">
                  {ev.era}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-botanical-forest leading-snug">
                  {ev.title}
                </h3>
                <div className="text-xs text-botanical-amber-deep font-mono mt-0.5">
                  Source: {ev.source}
                </div>
              </div>

              <p className="text-xs text-botanical-charcoal leading-relaxed">
                {ev.description}
              </p>

              {ev.provenance_id && (
                <div className="pt-2 border-t border-botanical-parchment-border text-[10px] font-mono text-botanical-charcoal-muted">
                  Registry Identifier: <span className="font-semibold text-botanical-forest">{ev.provenance_id}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
