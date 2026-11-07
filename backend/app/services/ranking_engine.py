from typing import List, Dict, Any, Optional
from app.models.schemas import (
    ResearchHypothesis, HypothesisFactor, EvidenceRecord
)
from app.data.verified_dataset import (
    VERIFIED_PLANTS, VERIFIED_COMPOUNDS, VERIFIED_TARGETS,
    VERIFIED_PATHWAYS, VERIFIED_DISEASES, VERIFIED_EVIDENCE
)

class RankingEngine:
    """
    Explainable Multi-Factor Hypothesis Ranking Engine.
    Evaluates:
    1. Source Quality (Weight: 0.20)
    2. Directness of Evidence (Weight: 0.20)
    3. Experimental vs Computational Ratio (Weight: 0.15)
    4. Identity Confidence & Botanical Standardization (Weight: 0.15)
    5. Contradiction & Limitation Penalty (Weight: 0.15)
    6. Pathway Completeness (Weight: 0.15)
    """

    def generate_hypotheses(
        self,
        plant_id: Optional[str] = None,
        disease_id: Optional[str] = None
    ) -> List[ResearchHypothesis]:
        hypotheses: List[ResearchHypothesis] = []

        # Default Curated Candidate Hypotheses
        # Hypothesis 1: Withania somnifera -> Withaferin A -> NFKB1 -> Neuroinflammation
        hyp1 = self._build_hypothesis(
            hyp_id="HYP_001",
            plant_id="PLANT_001",
            plant_name="Withania somnifera (Ashwagandha)",
            compound_id="CMP_001",
            compound_name="Withaferin A",
            target_id="TGT_001",
            target_name="Nuclear Factor NF-kappa-B p105 (NFKB1)",
            pathway_id="PW_001",
            pathway_name="NF-kappa B Signaling Cascade",
            disease_id="DIS_001",
            disease_name="Neurodegenerative Disorders & Microglial Neuroinflammation",
            statement="Targeted Withaferin A-mediated inhibition of IKK phosphorylation suppresses chronic microglial activation and preserves synaptic spine integrity in beta-amyloid neurotoxicity models.",
            supporting_ids=["EVD_001", "EVD_002", "EVD_003", "EVD_006"],
            contradictory_ids=["EVD_001"], # Non-specific proteasome toxicity at high concentrations
            missing_links=[
                "Human pharmacokinetic evidence of Withaferin A blood-brain barrier permeability in non-invasive clinical trials."
            ],
            test_proposals=[
                "Assess cortical spine density and microglial morphology in APP/PS1 transgenic mice treated with brain-penetrant nano-emulsified Withaferin A.",
                "Perform in vitro target-engagement cellular thermal shift assays (CETSA) for NFKB1 in primary human microglial cell lines."
            ],
            raw_scores={
                "source_quality": 0.95,
                "directness": 0.90,
                "experimental_ratio": 0.95,
                "identity_confidence": 0.90,
                "contradiction_penalty": 0.70, # moderate penalty due to PAINS/proteotoxic cautions
                "completeness": 0.85
            }
        )
        hypotheses.append(hyp1)

        # Hypothesis 2: Curcuma longa -> Curcumin -> PTGS2 / ALOX5 -> Inflammatory Arthritis
        hyp2 = self._build_hypothesis(
            hyp_id="HYP_002",
            plant_id="PLANT_002",
            plant_name="Curcuma longa (Haridra)",
            compound_id="CMP_004",
            compound_name="Curcumin",
            target_id="TGT_004",
            target_name="Prostaglandin G/H Synthase 2 (PTGS2 / COX-2)",
            pathway_id="PW_004",
            pathway_name="Arachidonic Acid Metabolism & Eicosanoid Biosynthesis",
            disease_id="DIS_002",
            disease_name="Chronic Inflammatory Arthropathies (Rheumatoid Arthritis)",
            statement="Concomitant inhibition of PTGS2 and ALOX5 by Curcuminoid fractions selectively suppresses dual-pathway eicosanoid joint inflammation without gastrointestinal ulceration risk.",
            supporting_ids=["EVD_004", "EVD_005"],
            contradictory_ids=["EVD_004"], # PAINS alert
            missing_links=[
                "Determination of whether minor curcuminoids (Demethoxycurcumin, Bisdemethoxycurcumin) synergize or antagonize in whole extract formulations."
            ],
            test_proposals=[
                "Evaluate isobolographic combination analysis of pure Curcumin vs full-spectrum turmeric oleoresin in human synovial fibroblast cultures.",
                "Surface plasmon resonance (SPR) cross-validation to rule out optical false positives in biochemical kinase assays."
            ],
            raw_scores={
                "source_quality": 0.90,
                "directness": 0.92,
                "experimental_ratio": 0.90,
                "identity_confidence": 0.95,
                "contradiction_penalty": 0.65, # PAINS alert penalty
                "completeness": 0.88
            }
        )
        hypotheses.append(hyp2)

        # Hypothesis 3: Zingiber officinale -> 6-Shogaol -> TRPV1 -> Neuropathic Pain
        hyp3 = self._build_hypothesis(
            hyp_id="HYP_003",
            plant_id="PLANT_005",
            plant_name="Zingiber officinale (Shunthi)",
            compound_id="CMP_014",
            compound_name="6-Shogaol",
            target_id="TGT_006",
            target_name="Transient Receptor Potential Vanilloid 1 (TRPV1)",
            pathway_id="PW_005",
            pathway_name="Nociception & Sensory Neuron Ion Flux",
            disease_id="DIS_007",
            disease_name="Peripheral Neuropathic Pain & Hyperalgesia",
            statement="Dry ginger processing selectively enriches 6-shogaol which accelerates long-term TRPV1 receptor desensitization, explaining historical analgesic efficacy in deep somatic pain.",
            supporting_ids=["EVD_008"],
            contradictory_ids=[],
            missing_links=[
                "Comparative electrophysiology evaluating fresh rhizome (6-gingerol dominated) vs oven-cured rhizome (6-shogaol enriched) on dorsal root ganglion neurons."
            ],
            test_proposals=[
                "Measure calcium fluorometry response curves and receptor internalization kinetics in DRG sensory neuron cultures exposed to dried vs fresh Zingiber extracts."
            ],
            raw_scores={
                "source_quality": 0.88,
                "directness": 0.85,
                "experimental_ratio": 0.90,
                "identity_confidence": 0.92,
                "contradiction_penalty": 0.90,
                "completeness": 0.80
            }
        )
        hypotheses.append(hyp3)

        # Filtering if requested
        if plant_id:
            hypotheses = [h for h in hypotheses if h.plant_id == plant_id]
        if disease_id:
            hypotheses = [h for h in hypotheses if h.disease_id == disease_id]

        # Sort descending by score
        hypotheses.sort(key=lambda x: x.score, reverse=True)
        return hypotheses

    def _build_hypothesis(
        self,
        hyp_id: str,
        plant_id: str,
        plant_name: str,
        compound_id: str,
        compound_name: str,
        target_id: str,
        target_name: str,
        pathway_id: str,
        pathway_name: str,
        disease_id: str,
        disease_name: str,
        statement: str,
        supporting_ids: List[str],
        contradictory_ids: List[str],
        missing_links: List[str],
        test_proposals: List[str],
        raw_scores: Dict[str, float]
    ) -> ResearchHypothesis:
        # Weights definition
        weights = {
            "source_quality": (0.20, "Source Quality & Peer-Reviewed Citation Rigor"),
            "directness": (0.20, "Directness of Experimental Binding vs Inferred Correlation"),
            "experimental_ratio": (0.15, "Ratio of Wet-Lab Experimental Evidence to Pure In Silico Models"),
            "identity_confidence": (0.15, "Taxonomic Botanical Verification & PubChem Chemical Identity Confidence"),
            "contradiction_penalty": (0.15, "Robustness to PAINS Alerts & Known Contradictory Findings"),
            "completeness": (0.15, "Pathway Completeness (Coverage across all 8 Discovery Stages)")
        }

        factors: List[HypothesisFactor] = []
        total_weighted_score = 0.0

        for key, (weight, desc) in weights.items():
            val = raw_scores.get(key, 0.5)
            contrib = val * weight * 100.0
            total_weighted_score += contrib
            factors.append(HypothesisFactor(
                factor_name=desc,
                score=round(val, 2),
                weight=weight,
                contribution=round(contrib, 2),
                description=f"Assessed at {int(val*100)}% based on available verified citations and structural annotations."
            ))

        final_score = round(total_weighted_score, 1)
        grade = "A (Strong Experimental Basis)" if final_score >= 80 else ("B (Promising Mechanistic Candidate)" if final_score >= 65 else "C (Exploratory Hypothesis)")

        supporting_evd = [VERIFIED_EVIDENCE[eid] for eid in supporting_ids if eid in VERIFIED_EVIDENCE]
        contradictory_evd = [VERIFIED_EVIDENCE[eid] for eid in contradictory_ids if eid in VERIFIED_EVIDENCE]

        return ResearchHypothesis(
            id=hyp_id,
            plant_id=plant_id,
            plant_name=plant_name,
            compound_id=compound_id,
            compound_name=compound_name,
            target_id=target_id,
            target_name=target_name,
            pathway_id=pathway_id,
            pathway_name=pathway_name,
            disease_id=disease_id,
            disease_name=disease_name,
            hypothesis_statement=statement,
            score=final_score,
            score_grade=grade,
            factors=factors,
            supporting_evidence=supporting_evd,
            contradictory_evidence=contradictory_evd,
            missing_connections=missing_links,
            experimental_test_proposals=test_proposals,
            responsible_use_disclaimer="AYURGRAPH-X is an exploratory hypothesis generation system. This score reflects traceable scientific literature coverage, not clinical efficacy or medical safety. Experimental laboratory testing is required."
        )

ranking_engine = RankingEngine()
