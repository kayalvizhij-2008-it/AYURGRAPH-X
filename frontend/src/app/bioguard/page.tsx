"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  Globe2,
  ShieldCheck,
  AlertCircle,
  MapPin,
  ExternalLink,
  Info,
  CheckCircle2,
  Navigation as NavigationIcon,
  Layers
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import dynamic from "next/dynamic";

const BioGlobe3D = dynamic(() => import("@/components/3d/BioGlobe3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 rounded-xl bg-botanical-forest/30 border border-botanical-sage/20 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-botanical-amber/30 border-t-botanical-amber rounded-full animate-spin" />
      <span className="text-[10px] font-mono text-botanical-sage mt-2">Loading 3D Terrestrial BioGlobe...</span>
    </div>
  ),
});

function BioGuardContent() {
  const searchParams = useSearchParams();
  const urlPlant = searchParams.get("plant");

  const [plants, setPlants] = useState<any[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string>(urlPlant || "PLANT_001");
  const [bioProfile, setBioProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOcc, setSelectedOcc] = useState<any>(null);
  const [mapDimension, setMapDimension] = useState<"3D" | "2D">("3D");

  useEffect(() => {
    fetch(`${API_BASE}/plants`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPlants(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (urlPlant) {
      setSelectedPlantId(urlPlant);
    }
  }, [urlPlant]);

  useEffect(() => {
    if (!selectedPlantId) return;
    setLoading(true);
    setSelectedOcc(null);
    fetch(`${API_BASE}/biodiversity/${selectedPlantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setBioProfile(data);
        if (data?.occurrences?.length > 0) {
          setSelectedOcc(data.occurrences[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Biodiversity profile error:", err);
        setLoading(false);
      });
  }, [selectedPlantId]);

  // Dynamic projection bounds calculated from actual occurrence coordinates
  const bounds = useMemo(() => {
    if (!bioProfile?.occurrences || bioProfile.occurrences.length === 0) {
      return { minLat: 5, maxLat: 35, minLon: 65, maxLon: 95 };
    }
    const lats = bioProfile.occurrences.map((o: any) => o.latitude).filter((n: any) => typeof n === "number");
    const lons = bioProfile.occurrences.map((o: any) => o.longitude).filter((n: any) => typeof n === "number");
    if (lats.length === 0 || lons.length === 0) {
      return { minLat: 5, maxLat: 35, minLon: 65, maxLon: 95 };
    }
    const minLat = Math.min(...lats) - 2.5;
    const maxLat = Math.max(...lats) + 2.5;
    const minLon = Math.min(...lons) - 3.5;
    const maxLon = Math.max(...lons) + 3.5;
    return {
      minLat: Math.floor(minLat),
      maxLat: Math.ceil(maxLat),
      minLon: Math.floor(minLon),
      maxLon: Math.ceil(maxLon)
    };
  }, [bioProfile]);

  const projectCoords = (lat: number, lon: number) => {
    const latSpan = Math.max(1, bounds.maxLat - bounds.minLat);
    const lonSpan = Math.max(1, bounds.maxLon - bounds.minLon);

    const x = ((lon - bounds.minLon) / lonSpan) * 100;
    const y = (1 - (lat - bounds.minLat) / latSpan) * 100;

    return {
      x: Math.max(6, Math.min(94, x)),
      y: Math.max(6, Math.min(94, y)),
    };
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Title & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-botanical-forest/10 border border-botanical-forest/20 text-botanical-forest text-[11px] font-mono uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Module 5 — BioGuard</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-forest">
            Biodiversity & Conservation Intelligence
          </h1>
          <p className="text-xs text-botanical-charcoal-muted mt-1 max-w-xl leading-relaxed">
            Monitor botanical species occurrences via GBIF, evaluate IUCN Red List status, and enforce wild germplasm protection safeguards.
          </p>
        </div>

        {/* Species Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-botanical-charcoal shrink-0">
            Botanical Taxon:
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
          Retrieving GBIF occurrences and conservation assessments...
        </div>
      ) : bioProfile ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: IUCN Assessment & Cultivation Policy (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* IUCN Status Card */}
            <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border">
                <span className="text-[10px] font-mono uppercase text-botanical-amber-deep font-semibold">
                  IUCN Threat Assessment
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold border ${
                  bioProfile.conservation_assessment?.status_code === "VU" || bioProfile.conservation_assessment?.status_code === "EN"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-200"
                }`}>
                  {bioProfile.conservation_assessment?.status_code || "LC"}
                </span>
              </div>

              <div>
                <h2 className="font-serif text-xl font-bold text-botanical-forest">
                  {bioProfile.scientific_name}
                </h2>
                <div className="text-xs text-botanical-charcoal-muted mt-0.5">
                  Family: <strong className="text-botanical-forest">{bioProfile.family}</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-botanical-parchment border border-botanical-parchment-border space-y-1.5 text-xs">
                <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                  Conservation Category
                </span>
                <span className="font-semibold text-botanical-forest block text-sm">
                  {bioProfile.conservation_assessment?.status_label || "Assessment unavailable"}
                </span>
                <p className="text-botanical-charcoal-muted leading-relaxed">
                  {bioProfile.conservation_assessment?.threat_summary || "No specific regional threat warning logged."}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Cultivation-First Research Guidance</span>
                </div>
                <p className="leading-relaxed">
                  {bioProfile.conservation_assessment?.cultivation_recommendation || "Maintain standard sustainable sourcing protocols."}
                </p>
              </div>

              <div className="pt-2 border-t border-botanical-parchment-border text-[10px] font-mono text-botanical-charcoal-muted flex justify-between">
                <span>Assessment Year: {bioProfile.conservation_assessment?.assessment_year || 2021}</span>
                <span>Source: {bioProfile.conservation_assessment?.source}</span>
              </div>
            </div>

            {/* Nagoya Protocol & Coordinate Protection Safeguard */}
            <div className="p-5 rounded-xl bg-botanical-forest text-botanical-parchment border border-botanical-forest-mid shadow-botanical space-y-2 text-xs">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-botanical-amber">
                <ShieldCheck className="w-4 h-4" />
                <span>Geospatial Safeguard Protocol</span>
              </div>
              <p className="text-botanical-sage-light/80 leading-relaxed text-[11px]">
                {bioProfile.responsible_conservation_note}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Geospatial Occurrence Map & Records (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-xl bg-botanical-parchment-card border border-botanical-parchment-border shadow-specimen space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-botanical-parchment-border">
                <div>
                  <h3 className="font-serif text-lg font-bold text-botanical-forest flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-botanical-forest" />
                    <span>Interactive Distribution Map & Occurrences</span>
                  </h3>
                  <p className="text-xs text-botanical-charcoal-muted mt-0.5">
                    Verified botanical observation records from Global Biodiversity Information Facility.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-botanical-parchment p-0.5 rounded border border-botanical-parchment-border">
                    <button
                      type="button"
                      onClick={() => setMapDimension("3D")}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                        mapDimension === "3D" ? "bg-botanical-forest text-botanical-parchment font-semibold" : "text-botanical-charcoal"
                      }`}
                    >
                      3D Globe
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapDimension("2D")}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                        mapDimension === "2D" ? "bg-botanical-forest text-botanical-parchment font-semibold" : "text-botanical-charcoal"
                      }`}
                    >
                      2D Projection
                    </button>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-botanical-forest text-botanical-parchment">
                    {bioProfile.source_state}
                  </span>
                </div>
              </div>

              {mapDimension === "3D" ? (
                <div className="w-full h-72">
                  <BioGlobe3D
                    occurrences={bioProfile.occurrences || []}
                    isSensitiveSpecies={bioProfile.is_sensitive_species || false}
                    selectedOcc={selectedOcc}
                    onSelectOcc={(occ) => setSelectedOcc(occ)}
                    className="w-full h-full rounded-xl"
                  />
                </div>
              ) : (
                /* Interactive Visual Geospatial Projection Map */
                <div className="relative w-full h-64 rounded-xl bg-botanical-forest-deep border border-botanical-forest-mid overflow-hidden p-3 shadow-inner">
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 bg-dark-grid opacity-20 pointer-events-none" />

                  <div className="absolute top-2 left-2 z-10 text-[9px] font-mono text-botanical-sage-light/70 uppercase tracking-wider">
                    GBIF Geospatial Projection (Lat: {bounds.minLat}°N - {bounds.maxLat}°N, Lon: {bounds.minLon}°E - {bounds.maxLon}°E)
                  </div>

                {/* Protective centroid indicator */}
                {bioProfile.is_sensitive_species && (
                  <div className="absolute top-2 right-2 z-10 text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Active Coordinate Masking (Fuzzed)
                  </div>
                )}

                {/* Simulated Geographic Basin SVG Outline */}
                <svg className="w-full h-full opacity-40 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 15,15 Q 50,20 85,15 Q 90,45 65,70 Q 50,88 45,95 Q 40,88 30,70 Q 10,45 15,15 Z"
                    fill="none"
                    stroke="#5D7A68"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                </svg>

                {/* Occurrence Pin Coordinates */}
                {bioProfile.occurrences?.map((occ: any, idx: number) => {
                  const proj = projectCoords(occ.latitude, occ.longitude);
                  const isSelected = selectedOcc?.key === occ.key;
                  return (
                    <button
                      key={occ.key || idx}
                      onClick={() => setSelectedOcc(occ)}
                      style={{ left: `${proj.x}%`, top: `${proj.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                        isSelected ? "scale-150 z-20" : "scale-100 hover:scale-125 z-10"
                      }`}
                      title={`${occ.state_province}, ${occ.country} (${occ.latitude}°, ${occ.longitude}°)`}
                      aria-label={`Occurrence at ${occ.state_province}, ${occ.country}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className={`w-3 h-3 rounded-full ${isSelected ? "bg-botanical-amber animate-ping absolute" : ""}`} />
                        <span className={`w-2.5 h-2.5 rounded-full border border-white ${
                          isSelected ? "bg-botanical-amber" : "bg-emerald-400"
                        }`} />
                      </div>
                    </button>
                  );
                })}

                {/* Map Bottom Active Pin Details */}
                {selectedOcc && (
                  <div className="absolute bottom-2 left-2 right-2 bg-botanical-forest/90 backdrop-blur-sm border border-botanical-forest-light p-2 rounded-md text-[11px] text-botanical-parchment flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-botanical-amber">
                        {selectedOcc.state_province || "Regional Basin"}, {selectedOcc.country}
                      </span>
                      <span className="text-[10px] text-botanical-sage-light ml-2">
                        {selectedOcc.latitude}°, {selectedOcc.longitude}°
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-botanical-sage-light/80">
                      Year: {selectedOcc.year || "Historical"} • {selectedOcc.basis_of_record}
                    </span>
                  </div>
                )}
              </div>
              )}

              {/* Coordinate Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-botanical-parchment-border text-[10px] font-mono uppercase text-botanical-charcoal-muted">
                      <th className="py-2 px-3">Location / Region</th>
                      <th className="py-2 px-3">Country</th>
                      <th className="py-2 px-3">Coordinates (Lat / Lon)</th>
                      <th className="py-2 px-3">Basis of Record</th>
                      <th className="py-2 px-3">Observation Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-botanical-parchment-border">
                    {bioProfile.occurrences?.map((occ: any, idx: number) => {
                      const isSelected = selectedOcc?.key === occ.key;
                      return (
                        <tr
                          key={idx}
                          onClick={() => setSelectedOcc(occ)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-botanical-amber/10 font-semibold" : "hover:bg-botanical-parchment-surface"
                          }`}
                        >
                          <td className="py-2.5 px-3 font-medium text-botanical-forest flex items-center gap-1.5">
                            <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-botanical-amber" : "text-botanical-sage"}`} />
                            <span>{occ.state_province || "Regional Basin"}</span>
                          </td>
                          <td className="py-2.5 px-3 text-botanical-charcoal">
                            {occ.country} ({occ.country_code})
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-botanical-forest">
                            {occ.latitude}°, {occ.longitude}°
                            {occ.coordinate_fuzzed && (
                              <span className="ml-1 text-[9px] text-amber-600 font-sans">(Fuzzed)</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[10px] text-botanical-charcoal-muted">
                            {occ.basis_of_record}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-botanical-charcoal-muted">
                            {occ.year || "Historical"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Habitat & Distribution Text */}
              <div className="pt-3 border-t border-botanical-parchment-border space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                    Habitat Ecology
                  </span>
                  <p className="text-botanical-charcoal mt-0.5 leading-relaxed">
                    {bioProfile.habitat_description}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-botanical-charcoal-muted block">
                    Regional Native Range
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bioProfile.geographic_distribution?.map((geo: string) => (
                      <span
                        key={geo}
                        className="px-2 py-0.5 rounded bg-botanical-parchment border border-botanical-parchment-border font-mono text-[10px] text-botanical-forest"
                      >
                        {geo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function BioGuardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-botanical-charcoal-muted">Loading BioGuard...</div>}>
      <BioGuardContent />
    </Suspense>
  );
}
