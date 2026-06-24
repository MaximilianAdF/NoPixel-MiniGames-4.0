#!/usr/bin/env python3
"""Fetch a compact GSC + GA4 data bundle for the weekly SEO content agent.

Env:
  GCP_SA_KEY        service-account JSON (the raw JSON string)
  GA4_PROPERTY_ID   numeric GA4 property id
  GSC_SITE          Search Console property (e.g. https://nphacks.net/)
  SEO_DATA_OUT      output path (default ./seo-data.json)
Reads only; writes a single JSON file the Claude step then analyzes.
"""
import os, sys, json, socket, datetime
from google.oauth2 import service_account

socket.setdefaulttimeout(30)


def log(m):
    print(m, file=sys.stderr, flush=True)


GA4 = os.environ["GA4_PROPERTY_ID"]
GSC = os.environ["GSC_SITE"]
OUT = os.environ.get("SEO_DATA_OUT", "seo-data.json")
INFO = json.loads(os.environ["GCP_SA_KEY"])

today = datetime.date.today()
gsc_end = today - datetime.timedelta(days=3)   # GSC lags ~2-3 days
gsc_start = gsc_end - datetime.timedelta(days=28)

bundle = {
    "generated": today.isoformat(),
    "windows": {"gsc": {"start": gsc_start.isoformat(), "end": gsc_end.isoformat()}},
    "gsc": {}, "ga4": {}, "errors": [],
}

# ---------------- Search Console ----------------
try:
    from googleapiclient.discovery import build
    creds = service_account.Credentials.from_service_account_info(
        INFO, scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    sc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    s, e = gsc_start.isoformat(), gsc_end.isoformat()
    log("GSC: client ready")

    import time as _t
    def gsc_query(dims, limit):
        body = {"startDate": s, "endDate": e, "dimensions": dims, "rowLimit": limit}
        last = None
        for attempt in range(4):
            try:
                return sc.searchanalytics().query(siteUrl=GSC, body=body).execute(num_retries=1).get("rows", [])
            except Exception as ex:
                last = ex; log(f"GSC attempt {attempt + 1} failed: {repr(ex)[:80]}"); _t.sleep(2 * (attempt + 1))
        raise last

    queries = gsc_query(["query"], 50); log(f"GSC: {len(queries)} queries")
    pages = gsc_query(["page"], 50); log(f"GSC: {len(pages)} pages")

    def q(r):
        return {"key": r["keys"][0], "clicks": r["clicks"], "impr": r["impressions"],
                "ctr": round(r["ctr"], 4), "pos": round(r["position"], 1)}

    qs = [q(r) for r in queries]
    bundle["gsc"] = {
        "top_by_clicks": sorted(qs, key=lambda x: x["clicks"], reverse=True)[:25],
        "top_by_impressions": sorted(qs, key=lambda x: x["impr"], reverse=True)[:25],
        "striking_distance": sorted([x for x in qs if 4.0 <= x["pos"] <= 20.0 and x["impr"] >= 20],
                                    key=lambda x: x["impr"], reverse=True)[:25],
        "low_ctr_high_impressions": sorted([x for x in qs if x["impr"] >= 50 and x["ctr"] < 0.02],
                                           key=lambda x: x["impr"], reverse=True)[:15],
        "top_pages": [{"page": r["keys"][0], "clicks": r["clicks"], "impr": r["impressions"],
                       "ctr": round(r["ctr"], 4), "pos": round(r["position"], 1)} for r in pages],
    }
except Exception as ex:
    bundle["errors"].append("GSC: " + repr(ex)[:300]); log("GSC ERROR: " + repr(ex)[:200])

# ---------------- GA4 ----------------
try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric, Dimension, OrderBy
    creds = service_account.Credentials.from_service_account_info(
        INFO, scopes=["https://www.googleapis.com/auth/analytics.readonly"])
    client = BetaAnalyticsDataClient(credentials=creds)
    prop = f"properties/{GA4}"
    log("GA4: client ready")

    def report(dims, mets, n=15, order_metric=None, ranges=None):
        req = RunReportRequest(
            property=prop, dimensions=[Dimension(name=d) for d in dims],
            metrics=[Metric(name=m) for m in mets],
            date_ranges=ranges or [DateRange(start_date="28daysAgo", end_date="today")],
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_metric), desc=True)] if order_metric else None,
            limit=n)
        return client.run_report(req)

    def rows(r, dim):
        return [{dim: row.dimension_values[0].value,
                 **{r.metric_headers[i].name: row.metric_values[i].value for i in range(len(row.metric_values))}}
                for row in r.rows]

    totals = report([], ["sessions", "activeUsers", "engagementRate", "averageSessionDuration", "screenPageViews"],
                    ranges=[DateRange(start_date="28daysAgo", end_date="today"),
                            DateRange(start_date="56daysAgo", end_date="29daysAgo")])
    names = [h.name for h in totals.metric_headers]
    bundle["ga4"]["totals_28d"] = dict(zip(names, [m.value for m in totals.rows[0].metric_values])) if totals.rows else {}
    bundle["ga4"]["totals_prev_28d"] = dict(zip(names, [m.value for m in totals.rows[1].metric_values])) if len(totals.rows) > 1 else {}
    log("GA4: totals")
    bundle["ga4"]["top_pages"] = rows(report(["pagePath"], ["screenPageViews", "sessions"], 20, "screenPageViews"), "pagePath"); log("GA4: pages")
    bundle["ga4"]["channels"] = rows(report(["sessionDefaultChannelGroup"], ["sessions", "engagementRate"], 12, "sessions"), "sessionDefaultChannelGroup"); log("GA4: channels")
    bundle["ga4"]["countries"] = rows(report(["country"], ["sessions", "engagementRate"], 12, "sessions"), "country"); log("GA4: countries")
    bundle["ga4"]["new_vs_returning"] = rows(report(["newVsReturning"], ["sessions"], 5, "sessions"), "newVsReturning"); log("GA4: nvr")
except Exception as ex:
    bundle["errors"].append("GA4: " + repr(ex)[:300]); log("GA4 ERROR: " + repr(ex)[:200])

with open(OUT, "w") as f:
    json.dump(bundle, f, indent=2)
print("wrote", OUT)
print("GSC striking:", len(bundle.get("gsc", {}).get("striking_distance", [])),
      "| GA4 sessions 28d:", bundle.get("ga4", {}).get("totals_28d", {}).get("sessions"),
      "| errors:", bundle["errors"] or "none")
