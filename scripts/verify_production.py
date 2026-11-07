"""
AYURGRAPH-X Production Verification Script
Runs end-to-end tests against deployed frontend and backend URLs.
Usage: python scripts/verify_production.py <frontend_url> <backend_url>
"""

import sys
import json
import urllib.request
import urllib.error
import time

def check_endpoint(name: str, url: str, expected_codes=(200,)) -> dict:
    start_time = time.time()
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "AYURGRAPH-X-Production-Probe/1.0",
                "Accept": "application/json, text/html, */*"
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            elapsed = round((time.time() - start_time) * 1000, 2)
            code = resp.getcode()
            body = resp.read(2048).decode("utf-8", errors="replace")
            return {
                "name": name,
                "url": url,
                "status": "PASS" if code in expected_codes else "FAIL",
                "code": code,
                "latency_ms": elapsed,
                "sample": body[:120].strip()
            }
    except urllib.error.HTTPError as e:
        elapsed = round((time.time() - start_time) * 1000, 2)
        return {
            "name": name,
            "url": url,
            "status": "PASS" if e.code in expected_codes else "FAIL",
            "code": e.code,
            "latency_ms": elapsed,
            "error": str(e)
        }
    except Exception as e:
        elapsed = round((time.time() - start_time) * 1000, 2)
        return {
            "name": name,
            "url": url,
            "status": "ERROR",
            "code": None,
            "latency_ms": elapsed,
            "error": str(e)
        }

def main():
    frontend = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "https://ayurgraph-x.vercel.app"
    backend = sys.argv[2].rstrip("/") if len(sys.argv) > 2 else "https://ayurgraph-x-api.onrender.com"

    print("=" * 70)
    print("🌿 AYURGRAPH-X — Live Production Health & Integration Probe")
    print(f"Frontend Target: {frontend}")
    print(f"Backend Target:  {backend}")
    print("=" * 70)

    checks = [
        # Backend Checks
        ("Backend Root / Info", f"{backend}/"),
        ("Backend Health Check", f"{backend}/health"),
        ("Swagger / OpenAPI Docs", f"{backend}/docs"),
        ("API: Plants Catalog", f"{backend}/api/v1/plants"),
        ("API: Compounds Catalog", f"{backend}/api/v1/compounds"),
        ("API: Targets Catalog", f"{backend}/api/v1/targets"),
        ("API: Pathways Catalog", f"{backend}/api/v1/pathways"),
        ("API: Graph Topology", f"{backend}/api/v1/graph/data"),
        ("API: Global Search", f"{backend}/api/v1/search?q=ashwagandha"),
        ("API: Literature Review", f"{backend}/api/v1/literature/miner"),
        ("API: Polyherbal Formulations", f"{backend}/api/v1/formulations"),
        ("API: Biodiversity Intel", f"{backend}/api/v1/biodiversity"),
        ("API: Hypotheses Engine", f"{backend}/api/v1/hypotheses"),

        # Frontend Route Checks
        ("Frontend: Homepage", f"{frontend}/"),
        ("Frontend: Evidence-to-Discovery", f"{frontend}/pathway"),
        ("Frontend: EthnoGraph Explorer", f"{frontend}/ethnograph"),
        ("Frontend: Knowledge Miner", f"{frontend}/miner"),
        ("Frontend: PhytoDiscover", f"{frontend}/phytodiscover"),
        ("Frontend: FormulaLab", f"{frontend}/formulalab"),
        ("Frontend: BioGuard Intelligence", f"{frontend}/bioguard"),
        ("Frontend: TimeLens Chronology", f"{frontend}/timelens"),
        ("Frontend: EvidenceTrust Audit", f"{frontend}/evidencetrust"),
        ("Frontend: Hypothesis Studio", f"{frontend}/hypotheses"),
    ]

    results = []
    passed = 0
    for name, url in checks:
        res = check_endpoint(name, url)
        results.append(res)
        status_symbol = "✅" if res["status"] == "PASS" else ("⚠️" if res["status"] == "FAIL" else "❌")
        code_str = str(res["code"]) if res["code"] else "ERR"
        print(f"{status_symbol} [{code_str:>3}] {res['latency_ms']:>6.1f}ms | {name:<30} -> {url}")
        if res["status"] == "PASS":
            passed += 1

    print("=" * 70)
    print(f"Verification Summary: {passed}/{len(checks)} passed ({round(passed/len(checks)*100, 1)}%)")
    print("=" * 70)

    return 0 if passed == len(checks) else 1

if __name__ == "__main__":
    sys.exit(main())
