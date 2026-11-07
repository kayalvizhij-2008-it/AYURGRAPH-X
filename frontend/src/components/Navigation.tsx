"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Network,
  BookOpen,
  FlaskConical,
  Layers,
  ShieldAlert,
  History,
  FileCheck2,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Info,
  X,
  Menu,
  ChevronRight
} from "lucide-react";
import { API_BASE } from "@/lib/api";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: Compass },
  { label: "EthnoGraph", href: "/ethnograph", icon: Network, badge: "Graph" },
  { label: "Knowledge Miner", href: "/miner", icon: BookOpen, badge: "NLP" },
  { label: "PhytoDiscover", href: "/phytodiscover", icon: FlaskConical, badge: "Bioactivity" },
  { label: "FormulaLab", href: "/formulalab", icon: Layers, badge: "Formulations" },
  { label: "BioGuard", href: "/bioguard", icon: ShieldAlert, badge: "IUCN / GBIF" },
  { label: "TimeLens", href: "/timelens", icon: History, badge: "Timeline" },
  { label: "EvidenceTrust", href: "/evidencetrust", icon: FileCheck2, badge: "Audit" },
  { label: "Hypothesis Studio", href: "/hypotheses", icon: Sparkles, badge: "Explainable" },
];

export default function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showEthicsModal, setShowEthicsModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathname]);

  // Click outside search container to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults && searchResults.total_hits > 0) {
        // Navigate to first hit across categories
        for (const cat of ["plants", "compounds", "targets", "pathways", "diseases", "formulations"]) {
          const items = searchResults.results[cat];
          if (items && items.length > 0) {
            router.push(items[0].url);
            setSearchQuery("");
            setSearchResults(null);
            setIsMobileSearchOpen(false);
            return;
          }
        }
      }
    } else if (e.key === "Escape") {
      setSearchQuery("");
      setSearchResults(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-botanical-parchment text-botanical-charcoal font-sans">
      {/* Top Research Header */}
      <header className="sticky top-0 z-40 bg-botanical-forest-deep text-botanical-parchment border-b border-botanical-forest-mid shadow-botanical px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-md md:hidden text-botanical-sage-light hover:text-botanical-parchment hover:bg-botanical-forest border border-botanical-forest-mid"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-md bg-botanical-amber/20 border border-botanical-amber/40 flex items-center justify-center text-botanical-amber group-hover:scale-105 transition-transform">
                <span className="font-serif font-bold text-lg leading-none">AX</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-semibold tracking-wide text-botanical-parchment">
                    AYURGRAPH<span className="text-botanical-amber">-X</span>
                  </span>
                  <span className="text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-botanical-forest-light/60 text-botanical-sage-light border border-botanical-forest-light">
                    Preclinical Intel
                  </span>
                </div>
                <p className="text-[11px] text-botanical-sage-light/70 hidden sm:block">
                  Connecting Traditional Knowledge with Molecular Science
                </p>
              </div>
            </Link>
          </div>

          {/* Global Scientific Search Bar (Desktop) */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-botanical-sage-light/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search plants, synonyms, compounds, targets, diseases... (Enter to go)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-botanical-forest-deep/90 border border-botanical-forest-mid focus:border-botanical-amber text-xs text-botanical-parchment pl-9 pr-8 py-2 rounded-md outline-none placeholder-botanical-sage-light/40 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSearchResults(null); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-botanical-sage-light/60 hover:text-botanical-parchment"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {searchResults && searchResults.total_hits > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-botanical-forest border border-botanical-forest-mid rounded-md shadow-2xl p-3 z-50 max-h-96 overflow-y-auto">
                <div className="text-[10px] uppercase tracking-wider text-botanical-amber font-mono mb-2 flex justify-between items-center">
                  <span>Found {searchResults.total_hits} results for &quot;{searchResults.query}&quot;</span>
                  <span className="text-[9px] text-botanical-sage-light/60">Press Enter for top result</span>
                </div>
                {Object.entries(searchResults.results as Record<string, any[]>).map(([category, items]) => {
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={category} className="mb-3">
                      <div className="text-[11px] font-semibold text-botanical-sage-light uppercase tracking-wider mb-1">
                        {category} ({items.length})
                      </div>
                      <div className="space-y-1">
                        {items.slice(0, 3).map((item: any) => (
                          <Link
                            key={item.id}
                            href={item.url}
                            onClick={() => { setSearchQuery(""); setSearchResults(null); }}
                            className="block px-2.5 py-1.5 rounded bg-botanical-forest-deep/60 hover:bg-botanical-forest-light text-xs text-botanical-parchment transition-colors"
                          >
                            <div className="font-medium text-botanical-parchment flex items-center justify-between">
                              <span>{item.title}</span>
                              <span className="text-[10px] font-mono text-botanical-amber/80">{item.match_type}</span>
                            </div>
                            <div className="text-[11px] text-botanical-sage-light/70 truncate">{item.subtitle}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Status & Ethics Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Icon Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-1.5 rounded-md md:hidden text-botanical-sage-light hover:text-botanical-parchment hover:bg-botanical-forest border border-botanical-forest-mid"
              aria-label="Toggle search bar"
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-botanical-forest border border-botanical-forest-mid text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-botanical-sage-light">Live Adapters:</span>
              <span className="font-mono text-botanical-amber">ChEMBL • PubChem • GBIF</span>
            </div>

            <button
              onClick={() => setShowEthicsModal(true)}
              className="flex items-center gap-1.5 text-xs text-botanical-sage-light hover:text-botanical-parchment px-2.5 py-1 rounded border border-botanical-forest-mid hover:border-botanical-amber/50 transition-colors"
              title="Traditional Knowledge & Research Ethics"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-botanical-amber" />
              <span className="hidden sm:inline">Nagoya Ethics</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown Bar */}
        {isMobileSearchOpen && (
          <div className="mt-3 pt-3 border-t border-botanical-forest-mid md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-botanical-sage-light/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search plants, compounds, targets... (Enter to go)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full bg-botanical-forest-deep border border-botanical-forest-mid focus:border-botanical-amber text-xs text-botanical-parchment pl-9 pr-8 py-2 rounded-md outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSearchResults(null); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-botanical-sage-light/60 hover:text-botanical-parchment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchResults && searchResults.total_hits > 0 && (
              <div className="mt-2 bg-botanical-forest border border-botanical-forest-mid rounded-md p-3 max-h-64 overflow-y-auto">
                <div className="text-[10px] uppercase tracking-wider text-botanical-amber font-mono mb-2">
                  Found {searchResults.total_hits} results
                </div>
                {Object.entries(searchResults.results as Record<string, any[]>).map(([category, items]) => {
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={category} className="mb-2">
                      <div className="text-[10px] font-semibold text-botanical-sage-light uppercase tracking-wider mb-1">
                        {category}
                      </div>
                      <div className="space-y-1">
                        {items.slice(0, 2).map((item: any) => (
                          <Link
                            key={item.id}
                            href={item.url}
                            onClick={() => {
                              setSearchQuery("");
                              setSearchResults(null);
                              setIsMobileSearchOpen(false);
                            }}
                            className="block px-2 py-1 rounded bg-botanical-forest-deep text-xs text-botanical-parchment"
                          >
                            <div className="font-medium flex justify-between">
                              <span>{item.title}</span>
                              <span className="text-[9px] font-mono text-botanical-amber">{item.match_type}</span>
                            </div>
                            <div className="text-[10px] text-botanical-sage-light/70 truncate">{item.subtitle}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Off-Canvas Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex">
          <div className="w-72 bg-botanical-parchment h-full shadow-2xl flex flex-col justify-between p-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-botanical-forest text-botanical-amber flex items-center justify-center font-serif font-bold text-sm">
                    AX
                  </div>
                  <span className="font-serif font-bold text-sm text-botanical-forest">
                    AYURGRAPH-X
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded text-botanical-charcoal-muted hover:text-botanical-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-[10px] font-mono uppercase tracking-wider text-botanical-charcoal-muted px-2 py-1 font-semibold">
                Research Modules
              </div>
              <nav className="mt-1 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                        isActive
                          ? "bg-botanical-forest text-botanical-parchment shadow-sm"
                          : "text-botanical-charcoal hover:bg-botanical-parchment-surface"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-botanical-amber" : "text-botanical-sage"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-botanical-parchment-surface text-botanical-charcoal-muted border border-botanical-parchment-border">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Signature Feature Button in Mobile */}
              <div className="mt-4 p-3 rounded-lg border border-botanical-amber/30 bg-botanical-amber-light/30">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-botanical-amber-deep">
                  <Sparkles className="w-3.5 h-3.5 text-botanical-amber" />
                  <span>Signature Pathway</span>
                </div>
                <p className="text-[11px] text-botanical-charcoal-muted mt-1 leading-snug">
                  8-stage traceable Evidence-to-Discovery chain.
                </p>
                <Link
                  href="/pathway"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center w-full py-1.5 px-2 bg-botanical-forest text-botanical-parchment text-xs font-medium rounded hover:bg-botanical-forest-mid transition-colors shadow-sm"
                >
                  Launch Pathway Explorer →
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-botanical-parchment-border text-[11px] text-botanical-charcoal-muted space-y-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowEthicsModal(true);
                }}
                className="w-full flex items-center justify-between p-2 rounded bg-botanical-parchment-surface text-botanical-forest font-medium text-xs mb-2"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-botanical-amber" />
                  <span>Nagoya Ethics Governance</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex justify-between">
                <span>Platform Version</span>
                <span className="font-mono text-botanical-charcoal">v1.0.0</span>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main App Layout: Sidebar + Workspace */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar (Desktop) */}
        <aside className="w-64 shrink-0 border-r border-botanical-parchment-border bg-botanical-parchment-card/60 p-4 hidden md:flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-botanical-charcoal-muted px-3 py-1 font-semibold">
              Research Modules
            </div>
            <nav className="mt-2 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? "bg-botanical-forest text-botanical-parchment shadow-sm"
                        : "text-botanical-charcoal hover:bg-botanical-parchment-surface hover:text-botanical-forest"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-botanical-amber" : "text-botanical-sage"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-botanical-forest-light text-botanical-amber"
                            : "bg-botanical-parchment-surface text-botanical-charcoal-muted border border-botanical-parchment-border"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Signature Feature Banner */}
            <div className="mt-6 p-3 rounded-lg border border-botanical-amber/30 bg-botanical-amber-light/40">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-botanical-amber-deep">
                <Sparkles className="w-3.5 h-3.5 text-botanical-amber" />
                <span>Signature Feature</span>
              </div>
              <p className="text-[11px] text-botanical-charcoal-muted mt-1 leading-relaxed">
                Explore the 8-stage traceable Evidence-to-Discovery chain from traditional text to molecular target.
              </p>
              <Link
                href="/pathway"
                className="mt-2.5 inline-flex items-center justify-center w-full py-1.5 px-2 bg-botanical-forest text-botanical-parchment text-xs font-medium rounded hover:bg-botanical-forest-mid transition-colors shadow-sm"
              >
                Launch Pathway Explorer →
              </Link>
            </div>
          </div>

          {/* Provenance Footer */}
          <div className="pt-4 border-t border-botanical-parchment-border text-[11px] text-botanical-charcoal-muted space-y-1">
            <div className="flex items-center justify-between">
              <span>Platform Version</span>
              <span className="font-mono text-botanical-charcoal">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>EthnoHack Edition</span>
              <span className="text-botanical-amber font-medium">2026</span>
            </div>
          </div>
        </aside>

        {/* Dynamic Page Workspace Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-botanical-parchment">
          {children}
        </main>
      </div>

      {/* Ethics & Nagoya Protocol Modal */}
      {showEthicsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-botanical-parchment max-w-xl w-full rounded-xl border border-botanical-parchment-border shadow-2xl p-6 relative">
            <button
              onClick={() => setShowEthicsModal(false)}
              className="absolute top-4 right-4 text-botanical-charcoal-muted hover:text-botanical-charcoal"
              aria-label="Close ethics modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-botanical-amber/10 border border-botanical-amber/30 flex items-center justify-center text-botanical-amber">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-botanical-forest">
                  BioCultural Ethics & Traditional Knowledge Governance
                </h3>
                <p className="text-xs text-botanical-charcoal-muted">
                  Compliance with the Nagoya Protocol on Access and Benefit Sharing
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-botanical-charcoal leading-relaxed">
              <div className="p-3 bg-botanical-parchment-surface rounded-md border border-botanical-parchment-border">
                <span className="font-semibold text-botanical-forest block mb-1">1. Community Attribution & Heritage Protection</span>
                Traditional medicinal knowledge is preserved from ancient pharmacopeias (Ayurveda, Siddha, Unani, Folk systems) and indigenous wisdom. AYURGRAPH-X functions solely as a research hypothesis engine and strictly disclaims exclusive ownership or patents over traditional indigenous practices.
              </div>

              <div className="p-3 bg-botanical-parchment-surface rounded-md border border-botanical-parchment-border">
                <span className="font-semibold text-botanical-forest block mb-1">2. Vulnerable Species Coordinate Masking</span>
                In accordance with IUCN and CITES safeguards, exact geospatial coordinates for endangered or vulnerable taxa (e.g. over-harvested wild medicinal roots) are blurred to regional administrative levels to prevent facilitating illicit bio-prospecting.
              </div>

              <div className="p-3 bg-botanical-parchment-surface rounded-md border border-botanical-parchment-border">
                <span className="font-semibold text-botanical-forest block mb-1">3. Non-Clinical Preclinical Research Boundary</span>
                All computed scores, binding predictions, and target linkages represent scientific hypotheses for laboratory testing. They must NEVER be interpreted as medical treatment recommendations or clinical claims.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowEthicsModal(false)}
                className="px-4 py-2 bg-botanical-forest text-botanical-parchment rounded text-xs font-medium hover:bg-botanical-forest-mid transition-colors"
              >
                I Understand & Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
