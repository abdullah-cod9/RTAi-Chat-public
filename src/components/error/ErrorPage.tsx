"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function ErrorPage() {
  const t = useTranslations('errorPage')
  return (
    <div className="flex h-svh w-full items-center justify-center px-2">
  <div className="space-y-4">
    <div className="flex flex-col items-start gap-2 rounded-sm bg-destructive/80 p-2">
      <p>{t('unexpectedError')}</p>
    </div>
    <div className="flex items-center justify-between">
      <Link prefetch href={"/chat"}>
        <Button variant={"secondary"}>{t('home')}</Button>
      </Link>
      <Link href={"mailto:support@rtai.chat"}>
        <Button variant={"secondary"}>{t('support')}</Button>
      </Link>
    </div>
  </div>
</div>

  );
}
