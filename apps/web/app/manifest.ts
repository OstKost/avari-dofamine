import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Avari Dofamine — Маркетплейс мгновенного дофамина",
    short_name: "Avari Dofamine",
    description: "Маркетплейс мгновенной радости: товары по 10 ₽, бесплатное оформление, интерактивная симуляция доставки и геймификация.",
    start_url: "/",
    display: "standalone",
    background_color: "#050B14",
    theme_color: "#050B14",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-minimal-star.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
