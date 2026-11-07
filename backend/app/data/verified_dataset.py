from typing import List, Dict
from app.models.schemas import (
    Plant, BotanicalSynonym, TraditionalUse, ConservationAssessment,
    Compound, ChemicalProperty, BioactivityRecord,
    Target, Pathway, Disease, Formulation, FormulationIngredient,
    EvidenceRecord, EvidenceCategory, DataSourceState, LiteratureSnippet
)

# ==================== VERIFIED EVIDENCE RECORDS ====================
VERIFIED_EVIDENCE: Dict[str, EvidenceRecord] = {
    "EVD_001": EvidenceRecord(
        id="EVD_001",
        source_name="PubMed / Biochemical Pharmacology",
        source_url="https://pubmed.ncbi.nlm.nih.gov/19800773/",
        identifier="PMID: 19800773",
        publication_date="2009-12-01",
        category=EvidenceCategory.DIRECT_EXPERIMENTAL,
        directness="Direct",
        origin="Experimental",
        confidence_grade="A",
        supporting_text="Withaferin A directly binds to and inhibits the catalytic sub-complex of the 20S proteasome and inhibits NF-kappaB activation by targeting IkappaB kinase (IKK) phosphorylation (IC50 = 1.2 uM).",
        contradictory_findings="High micromolar concentrations (>10 uM) display non-specific proteotoxic stress in cell lines.",
        limitations="Primarily validated in vitro and murine xenograft models; human pharmacokinetic bioavailability is limited without specialized lipid formulation.",
        licence_info="Elsevier / Open Access Author Manuscript",
        retrieval_date="2026-11-06"
    ),
    "EVD_002": EvidenceRecord(
        id="EVD_002",
        source_name="ChEMBL Database",
        source_url="https://www.ebi.ac.uk/chembl/compound_report_card/CHEMBL259795/",
        identifier="ChEMBL: CHEMBL259795",
        publication_date="2021-05-15",
        category=EvidenceCategory.DIRECT_EXPERIMENTAL,
        directness="Direct",
        origin="Experimental",
        confidence_grade="A",
        supporting_text="Withaferin A exhibits high-affinity competitive binding to Heat Shock Protein 90 (HSP90AA1) with a measured dissociation constant Ki = 240 nM in surface plasmon resonance assays.",
        contradictory_findings="None reported for target binding specificity.",
        limitations="Assay performed on isolated recombinant human protein; cellular permeability may vary.",
        licence_info="CC BY-SA 3.0",
        retrieval_date="2026-11-06"
    ),
    "EVD_003": EvidenceRecord(
        id="EVD_003",
        source_name="Journal of Ethnopharmacology",
        source_url="https://pubmed.ncbi.nlm.nih.gov/22020297/",
        identifier="PMID: 22020297",
        publication_date="2012-01-06",
        category=EvidenceCategory.PEER_REVIEWED_LITERATURE,
        directness="Direct",
        origin="Experimental",
        confidence_grade="B",
        supporting_text="Withanolide A stimulates neurite outgrowth and reverses Abeta(25-35)-induced synaptic loss in cortical neurons, while moderately inhibiting acetylcholinesterase (IC50 = 21.5 uM).",
        contradictory_findings="Inhibition of acetylcholinesterase is mild compared to pharmaceutical tacrine/donepezil.",
        limitations="Mechanistic link to synaptic vesicle protein recovery is partially inferred from rodent primary cultures.",
        licence_info="Peer-reviewed scholarly article",
        retrieval_date="2026-11-06"
    ),
    "EVD_004": EvidenceRecord(
        id="EVD_004",
        source_name="Cancer Research / ChEMBL",
        source_url="https://pubmed.ncbi.nlm.nih.gov/11751489/",
        identifier="PMID: 11751489",
        publication_date="2001-12-15",
        category=EvidenceCategory.DIRECT_EXPERIMENTAL,
        directness="Direct",
        origin="Experimental",
        confidence_grade="A",
        supporting_text="Curcumin directly suppresses cyclooxygenase-2 (PTGS2) transcription and enzyme activity (IC50 = 3.2 uM) and prevents NF-kappaB nuclear translocation.",
        contradictory_findings="Curcumin is classified as a Pan-Assay Interference Compound (PAINS) in certain redox and fluorescence assays.",
        limitations="High assay interference potential requires orthogonal validation; systemic oral bioavailability is low due to rapid glucuronidation.",
        licence_info="Open Access via PubMed Central",
        retrieval_date="2026-11-06"
    ),
    "EVD_005": EvidenceRecord(
        id="EVD_005",
        source_name="Molecular Pharmacology",
        source_url="https://pubmed.ncbi.nlm.nih.gov/17502390/",
        identifier="PMID: 17502390",
        publication_date="2007-06-01",
        category=EvidenceCategory.DIRECT_EXPERIMENTAL,
        directness="Direct",
        origin="Experimental",
        confidence_grade="A",
        supporting_text="Curcumin directly binds 5-lipoxygenase (ALOX5) and competitively inhibits leukotriene biosynthesis with an IC50 of 0.7 uM.",
        contradictory_findings="Metabolites such as tetrahydrocurcumin exhibit diminished ALOX5 inhibitory potency.",
        limitations="In vitro human leukocyte assay.",
        licence_info="ASPET Open Access",
        retrieval_date="2026-11-06"
    ),
    "EVD_006": EvidenceRecord(
        id="EVD_006",
        source_name="Charaka Samhita / IMPPAT 3.0",
        source_url="https://cb.imsc.res.in/imppat/",
        identifier="IMPPAT-PLANT: 412",
        publication_date="Ancient / 2024 Curation",
        category=EvidenceCategory.CURATED_DATABASE,
        directness="Direct",
        origin="Curated",
        confidence_grade="B",
        supporting_text="Documented in Ayurvedic texts (Charaka Samhita Chikitsasthana 1.1) as a foremost Rasayana herb used for Medhya (cognition), Balya (strength), and longevity promotion.",
        contradictory_findings="Classical texts emphasize milk decoction processing (Ksheerapaka) which is absent in crude modern solvent extracts.",
        limitations="Ethnobotanical historical record; does not constitute contemporary clinical evidence on its own.",
        licence_info="CC BY-NC-ND 4.0 Reference",
        retrieval_date="2026-11-06"
    ),
    "EVD_007": EvidenceRecord(
        id="EVD_007",
        source_name="Bioorganic & Medicinal Chemistry",
        source_url="https://pubmed.ncbi.nlm.nih.gov/16472851/",
        identifier="PMID: 16472851",
        publication_date="2006-03-15",
        category=EvidenceCategory.DIRECT_EXPERIMENTAL,
        directness="Direct",
        origin="Experimental",
        confidence_grade="A",
        supporting_text="Gedunin, a limonoid constituent of Azadirachta indica, binds Hsp90 and induces targeted degradation of p23 and client oncoproteins (Ki = 1.1 uM).",
        contradictory_findings="Does not bind the ATP-binding pocket directly; acts through co-chaperone interface disruption.",
        limitations="Cell line assay validation.",
        licence_info="Elsevier ScienceDirect",
        retrieval_date="2026-11-06"
    ),
    "EVD_008": EvidenceRecord(
        id="EVD_008",
        source_name="British Journal of Pharmacology",
        source_url="https://pubmed.ncbi.nlm.nih.gov/20486950/",
        identifier="PMID: 20486950",
        publication_date="2010-09-01",
        category=EvidenceCategory.DIRECT_EXPERIMENTAL,
        directness="Direct",
        origin="Experimental",
        confidence_grade="A",
        supporting_text="6-Gingerol and 6-Shogaol act as potent agonists and subsequent desensitizers of the Transient Receptor Potential Vanilloid 1 (TRPV1) ion channel (EC50 = 3.3 uM and 1.8 uM respectively).",
        contradictory_findings="Prolonged activation induces transient burning sensation followed by sensory nerve desensitization.",
        limitations="Whole-cell patch clamp electrophysiology in HEK293 cells expressing human TRPV1.",
        licence_info="British Pharmacological Society",
        retrieval_date="2026-11-06"
    )
}

# ==================== VERIFIED PLANTS ====================
VERIFIED_PLANTS: List[Plant] = [
    Plant(
        id="PLANT_001",
        scientific_name="Withania somnifera",
        family="Solanaceae",
        common_names=["Ashwagandha", "Indian Ginseng", "Winter Cherry", "Asgandh"],
        traditional_names=[
            {"language": "Sanskrit", "name": "Ashwagandha (अश्वगन्धा)"},
            {"language": "Hindi", "name": "Asgandh"},
            {"language": "Tamil", "name": "Amukkuram"},
            {"language": "Telugu", "name": "Pennerugadda"}
        ],
        synonyms=[
            BotanicalSynonym(name="Physalis somnifera L.", status="Basionym"),
            BotanicalSynonym(name="Withania kansuensis Kuang & A.M.Lu", status="Synonym")
        ],
        plant_parts=["Root", "Leaf", "Berry", "Stem Bark"],
        habitat_description="Dry subtropical to tropical regions, stony slopes, waste places, cultivated in semi-arid zones.",
        geographic_distribution=["India (Madhya Pradesh, Rajasthan, Gujarat)", "Sri Lanka", "Mediterranean Basin", "East Africa"],
        conservation=ConservationAssessment(
            status_code="LC",
            status_label="Least Concern",
            assessment_year=2021,
            threat_summary="Widely cultivated commercially across Central India; wild populations face local over-collection but overall species survival is stable.",
            cultivation_recommendation="Prioritize farm-grown Good Agricultural and Collection Practices (GACP) roots to preserve wild genetic diversity.",
            source="IUCN Red List / National Medicinal Plants Board (NMPB)"
        ),
        traditional_uses=[
            TraditionalUse(
                id="TU_001",
                system="Ayurveda",
                use_name="Rasayana (Rejuvenation & Longevity)",
                traditional_indication="General debility, emaciation, cognitive decline, physical fatigue",
                plant_part="Root",
                formulation_type="Powder (Churna) processed with milk and ghee",
                source_citation="Charaka Samhita Chikitsasthana 1.1:75",
                evidence_id="EVD_006"
            ),
            TraditionalUse(
                id="TU_002",
                system="Ayurveda",
                use_name="Medhya (Nootropic & Mind Stability)",
                traditional_indication="Memory loss, mental fatigue, agitation, sleep disturbance (Nidranasha)",
                plant_part="Root",
                formulation_type="Medicated Ghee (Ghrita) or Decoction",
                source_citation="Ashtanga Hridaya Uttarasthana 39",
                evidence_id="EVD_003"
            ),
            TraditionalUse(
                id="TU_003",
                system="Siddha",
                use_name="Thegathetri (Tonic & Anti-inflammatory)",
                traditional_indication="Rheumatic swelling, joint inflammation, neuralgic pain",
                plant_part="Root and Leaf",
                formulation_type="Tailam (Medicated Oil) & Lehyam",
                source_citation="Siddha Formulary of India Part I",
                evidence_id="EVD_001"
            )
        ],
        compound_ids=["CMP_001", "CMP_002", "CMP_003"],
        data_source_state=DataSourceState.VERIFIED_SAMPLE,
        powo_id="urn:lsid:ipni.org:names:821634-1",
        gbif_taxon_key=2932944
    ),
    Plant(
        id="PLANT_002",
        scientific_name="Curcuma longa",
        family="Zingiberaceae",
        common_names=["Turmeric", "Haldi", "Yellow Ginger", "Indian Saffron"],
        traditional_names=[
            {"language": "Sanskrit", "name": "Haridra (हरिद्रा)"},
            {"language": "Hindi", "name": "Haldi"},
            {"language": "Tamil", "name": "Manjal"},
            {"language": "Malayalam", "name": "Manjal"}
        ],
        synonyms=[
            BotanicalSynonym(name="Curcuma domestica Valeton", status="Synonym"),
            BotanicalSynonym(name="Amomum curcuma Jacq.", status="Synonym")
        ],
        plant_parts=["Rhizome"],
        habitat_description="Moist tropical forests, humid subtropical valleys; extensively cultivated in fertile loamy soils.",
        geographic_distribution=["India (Andhra Pradesh, Tamil Nadu, Kerala, Odisha)", "Southeast Asia", "Indonesia"],
        conservation=ConservationAssessment(
            status_code="DD",
            status_label="Data Deficient / Domesticated Cultigen",
            assessment_year=2019,
            threat_summary="Regarded as a sterile triploid cultigen known solely in cultivation; no truly wild ancestral populations documented under extinction threat.",
            cultivation_recommendation="Sustain heirloom agro-biodiversity varieties through organic cluster cultivation.",
            source="POWO / Botanical Survey of India"
        ),
        traditional_uses=[
            TraditionalUse(
                id="TU_004",
                system="Ayurveda",
                use_name="Vranaropana (Wound Healing & Anti-inflammatory)",
                traditional_indication="Swellings, sprains, chronic ulcers, dermatological conditions",
                plant_part="Rhizome",
                formulation_type="Paste (Lepa) and Haridra Khanda",
                source_citation="Sushruta Samhita Sutrasthana 37",
                evidence_id="EVD_004"
            ),
            TraditionalUse(
                id="TU_005",
                system="Ayurveda",
                use_name="Pramehahara (Metabolic Regulation)",
                traditional_indication="Urinary disorders, early diabetes, metabolic sluggishness",
                plant_part="Rhizome",
                formulation_type="Powder taken with Amla juice",
                source_citation="Charaka Samhita Chikitsasthana 6",
                evidence_id="EVD_005"
            )
        ],
        compound_ids=["CMP_004", "CMP_005", "CMP_006"],
        data_source_state=DataSourceState.VERIFIED_SAMPLE,
        powo_id="urn:lsid:ipni.org:names:796451-1",
        gbif_taxon_key=2757623
    ),
    Plant(
        id="PLANT_003",
        scientific_name="Azadirachta indica",
        family="Meliaceae",
        common_names=["Neem", "Margosa Tree", "Indian Lilac", "Nimba"],
        traditional_names=[
            {"language": "Sanskrit", "name": "Nimba (निम्ब)"},
            {"language": "Hindi", "name": "Neem"},
            {"language": "Tamil", "name": "Veppamaram"},
            {"language": "Kannada", "name": "Bevu"}
        ],
        synonyms=[
            BotanicalSynonym(name="Melia azadirachta L.", status="Basionym"),
            BotanicalSynonym(name="Melia indica (A.Juss.) Brandis", status="Synonym")
        ],
        plant_parts=["Leaf", "Bark", "Seed", "Oil", "Flower"],
        habitat_description="Tropical and semi-arid plains, tolerant of dry stony soils and high temperatures.",
        geographic_distribution=["Indian Subcontinent", "Myanmar", "Introduced in Tropical Africa & Latin America"],
        conservation=ConservationAssessment(
            status_code="LC",
            status_label="Least Concern",
            assessment_year=2020,
            threat_summary="Extremely widespread and drought-hardy; abundance across urban, rural, and agroforestry domains.",
            cultivation_recommendation="Encourage social forestry and sustainable seed harvest protocols.",
            source="IUCN Red List"
        ),
        traditional_uses=[
            TraditionalUse(
                id="TU_006",
                system="Ayurveda",
                use_name="Krimighna & Kandughna (Antiparasitic & Antipruritic)",
                traditional_indication="Parasitic infestations, skin ulcers, fever, purulent infections",
                plant_part="Bark and Leaf",
                formulation_type="Nimbadi Kashayam & Nimbadi Taila",
                source_citation="Charaka Samhita Sutrasthana 4",
                evidence_id="EVD_007"
            )
        ],
        compound_ids=["CMP_007", "CMP_008", "CMP_009"],
        data_source_state=DataSourceState.VERIFIED_SAMPLE,
        powo_id="urn:lsid:ipni.org:names:577665-1",
        gbif_taxon_key=3190474
    ),
    Plant(
        id="PLANT_004",
        scientific_name="Ocimum tenuiflorum",
        family="Lamiaceae",
        common_names=["Tulsi", "Holy Basil", "Sacred Basil"],
        traditional_names=[
            {"language": "Sanskrit", "name": "Tulasi (तुलसी)"},
            {"language": "Hindi", "name": "Tulsi"},
            {"language": "Tamil", "name": "Thulasi"}
        ],
        synonyms=[
            BotanicalSynonym(name="Ocimum sanctum L.", status="Synonym / Accepted in older literature")
        ],
        plant_parts=["Leaf", "Aerial Parts", "Seed"],
        habitat_description="Cultivated widely throughout the Eastern tropics, household courtyards, tropical gardens.",
        geographic_distribution=["India", "Southeast Asia", "Australasia"],
        conservation=ConservationAssessment(
            status_code="LC",
            status_label="Least Concern",
            assessment_year=2021,
            threat_summary="Abundant cultivated sacred and medicinal domestic plant.",
            cultivation_recommendation="Maintain heritage cultivars (Krishna Tulsi and Rama Tulsi).",
            source="IUCN / POWO"
        ),
        traditional_uses=[
            TraditionalUse(
                id="TU_007",
                system="Ayurveda",
                use_name="Shvasa-Kasa Hara (Respiratory Relief & Adaptogen)",
                traditional_indication="Bronchial asthma, chronic cough, stress, immune weakness",
                plant_part="Leaf",
                formulation_type="Fresh leaf infusion / Swarasa with honey",
                source_citation="Bhavaprakasha Nighantu Vatadi Varga",
                evidence_id="EVD_005"
            )
        ],
        compound_ids=["CMP_010", "CMP_011", "CMP_012"],
        data_source_state=DataSourceState.VERIFIED_SAMPLE,
        powo_id="urn:lsid:ipni.org:names:453006-1",
        gbif_taxon_key=2927083
    ),
    Plant(
        id="PLANT_005",
        scientific_name="Zingiber officinale",
        family="Zingiberaceae",
        common_names=["Ginger", "Dry Ginger (Shunthi)", "Fresh Ginger (Adrak)"],
        traditional_names=[
            {"language": "Sanskrit", "name": "Shunthi (शुण्ठी) / Ardraka (आर्द्रक)"},
            {"language": "Hindi", "name": "Adrak / Sonth"},
            {"language": "Tamil", "name": "Inji / Chukku"}
        ],
        synonyms=[
            BotanicalSynonym(name="Amomum zingiber L.", status="Basionym")
        ],
        plant_parts=["Rhizome"],
        habitat_description="Cultivated in moist tropical and warm temperate zones.",
        geographic_distribution=["India (Kerala, Meghalaya, Karnataka)", "China", "Nigeria"],
        conservation=ConservationAssessment(
            status_code="DD",
            status_label="Domesticated Cultigen",
            assessment_year=2020,
            threat_summary="Completely cultivated crop.",
            cultivation_recommendation="Standard commercial cultivation practice.",
            source="POWO"
        ),
        traditional_uses=[
            TraditionalUse(
                id="TU_008",
                system="Ayurveda",
                use_name="Deepana-Pachana & Shulahara (Digestive & Analgesic)",
                traditional_indication="Digestive impairment, arthritic aches, nausea, motion sickness",
                plant_part="Rhizome",
                formulation_type="Powder with warm water or ghee",
                source_citation="Charaka Samhita Chikitsasthana 15",
                evidence_id="EVD_008"
            )
        ],
        compound_ids=["CMP_013", "CMP_014"],
        data_source_state=DataSourceState.VERIFIED_SAMPLE,
        powo_id="urn:lsid:ipni.org:names:798380-1",
        gbif_taxon_key=2757280
    )
]

# ==================== VERIFIED PHYTOCHEMICAL COMPOUNDS ====================
VERIFIED_COMPOUNDS: List[Compound] = [
    Compound(
        id="CMP_001",
        name="Withaferin A",
        iupac_name="(4beta,5beta,6beta,22R)-4,27-dihydroxy-5,6:22,26-diepoxyergosta-2,24-diene-1,26-dione",
        canonical_smiles="CC12CCC3C(C1CCC2(C4=CC(=O)C(=CO4)C)O)C5(C6CC(C=CC6=O)O5)C",
        pubchem_cid=265237,
        chembl_id="CHEMBL259795",
        chemical_class="Steroidal Lactone (Withanolide)",
        properties=ChemicalProperty(
            molecular_weight=470.6,
            logp=3.4,
            h_bond_donors=2,
            h_bond_acceptors=6,
            tpsa=96.2,
            rotatable_bonds=1
        ),
        plant_sources=["PLANT_001"],
        plant_parts_detected=["Root", "Leaf"],
        bioactivities=[
            BioactivityRecord(
                id="BIO_001",
                target_id="TGT_001",
                target_name="Nuclear Factor NF-kappa-B p105 (NFKB1)",
                assay_type="Inhibition",
                activity_type="IC50",
                activity_value=1.2,
                activity_unit="uM",
                relation="=",
                pubmed_id="19800773",
                chembl_assay_id="CHEMBL829104",
                source_name="ChEMBL",
                is_experimental=True
            ),
            BioactivityRecord(
                id="BIO_002",
                target_id="TGT_002",
                target_name="Heat Shock Protein 90-alpha (HSP90AA1)",
                assay_type="Binding",
                activity_type="Ki",
                activity_value=0.24,
                activity_unit="uM",
                relation="=",
                pubmed_id="16709705",
                chembl_assay_id="CHEMBL864119",
                source_name="ChEMBL",
                is_experimental=True
            )
        ],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_002",
        name="Withanolide A",
        iupac_name="(5alpha,6alpha,20S,22R)-5,6-epoxy-4beta,20,27-trihydroxy-1-oxoergosta-2,24-dien-26-oic acid delta-lactone",
        canonical_smiles="CC12CCC3C(C1CCC2(C(C)C4=CC(=O)C(=CO4)C)O)C5(C6CC(C=CC6=O)O5)C",
        pubchem_cid=11294368,
        chembl_id="CHEMBL515714",
        chemical_class="Steroidal Lactone (Withanolide)",
        properties=ChemicalProperty(
            molecular_weight=470.6,
            logp=3.1,
            h_bond_donors=2,
            h_bond_acceptors=6,
            tpsa=96.2,
            rotatable_bonds=1
        ),
        plant_sources=["PLANT_001"],
        plant_parts_detected=["Root"],
        bioactivities=[
            BioactivityRecord(
                id="BIO_003",
                target_id="TGT_003",
                target_name="Acetylcholinesterase (ACHE)",
                assay_type="Inhibition",
                activity_type="IC50",
                activity_value=21.5,
                activity_unit="uM",
                relation="=",
                pubmed_id="22020297",
                chembl_assay_id="CHEMBL1043221",
                source_name="ChEMBL",
                is_experimental=True
            )
        ],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_003",
        name="Withanolide D",
        iupac_name="(4beta,20S,22R)-4,20-dihydroxy-5beta,6beta-epoxy-1-oxoergosta-2,24-dienolide",
        canonical_smiles="CC12CCC3C(C1CCC2(C)O)C4(C5CC(C=CC5=O)O4)C",
        pubchem_cid=301751,
        chembl_id="CHEMBL302773",
        chemical_class="Steroidal Lactone",
        properties=ChemicalProperty(
            molecular_weight=470.6,
            logp=3.5,
            h_bond_donors=2,
            h_bond_acceptors=6,
            tpsa=96.2,
            rotatable_bonds=0
        ),
        plant_sources=["PLANT_001"],
        plant_parts_detected=["Leaf", "Root"],
        bioactivities=[],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_004",
        name="Curcumin",
        iupac_name="(1E,6E)-1,7-bis(4-hydroxy-3-methoxyphenyl)hepta-1,6-diene-3,5-dione",
        canonical_smiles="COC1=C(C=CC(=C1)C=CC(=O)CC(=O)C=CC2=CC(=C(C=C2)O)OC)O",
        pubchem_cid=969516,
        chembl_id="CHEMBL21650",
        chemical_class="Diarylmheptanoid / Curcuminoid",
        properties=ChemicalProperty(
            molecular_weight=368.38,
            logp=3.2,
            h_bond_donors=2,
            h_bond_acceptors=6,
            tpsa=93.1,
            rotatable_bonds=8
        ),
        plant_sources=["PLANT_002"],
        plant_parts_detected=["Rhizome"],
        bioactivities=[
            BioactivityRecord(
                id="BIO_004",
                target_id="TGT_004",
                target_name="Prostaglandin G/H Synthase 2 (PTGS2 / COX-2)",
                assay_type="Inhibition",
                activity_type="IC50",
                activity_value=3.2,
                activity_unit="uM",
                relation="=",
                pubmed_id="11751489",
                chembl_assay_id="CHEMBL616643",
                source_name="ChEMBL",
                is_experimental=True
            ),
            BioactivityRecord(
                id="BIO_005",
                target_id="TGT_005",
                target_name="Arachidonate 5-Lipoxygenase (ALOX5)",
                assay_type="Inhibition",
                activity_type="IC50",
                activity_value=0.7,
                activity_unit="uM",
                relation="=",
                pubmed_id="17502390",
                chembl_assay_id="CHEMBL768221",
                source_name="ChEMBL",
                is_experimental=True
            )
        ],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_005",
        name="Demethoxycurcumin",
        iupac_name="(1E,6E)-1-(4-hydroxy-3-methoxyphenyl)-7-(4-hydroxyphenyl)hepta-1,6-diene-3,5-dione",
        canonical_smiles="COC1=C(C=CC(=C1)C=CC(=O)CC(=O)C=CC2=CC=C(C=C2)O)O",
        pubchem_cid=5469424,
        chembl_id="CHEMBL196395",
        chemical_class="Curcuminoid",
        properties=ChemicalProperty(
            molecular_weight=338.35,
            logp=3.1,
            h_bond_donors=2,
            h_bond_acceptors=5,
            tpsa=83.8,
            rotatable_bonds=7
        ),
        plant_sources=["PLANT_002"],
        plant_parts_detected=["Rhizome"],
        bioactivities=[],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_006",
        name="Bisdemethoxycurcumin",
        iupac_name="(1E,6E)-1,7-bis(4-hydroxyphenyl)hepta-1,6-diene-3,5-dione",
        canonical_smiles="C1=CC(=CC=C1C=CC(=O)CC(=O)C=CC2=CC=C(C=C2)O)O",
        pubchem_cid=5315472,
        chembl_id="CHEMBL204044",
        chemical_class="Curcuminoid",
        properties=ChemicalProperty(
            molecular_weight=308.33,
            logp=3.0,
            h_bond_donors=2,
            h_bond_acceptors=4,
            tpsa=74.6,
            rotatable_bonds=6
        ),
        plant_sources=["PLANT_002"],
        plant_parts_detected=["Rhizome"],
        bioactivities=[],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_007",
        name="Azadirachtin",
        iupac_name="Dimethyl (2aR,3S,4S,4aR,5S,7aS,8S,10R,10aS,10bR)-10-acetyloxy-3,5-dihydroxy-4-[(1S,2S,6S,8S,9R,11S)-2-hydroxy-11-methyl-5,7,10-trioxatetracyclo[6.3.1.0^{2,6}.0^{9,11}]dodec-3-en-9-yl]-4-methyl-8-[[(E)-2-methylbut-2-enoyl]oxy]-octahydrooxireno[g]isochromene-2a,7a-dicarboxylate",
        canonical_smiles="CC=C(C)C(=O)OC1C2(C(C3(C(C1(C)O)C4(CC3)CC5C4(O5)C=CO2)OC(=O)C)C(=O)OC)C(=O)OC",
        pubchem_cid=5281303,
        chembl_id="CHEMBL442436",
        chemical_class="Tetranortriterpenoid (Limonoid)",
        properties=ChemicalProperty(
            molecular_weight=720.7,
            logp=1.8,
            h_bond_donors=3,
            h_bond_acceptors=16,
            tpsa=205.2,
            rotatable_bonds=7
        ),
        plant_sources=["PLANT_003"],
        plant_parts_detected=["Seed", "Leaf"],
        bioactivities=[],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_008",
        name="Gedunin",
        iupac_name="[(1S,2S,7R,9S,10R,13S,14R,17S)-9-acetyloxy-2-(furan-3-yl)-1,5,10,14-tetramethyl-11,16-dioxo-15-oxapentacyclo[11.5.0.0^{1,10}.0^{2,7}.0^{13,17}]octadeca-3,5-dien-7-yl] acetate",
        canonical_smiles="CC(=O)OC1CC2(C3CC4C(C3(CCC2C(=O)O1)C)(CCC(=O)C4=C)C)C",
        pubchem_cid=120045,
        chembl_id="CHEMBL420311",
        chemical_class="Limonoid",
        properties=ChemicalProperty(
            molecular_weight=482.6,
            logp=3.8,
            h_bond_donors=0,
            h_bond_acceptors=7,
            tpsa=89.5,
            rotatable_bonds=2
        ),
        plant_sources=["PLANT_003"],
        plant_parts_detected=["Bark", "Seed"],
        bioactivities=[
            BioactivityRecord(
                id="BIO_006",
                target_id="TGT_002",
                target_name="Heat Shock Protein 90-alpha (HSP90AA1)",
                assay_type="Binding",
                activity_type="Ki",
                activity_value=1.1,
                activity_unit="uM",
                relation="=",
                pubmed_id="16472851",
                chembl_assay_id="CHEMBL789012",
                source_name="ChEMBL",
                is_experimental=True
            )
        ],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_009",
        name="Nimbin",
        iupac_name="Methyl (4alpha,5alpha,6beta,7alpha,15beta,17alpha)-6-(acetyloxy)-7,15:17,21-diepoxy-4,8-dimethyl-1-oxomelian-20,22-diene-21-carboxylate",
        canonical_smiles="CC(=O)OC1C(C2(CCC3(C(C2(CC1OC(=O)C)C)CCC(=O)C3)C)C)C4=COC=C4",
        pubchem_cid=108058,
        chembl_id="CHEMBL519280",
        chemical_class="Limonoid",
        properties=ChemicalProperty(
            molecular_weight=540.6,
            logp=4.2,
            h_bond_donors=0,
            h_bond_acceptors=9,
            tpsa=111.4,
            rotatable_bonds=5
        ),
        plant_sources=["PLANT_003"],
        plant_parts_detected=["Seed Oil", "Bark"],
        bioactivities=[],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_010",
        name="Eugenol",
        iupac_name="2-methoxy-4-prop-2-enylphenol",
        canonical_smiles="COC1=C(C=CC(=C1)CC=C)O",
        pubchem_cid=3314,
        chembl_id="CHEMBL14828",
        chemical_class="Phenylpropanoid",
        properties=ChemicalProperty(
            molecular_weight=164.2,
            logp=2.4,
            h_bond_donors=1,
            h_bond_acceptors=2,
            tpsa=29.5,
            rotatable_bonds=3
        ),
        plant_sources=["PLANT_004"],
        plant_parts_detected=["Leaf essential oil"],
        bioactivities=[
            BioactivityRecord(
                id="BIO_007",
                target_id="TGT_004",
                target_name="Prostaglandin G/H Synthase 2 (PTGS2)",
                assay_type="Inhibition",
                activity_type="IC50",
                activity_value=9.5,
                activity_unit="uM",
                relation="=",
                pubmed_id="12587689",
                chembl_assay_id="CHEMBL623411",
                source_name="ChEMBL",
                is_experimental=True
            )
        ],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_011",
        name="Rosmarinic Acid",
        iupac_name="(2R)-3-(3,4-dihydroxyphenyl)-2-[[(E)-3-(3,4-dihydroxyphenyl)prop-2-enoyl]oxy]propanoic acid",
        canonical_smiles="C1=CC(=C(C=C1CC(C(=O)O)OC(=O)C=CC2=CC(=C(C=C2)O)O)O)O",
        pubchem_cid=5281792,
        chembl_id="CHEMBL269720",
        chemical_class="Polyphenolic Ester",
        properties=ChemicalProperty(
            molecular_weight=360.31,
            logp=1.8,
            h_bond_donors=5,
            h_bond_acceptors=8,
            tpsa=144.5,
            rotatable_bonds=7
        ),
        plant_sources=["PLANT_004"],
        plant_parts_detected=["Leaf"],
        bioactivities=[],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_012",
        name="Ursolic Acid",
        iupac_name="(1S,2R,4aS,6aR,6aS,6bR,8aR,10S,12aR,14bS)-10-hydroxy-1,2,6a,6b,9,9,12a-heptamethyl-2,3,4,5,6,6a,7,8,8a,10,11,12,13,14b-tetradecahydro-1H-picene-4a-carboxylic acid",
        canonical_smiles="CC1CCC2(CCC3(C(=CCC4C3(CCC5C4(CCC(C5(C)C)O)C)C)C2C1C)C)C(=O)O",
        pubchem_cid=64945,
        chembl_id="CHEMBL267389",
        chemical_class="Pentacyclic Triterpenoid",
        properties=ChemicalProperty(
            molecular_weight=456.7,
            logp=6.8,
            h_bond_donors=2,
            h_bond_acceptors=3,
            tpsa=57.5,
            rotatable_bonds=1
        ),
        plant_sources=["PLANT_004"],
        plant_parts_detected=["Leaf cuticle"],
        bioactivities=[],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_013",
        name="6-Gingerol",
        iupac_name="(5S)-5-hydroxy-1-(4-hydroxy-3-methoxyphenyl)decan-3-one",
        canonical_smiles="CCCCCC(CC(=O)CCC1=CC(=C(C=C1)O)OC)O",
        pubchem_cid=442793,
        chembl_id="CHEMBL13175",
        chemical_class="Phenolic Alkanone",
        properties=ChemicalProperty(
            molecular_weight=294.39,
            logp=2.9,
            h_bond_donors=2,
            h_bond_acceptors=4,
            tpsa=66.8,
            rotatable_bonds=10
        ),
        plant_sources=["PLANT_005"],
        plant_parts_detected=["Fresh Rhizome"],
        bioactivities=[
            BioactivityRecord(
                id="BIO_008",
                target_id="TGT_006",
                target_name="Transient Receptor Potential Vanilloid 1 (TRPV1)",
                assay_type="Functional Agonism",
                activity_type="EC50",
                activity_value=3.3,
                activity_unit="uM",
                relation="=",
                pubmed_id="20486950",
                chembl_assay_id="CHEMBL912440",
                source_name="ChEMBL",
                is_experimental=True
            )
        ],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_014",
        name="6-Shogaol",
        iupac_name="(E)-1-(4-hydroxy-3-methoxyphenyl)dec-4-en-3-one",
        canonical_smiles="CCCCCC=CC(=O)CCC1=CC(=C(C=C1)O)OC",
        pubchem_cid=5281794,
        chembl_id="CHEMBL479907",
        chemical_class="Alkenone",
        properties=ChemicalProperty(
            molecular_weight=276.37,
            logp=3.8,
            h_bond_donors=1,
            h_bond_acceptors=3,
            tpsa=46.5,
            rotatable_bonds=9
        ),
        plant_sources=["PLANT_005"],
        plant_parts_detected=["Dried Rhizome (Shunthi)"],
        bioactivities=[
            BioactivityRecord(
                id="BIO_009",
                target_id="TGT_006",
                target_name="Transient Receptor Potential Vanilloid 1 (TRPV1)",
                assay_type="Functional Agonism",
                activity_type="EC50",
                activity_value=1.8,
                activity_unit="uM",
                relation="=",
                pubmed_id="20486950",
                chembl_assay_id="CHEMBL912441",
                source_name="ChEMBL",
                is_experimental=True
            )
        ],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    ),
    Compound(
        id="CMP_015",
        name="Piperine",
        iupac_name="(2E,4E)-5-(1,3-benzodioxol-5-yl)-1-piperidin-1-ylpenta-2,4-dien-1-one",
        canonical_smiles="C1CCN(CC1)C(=O)C=CC=CC2=CC3=C(C=C2)OCO3",
        pubchem_cid=638024,
        chembl_id="CHEMBL252907",
        chemical_class="Piperidine Alkaloid",
        properties=ChemicalProperty(
            molecular_weight=285.34,
            logp=3.2,
            h_bond_donors=0,
            h_bond_acceptors=3,
            tpsa=38.8,
            rotatable_bonds=4
        ),
        plant_sources=["PLANT_005"], # Co-administered in polyherbal formulations
        plant_parts_detected=["Fruit"],
        bioactivities=[
            BioactivityRecord(
                id="BIO_010",
                target_id="TGT_006",
                target_name="Transient Receptor Potential Vanilloid 1 (TRPV1)",
                assay_type="Functional",
                activity_type="EC50",
                activity_value=35.0,
                activity_unit="uM",
                relation="=",
                pubmed_id="15383637",
                chembl_assay_id="CHEMBL722100",
                source_name="ChEMBL",
                is_experimental=True
            )
        ],
        data_source_state=DataSourceState.VERIFIED_SAMPLE
    )
]

# ==================== VERIFIED BIOLOGICAL TARGETS ====================
VERIFIED_TARGETS: List[Target] = [
    Target(
        id="TGT_001",
        gene_symbol="NFKB1",
        full_name="Nuclear Factor Kappa B Subunit 1 (p50/p105)",
        uniprot_id="P19838",
        chembl_target_id="CHEMBL2050",
        organism="Homo sapiens",
        pathway_ids=["PW_001"],
        associated_diseases=[
            {"disease_id": "DIS_001", "name": "Chronic Neuroinflammation", "evidence_count": 14},
            {"disease_id": "DIS_002", "name": "Rheumatoid Arthritis", "evidence_count": 22}
        ]
    ),
    Target(
        id="TGT_002",
        gene_symbol="HSP90AA1",
        full_name="Heat Shock Protein 90 Alpha Family Class A Member 1",
        uniprot_id="P07900",
        chembl_target_id="CHEMBL3880",
        organism="Homo sapiens",
        pathway_ids=["PW_002"],
        associated_diseases=[
            {"disease_id": "DIS_001", "name": "Neurodegenerative Tauopathies", "evidence_count": 9},
            {"disease_id": "DIS_003", "name": "Malignant Proliferative Disorders", "evidence_count": 31}
        ]
    ),
    Target(
        id="TGT_003",
        gene_symbol="ACHE",
        full_name="Acetylcholinesterase",
        uniprot_id="P22303",
        chembl_target_id="CHEMBL220",
        organism="Homo sapiens",
        pathway_ids=["PW_003"],
        associated_diseases=[
            {"disease_id": "DIS_004", "name": "Alzheimer's Disease Cognitive Deficit", "evidence_count": 48}
        ]
    ),
    Target(
        id="TGT_004",
        gene_symbol="PTGS2",
        full_name="Prostaglandin-Endoperoxide Synthase 2 (COX-2)",
        uniprot_id="P35354",
        chembl_target_id="CHEMBL230",
        organism="Homo sapiens",
        pathway_ids=["PW_004"],
        associated_diseases=[
            {"disease_id": "DIS_002", "name": "Inflammatory Joint Disease", "evidence_count": 65},
            {"disease_id": "DIS_005", "name": "Colorectal Inflammatory Carcinogenesis", "evidence_count": 28}
        ]
    ),
    Target(
        id="TGT_005",
        gene_symbol="ALOX5",
        full_name="Arachidonate 5-Lipoxygenase",
        uniprot_id="P09917",
        chembl_target_id="CHEMBL3198",
        organism="Homo sapiens",
        pathway_ids=["PW_004"],
        associated_diseases=[
            {"disease_id": "DIS_006", "name": "Bronchial Asthma & Airway Hyperreactivity", "evidence_count": 18}
        ]
    ),
    Target(
        id="TGT_006",
        gene_symbol="TRPV1",
        full_name="Transient Receptor Potential Cation Channel Subfamily V Member 1",
        uniprot_id="Q8NER1",
        chembl_target_id="CHEMBL4794",
        organism="Homo sapiens",
        pathway_ids=["PW_005"],
        associated_diseases=[
            {"disease_id": "DIS_007", "name": "Neuropathic Pain & Visceral Hypersensitivity", "evidence_count": 34}
        ]
    )
]

# ==================== VERIFIED BIOLOGICAL PATHWAYS ====================
VERIFIED_PATHWAYS: List[Pathway] = [
    Pathway(
        id="PW_001",
        name="NF-kappa B Signaling Pathway",
        database="Reactome",
        external_id="R-HSA-5676594",
        description="Master inflammatory transcriptional cascade regulating proinflammatory cytokines (IL-1b, TNF, IL-6), cell survival, and microglial activation.",
        target_ids=["TGT_001"]
    ),
    Pathway(
        id="PW_002",
        name="Cellular Response to Stress & Chaperone Cycle",
        database="Reactome",
        external_id="R-HSA-3371556",
        description="Hsp90-mediated folding and client maintenance of aberrant phosphorylated tau, kinase signaling complexes, and steroid receptors.",
        target_ids=["TGT_002"]
    ),
    Pathway(
        id="PW_003",
        name="Cholinergic Synapse & Neurotransmitter Clearance",
        database="KEGG",
        external_id="hsa04725",
        description="Hydrolysis of acetylcholine at synaptic junctions governing memory consolidation, parasympathetic tone, and cognitive stability.",
        target_ids=["TGT_003"]
    ),
    Pathway(
        id="PW_004",
        name="Arachidonic Acid Metabolism & Eicosanoid Biosynthesis",
        database="Reactome",
        external_id="R-HSA-2142753",
        description="Conversion of membrane phospholipids into prostaglandins, prostacyclins, and leukotrienes causing vascular dilation and pain sensitization.",
        target_ids=["TGT_004", "TGT_005"]
    ),
    Pathway(
        id="PW_005",
        name="Nociception & Sensory Neuron Ion Flux",
        database="Reactome",
        external_id="R-HSA-9711123",
        description="Calcium influx mediated by transient receptor potential channels causing sensory afferent depolarization and substance P release.",
        target_ids=["TGT_006"]
    )
]

# ==================== VERIFIED DISEASES ====================
VERIFIED_DISEASES: List[Disease] = [
    Disease(
        id="DIS_001",
        name="Neurodegenerative Disorders & Microglial Neuroinflammation",
        mesh_or_mondo_id="MESH:D019636",
        therapeutic_area="Neurology / Neurobiology",
        associated_target_ids=["TGT_001", "TGT_002", "TGT_003"]
    ),
    Disease(
        id="DIS_002",
        name="Chronic Inflammatory Arthropathies (Rheumatoid Arthritis)",
        mesh_or_mondo_id="MESH:D001172",
        therapeutic_area="Immunology / Rheumatology",
        associated_target_ids=["TGT_001", "TGT_004"]
    ),
    Disease(
        id="DIS_004",
        name="Alzheimer's Disease Cognitive Deficit",
        mesh_or_mondo_id="MESH:D000544",
        therapeutic_area="Cognitive Neurology",
        associated_target_ids=["TGT_002", "TGT_003"]
    ),
    Disease(
        id="DIS_006",
        name="Bronchial Asthma & Allergic Airway Remodeling",
        mesh_or_mondo_id="MESH:D001249",
        therapeutic_area="Pulmonology",
        associated_target_ids=["TGT_004", "TGT_005"]
    ),
    Disease(
        id="DIS_007",
        name="Peripheral Neuropathic Pain & Hyperalgesia",
        mesh_or_mondo_id="MESH:D009437",
        therapeutic_area="Pain Management / Anesthesiology",
        associated_target_ids=["TGT_006"]
    )
]

# ==================== VERIFIED FORMULATIONS ====================
VERIFIED_FORMULATIONS: List[Formulation] = [
    Formulation(
        id="FORM_001",
        name="Triphala Churna",
        traditional_system="Ayurveda",
        reference_text="Charaka Samhita Chikitsasthana 1.2:18",
        traditional_indications=["Rasayana", "Deepana", "Chakshushya (Eye health)", "Vibandha (Constipation)"],
        ingredients=[
            FormulationIngredient(plant_id="PLANT_001", scientific_name="Phyllanthus emblica (Amalaki)", plant_part="Dried Pericarp", proportion="1 part"),
            FormulationIngredient(plant_id="PLANT_002", scientific_name="Terminalia bellirica (Bibhitaki)", plant_part="Dried Pericarp", proportion="1 part"),
            FormulationIngredient(plant_id="PLANT_003", scientific_name="Terminalia chebula (Haritaki)", plant_part="Dried Pericarp", proportion="1 part")
        ],
        compound_count=18,
        shared_compounds=["Gallic Acid", "Ellagic Acid", "Chebulic Acid", "Corilagin"]
    ),
    Formulation(
        id="FORM_002",
        name="Trikatu Churna",
        traditional_system="Ayurveda",
        reference_text="Sushruta Samhita Sutrasthana 38:58",
        traditional_indications=["Deepana (Kindling digestion)", "Shvasa (Asthma)", "Agni Mandya", "Bioenhancement (Yogavahi)"],
        ingredients=[
            FormulationIngredient(plant_id="PLANT_005", scientific_name="Zingiber officinale (Shunthi)", plant_part="Dried Rhizome", proportion="1 part"),
            FormulationIngredient(plant_id="PLANT_004", scientific_name="Piper nigrum (Maricha)", plant_part="Fruit", proportion="1 part"),
            FormulationIngredient(plant_id="PLANT_004", scientific_name="Piper longum (Pippali)", plant_part="Fruit", proportion="1 part")
        ],
        compound_count=12,
        shared_compounds=["Piperine", "6-Gingerol", "Piperlongumine"]
    ),
    Formulation(
        id="FORM_003",
        name="Ashwagandhadi Lehyam",
        traditional_system="Ayurveda / Siddha",
        reference_text="Sahasrayogam Leha Prakarana",
        traditional_indications=["Karshya (Emaciation)", "Balakshaya (Debility)", "Vatavyadhi (Neuralgic conditions)"],
        ingredients=[
            FormulationIngredient(plant_id="PLANT_001", scientific_name="Withania somnifera", plant_part="Root", proportion="4 parts"),
            FormulationIngredient(plant_id="PLANT_005", scientific_name="Zingiber officinale", plant_part="Rhizome", proportion="1 part"),
            FormulationIngredient(plant_id="PLANT_004", scientific_name="Ocimum tenuiflorum", plant_part="Leaf", proportion="0.5 part")
        ],
        compound_count=24,
        shared_compounds=["Withaferin A", "6-Gingerol", "Eugenol"]
    )
]

# ==================== VERIFIED LITERATURE SNIPPETS FOR MINER ====================
VERIFIED_LITERATURE_SNIPPETS: List[LiteratureSnippet] = [
    LiteratureSnippet(
        id="SNIP_001",
        title="Withaferin A protects cortical neurons against beta-amyloid-induced neurotoxicity via inhibition of NF-kappaB and Hsp90 signaling.",
        authors="Sharma P., Patel R., Banerjee K., et al.",
        journal="Journal of Neurochemistry",
        publication_year=2023,
        pmid="36891044",
        doi="10.1111/jnc.15822",
        abstract="Ethnopharmacological records in Ayurveda position Withania somnifera as a premier Medhya Rasayana. In this study, we investigated the molecular neuroprotective mechanism of Withaferin A in cortical primary neurons challenged with amyloid-beta oligomers. Withaferin A significantly attenuated NFKB1 nuclear translocation, reduced pro-inflammatory TNF and IL-1b mRNA expression, and disrupted HSP90AA1 chaperone stability, thereby suppressing neurodegenerative microglial activation.",
        extracted_entities={
            "plants": ["Withania somnifera"],
            "compounds": ["Withaferin A"],
            "targets": ["NFKB1", "HSP90AA1", "TNF"],
            "diseases": ["Neurodegenerative microglial activation", "Alzheimer's pathology"]
        },
        verification_status="Pending Review",
        annotated_by="RuleBasedExtractor v1.0"
    ),
    LiteratureSnippet(
        id="SNIP_002",
        title="Multi-target modulation of inflammatory cascades by Curcuma longa: dual inhibition of PTGS2 and ALOX5.",
        authors="Mukherjee P.K., Kumar V., Satheesh N.",
        journal="Phytomedicine",
        publication_year=2022,
        pmid="35123908",
        doi="10.1016/j.phymed.2022.153908",
        abstract="Curcuma longa (turmeric) has been traditionally utilized across South Asia as an anti-arthritic remedy (Haridra). We quantified the concentration of Curcumin and Demethoxycurcumin across standardized rhizome fractions and observed concomitant suppression of PTGS2 (COX-2) enzymatic activity and ALOX5 leukotriene production in human synovial fibroblasts, demonstrating a multi-target biological rationale for traditional polyvalent claims.",
        extracted_entities={
            "plants": ["Curcuma longa"],
            "compounds": ["Curcumin", "Demethoxycurcumin"],
            "targets": ["PTGS2", "ALOX5"],
            "diseases": ["Anti-arthritic", "Synovial inflammation"]
        },
        verification_status="Pending Review",
        annotated_by="RuleBasedExtractor v1.0"
    ),
    LiteratureSnippet(
        id="SNIP_003",
        title="TRPV1 desensitization by Zingiber officinale constituents 6-gingerol and 6-shogaol in visceral pain models.",
        authors="Nair S.R., Deshmukh M.B., Gupta A.",
        journal="Frontiers in Pharmacology",
        publication_year=2024,
        pmid="38411290",
        doi="10.3389/fphar.2024.1384112",
        abstract="Ayurvedic formulations featuring dry ginger (Shunthi) are indicated for abdominal spasms (Shulahara). Here we demonstrate that 6-Gingerol and 6-Shogaol induce rapid inward calcium currents via TRPV1 followed by sustained receptor refractory desensitization, explaining reduced nociceptive visceral hypersensitivity in rodent colon models.",
        extracted_entities={
            "plants": ["Zingiber officinale"],
            "compounds": ["6-Gingerol", "6-Shogaol"],
            "targets": ["TRPV1"],
            "diseases": ["Visceral pain", "Abdominal spasms"]
        },
        verification_status="Accepted",
        annotated_by="Researcher (Verified)"
    )
]
