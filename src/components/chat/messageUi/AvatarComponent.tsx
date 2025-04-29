/* eslint-disable react/jsx-no-literals */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { memo } from "react";

const AvatarComponent = memo(({ src, username }: { src: string, username:string }) => (
  <Avatar className="h-auto max-w-10">
    <AvatarImage  alt={`${username}'s avatar`} className="bg-secondary" src={src} />
    <AvatarFallback>RTAi</AvatarFallback>
  </Avatar>
));

AvatarComponent.displayName = "AvatarComponent";
export default AvatarComponent;
