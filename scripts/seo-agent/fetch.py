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
    "gsc": {}, "ga4": {}, "cloudflare": {}, "web_vitals": {}, "errors": [],
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

# ---------------- Core Web Vitals via PageSpeed Insights (Google's ranking signal) ----------------
try:
    import urllib.request, urllib.parse
    PSI_KEY = os.environ.get("PSI_API_KEY", "")

    def psi(url, strategy="mobile"):
        params = {"url": url, "strategy": strategy, "category": "performance"}
        if PSI_KEY:
            params["key"] = PSI_KEY
        api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + urllib.parse.urlencode(params)
        d = json.load(urllib.request.urlopen(api, timeout=80))
        lr = d.get("lighthouseResult", {})
        au = lr.get("audits", {})
        def labn(k):
            v = au.get(k, {}).get("numericValue")
            return round(v, 1) if v is not None else None
        def field(le):
            if not le:
                return None
            m = le.get("metrics", {})
            def g(k):
                x = m.get(k)
                return {"p75": x.get("percentile"), "rating": x.get("category")} if x else None
            return {"overall": le.get("overall_category"),
                    "LCP": g("LARGEST_CONTENTFUL_PAINT_MS"),
                    "INP": g("INTERACTION_TO_NEXT_PAINT"),
                    "CLS": g("CUMULATIVE_LAYOUT_SHIFT_SCORE")}
        return {"url": url, "strategy": strategy,
                "lab_perf_score": round((lr.get("categories", {}).get("performance", {}).get("score") or 0) * 100),
                "lab_LCP_ms": labn("largest-contentful-paint"),
                "lab_CLS": labn("cumulative-layout-shift"),
                "lab_TBT_ms": labn("total-blocking-time"),
                "field_url": field(d.get("loadingExperience")),
                "field_origin": field(d.get("originLoadingExperience"))}

    bundle["web_vitals"] = {
        "note": ("Core Web Vitals. field = real Chrome users (CrUX) = the Google ranking signal; "
                 "lab = Lighthouse diagnostic. Mobile strategy (Google's primary signal). "
                 "field_url may be null on low-traffic pages — use field_origin then.")}
    if PSI_KEY:
        bundle["web_vitals"]["pages"] = []
        for p in ["https://nphacks.net/", "https://nphacks.net/puzzles/lockpick", "https://nphacks.net/puzzles/thermite"]:
            try:
                bundle["web_vitals"]["pages"].append(psi(p)); log("PSI " + p)
            except Exception as ex:
                log("PSI fail " + p + ": " + repr(ex)[:80])
    else:
        bundle["web_vitals"]["note"] += " (SKIPPED — set the PSI_API_KEY secret to enable.)"
        log("PSI skipped — no key")
except Exception as ex:
    bundle["errors"].append("PSI: " + repr(ex)[:200]); log("PSI ERROR " + repr(ex)[:160])

# ---------------- Cloudflare RUM Web Vitals (real-user field CWV; CrUX lacks it at this traffic) ----------------
CF_ACCT = os.environ.get("CF_ACCOUNT_ID")
if CF_TOKEN and CF_ACCT:
    try:
        import urllib.request
        rv_start = (today - datetime.timedelta(days=7)).isoformat()
        rq = ('query{viewer{accounts(filter:{accountTag:"%s"}){'
              'overall: rumWebVitalsEventsAdaptiveGroups(limit:1,filter:{date_geq:"%s"}){'
              'count quantiles{largestContentfulPaintP75 interactionToNextPaintP75 cumulativeLayoutShiftP75 firstContentfulPaintP75 timeToFirstByteP75} '
              'sum{lcpGood lcpTotal inpGood inpTotal clsGood clsTotal}} '
              'byPage: rumWebVitalsEventsAdaptiveGroups(limit:12,filter:{date_geq:"%s"},orderBy:[count_DESC]){'
              'dimensions{requestPath} count '
              'quantiles{largestContentfulPaintP75 interactionToNextPaintP75 cumulativeLayoutShiftP75 firstContentfulPaintP75 timeToFirstByteP75}}'
              '}}}' % (CF_ACCT, rv_start, rv_start))
        rreq = urllib.request.Request("https://api.cloudflare.com/client/v4/graphql",
            data=json.dumps({"query": rq}).encode(),
            headers={"Authorization": "Bearer " + CF_TOKEN, "Content-Type": "application/json"})
        rd = json.load(urllib.request.urlopen(rreq, timeout=40))
        if rd.get("errors"):
            raise RuntimeError(str(rd["errors"])[:200])
        acc = rd["data"]["viewer"]["accounts"][0]
        ms = lambda v: round(v / 1000) if v is not None else None  # CF returns µs
        pct = lambda g, t: round(g / t * 100) if t else None
        cf_rum = {"note": ("Cloudflare RUM = REAL-USER (browser beacon) Core Web Vitals, last 7d. "
                           "LCP/INP/FCP/TTFB in ms; CLS unitless. *_good_pct = share meeting the 'good' threshold "
                           "(Google CWV thresholds: LCP<=2500, INP<=200, CLS<=0.1; FCP good<=1800, TTFB good<=800). "
                           "Real-user field CWV that Google CrUX lacks until traffic grows.")}
        if acc.get("overall"):
            o = acc["overall"][0]; q = o["quantiles"]; s = o["sum"]
            cf_rum["site_wide"] = {
                "events": o["count"],
                "LCP_p75_ms": ms(q["largestContentfulPaintP75"]), "LCP_good_pct": pct(s["lcpGood"], s["lcpTotal"]),
                "INP_p75_ms": ms(q["interactionToNextPaintP75"]), "INP_good_pct": pct(s["inpGood"], s["inpTotal"]),
                "CLS_p75": q["cumulativeLayoutShiftP75"], "CLS_good_pct": pct(s["clsGood"], s["clsTotal"]),
                "FCP_p75_ms": ms(q["firstContentfulPaintP75"]), "TTFB_p75_ms": ms(q["timeToFirstByteP75"])}
        cf_rum["by_page"] = [{"path": p["dimensions"]["requestPath"], "events": p["count"],
                              "LCP_p75_ms": ms(p["quantiles"]["largestContentfulPaintP75"]),
                              "INP_p75_ms": ms(p["quantiles"]["interactionToNextPaintP75"]),
                              "CLS_p75": p["quantiles"]["cumulativeLayoutShiftP75"],
                              "FCP_p75_ms": ms(p["quantiles"]["firstContentfulPaintP75"]),
                              "TTFB_p75_ms": ms(p["quantiles"]["timeToFirstByteP75"])} for p in acc.get("byPage", [])]
        bundle["web_vitals"]["cloudflare_rum"] = cf_rum
        log("CF RUM web vitals ok")
    except Exception as ex:
        bundle["errors"].append("CF RUM: " + repr(ex)[:200]); log("CF RUM ERROR " + repr(ex)[:160])

# ---------------- Cloudflare RUM page-load speed (real-user full load time, beyond CWV) ----------------
if CF_TOKEN and CF_ACCT:
    try:
        import urllib.request
        ps_start = (today - datetime.timedelta(days=7)).isoformat()
        pq = ('query{viewer{accounts(filter:{accountTag:"%s"}){'
              'overall: rumPerformanceEventsAdaptiveGroups(limit:1,filter:{date_geq:"%s"}){'
              'count quantiles{pageLoadTimeP50 pageLoadTimeP75 pageLoadTimeP90 pageRenderTimeP75}} '
              'byPage: rumPerformanceEventsAdaptiveGroups(limit:12,filter:{date_geq:"%s"},orderBy:[count_DESC]){'
              'dimensions{requestPath} count quantiles{pageLoadTimeP50 pageLoadTimeP75 pageLoadTimeP90 pageRenderTimeP75}}'
              '}}}' % (CF_ACCT, ps_start, ps_start))
        preq = urllib.request.Request("https://api.cloudflare.com/client/v4/graphql",
            data=json.dumps({"query": pq}).encode(),
            headers={"Authorization": "Bearer " + CF_TOKEN, "Content-Type": "application/json"})
        pdat = json.load(urllib.request.urlopen(preq, timeout=40))
        if pdat.get("errors"):
            raise RuntimeError(str(pdat["errors"])[:200])
        pacc = pdat["data"]["viewer"]["accounts"][0]
        ms = lambda v: round(v / 1000) if v is not None else None  # CF returns µs
        perf = {"note": "Cloudflare RUM real-user PAGE-LOAD time (full window load) + render_p75 (DOM render phase = client-side cost; the minigames are JS-heavy), last 7d, in ms."}
        if pacc.get("overall"):
            oq = pacc["overall"][0]["quantiles"]
            perf["site_wide_ms"] = {"events": pacc["overall"][0]["count"],
                "p50": ms(oq["pageLoadTimeP50"]), "p75": ms(oq["pageLoadTimeP75"]), "p90": ms(oq["pageLoadTimeP90"]),
                "render_p75": ms(oq["pageRenderTimeP75"])}
        perf["by_page_ms"] = [{"path": p["dimensions"]["requestPath"], "events": p["count"],
                               "p50": ms(p["quantiles"]["pageLoadTimeP50"]), "p75": ms(p["quantiles"]["pageLoadTimeP75"]),
                               "p90": ms(p["quantiles"]["pageLoadTimeP90"]), "render_p75": ms(p["quantiles"]["pageRenderTimeP75"])} for p in pacc.get("byPage", [])]
        bundle["web_vitals"]["cloudflare_rum_pageload"] = perf
        log("CF RUM page-load speed ok")
    except Exception as ex:
        bundle["errors"].append("CF RUM perf: " + repr(ex)[:200]); log("CF RUM perf ERROR " + repr(ex)[:160])

# ---------------- Cloudflare RUM audience (consent-free, real-user traffic breakdown) ----------------
if CF_TOKEN and CF_ACCT:
    try:
        import urllib.request
        au_start = (today - datetime.timedelta(days=7)).isoformat()
        def _grp(alias, dim, lim):
            return ('%s: rumPageloadEventsAdaptiveGroups(limit:%d,filter:{date_geq:"%s"},'
                    'orderBy:[count_DESC]){count sum{visits} dimensions{%s}}' % (alias, lim, au_start, dim))
        aq = ('query{viewer{accounts(filter:{accountTag:"%s"}){' % CF_ACCT
              + ('total: rumPageloadEventsAdaptiveGroups(limit:1,filter:{date_geq:"%s"}){count sum{visits}} ' % au_start)
              + _grp("byCountry", "countryName", 15) + ' ' + _grp("byDevice", "deviceType", 5) + ' '
              + _grp("byBrowser", "userAgentBrowser", 8) + ' ' + _grp("byReferer", "refererHost", 12) + ' '
              + _grp("byOS", "userAgentOS", 6) + ' '
              + _grp("byPath", "requestPath", 15) + '}}}')
        areq = urllib.request.Request("https://api.cloudflare.com/client/v4/graphql",
            data=json.dumps({"query": aq}).encode(),
            headers={"Authorization": "Bearer " + CF_TOKEN, "Content-Type": "application/json"})
        adat = json.load(urllib.request.urlopen(areq, timeout=40))
        if adat.get("errors"):
            raise RuntimeError(str(adat["errors"])[:200])
        aacc = adat["data"]["viewer"]["accounts"][0]
        rows = lambda alias, key: [{"name": r["dimensions"][key], "page_views": r["count"],
                                    "visits": (r.get("sum") or {}).get("visits")} for r in aacc.get(alias, [])]
        _tot = (aacc.get("total") or [{}])[0]
        bundle["cloudflare"]["rum_audience"] = {
            "note": ("Cloudflare RUM = REAL-USER (browser beacon, CONSENT-FREE, excludes bots/non-JS), last 7d. "
                     "page_views = real human page loads; visits = entry sessions (de-dupes internal nav — the "
                     "right RPM/engagement denominator). Use this to validate/correct GA4's consent-gated "
                     "geo/device/referrer numbers; treat it (with GSC) as a truthful audience source."),
            "total_page_views": _tot.get("count"),
            "total_visits": (_tot.get("sum") or {}).get("visits"),
            "by_country": rows("byCountry", "countryName"),
            "by_device": rows("byDevice", "deviceType"),
            "by_browser": rows("byBrowser", "userAgentBrowser"),
            "by_os": rows("byOS", "userAgentOS"),
            "by_referer": rows("byReferer", "refererHost"),
            "by_page": rows("byPath", "requestPath"),
        }
        log("CF RUM audience ok")
    except Exception as ex:
        bundle["errors"].append("CF RUM audience: " + repr(ex)[:200]); log("CF RUM audience ERROR " + repr(ex)[:160])

# ---------------- Cloudflare HTTP health (zone, last ~24h): status-by-path + cache mix ----------------
CF_ZONE = os.environ.get("CF_ZONE_ID")
if CF_TOKEN and CF_ZONE:
    try:
        import urllib.request
        h_now = datetime.datetime.now(datetime.timezone.utc)
        h_start = (h_now - datetime.timedelta(hours=23)).strftime("%Y-%m-%dT%H:%M:%SZ")
        hq = ('query{viewer{zones(filter:{zoneTag:"%s"}){'
              'errorPaths: httpRequestsAdaptiveGroups(limit:20,'
              'filter:{datetime_geq:"%s",edgeResponseStatus_geq:400},orderBy:[count_DESC]){'
              'count dimensions{edgeResponseStatus clientRequestPath}} '
              'cache: httpRequestsAdaptiveGroups(limit:8,filter:{datetime_geq:"%s"},orderBy:[count_DESC]){'
              'count dimensions{cacheStatus}}'
              '}}}' % (CF_ZONE, h_start, h_start))
        hreq = urllib.request.Request("https://api.cloudflare.com/client/v4/graphql",
            data=json.dumps({"query": hq}).encode(),
            headers={"Authorization": "Bearer " + CF_TOKEN, "Content-Type": "application/json"})
        hdat = json.load(urllib.request.urlopen(hreq, timeout=40))
        if hdat.get("errors"):
            raise RuntimeError(str(hdat["errors"])[:200])
        zd = hdat["data"]["viewer"]["zones"][0]
        bundle["cloudflare"]["http_health_24h"] = {
            "note": ("Cloudflare edge HTTP, last ~24h. error_paths = non-2xx (status >=400) responses by path — "
                     "the broken-page / 5xx finder. cache_status = edge cache-hit mix (more 'hit' = cheaper + faster)."),
            "error_paths": [{"status": r["dimensions"]["edgeResponseStatus"],
                             "path": r["dimensions"]["clientRequestPath"], "requests": r["count"]}
                            for r in zd.get("errorPaths", [])],
            "cache_status": [{"status": r["dimensions"]["cacheStatus"], "requests": r["count"]}
                             for r in zd.get("cache", [])],
        }
        log("CF HTTP health ok")
    except Exception as ex:
        bundle["errors"].append("CF HTTP health: " + repr(ex)[:200]); log("CF HTTP health ERROR " + repr(ex)[:160])

with open(OUT, "w") as f:
    json.dump(bundle, f, indent=2)
print("wrote", OUT, "(", len(json.dumps(bundle)), "bytes )")
print("GSC queries:", bundle.get("gsc", {}).get("all_queries_count"),
      "| GA4 sessions 28d:", bundle.get("ga4", {}).get("totals_28d", {}).get("sessions"),
      "| errors:", bundle["errors"] or "none")
