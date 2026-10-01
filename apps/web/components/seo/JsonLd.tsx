import React from "react";

export function WebsiteJsonLd({
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev",
}: {
  siteUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Avari Dofamine Market",
    alternateName: ["Avari Dofamine", "Дофамин Маркет"],
    url: siteUrl,
    description: "Маркетплейс мгновенной радости: товары по 10 ₽, быстрая симуляция доставки 100–500м, геймификация и стрики.",
    inLanguage: "ru",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/catalog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd({
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev",
}: {
  siteUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Avari Dofamine",
    url: siteUrl,
    logo: `${siteUrl}/logo-detailed.png`,
    image: `${siteUrl}/og-image.png`,
    description: "Маркетплейс мгновенного дофамина с синтетическим каталогом товаров и быстрой доставкой.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Russian", "English"],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ProductJsonLdProps {
  id: string;
  name: string;
  description?: string;
  price: string | number;
  imageUrl?: string;
  categoryName?: string;
  siteUrl?: string;
}

export function ProductJsonLd({
  id,
  name,
  description,
  price,
  imageUrl,
  categoryName,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev",
}: ProductJsonLdProps) {
  const productUrl = `${siteUrl}/product/${id}`;
  const img = imageUrl || `${siteUrl}/og-image.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    image: [img],
    description: description || `Купить ${name} за ${price} ₽ в маркетплейсе Avari Dofamine с быстрой доставкой.`,
    sku: id,
    category: categoryName || "Дофаминовые товары",
    brand: {
      "@type": "Brand",
      name: "Avari Dofamine",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "RUB",
      price: typeof price === "number" ? price.toFixed(2) : price,
      priceValidUntil: "2030-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Avari Dofamine Market",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "RU",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnInStore",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbsJsonLd({
  items,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev",
}: {
  items: BreadcrumbItem[];
  siteUrl?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface LocalPickupPointProps {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  siteUrl?: string;
}

export function LocalPickupPointJsonLd({
  id,
  name,
  latitude,
  longitude,
  city = "Ростов-на-Дону",
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dofamine.avari.dev",
}: LocalPickupPointProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    additionalType: "https://schema.org/AutomatedTeller",
    name: `ПВЗ Avari Dofamine — ${name}`,
    description: `Синтетический пункт выдачи заказов Avari Dofamine в г. ${city}`,
    url: `${siteUrl}/onboarding`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "RU",
      streetAddress: name,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: latitude,
      longitude: longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "23:00",
      },
    ],
    identifier: id,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
