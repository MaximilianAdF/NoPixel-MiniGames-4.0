import { SITE_URL } from "@/lib/siteConfig";

interface Crumb {
  name: string;
  path: string;
}

// Builds a BreadcrumbList; pass crumbs from Home through to the current page.
export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

// Builds a FAQPage from visible Q&A pairs. Note: Google restricted FAQ rich
// results to gov/health sites in 2023, so this is for content/AI comprehension
// (AI Overviews, answer engines), not a Google rich snippet.
export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

// Builds an Article node for a guide page, linked to the site Organization.
export function guideArticle(params: { headline: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    url: `${SITE_URL}${params.path}`,
    mainEntityOfPage: `${SITE_URL}${params.path}`,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
