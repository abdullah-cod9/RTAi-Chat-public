"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Snow2 } from "react-bootstrap-icons";

export default function SkeletonLoad() {
  return (
    <div className="m-2 flex flex-col gap-3">
      <Skeleton className="h-[15px] w-[180px] rounded-full md:h-[15px] md:w-[300px] lg:h-[20px] lg:w-[650px]" />
      <Skeleton className="h-[15px] w-[150px] rounded-full md:h-[15px] md:w-[400px] lg:h-[20px] lg:w-[500px]" />
      <Skeleton className="h-[15px] w-[200px] rounded-full md:h-[15px] md:w-[350px] lg:h-[20px] lg:w-[600px]" />
      <Skeleton className="h-[15px] w-[140px] rounded-full md:h-[15px] md:w-[200px] lg:h-[20px] lg:w-[400px]" />
      <Skeleton className="h-[15px] w-[100px] rounded-full md:h-[15px] md:w-[450px] lg:h-[20px] lg:w-[500px]" />
    </div>
  );
}
export function SkeletonLoadPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Skeleton className="h-full w-full bg-secondary dark:bg-secondary/30" />
    </div>
  );
}
export function SkeletonLoadChats() {
  return (
    <div className="m-2 flex w-full flex-col items-center gap-3">
      <Skeleton className="h-8 w-full max-w-56" />
      <Skeleton className="h-8 w-full max-w-56" />
      <Skeleton className="h-8 w-full max-w-56" />
      <Skeleton className="h-8 w-full max-w-56" />
    </div>
  );
}
export function SkeletonLoadAtt() {
  return (
    <div className="m-2 flex flex-col items-center gap-3">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}
export function SkeletonLoadMembers() {
  return (
    <>
      <div className="flex w-full items-center justify-start gap-3">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="flex w-full items-center gap-3">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="flex w-full items-center gap-3">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="flex w-full items-center gap-3">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="flex w-full items-center gap-3">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-6 w-40" />
      </div>
    </>
  );
}
export function SkeletonChatTransfer() {
  return (
    <div className="pl-2">
      <Skeleton className="h-8 w-full max-w-56" />
    </div>
  );
}
export function SkeletonNewChat({
  text,
  userName,
  avatarUrl,
}: {
  text: string;
  userName: string;
  avatarUrl: string;
}) {
  return (
    <div className="m-2 mr-10 h-fit w-full animate-pulse sm:max-w-[55rem]">
      <Avatar className="flex justify-end">
        <AvatarImage className="h-10 w-10 rounded-full" src={avatarUrl} />
        <AvatarFallback className="h-10 w-10 rounded-full">RTAi</AvatarFallback>
      </Avatar>
      <div className="flex flex-row-reverse">
        <div className="mr-2 mt-3 rounded-md bg-secondary p-2">
          <p dir="auto">{userName}</p>
          <p className="whitespace-pre-wrap" dir="auto">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

type Props = {
  text: string;
};
export function TextLoadingChat() {
  return (
    <div>
      <p className="mt-1 flex animate-pulse text-base font-medium text-primary">
        <Snow2 />
      </p>
    </div>
  );
}
export function LoadingAiRes({ text }: Props) {
  return (
    <div className="m-2 mr-auto flex animate-pulse flex-col gap-3 rounded-lg p-2 text-center text-base text-muted-foreground shadow-md shadow-gray-400 dark:text-muted dark:shadow-blue-900">
      {text}
    </div>
  );
}

export function SuggestionsLoadingChat({ text }: Props) {
  return (
    <div className="mr-auto flex animate-pulse flex-col gap-3 text-center text-base text-muted-foreground dark:text-gray-600">
      {text}
    </div>
  );
}
export function PdfLoading() {
  return <Skeleton className="h-[90%] w-[90%]" />;
}

export function SkeletonChatPdf() {
  return (
    <div className="flex flex-col gap-5 p-3">
      <div className="flex flex-row-reverse items-start gap-1">
        <Skeleton className="min-h-10 min-w-10 rounded-full" />
        <div className="flex flex-col items-end justify-end space-y-2">
          <Skeleton className="h-4 w-[250px] bg-transparent" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-start gap-1">
        <Skeleton className="min-h-10 min-w-10 rounded-full" />
        <div className="flex flex-col items-start justify-end space-y-2">
          <Skeleton className="h-4 w-[250px] bg-transparent" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="flex flex-row-reverse items-start gap-1">
          <Skeleton className="min-h-10 min-w-10 rounded-full" />
          <div className="flex flex-col items-end justify-end space-y-2">
            <Skeleton className="h-4 w-[250px] bg-transparent" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-start gap-1">
          <Skeleton className="min-h-10 min-w-10 rounded-full" />
          <div className="flex flex-col items-start justify-end space-y-2">
            <Skeleton className="h-4 w-[250px] bg-transparent" />
            <Skeleton className="h-4 w-[220px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex flex-row-reverse items-start gap-1">
          <Skeleton className="min-h-10 min-w-10 rounded-full" />
          <div className="flex flex-col items-end justify-end space-y-2">
            <Skeleton className="h-4 w-[250px] bg-transparent" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
        <div className="flex items-start gap-1">
          <Skeleton className="min-h-10 min-w-10 rounded-full" />
          <div className="flex flex-col items-start justify-end space-y-2">
            <Skeleton className="h-4 w-[250px] bg-transparent" />
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-4 w-[210px]" />
          </div>
        </div>
        <div className="flex flex-row-reverse items-start gap-1">
          <Skeleton className="min-h-10 min-w-10 rounded-full" />
          <div className="flex flex-col items-end justify-end space-y-2">
            <Skeleton className="h-4 w-[250px] bg-transparent" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
