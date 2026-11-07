"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Network,
  BookOpen,
  FlaskConical,
  Layers,
  ShieldAlert,
  History,
  FileCheck2,
  ArrowRight,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import dynamic from "next/dynamic";
import { API_BASE } from "@/lib/api";

const CorollaGleam = dynamic(() => import("@/components/CorollaGleam"), {
  ssr: false,
  loading: () => (
    <div className="w-72 h-72 sm:w-80 sm:h-80 flex flex-col items-center justify-center rounded-full bg-botanical-forest/30 border border-botanical-amber/20">
      <div className="w-16 h-16 rounded-full border-2 border-botanical-amber/30 border-t-botanical-amber animate-spin" />
      <span className="text-[10px] font-mono text-botanical-sage-light mt-3 tracking-widest uppercase">
        Initializing Visualizer...
      </span>
    </div>
  ),
});

const ParticleField = dynamic(() => import("@/components/3d/ParticleField"), {
  ssr: false,
});

const MolecularOrb = dynamic(() => import("@/components/3d/MolecularOrb"), {
  ssr: false,
  loading: () => <div className="w-full h-44 bg-forest/20 rounded-xl animate-pulse" />,
});

const DepthCard = dynamic(() => import("@/components/3d/DepthCard"), {
  ssr: false,
});

export default function HomePage() {
  const [stats, setStats] = useState({
    plants: 5,
    compounds: 15,
    targets: 6,
    pathways: 5,
    diseases: 5,
    evidence_records: 8,
  });

  useEffect(() => {
    fetch(`${API_BASE}/evidence/summary/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.total_evidence_records) {
          setStats((prev) => ({ ...prev, evidence_records: data.total_evidence_records }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* Hero Section with CorollaGleam visual */}
      <section className="relative overflow-hidden rounded-2xl bg-botanical-forest-deep text-botanical-parchment p-8 sm:p-12 border border-botanical-forest-mid shadow-botanical-lg">
        {/* Subtle background ambient mesh and 3D Particle Field */}
        <div className="absolute inset-0 bg-dark-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <ParticleField count={160} className="w-full h-full" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanical-amber/20 border border-botanical-amber/40 text-botanical-amber text-xs font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BioCultural Intelligence Platform</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-botanical-parchment leading-tight">
              AYURGRAPH<span className="text-botanical-amber">-X</span>
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-botanical-sage-light/90">
              Connecting Traditional Knowledge with Molecular Science.
            </p>

            <p className="text-sm text-botanical-sage-light/80 max-w-xl leading-relaxed">
              An explainable scientific intelligence platform that bridges centuries of traditional botanical pharmacopeias with contemporary molecular targets, pathway biology, and biodiversity conservation.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/pathway"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-botanical-amber text-botanical-forest-deep font-semibold text-xs hover:bg-botanical-amber-glow transition-all shadow-md group"
              >
                <span>Launch Evidence Pathway Explorer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/ethnograph"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-botanical-forest border border-botanical-forest-mid text-botanical-parchment font-medium text-xs hover:bg-botanical-forest-light transition-all"
              >
                <Network className="w-4 h-4 text-botanical-sage-light" />
                <span>Explore EthnoGraph</span>
              </Link>
            </div>
          </div>

          {/* Signature CorollaGleam Interactive Component */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full flex items-center justify-center">
              <CorollaGleam className="w-72 h-72 sm:w-80 sm:h-80" bladeCount={24} interactive={true} />
            </div>
            <div className="text-[11px] font-mono text-botanical-sage-light/60 mt-1 tracking-wider text-center">
              COROLLA GLEAM • IRIDESCENT BOTANICAL VISUALIZER
            </div>
          </div>
        </div>
      </section>

      {/* Verified Scientific Metrics Banner */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Indexed Plants", value: stats.plants, desc: "Botanical taxonomy & synonyms" },
          { label: "Linked Compounds", value: stats.compounds, desc: "PubChem CIDs & 2D structures" },
          { label: "Molecular Targets", value: stats.targets, desc: "Human binding assays" },
          { label: "Biological Pathways", value: stats.pathways, desc: "Reactome & KEGG cascades" },
          { label: "Disease Indication", value: stats.diseases, desc: "Preclinical disease models" },
          { label: "Audited Evidence", value: stats.evidence_records, desc: "6-tier traceable provenance" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen"
          >
            <div className="text-2xl font-serif font-bold text-botanical-forest">{item.value}</div>
            <div className="text-xs font-semibold text-botanical-charcoal mt-0.5">{item.label}</div>
            <div className="text-[10px] text-botanical-charcoal-muted mt-1 leading-tight">{item.desc}</div>
          </div>
        ))}
      </section>

      {/* Signature Feature Highlight: Evidence-to-Discovery */}
      <section className="p-6 sm:p-8 rounded-2xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-botanical">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-botanical-parchment-border">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-botanical-amber-deep font-semibold">
              Signature Discovery Architecture
            </div>
            <h2 className="font-serif text-2xl font-bold text-botanical-forest mt-0.5">
              The 8-Stage Evidence-to-Discovery Chain
            </h2>
            <p className="text-xs text-botanical-charcoal-muted mt-1">
              Every transitional link is verified with source citations, assay conditions, and confidence grading.
            </p>
          </div>
          <Link
            href="/pathway"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-botanical-forest text-botanical-parchment text-xs font-medium hover:bg-botanical-forest-mid transition-colors"
          >
            <span>Interactive Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pathway Stepper Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { step: "01", name: "Traditional Use", icon: "Charaka Samhita", type: "Historical Record" },
            { step: "02", name: "Medicinal Plant", icon: "Withania somnifera", type: "Botanical Taxon" },
            { step: "03", name: "Plant Part", icon: "Dried Root", type: "Pharmacognosy" },
            { step: "04", name: "Phytochemical", icon: "Withaferin A", type: "PubChem CID: 265237" },
            { step: "05", name: "Biological Target", icon: "NFKB1 / Hsp90", type: "ChEMBL Assay" },
            { step: "06", name: "Pathway", icon: "NF-kB Signaling", type: "Reactome Pathway" },
            { step: "07", name: "Disease Evidence", icon: "Neuroinflammation", type: "Preclinical Model" },
            { step: "08", name: "Hypothesis", icon: "Testable Rationale", type: "Explainable Studio" },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border flex flex-col justify-between relative group hover:border-botanical-amber transition-colors"
            >
              <div>
                <div className="text-[10px] font-mono font-semibold text-botanical-amber-deep">{s.step}</div>
                <div className="text-xs font-bold text-botanical-forest mt-1">{s.name}</div>
                <div className="text-[11px] text-botanical-charcoal mt-0.5">{s.icon}</div>
              </div>
              <div className="text-[9px] font-mono text-botanical-charcoal-muted mt-2 pt-2 border-t border-botanical-parchment-border">
                {s.type}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8 Research Modules Grid */}
      <section className="space-y-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-botanical-charcoal-muted font-semibold">
            Scientific Toolset
          </div>
          <h2 className="font-serif text-2xl font-bold text-botanical-forest">
            Specialized Research Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "EthnoGraph",
              desc: "Multi-relational knowledge graph explorer with Cytoscape.js interactive layouts.",
              href: "/ethnograph",
              icon: Network,
              badge: "Graph Engine",
            },
            {
              title: "Knowledge Miner",
              desc: "Automated NLP literature entity extraction with researcher verification loop.",
              href: "/miner",
              icon: BookOpen,
              badge: "PubMed NLP",
            },
            {
              title: "PhytoDiscover",
              desc: "Phytochemical structure viewer and ChEMBL experimental bioactivity target profiles.",
              href: "/phytodiscover",
              icon: FlaskConical,
              badge: "PubChem & ChEMBL",
            },
            {
              title: "FormulaLab",
              desc: "Polyherbal formulation constituent analysis with remove-one ingredient matrix.",
              href: "/formulalab",
              icon: Layers,
              badge: "Polyherbal",
            },
            {
              title: "BioGuard",
              desc: "Geospatial biodiversity occurrence mapping and IUCN conservation status.",
              href: "/bioguard",
              icon: ShieldAlert,
              badge: "GBIF & Red List",
            },
            {
              title: "TimeLens",
              desc: "Historical Ayurvedic treaties vs modern PubMed peer-reviewed documentation timeline.",
              href: "/timelens",
              icon: History,
              badge: "Chronology",
            },
            {
              title: "EvidenceTrust",
              desc: "6-tier evidence classification auditor, PAINS contradiction detection, and data licences.",
              href: "/evidencetrust",
              icon: FileCheck2,
              badge: "Audit Panel",
            },
            {
              title: "Hypothesis Studio",
              desc: "Multi-factor explainable hypothesis ranking engine and downloadable research dossier.",
              href: "/hypotheses",
              icon: Sparkles,
              badge: "Explainable ML",
            },
          ].map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <DepthCard key={idx} depth={12} className="h-full">
                <Link
                  href={mod.href}
                  className="h-full p-5 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border hover:border-botanical-amber shadow-specimen hover:shadow-botanical transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-md bg-botanical-forest/10 border border-botanical-forest/20 flex items-center justify-center text-botanical-forest group-hover:bg-botanical-forest group-hover:text-botanical-parchment transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-botanical-parchment-surface text-botanical-charcoal-muted border border-botanical-parchment-border">
                        {mod.badge}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-botanical-forest group-hover:text-botanical-amber-deep transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-botanical-charcoal-muted mt-1.5 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-botanical-parchment-border flex items-center justify-between text-xs font-medium text-botanical-forest">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </DepthCard>
            );
          })}
        </div>
      </section>

      {/* Responsible Research & Ethics Disclaimer */}
      <section className="p-5 rounded-xl bg-botanical-forest text-botanical-parchment border border-botanical-forest-mid flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-botanical-amber" />
            <h4 className="font-serif text-sm font-semibold text-botanical-parchment">
              Responsible Ethnopharmacology & Traditional Knowledge Governance
            </h4>
          </div>
          <p className="text-xs text-botanical-sage-light/80 max-w-2xl leading-relaxed">
            AYURGRAPH-X is an exploratory hypothesis-generation platform for preclinical researchers. In compliance with the Nagoya Protocol and CITES biodiversity guidelines, traditional knowledge is credited to source communities, sensitive wild species coordinates are masked, and generated predictions never claim clinical cure.
          </p>
        </div>
        <Link
          href="/evidencetrust"
          className="shrink-0 px-3 py-1.5 rounded bg-botanical-forest-light border border-botanical-forest-mid text-xs text-botanical-parchment hover:bg-botanical-forest-mid transition-colors"
        >
          View Evidence Licences
        </Link>
      </section>
    </div>
  );
}
