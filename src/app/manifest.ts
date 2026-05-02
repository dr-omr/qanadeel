import type { MetadataRoute } from "next";
import { schoolInfo } from "@/data/school-info";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: schoolInfo.fullName,
    short_name: "قناديل العلم",
    description: schoolInfo.appDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F1E6",
    theme_color: "#17483A",
    dir: "rtl",
    lang: "ar-OM",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
