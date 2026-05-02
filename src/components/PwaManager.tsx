"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { schoolInfo } from "@/data/school-info";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [swReady, setSwReady] = useState(false);

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => setSwReady(true))
        .catch(() => {}); // silent fail
    }
  }, []);

  // Capture install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      // Show banner after 3 seconds (not immediately — don't be annoying)
      const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  if (!showBanner || !installPrompt) return null;

  return (
    <div
      className="fixed inset-x-3 bottom-[calc(80px+env(safe-area-inset-bottom))] z-[80] mx-auto max-w-sm rounded-[1.75rem] border border-brand-line/60 bg-white/95 p-4 shadow-[0_20px_60px_rgba(16,64,45,0.18)] backdrop-blur-2xl lg:bottom-6 lg:right-6 lg:left-auto lg:max-w-xs"
      style={{ animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      role="dialog"
      aria-label="تثبيت التطبيق"
    >
      <div className="flex items-start gap-3">
        <Image
          src={schoolInfo.logoMarkPath}
          alt={schoolInfo.shortName}
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-2xl border border-brand-line/30 bg-white object-contain p-0.5 shadow-sm"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-brand-deep">أضف التطبيق للشاشة</p>
          <p className="mt-0.5 text-xs leading-5 text-brand-calm">
            ثبّت مدرسة قناديل العلم (مرحلة الروضة) كتطبيق للوصول السريع
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="إغلاق"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-line/30 text-brand-calm text-xs transition hover:bg-brand-line/50"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="flex-1 rounded-xl bg-brand-deep py-2.5 text-xs font-extrabold text-white transition hover:bg-[#11382d] active:scale-95"
        >
          تثبيت الآن
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-1 rounded-xl border border-brand-line bg-transparent py-2.5 text-xs font-extrabold text-brand-calm transition hover:bg-brand-ivory"
        >
          لاحقاً
        </button>
      </div>
    </div>
  );
}
