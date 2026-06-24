#!/usr/bin/env python3
"""Ad-hoc GSC / GA4 query tool — lets the SEO agent drill into any slice on demand.

Reads GCP_SA_KEY, GA4_PROPERTY_ID, GSC_SITE from the environment. Prints JSON to stdout.

GSC examples:
  python scripts/seo-agent/query.py gsc --dims query,page --days 28 --rows 100
  python scripts/seo-agent/query.py gsc --dims query --days 90 --rows 50 --filter page contains /puzzles/lockpick
  python scripts/seo-agent/query.py gsc --dims date --days 90            # daily trend
  python scripts/seo-agent/query.py gsc --dims query --filter query contains lockpick

GA4 examples:
  python scripts/seo-agent/query.py ga4 --dims pagePath --mets screenPageViews,sessions,averageSessionDuration --days 28 --rows 25
  python scripts/seo-agent/query.py ga4 --dims eventName --mets eventCount --order eventCount
  python scripts/seo-agent/query.py ga4 --dims sessionSourceMedium --mets sessions,engagementRate --days 90
  python scripts/seo-agent/query.py ga4 --dims country,deviceCategory --mets sessions --rows 30

Notes: GSC data lags ~3 days (end date = today-3). --filter takes 3 tokens:
  <dimension> <operator> <value>   operators: contains|equals|notContains|notEquals|includingRegex|excludingRegex
"""
import os, sys, json, socket, datetime, argparse
from google.oauth2 import service_account

socket.setdefaulttimeout(30)
INFO = json.loads(os.environ["GCP_SA_KEY"])
GA4 = os.environ.get("GA4_PROPERTY_ID")
GSC = os.environ.get("GSC_SITE")


def run_gsc(a):
    import time
    from googleapiclient.discovery import build
    creds = service_account.Credentials.from_service_account_info(
        INFO, scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    sc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    end = datetime.date.today() - datetime.timedelta(days=3)
    start = end - datetime.timedelta(days=a.days)
    body = {"startDate": start.isoformat(), "endDate": end.isoformat(),
            "dimensions": a.dims.split(","), "rowLimit": a.rows}
    if a.filter:
        dim, op, val = a.filter
        body["dimensionFilterGroups"] = [{"filters": [{"dimension": dim, "operator": op, "expression": val}]}]
    last = None
    for attempt in range(4):
        try:
            rows = sc.searchanalytics().query(siteUrl=GSC, body=body).execute(num_retries=1).get("rows", [])
            dims = a.dims.split(",")
            out = []
            for r in rows:
                d = {dims[i]: r["keys"][i] for i in range(len(dims))}
                d.update(clicks=r["clicks"], impressions=r["impressions"],
                         ctr=round(r["ctr"], 4), position=round(r["position"], 1))
                out.append(d)
            return {"window": {"start": start.isoformat(), "end": end.isoformat()}, "rows": out}
        except Exception as ex:
            last = ex; time.sleep(2 * (attempt + 1))
    raise last


def run_ga4(a):
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric, Dimension, OrderBy
    creds = service_account.Credentials.from_service_account_info(
        INFO, scopes=["https://www.googleapis.com/auth/analytics.readonly"])
    client = BetaAnalyticsDataClient(credentials=creds)
    dims = [d for d in a.dims.split(",") if d] if a.dims else []
    mets = a.mets.split(",")
    req = RunReportRequest(
        property=f"properties/{GA4}",
        dimensions=[Dimension(name=d) for d in dims],
        metrics=[Metric(name=m) for m in mets],
        date_ranges=[DateRange(start_date=f"{a.days}daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=a.order), desc=True)] if a.order else None,
        limit=a.rows)
    resp = client.run_report(req)
    out = []
    for row in resp.rows:
        d = {dims[i]: row.dimension_values[i].value for i in range(len(dims))}
        d.update({resp.metric_headers[i].name: row.metric_values[i].value for i in range(len(row.metric_values))})
        out.append(d)
    return {"days": a.days, "rows": out}


def run_cf(a):
    import urllib.request
    token = os.environ["CF_ANALYTICS_TOKEN"]; zone = os.environ["CF_ZONE_ID"]
    start = (datetime.date.today() - datetime.timedelta(days=a.days)).isoformat()
    q = ('query{viewer{zones(filter:{zoneTag:"%s"}){'
         'httpRequests1dGroups(limit:31,filter:{date_geq:"%s"},orderBy:[date_ASC]){'
         'dimensions{date} sum{requests pageViews cachedRequests threats '
         'countryMap{clientCountryName requests} responseStatusMap{edgeResponseStatus requests}} '
         'uniq{uniques}}}}}' % (zone, start))
    req = urllib.request.Request("https://api.cloudflare.com/client/v4/graphql",
        data=json.dumps({"query": q}).encode(),
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"})
    d = json.load(urllib.request.urlopen(req, timeout=40))
    if d.get("errors"):
        return {"error": str(d["errors"])[:300]}
    groups = d["data"]["viewer"]["zones"][0]["httpRequests1dGroups"]
    if a.view == "daily":
        return {"rows": [{"date": g["dimensions"]["date"], "requests": g["sum"]["requests"],
                          "pageViews": g["sum"]["pageViews"], "uniques": g["uniq"]["uniques"],
                          "cached": g["sum"]["cachedRequests"], "threats": g["sum"].get("threats", 0)} for g in groups]}
    latest = groups[-1]["sum"] if groups else {}
    if a.view == "countries":
        return {"rows": sorted([{"country": c["clientCountryName"], "requests": c["requests"]}
                                for c in latest.get("countryMap", [])], key=lambda x: -x["requests"])}
    return {"rows": sorted([{"status": s["edgeResponseStatus"], "requests": s["requests"]}
                            for s in latest.get("responseStatusMap", [])], key=lambda x: -x["requests"])}


p = argparse.ArgumentParser(description="Ad-hoc GSC/GA4/Cloudflare query tool")
sub = p.add_subparsers(dest="source", required=True)
g = sub.add_parser("gsc"); g.add_argument("--dims", default="query"); g.add_argument("--days", type=int, default=28)
g.add_argument("--rows", type=int, default=50); g.add_argument("--filter", nargs=3, metavar=("DIM", "OP", "VAL"))
a4 = sub.add_parser("ga4"); a4.add_argument("--dims", default=""); a4.add_argument("--mets", default="sessions")
a4.add_argument("--days", type=int, default=28); a4.add_argument("--rows", type=int, default=25); a4.add_argument("--order", default=None)
cf = sub.add_parser("cf"); cf.add_argument("--days", type=int, default=7)
cf.add_argument("--view", choices=["daily", "countries", "status"], default="daily")

args = p.parse_args()
try:
    result = run_gsc(args) if args.source == "gsc" else (run_ga4(args) if args.source == "ga4" else run_cf(args))
    print(json.dumps(result, indent=2))
except Exception as ex:
    print(json.dumps({"error": repr(ex)[:400]}, indent=2)); sys.exit(1)
