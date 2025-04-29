"use client";
import React, { useCallback } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { signAnonymously } from "@/app/actions/auth/actions";
import { useTranslations } from "next-intl";

export default function TurnstileValidation() {
  const t = useTranslations("TurnstileValidation");
  const handleSuccess = useCallback(async (token: string) => {
    await signAnonymously(token);
  }, []);
  return (
    <div className="flex h-svh items-center justify-center px-2">
      <div dir="auto" className="space-y-3">
        <p>{t("m1")}</p>
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURUSTILE_SITE_KEY!}
          onSuccess={handleSuccess}
        />
        <p>
          {t("m2")} <strong> {t("m3")}</strong> {t("m4")}
        </p>
      </div>
    </div>
  );
}
