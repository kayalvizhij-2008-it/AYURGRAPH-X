import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health_endpoints():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "AYURGRAPH-X"
    assert data["indexed_records"]["plants"] > 0
    assert data["indexed_records"]["compounds"] > 0
    assert data["indexed_records"]["targets"] > 0
    assert data["indexed_records"]["pathways"] > 0
    assert data["indexed_records"]["diseases"] > 0

    h_resp = client.get("/health")
    assert h_resp.status_code == 200
    assert h_resp.json()["status"] == "healthy"

def test_plants_endpoints():
    response = client.get("/api/v1/plants")
    assert response.status_code == 200
    plants = response.json()
    assert len(plants) >= 5

    # Test single plant
    p_resp = client.get("/api/v1/plants/PLANT_001")
    assert p_resp.status_code == 200
    plant = p_resp.json()
    assert "Withania" in plant["scientific_name"]
    assert len(plant["traditional_uses"]) > 0

    # Test 404 for nonexistent plant
    not_found = client.get("/api/v1/plants/NON_EXISTENT")
    assert not_found.status_code == 404

def test_plant_compounds_endpoints():
    compounds_resp = client.get("/api/v1/plants/PLANT_001/compounds")
    assert compounds_resp.status_code == 200
    compounds = compounds_resp.json()
    assert len(compounds) > 0
    assert any(c["name"] == "Withaferin A" for c in compounds)

def test_compounds_endpoints():
    response = client.get("/api/v1/compounds")
    assert response.status_code == 200
    compounds = response.json()
    assert len(compounds) >= 10

    # Test filter by chemical class
    filter_resp = client.get("/api/v1/compounds?chemical_class=lactone")
    assert filter_resp.status_code == 200
    filtered = filter_resp.json()
    assert len(filtered) > 0

    # Test single compound
    c_resp = client.get("/api/v1/compounds/CMP_001")
    assert c_resp.status_code == 200
    cmp_data = c_resp.json()
    assert cmp_data["name"] == "Withaferin A"
    assert cmp_data["properties"]["molecular_weight"] > 0

    # Test compound bioactivity
    bio_resp = client.get("/api/v1/compounds/CMP_001/bioactivity")
    assert bio_resp.status_code == 200
    bio = bio_resp.json()
    assert "curated_bioactivities" in bio
    assert len(bio["curated_bioactivities"]) > 0

    # 404 for invalid compound
    assert client.get("/api/v1/compounds/INVALID_CMP").status_code == 404

def test_targets_endpoints():
    response = client.get("/api/v1/targets")
    assert response.status_code == 200
    targets = response.json()
    assert len(targets) >= 4

    t_resp = client.get("/api/v1/targets/TGT_001")
    assert t_resp.status_code == 200
    tgt = t_resp.json()
    assert tgt["gene_symbol"] == "NFKB1"
    assert len(tgt["associated_diseases"]) > 0

    # Test 404
    assert client.get("/api/v1/targets/INVALID_TARGET").status_code == 404

def test_pathways_and_diseases_endpoints():
    pw_resp = client.get("/api/v1/pathways")
    assert pw_resp.status_code == 200
    pathways = pw_resp.json()
    assert len(pathways) >= 4

    single_pw = client.get("/api/v1/pathways/PW_001")
    assert single_pw.status_code == 200
    assert "NF-kappa" in single_pw.json()["name"]

    dis_resp = client.get("/api/v1/pathways/diseases/all")
    assert dis_resp.status_code == 200
    assert len(dis_resp.json()) >= 4

def test_graph_and_subgraph_endpoints():
    response = client.get("/api/v1/graph")
    assert response.status_code == 200
    graph = response.json()
    assert "nodes" in graph
    assert "edges" in graph
    assert len(graph["nodes"]) > 10

    # Subgraph ego-network
    sub_resp = client.get("/api/v1/graph/subgraph/PLANT_001?depth=1")
    assert sub_resp.status_code == 200
    subgraph = sub_resp.json()
    assert len(subgraph["nodes"]) > 0
    assert any(n["id"] == "PLANT_001" for n in subgraph["nodes"])

def test_evidence_pathway_multivariant():
    # 1. Ashwagandha
    ashwa = client.get("/api/v1/graph/pathway?plant_id=PLANT_001&disease_id=DIS_001")
    assert ashwa.status_code == 200
    ashwa_p = ashwa.json()
    assert len(ashwa_p["steps"]) == 8
    assert len(ashwa_p["edges"]) == 7
    assert "Withania" in ashwa_p["steps"][1]["entity_name"]
    assert "Withaferin" in ashwa_p["steps"][3]["entity_name"]

    # 2. Turmeric
    turmeric = client.get("/api/v1/graph/pathway?plant_id=PLANT_002&disease_id=DIS_002")
    assert turmeric.status_code == 200
    turmeric_p = turmeric.json()
    assert len(turmeric_p["steps"]) == 8
    assert "Curcuma" in turmeric_p["steps"][1]["entity_name"]
    assert "Curcumin" in turmeric_p["steps"][3]["entity_name"]

    # 3. Ginger
    ginger = client.get("/api/v1/graph/pathway?plant_id=PLANT_005&disease_id=DIS_007")
    assert ginger.status_code == 200
    ginger_p = ginger.json()
    assert len(ginger_p["steps"]) == 8
    assert "Zingiber" in ginger_p["steps"][1]["entity_name"]
    assert "Shogaol" in ginger_p["steps"][3]["entity_name"]

def test_hypotheses_ranking_and_filters():
    # All hypotheses
    response = client.get("/api/v1/hypotheses")
    assert response.status_code == 200
    hyps = response.json()
    assert len(hyps) >= 3
    top = hyps[0]
    assert "score" in top
    assert len(top["factors"]) == 6
    assert "responsible_use_disclaimer" in top

    # Filtered by plant
    filtered = client.get("/api/v1/hypotheses?plant_id=PLANT_002")
    assert filtered.status_code == 200
    filtered_hyps = filtered.json()
    assert len(filtered_hyps) > 0
    assert all(h["plant_id"] == "PLANT_002" for h in filtered_hyps)

def test_global_search():
    # 1. Botanical name
    res1 = client.get("/api/v1/search?q=withania").json()
    assert res1["total_hits"] > 0
    assert len(res1["results"]["plants"]) > 0

    # 2. Common name
    res2 = client.get("/api/v1/search?q=turmeric").json()
    assert res2["total_hits"] > 0
    assert len(res2["results"]["plants"]) > 0

    # 3. Compound
    res3 = client.get("/api/v1/search?q=curcumin").json()
    assert res3["total_hits"] > 0
    assert len(res3["results"]["compounds"]) > 0

    # 4. Target
    res4 = client.get("/api/v1/search?q=nfkb1").json()
    assert res4["total_hits"] > 0
    assert len(res4["results"]["targets"]) > 0

    # 5. Formulation
    res5 = client.get("/api/v1/search?q=triphala").json()
    assert res5["total_hits"] > 0
    assert len(res5["results"]["formulations"]) > 0

def test_dossier_generation_and_download():
    # Generate JSON response
    response = client.get("/api/v1/dossier/generate?plant_id=PLANT_001&disease_id=DIS_001")
    assert response.status_code == 200
    dossier = response.json()
    assert "research_question" in dossier
    assert "pathway" in dossier
    assert "hypothesis" in dossier
    assert len(dossier["sources_and_licences"]) > 0

    # Download JSON endpoint
    dl_resp = client.get("/api/v1/dossier/download/json?plant_id=PLANT_001&disease_id=DIS_001")
    assert dl_resp.status_code == 200
    assert dl_resp.headers["content-type"] == "application/json"
    assert "attachment" in dl_resp.headers["content-disposition"]

    # 404 for invalid plant or disease
    assert client.get("/api/v1/dossier/generate?plant_id=INVALID&disease_id=DIS_001").status_code == 404
    assert client.get("/api/v1/dossier/generate?plant_id=PLANT_001&disease_id=INVALID").status_code == 404

def test_literature_extractor_and_review_loop():
    # 1. Extraction from text
    extract_resp = client.post(
        "/api/v1/literature/extract",
        json={
            "text": "Withaferin A extracted from Withania somnifera downregulates NFKB1 in neurodegenerative models.",
            "title": "Test Title",
            "pmid": "PMID:12345678"
        }
    )
    assert extract_resp.status_code == 200
    data = extract_resp.json()
    assert "Withania somnifera" in data["extracted_entities"]["plants"]
    assert "Withaferin A" in data["extracted_entities"]["compounds"]
    assert "NFKB1" in data["extracted_entities"]["targets"]

    # 2. Review accept action
    accept_resp = client.post(
        "/api/v1/literature/review",
        json={
            "snippet_id": "SNIP_001",
            "action": "accept",
            "reviewer_notes": "Expert confirmation"
        }
    )
    assert accept_resp.status_code == 200
    assert accept_resp.json()["success"] is True

    # 3. Review correct action
    correct_resp = client.post(
        "/api/v1/literature/review",
        json={
            "snippet_id": "SNIP_001",
            "action": "correct",
            "corrected_entities": {
                "plants": ["Withania somnifera"],
                "compounds": ["Withaferin A"],
                "targets": ["IL6"],
                "diseases": ["Neurodegenerative Disorders"]
            },
            "reviewer_notes": "Corrected target to IL6"
        }
    )
    assert correct_resp.status_code == 200
    assert correct_resp.json()["success"] is True

def test_formulations_endpoints_and_sensitivity():
    # 1. List formulations
    f_resp = client.get("/api/v1/formulations")
    assert f_resp.status_code == 200
    forms = f_resp.json()
    assert len(forms) >= 2

    # 2. Formulation analysis & remove-one sensitivity
    analysis_resp = client.get("/api/v1/formulations/FORM_001/analysis")
    assert analysis_resp.status_code == 200
    analysis = analysis_resp.json()
    assert "remove_one_matrix" in analysis
    assert len(analysis["remove_one_matrix"]) > 0
    assert "synergy_disclaimer" in analysis

    # 3. Custom formulation creation
    create_resp = client.post(
        "/api/v1/formulations",
        json={
            "name": "AyurGraph Research Formula",
            "traditional_system": "Ayurveda",
            "reference_text": "Experimental Protocol v1",
            "traditional_indications": ["Neuroprotection", "Inflammation"],
            "plant_ids": ["PLANT_001", "PLANT_002"]
        }
    )
    assert create_resp.status_code == 200
    new_form = create_resp.json()
    assert new_form["name"] == "AyurGraph Research Formula"
    assert len(new_form["ingredients"]) == 2

def test_biodiversity_and_evidence():
    # Biodiversity profile
    bio_resp = client.get("/api/v1/biodiversity/PLANT_001")
    assert bio_resp.status_code == 200
    bio_data = bio_resp.json()
    assert "conservation_assessment" in bio_data
    assert "occurrences" in bio_data

    # Evidence list and summary stats
    ev_resp = client.get("/api/v1/evidence")
    assert ev_resp.status_code == 200
    assert len(ev_resp.json()) > 0

    stats_resp = client.get("/api/v1/evidence/summary/stats")
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert stats["total_evidence_records"] > 0
