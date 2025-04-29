"use client";
import * as React from "react";

type Props = {
  url: string;
};

export default function PdfViewer({ url }: Props) {
  return <iframe src={url} className="h-full w-full" allow="autoplay"></iframe>;
}
