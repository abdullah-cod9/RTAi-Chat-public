"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("notFoundPage");
  return (
    <div className="flex h-svh w-full items-center justify-center px-2">
      <div className="space-y-4">
        <div className="flex flex-col items-start gap-2 rounded-sm bg-destructive/80 p-2">
          <p>{t("title")}</p>
          <p>{t("message")}</p>
        </div>
        <div className="flex items-center justify-start">
          <Link prefetch href={"/chat"}>
            <Button variant={"secondary"}>{t("backButton")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
