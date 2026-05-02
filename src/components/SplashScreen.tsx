"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { schoolInfo } from "@/data/school-info";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // Only show once per session
    const shown = sessionStorage.getItem("splash-shown");
    if (shown) return;

    setVisible(true);
    sessionStorage.setItem("splash-shown", "1");

    // Auto-hide after 2.2s
    const t = setTimeout(() => {
      setHiding(true);
      setTimeout(() => setVisible(false), 500);
    }, 2200);

    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-brand-deep"
      style={{
        opacity: hiding ? 0 : 1,
        transform: hiding ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
      aria-hidden="true"
    >
      {/* Background radial */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,195,154,0.12)_0%,transparent_65%)]" />

      {/* Logo */}
      <div
        className="relative"
        style={{ animation: "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="rounded-[2rem] bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          <Image
            src={schoolInfo.logoPath}
            alt={schoolInfo.shortName}
            width={240}
            height={92}
            className="h-auto w-44 object-contain"
            priority
          />
        </div>
      </div>

      {/* Name */}
      <div
        className="mt-6 text-center"
        style={{ animation: "slideUp 0.7s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <p className="text-lg font-extrabold text-white">{schoolInfo.shortName}</p>
        <p className="mt-1 text-sm text-white/50">{schoolInfo.country}</p>
      </div>

      {/* Loading dots */}
      <div
        className="mt-8 flex gap-2"
        style={{ animation: "fadeIn 0.5s 0.6s ease both" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-brand-warm/60"
            style={{
              animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
