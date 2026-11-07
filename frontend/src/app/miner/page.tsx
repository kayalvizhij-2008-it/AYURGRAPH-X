"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  Edit3,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileText,
  X
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const LiteratureMiner3D = dynamic(() => import("@/components/3d/LiteratureMiner3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-2xl bg-botanical-forest/20 border border-botanical-sage/20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-2 border-botanical-amber/30 border-t-botanical-amber rounded-full animate-spin" />
      <span className="text-xs font-mono text-botanical-sage mt-2">Loading 3D Literature Extraction Prism...</span>
    </div>
  ),
});

export default function KnowledgeMinerPage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("Withania somnifera neuroprotection");
  const [liveArticles, setLiveArticles] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customText, setCustomText] = useState("");
  const [extractedResult, setExtractedResult] = useState<any>(null);

  // Correction Modal State
  const [editingSnippet, setEditingSnippet] = useState<any>(null);
  const [editPlants, setEditPlants] = useState("");
  const [editCompounds, setEditCompounds] = useState("");
  const [editTargets, setEditTargets] = useState("");
  const [editDiseases, setEditDiseases] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const fetchSnippets = () => {
    fetch(`${API_BASE}/literature/snippets`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setSnippets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/literature/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setLiveArticles(data.data || []);
      }
    } catch (err) {
      console.error("Live search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExtractText = async () => {
    if (!customText.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/literature/extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customText, title: "Researcher Input Abstract" }),
      });
      if (res.ok) {
        const data = await res.json();
        setExtractedResult(data);
      }
    } catch (err) {
      console.error("Extraction error:", err);
    }
  };

  const handleReviewAction = async (snippetId: string, action: "accept" | "reject") => {
    try {
      const res = await fetch(`${API_BASE}/literature/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snippet_id: snippetId, action }),
      });
      if (res.ok) {
        fetchSnippets();
      }
    } catch (err) {
      console.error("Review action error:", err);
    }
  };

  const openCorrectionModal = (snip: any) => {
    setEditingSnippet(snip);
    setEditPlants((snip.extracted_entities.plants || []).join(", "));
    setEditCompounds((snip.extracted_entities.compounds || []).join(", "));
    setEditTargets((snip.extracted_entities.targets || []).join(", "));
    setEditDiseases((snip.extracted_entities.diseases || []).join(", "));
    setEditNotes("");
  };

  const saveCorrection = async () => {
    if (!editingSnippet) return;
    const corrected = {
      plants: editPlants.split(",").map((s) => s.trim()).filter(Boolean),
      compounds: editCompounds.split(",").map((s) => s.trim()).filter(Boolean),
      targets: editTargets.split(",").map((s) => s.trim()).filter(Boolean),
      diseases: editDiseases.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`${API_BASE}/literature/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          snippet_id: editingSnippet.id,
          action: "correct",
          corrected_entities: corrected,
          reviewer_notes: editNotes || "Researcher verified correction",
        }),
      });
      if (res.ok) {
        setEditingSnippet(null);
        fetchSnippets();
      }
    } catch (err) {
      console.error("Correction error:", err);
    }
  };

  const plantCount = new Set(snippets.flatMap((s) => s.extracted_entities?.plants || [])).size || 4;
  const compoundCount = new Set(snippets.flatMap((s) => s.extracted_entities?.compounds || [])).size || 7;
  const targetCount = new Set(snippets.flatMap((s) => s.extracted_entities?.targets || [])).size || 5;
  const diseaseCount = new Set(snippets.flatMap((s) => s.extracted_entities?.diseases || [])).size || 3;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Title Header */}
      <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-forest/10 border border-botanical-forest/20 text-botanical-forest text-[11px] font-mono uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Module 2 — Knowledge Miner</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
          Literature Discovery & Candidate Entity Extraction
        </h1>
        <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-2xl leading-relaxed">
          Extract, resolve, and audit candidate ethnopharmacological relationships from peer-reviewed literature. All NLP-extracted links require human-in-the-loop researcher verification.
        </p>
      </div>

      {/* 3D Literature Extraction Prism Visualizer */}
      <LiteratureMiner3D
        isScanning={isSearching}
        plantCount={plantCount}
        compoundCount={compoundCount}
        targetCount={targetCount}
        diseaseCount={diseaseCount}
        className="w-full h-72 rounded-2xl"
      />

      {/* Two Columns: Live PubMed Literature Search & Interactive Extraction Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live PubMed Search (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
            <h2 className="font-serif text-base font-bold text-botanical-forest flex items-center justify-between">
              <span>PubMed Live Search</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                NCBI E-utilities
              </span>
            </h2>

            <form onSubmit={handleLiveSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PubMed..."
                className="flex-1 bg-botanical-parchment border border-botanical-parchment-border rounded-md px-3 py-2 text-xs outline-none focus:border-botanical-amber"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-3 py-2 rounded-md bg-botanical-forest text-botanical-parchment text-xs font-medium hover:bg-botanical-forest-mid transition-colors shrink-0"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </form>

            {liveArticles.length > 0 ? (
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-botanical-charcoal-muted">
                  Retrieved Articles ({liveArticles.length})
                </div>
                {liveArticles.map((art: any) => (
                  <div
                    key={art.pmid}
                    className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-1.5"
                  >
                    <a
                      href={art.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-serif font-bold text-xs text-botanical-forest hover:text-botanical-amber line-clamp-2"
                    >
                      {art.title}
                    </a>
                    <div className="text-[10px] text-botanical-charcoal-muted truncate">
                      {art.authors} • {art.source} ({art.pubdate})
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                      <span className="text-botanical-amber-deep">PMID: {art.pmid}</span>
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-botanical-forest flex items-center gap-1 hover:underline"
                      >
                        <span>Open NCBI</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-botanical-charcoal-muted py-4 text-center">
                Search PubMed live to inspect recent articles and extract molecular associations.
              </div>
            )}
          </div>

          {/* Ad-Hoc Text Extraction Workbench */}
          <div className="p-5 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-3">
            <h3 className="font-serif text-sm font-bold text-botanical-forest">
              Ad-Hoc Abstract Entity Extraction
            </h3>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste scientific abstract or trial excerpt here..."
              rows={4}
              className="w-full bg-botanical-parchment border border-botanical-parchment-border rounded-md p-2.5 text-xs outline-none focus:border-botanical-amber"
            />
            <button
              onClick={handleExtractText}
              className="w-full py-2 rounded-md bg-botanical-amber text-botanical-forest-deep text-xs font-semibold hover:bg-botanical-amber-glow transition-colors"
            >
              Run Rule-Based NER Extractor
            </button>

            {extractedResult && (
              <div className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-2 text-xs">
                <div className="font-semibold text-botanical-forest">Extraction Output (Awaiting Verification):</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-botanical-charcoal-muted block">Plants:</span>
                    <span className="font-medium text-emerald-800">{extractedResult.extracted_entities.plants?.join(", ") || "None"}</span>
                  </div>
                  <div>
                    <span className="text-botanical-charcoal-muted block">Compounds:</span>
                    <span className="font-medium text-amber-800">{extractedResult.extracted_entities.compounds?.join(", ") || "None"}</span>
                  </div>
                  <div>
                    <span className="text-botanical-charcoal-muted block">Targets:</span>
                    <span className="font-medium text-blue-800">{extractedResult.extracted_entities.targets?.join(", ") || "None"}</span>
                  </div>
                  <div>
                    <span className="text-botanical-charcoal-muted block">Diseases:</span>
                    <span className="font-medium text-red-800">{extractedResult.extracted_entities.diseases?.join(", ") || "None"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Candidate Snippets & Human Review Loop (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-botanical-forest">
              Verification Loop: Candidate Evidence Snippets
            </h2>
            <span className="text-xs font-mono text-botanical-charcoal-muted">
              {snippets.length} Indexed Records
            </span>
          </div>

          <div className="space-y-4">
            {snippets.map((snip: any) => {
              const isAccepted = snip.verification_status === "Accepted";
              const isRejected = snip.verification_status === "Rejected";

              return (
                <div
                  key={snip.id}
                  className="p-5 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-botanical-amber-deep font-semibold">
                        PMID: {snip.pmid} • {snip.journal} ({snip.publication_year})
                      </span>
                      <h3 className="font-serif text-sm font-bold text-botanical-forest mt-0.5 leading-snug">
                        {snip.title}
                      </h3>
                      <div className="text-[11px] text-botanical-charcoal-muted mt-0.5">
                        {snip.authors}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 ${
                        isAccepted
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : isRejected
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {snip.verification_status}
                    </span>
                  </div>

                  {/* Abstract Snippet */}
                  <div className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border text-xs italic text-botanical-charcoal leading-relaxed">
                    &quot;{snip.abstract}&quot;
                  </div>

                  {/* Extracted Entity Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-botanical-charcoal-muted">
                      Machine-Extracted Candidate Entities:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {snip.extracted_entities.plants?.map((p: string) => (
                        <span key={p} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono text-[10px]">
                          Plant: {p}
                        </span>
                      ))}
                      {snip.extracted_entities.compounds?.map((c: string) => (
                        <span key={c} className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-mono text-[10px]">
                          Compound: {c}
                        </span>
                      ))}
                      {snip.extracted_entities.targets?.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-mono text-[10px]">
                          Target: {t}
                        </span>
                      ))}
                      {snip.extracted_entities.diseases?.map((d: string) => (
                        <span key={d} className="px-2 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200 font-mono text-[10px]">
                          Disease: {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reviewer Action Buttons */}
                  <div className="pt-2 border-t border-botanical-parchment-border flex items-center justify-between">
                    <div className="text-[10px] font-mono text-botanical-charcoal-muted">
                      Annotated by: {snip.annotated_by || "RuleBasedExtractor v1.0"}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openCorrectionModal(snip)}
                        className="px-2.5 py-1 rounded bg-botanical-forest border border-botanical-forest-light text-botanical-parchment text-xs font-medium flex items-center gap-1 hover:bg-botanical-forest-mid transition-colors"
                        title="Edit and correct extracted entities"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-botanical-amber" />
                        <span>Correct</span>
                      </button>
                      <button
                        onClick={() => handleReviewAction(snip.id, "accept")}
                        className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Accept relationship as verified"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Link</span>
                      </button>
                      <button
                        onClick={() => handleReviewAction(snip.id, "reject")}
                        className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-800 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Reject spurious link"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Researcher Entity Correction Modal */}
      {editingSnippet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-botanical-parchment max-w-lg w-full rounded-xl border border-botanical-parchment-border shadow-2xl p-6 relative space-y-4">
            <button
              onClick={() => setEditingSnippet(null)}
              className="absolute top-4 right-4 text-botanical-charcoal-muted hover:text-botanical-charcoal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-botanical-amber" />
              <h3 className="font-serif text-lg font-bold text-botanical-forest">
                Correct Candidate Entities
              </h3>
            </div>

            <p className="text-xs text-botanical-charcoal-muted">
              Manually correct or resolve entities extracted from PMID {editingSnippet.pmid}. Comma-separate multiple entries.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-botanical-forest block mb-1">
                  Plants (Botanical / Traditional):
                </label>
                <input
                  type="text"
                  value={editPlants}
                  onChange={(e) => setEditPlants(e.target.value)}
                  className="w-full bg-botanical-parchment-card border border-botanical-parchment-border rounded px-3 py-1.5 text-xs outline-none focus:border-botanical-amber"
                />
              </div>

              <div>
                <label className="font-semibold text-botanical-forest block mb-1">
                  Phytochemical Compounds:
                </label>
                <input
                  type="text"
                  value={editCompounds}
                  onChange={(e) => setEditCompounds(e.target.value)}
                  className="w-full bg-botanical-parchment-card border border-botanical-parchment-border rounded px-3 py-1.5 text-xs outline-none focus:border-botanical-amber"
                />
              </div>

              <div>
                <label className="font-semibold text-botanical-forest block mb-1">
                  Molecular Targets:
                </label>
                <input
                  type="text"
                  value={editTargets}
                  onChange={(e) => setEditTargets(e.target.value)}
                  className="w-full bg-botanical-parchment-card border border-botanical-parchment-border rounded px-3 py-1.5 text-xs outline-none focus:border-botanical-amber"
                />
              </div>

              <div>
                <label className="font-semibold text-botanical-forest block mb-1">
                  Disease Indications:
                </label>
                <input
                  type="text"
                  value={editDiseases}
                  onChange={(e) => setEditDiseases(e.target.value)}
                  className="w-full bg-botanical-parchment-card border border-botanical-parchment-border rounded px-3 py-1.5 text-xs outline-none focus:border-botanical-amber"
                />
              </div>

              <div>
                <label className="font-semibold text-botanical-forest block mb-1">
                  Reviewer Notes:
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Corrected synonym to accepted taxon"
                  className="w-full bg-botanical-parchment-card border border-botanical-parchment-border rounded px-3 py-1.5 text-xs outline-none focus:border-botanical-amber"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-botanical-parchment-border flex justify-end gap-2">
              <button
                onClick={() => setEditingSnippet(null)}
                className="px-3 py-1.5 rounded bg-botanical-parchment border border-botanical-parchment-border text-xs text-botanical-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={saveCorrection}
                className="px-4 py-1.5 rounded bg-botanical-forest text-botanical-parchment text-xs font-semibold hover:bg-botanical-forest-mid"
              >
                Save & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
