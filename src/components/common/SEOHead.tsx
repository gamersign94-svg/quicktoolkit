import React, { useEffect } from 'react';
import { ToolDefinition } from '../../types';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  tool?: ToolDefinition;
  breadcrumbs?: { name: string; url: string }[];
  isHome?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  tool,
  breadcrumbs,
  isHome = false,
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
      url: 'https://quicktoolkit.com/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://quicktoolkit.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });

    // Tool WebApplication Schema
    if (tool) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.title,
        url: canonicalUrl,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: tool.metaDesc,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });

      // FAQPage Schema when FAQs are present
      if (tool.faqs && tool.faqs.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        });
      }
    }

    // BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      });
    }

    scriptTag.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
  }, [title, description, canonicalUrl, tool, breadcrumbs, isHome]);

  return null;
};
