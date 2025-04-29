// app/api/health/route.ts
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json('OK');
}
