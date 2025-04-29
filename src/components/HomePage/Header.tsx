"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <div className="sticky top-0 z-50">
      <div className="relative h-20">
        <div className="absolute flex w-full items-center justify-between px-10 py-5 backdrop-blur-md">
          <h2>RTAi Chat</h2>
          <Link href={"/chat"}>
            <Button>Get Started for Free</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
