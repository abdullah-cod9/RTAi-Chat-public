import { getCurrentUser } from "@/app/actions/caches/action";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
export declare interface PDFMargin {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
}
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

export async function POST(req: Request) {
  const { htmlContent }: { htmlContent: string } = await req.json();
   const { user } = await getCurrentUser();
  if (!user) {
    redirect('/auth/403')
  }

  const identifier = user.id;
  const { success, reset } = await ratelimit.limit(identifier);
  if (!success) {
    const now = Date.now();
    const retryAfter = Math.floor((reset - now) / 1000);
    return new NextResponse(`Too Many Requests`, {
      status: 429,
      headers: {
        ["retry-after"]: `${retryAfter}`,
      },
    });
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
  });

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=document.pdf",
    },
  });
}
