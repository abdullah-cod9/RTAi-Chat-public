import React from "react";
import { notFound } from "next/navigation";
import ErrorPage from "@/components/auth/ErrorPage";
import { AuthCode, authCodes } from "@/lib/myTypes";

export function generateStaticParams() {
  return authCodes.map((c) => ({ code: c }));
}

type Params = Promise<{ code: string }>;

export default async function page({ params }: { params: Params }) {
  const code = await params;
  if (!code.code.trim() || !authCodes.includes(code.code as AuthCode)) {
    notFound();
  }


  return <ErrorPage code={code.code as AuthCode} />;
}
