"use client";

// Global window declarations for analytics scripts
declare global {
  interface Window {
    ym?: (counterId: number | string, method: string, ...args: unknown[]) => void;
    gtag?: (command: string, targetIdOrAction: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const YM_ID = process.env.NEXT_PUBLIC_YM_ID || "113253982";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price?: number | string;
  item_category?: string;
  quantity?: number;
}

export interface EcommerceOrder {
  transaction_id: string;
  value: number | string;
  currency?: string;
  items: AnalyticsItem[];
}

/**
 * Sends a virtual page view hit to Yandex Metrika and Google Analytics 4.
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === "undefined") return;

  // Yandex Metrika hit
  if (YM_ID && typeof window.ym === "function") {
    try {
      window.ym(YM_ID, "hit", url, {
        title: title || document.title,
        referer: document.referrer,
      });
    } catch {
      // ignore
    }
  }

  // Google Analytics 4 page_view
  if (GA_ID && typeof window.gtag === "function") {
    try {
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: title || document.title,
        page_location: window.location.href,
      });
    } catch {
      // ignore
    }
  }
}

/**
 * Sends custom goal / event to Yandex Metrika and GA4.
 */
export function trackGoal(goalName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  // Yandex Metrika goal
  if (YM_ID && typeof window.ym === "function") {
    try {
      window.ym(YM_ID, "reachGoal", goalName, params);
    } catch {
      // ignore
    }
  }

  // GA4 custom event
  if (GA_ID && typeof window.gtag === "function") {
    try {
      window.gtag("event", goalName, params);
    } catch {
      // ignore
    }
  }
}

/**
 * Pushes Ecommerce data to dataLayer for Yandex Metrika Ecommerce and GA4.
 */
export function pushDataLayer(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

// =========================================================================
// Specialized E-commerce & User Journey Trackers
// =========================================================================

/**
 * Tracks viewing a product detail page.
 */
export function trackProductView(item: AnalyticsItem) {
  const price = typeof item.price === "string" ? parseFloat(item.price) : (item.price || 10.0);
  
  // GA4 event
  if (GA_ID && typeof window.gtag === "function") {
    window.gtag("event", "view_item", {
      currency: "RUB",
      value: price,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: price,
          item_category: item.item_category,
        },
      ],
    });
  }

  // Yandex Metrika Enhanced Ecommerce dataLayer
  pushDataLayer({
    ecommerce: {
      currencyCode: "RUB",
      detail: {
        products: [
          {
            id: item.item_id,
            name: item.item_name,
            price: price,
            category: item.item_category,
          },
        ],
      },
    },
  });

  trackGoal("view_product", { product_id: item.item_id, name: item.item_name });
}

/**
 * Tracks adding an item to the cart.
 */
export function trackAddToCart(item: AnalyticsItem, quantity = 1) {
  const price = typeof item.price === "string" ? parseFloat(item.price) : (item.price || 10.0);

  // GA4 event
  if (GA_ID && typeof window.gtag === "function") {
    window.gtag("event", "add_to_cart", {
      currency: "RUB",
      value: price * quantity,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: price,
          quantity: quantity,
          item_category: item.item_category,
        },
      ],
    });
  }

  // Yandex Metrika Enhanced Ecommerce dataLayer
  pushDataLayer({
    ecommerce: {
      currencyCode: "RUB",
      add: {
        products: [
          {
            id: item.item_id,
            name: item.item_name,
            price: price,
            quantity: quantity,
            category: item.item_category,
          },
        ],
      },
    },
  });

  trackGoal("add_to_cart", { product_id: item.item_id, quantity });
}

/**
 * Tracks removing an item from the cart.
 */
export function trackRemoveFromCart(item: AnalyticsItem, quantity = 1) {
  const price = typeof item.price === "string" ? parseFloat(item.price) : (item.price || 10.0);

  // GA4 event
  if (GA_ID && typeof window.gtag === "function") {
    window.gtag("event", "remove_from_cart", {
      currency: "RUB",
      value: price * quantity,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: price,
          quantity: quantity,
        },
      ],
    });
  }

  // Yandex Metrika Enhanced Ecommerce dataLayer
  pushDataLayer({
    ecommerce: {
      currencyCode: "RUB",
      remove: {
        products: [
          {
            id: item.item_id,
            name: item.item_name,
            price: price,
            quantity: quantity,
          },
        ],
      },
    },
  });

  trackGoal("remove_from_cart", { product_id: item.item_id });
}

/**
 * Tracks beginning checkout.
 */
export function trackBeginCheckout(items: AnalyticsItem[], totalValue = 10.0) {
  if (GA_ID && typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", {
      currency: "RUB",
      value: totalValue,
      items: items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        price: typeof i.price === "string" ? parseFloat(i.price) : (i.price || 10.0),
        quantity: i.quantity || 1,
      })),
    });
  }

  trackGoal("begin_checkout", { items_count: items.length, total: totalValue });
}

/**
 * Tracks successful order purchase (INV-01: fixed 10.00 RUB).
 */
export function trackPurchase(order: EcommerceOrder) {
  const orderVal = typeof order.value === "string" ? parseFloat(order.value) : order.value;

  // GA4 event
  if (GA_ID && typeof window.gtag === "function") {
    window.gtag("event", "purchase", {
      transaction_id: order.transaction_id,
      currency: order.currency || "RUB",
      value: orderVal,
      items: order.items.map((i) => ({
        item_id: i.item_id,
        item_name: i.item_name,
        price: typeof i.price === "string" ? parseFloat(i.price) : (i.price || 10.0),
        quantity: i.quantity || 1,
      })),
    });
  }

  // Yandex Metrika Enhanced Ecommerce dataLayer
  pushDataLayer({
    ecommerce: {
      currencyCode: order.currency || "RUB",
      purchase: {
        actionField: {
          id: order.transaction_id,
          revenue: orderVal,
        },
        products: order.items.map((i) => ({
          id: i.item_id,
          name: i.item_name,
          price: typeof i.price === "string" ? parseFloat(i.price) : (i.price || 10.0),
          quantity: i.quantity || 1,
          category: i.item_category,
        })),
      },
    },
  });

  trackGoal("purchase_success", {
    order_id: order.transaction_id,
    revenue: orderVal,
  });
}

/**
 * Tracks selecting or changing a GEO pickup point.
 */
export function trackPickupSelect(pointId: string, pointName: string, distanceMeters: number) {
  trackGoal("select_pickup_point", {
    pickup_point_id: pointId,
    pickup_point_name: pointName,
    distance_meters: Math.round(distanceMeters),
  });
}

/**
 * Tracks search query in catalog.
 */
export function trackSearch(query: string, resultsCount?: number) {
  if (GA_ID && typeof window.gtag === "function") {
    window.gtag("event", "search", {
      search_term: query,
    });
  }

  trackGoal("search_catalog", {
    query,
    results_count: resultsCount,
  });
}

/**
 * Tracks gamification events (streak, level-up).
 */
export function trackGamificationEvent(action: "streak_maintained" | "level_up" | "badge_earned", data: Record<string, unknown>) {
  trackGoal(`gamification_${action}`, data);
}
