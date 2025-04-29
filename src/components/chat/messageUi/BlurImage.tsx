import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type LoadingBlurImage = {
  image: {
    fileName: string;
    url: string;
    fileType: "webp" | "gif" | "jpeg" | "png"| 'jpg';
    expiresAt: string;
  };
};

export default function BlurImage({ image }: LoadingBlurImage) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="group/images h-fit w-full overflow-hidden rounded-md bg-gray-600">
      <Image
        alt={image.fileName}
        src={image.url}
        width={500}
        height={300}
        className={cn(
          "h-auto max-h-60 w-full min-w-52 sm:min-w-48 rounded-md object-cover duration-700 ease-in-out group-hover/images:opacity-75 max-w-52 ",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0",
        )}
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 400px"
        onLoad={() => setLoading(false)}
        priority
      />
    </div>
  );
}
