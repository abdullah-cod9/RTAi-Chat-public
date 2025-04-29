"use client";

import React from "react";
import CheckoutForm from "./CheckoutForm";
import Link from "next/link";

export default function Checkout({ email }: { email: string }) {
  return (
    <div className="mt-10 w-full px-3 lg:px-10">
      <div className="flex">
        <Link prefetch href={"/chat"} className="text-primary">
          <h2>RTAi chat </h2>
        </Link>
      </div>
      <CheckoutForm email={email}/>
    </div>
  );
}
