import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function LoginNow() {
  const t = useTranslations('Auth.loginNow')
  return (
    <div className="mt-3 flex w-full justify-center">
    <div className="relative h-32 md:h-40 min-w-56 w-full max-w-80">
      <div dir="auto" className="absolute inset-0 flex w-full flex-col justify-between gap-2 rounded-xl border border-border/20 bg-gradient-to-r from-background/30 via-primary/20 to-background/10 p-3 shadow-lg backdrop-blur-sm">
        <p className="font-semibold">
          {t('message')}
        </p>
        <Link prefetch href={"/login"} className="mb-2 ml-auto w-fit">
          <Button
            variant={"outline"}
            className="sm:text-md ml-auto rounded-full px-4 py-1 text-sm shadow-md"
          >
            {t('button')}
          </Button>
        </Link>
      </div>
    </div>
  </div>
  
  );
}
