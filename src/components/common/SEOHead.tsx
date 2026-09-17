import React, { useEffect } from 'react';
import { ToolDefinition } from '../../types';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  tool?: ToolDefinition;
  breadcrumbs?: { name: string; url: string }[];
  isHome?: boolean;
  faqs?: { question: string; answer: string }[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  tool,
  breadcrumbs,
  isHome = false,
  faqs,
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or update meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) meta.setAttribute('property', name);
        else meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 3. Helper to set link tag (canonical)
    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    setMeta('description', description);
    setMeta('robots', 'index, follow');
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', isHome ? 'website' : 'article', true);
    setMeta('og:site_name', 'QuickToolKit', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setCanonical(canonicalUrl);

    // 4. Structured Data (JSON-LD)
    const scriptId = 'quicktoolkit-schema-ld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas: Record<string, unknown>[] = [];

    // Base WebSite Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'QuickToolKit',
      url: 'https://gamersign94-svg.github.io/quicktoolkit/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://gamersign94-svg.github.io/quicktoolkit/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });

    // Homepage WebApplication Schema
    if (isHome) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'QuickToolKit',
        url: 'https://gamersign94-svg.github.io/quicktoolkit/',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });
    }

    // Tool WebApplication Schema
    if (tool) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.title,
        url: canonicalUrl,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: tool.metaDesc,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });
    }

    // FAQPage Schema when visible FAQs are present
    const activeFaqs = faqs || (tool && tool.faqs ? tool.faqs : undefined);
    if (activeFaqs && activeFaqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: activeFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    // BreadcrumbList Schema with absolute URLs
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => {
          const absoluteUrl = b.url.startsWith('http')
            ? b.url
            : `https://gamersign94-svg.github.io/quicktoolkit/${b.url.replace(/^\/+/, '')}`;
          return {
            '@type': 'ListItem',
            position: idx + 1,
            name: b.name,
            item: absoluteUrl,
          };
        }),
      });
    }

    scriptTag.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
  }, [title, description, canonicalUrl, tool, breadcrumbs, isHome, faqs]);

  return null;
};
