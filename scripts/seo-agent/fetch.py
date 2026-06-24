#!/usr/bin/env python3
"""Fetch a rich GSC + GA4 data bundle for the weekly SEO content agent.

Env:
  GCP_SA_KEY        service-account JSON (raw JSON string)
  GA4_PROPERTY_ID   numeric GA4 property id
  GSC_SITE          Search Console property (e.g. https://nphacks.net/)
  SEO_DATA_OUT      output path (default ./seo-data.json)

Pulls a broad-but-bounded slice across the high-value dimensions (it is not
literally every row GSC/GA4 hold — that would be unanalyzable noise — but it
covers queries, pages, query x page, device, daily trend, channels, countries,
landing pages and events so the analysis has real depth).
"""
import os, sys, json, socket, datetime
from google.oauth2 import service_account

socket.setdefaulttimeout(30)
def log(m): print(m, file=sys.stderr, flush=True)

GA4 = os.environ["GA4_PROPERTY_ID"]
GSC = os.environ["GSC_SITE"]
OUT = os.environ.get("SEO_DATA_OUT", "seo-data.json")
INFO = json.loads(os.environ["GCP_SA_KEY"])

today = datetime.date.today()
gsc_end = today - datetime.timedelta(days=3)
gsc_start = gsc_end - datetime.timedelta(days=28)

bundle = {
    "generated": today.isoformat(),
    "windows": {"gsc": {"start": gsc_start.isoformat(), "end": gsc_end.isoformat()},
                "ga4": "current 28d vs prior 28d"},
    "gsc": {}, "ga4": {}, "cloudflare": {}, "errors": [],
}

# ---------------- Search Console ----------------
try:
    import time as _t
    from googleapiclient.discovery import build
    creds = service_account.Credentials.from_service_account_info(
        INFO, scopes=["https://www.googleapis.com/auth/webmasters.readonly"])
    sc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    s, e = gsc_start.isoformat(), gsc_end.isoformat()

    def gscq(dims, limit):
        body = {"startDate": s, "endDate": e, "dimensions": dims, "rowLimit": limit}
        last = None
        for attempt in range(4):
            try:
                return sc.searchanalytics().query(siteUrl=GSC, body=body).execute(num_retries=1).get("rows", [])
            except Exception as ex:
                last = ex; log(f"GSC {dims} attempt {attempt+1}: {repr(ex)[:70]}"); _t.sleep(2*(attempt+1))
        raise last

    def row1(r):
        return {"key": r["keys"][0], "clicks": r["clicks"], "impr": r["impressions"],
                "ctr": round(r["ctr"], 4), "pos": round(r["position"], 1)}

    queries = [row1(r) for r in gscq(["query"], 250)]; log(f"GSC queries {len(queries)}")
    pages = [{"page": r["keys"][0], "clicks": r["clicks"], "impr": r["impressions"],
              "ctr": round(r["ctr"], 4), "pos": round(r["position"], 1)} for r in gscq(["page"], 100)]; log(f"GSC pages {len(pages)}")
    qp = [{"query": r["keys"][0], "page": r["keys"][1], "clicks": r["clicks"], "impr": r["impressions"],
           "ctr": round(r["ctr"], 4), "pos": round(r["position"], 1)} for r in gscq(["query", "page"], 150)]; log(f"GSC q+p {len(qp)}")
    devices = [{"device": r["keys"][0], "clicks": r["clicks"], "impr": r["impressions"],
                "ctr": round(r["ctr"], 4), "pos": round(r["position"], 1)} for r in gscq(["device"], 10)]
    daily = [{"date": r["keys"][0], "clicks": r["clicks"], "impr": r["impressions"]} for r in gscq(["date"], 60)]
    log("GSC device+daily")

    bundle["gsc"] = {
        "top_by_clicks": sorted(queries, key=lambda x: x["clicks"], reverse=True)[:40],
        "top_by_impressions": sorted(queries, key=lambda x: x["impr"], reverse=True)[:40],
        "striking_distance": sorted([x for x in queries if 4.0 <= x["pos"] <= 20.0 and x["impr"] >= 15],
                                    key=lambda x: x["impr"], reverse=True)[:40],
        "low_ctr_high_impressions": sorted([x for x in queries if x["impr"] >= 40 and x["ctr"] < 0.03],
                                           key=lambda x: x["impr"], reverse=True)[:25],
        "all_queries_count": len(queries),
        "top_pages": pages,
        "query_page_map": qp,
        "devices": devices,
        "daily_trend": daily,
    }
except Exception as ex:
    bundle["errors"].append("GSC: " + repr(ex)[:300]); log("GSC ERROR " + repr(ex)[:160])

# ---------------- GA4 ----------------
try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import RunReportRequest, DateRange, Metric, Dimension, OrderBy
    creds = service_account.Credentials.from_service_account_info(
        INFO, scopes=["https://www.googleapis.com/auth/analytics.readonly"])
    client = BetaAnalyticsDataClient(credentials=creds)
    prop = f"properties/{GA4}"

    def report(dims, mets, n=20, order_metric=None, ranges=None):
        return client.run_report(RunReportRequest(
            property=prop, dimensions=[Dimension(name=d) for d in dims],
            metrics=[Metric(name=m) for m in mets],
            date_ranges=ranges or [DateRange(start_date="28daysAgo", end_date="today")],
            order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_metric), desc=True)] if order_metric else None,
            limit=n))

    def rows(r, dim):
        return [{dim: row.dimension_values[0].value,
                 **{r.metric_headers[i].name: row.metric_values[i].value for i in range(len(row.metric_values))}}
                for row in r.rows]

    totals = report([], ["sessions", "activeUsers", "newUsers", "engagementRate", "averageSessionDuration", "screenPageViews", "keyEvents"],
                    ranges=[DateRange(start_date="28daysAgo", end_date="today"),
                            DateRange(start_date="56daysAgo", end_date="29daysAgo")])
    names = [h.name for h in totals.metric_headers]
    bundle["ga4"]["totals_28d"] = dict(zip(names, [m.value for m in totals.rows[0].metric_values])) if totals.rows else {}
    bundle["ga4"]["totals_prev_28d"] = dict(zip(names, [m.value for m in totals.rows[1].metric_values])) if len(totals.rows) > 1 else {}
    log("GA4 totals")
    bundle["ga4"]["top_pages"] = rows(report(["pagePath"], ["screenPageViews", "sessions", "averageSessionDuration"], 25, "screenPageViews"), "pagePath"); log("GA4 pages")
    bundle["ga4"]["landing_pages"] = rows(report(["landingPagePlusQueryString"], ["sessions", "engagementRate"], 15, "sessions"), "landingPagePlusQueryString"); log("GA4 landing")
    bundle["ga4"]["channels"] = rows(report(["sessionDefaultChannelGroup"], ["sessions", "engagementRate"], 12, "sessions"), "sessionDefaultChannelGroup")
    bundle["ga4"]["countries"] = rows(report(["country"], ["sessions", "engagementRate"], 15, "sessions"), "country")
    bundle["ga4"]["devices"] = rows(report(["deviceCategory"], ["sessions", "engagementRate"], 5, "sessions"), "deviceCategory")
    bundle["ga4"]["events"] = rows(report(["eventName"], ["eventCount"], 20, "eventCount"), "eventName")
    bundle["ga4"]["daily_sessions"] = sorted(rows(report(["date"], ["sessions", "activeUsers"], 40), "date"), key=lambda x: x["date"])
    bundle["ga4"]["new_vs_returning"] = rows(report(["newVsReturning"], ["sessions"], 5, "sessions"), "newVsReturning")
    log("GA4 done")
except Exception as ex:
    bundle["errors"].append("GA4: " + repr(ex)[:300]); log("GA4 ERROR " + repr(ex)[:160])

# ---------------- Cloudflare edge analytics (consent-free, counts ALL visitors) ----------------
CF_TOKEN = os.environ.get("CF_ANALYTICS_TOKEN")
CF_ZONE = os.environ.get("CF_ZONE_ID")
if CF_TOKEN and CF_ZONE:
    try:
        import urllib.request
        cf_start = (today - datetime.timedelta(days=30)).isoformat()
        q = ('query{viewer{zones(filter:{zoneTag:"%s"}){'
             'httpRequests1dGroups(limit:31,filter:{date_geq:"%s"},orderBy:[date_ASC]){'
             'dimensions{date} '
             'sum{requests pageViews cachedRequests bytes threats '
             'countryMap{clientCountryName requests} '
             'responseStatusMap{edgeResponseStatus requests}} '
             'uniq{uniques}}}}}' % (CF_ZONE, cf_start))
        req = urllib.request.Request(
            "https://api.cloudflare.com/client/v4/graphql",
            data=json.dumps({"query": q}).encode(),
            headers={"Authorization": "Bearer " + CF_TOKEN, "Content-Type": "application/json"})
        resp = json.load(urllib.request.urlopen(req, timeout=40))
        if resp.get("errors"):
            raise RuntimeError(str(resp["errors"])[:200])
        groups = resp["data"]["viewer"]["zones"][0]["httpRequests1dGroups"]
        bundle["cloudflare"]["note"] = ("Edge analytics = consent-free, counts ALL visitors (incl. bots). "
                                        "Use this + GSC as the trustworthy traffic source; GA4 is consent-gated and undercounts. "
                                        "CF was set up recently so history is short and grows over time.")
        bundle["cloudflare"]["daily"] = [
            {"date": g["dimensions"]["date"], "requests": g["sum"]["requests"],
             "pageViews": g["sum"]["pageViews"], "cachedRequests": g["sum"]["cachedRequests"],
             "uniques": g["uniq"]["uniques"], "threats": g["sum"].get("threats", 0)} for g in groups]
        if groups:
            latest = groups[-1]["sum"]
            bundle["cloudflare"]["latest_day_countries"] = [
                {"country": c["clientCountryName"], "requests": c["requests"]}
                for c in sorted(latest.get("countryMap", []), key=lambda x: -x["requests"])[:12]]
            bundle["cloudflare"]["latest_day_status_codes"] = [
                {"status": s["edgeResponseStatus"], "requests": s["requests"]}
                for s in sorted(latest.get("responseStatusMap", []), key=lambda x: -x["requests"])[:10]]
        log(f"CF {len(groups)} days")
    except Exception as ex:
        bundle["errors"].append("CF: " + repr(ex)[:300]); log("CF ERROR " + repr(ex)[:160])

with open(OUT, "w") as f:
    json.dump(bundle, f, indent=2)
print("wrote", OUT, "(", len(json.dumps(bundle)), "bytes )")
print("GSC queries:", bundle.get("gsc", {}).get("all_queries_count"),
      "| GA4 sessions 28d:", bundle.get("ga4", {}).get("totals_28d", {}).get("sessions"),
      "| errors:", bundle["errors"] or "none")
