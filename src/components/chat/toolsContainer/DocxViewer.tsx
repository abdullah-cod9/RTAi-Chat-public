"use client";
import * as React from "react";

type Props = {
  url: string;
};

export default function DocxViewer({ url }: Props) {
  return (
    <iframe
    src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}`} 
      className="h-full w-full"
      allow="autoplay"
    ></iframe>
  );
}
