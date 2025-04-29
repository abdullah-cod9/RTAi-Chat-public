"use client";
import React from "react";
import { AnimatedGradientText } from "../magicui/animated-gradient-text";
import { TextAnimate } from "../magicui/text-animate";
import Link from "next/link";
import { Button } from "../ui/button";
import HeroVideoDialog from "../magicui/hero-video-dialog";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 pt-20">
      <div className="flex max-w-lg flex-col items-center justify-center gap-4 px-4">
        <AnimatedGradientText>Introducing rtai.chat</AnimatedGradientText>
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          className="text-2xl sm:text-4xl"
        >
          Ai chat but with real time
        </TextAnimate>
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          className="text-center text-muted-foreground"
        >
          In RTAi Chat, invite friends and chat together — no view-only links
          needed!
        </TextAnimate>

        <Link href={"/chat"}>
          <Button>Get Started for Free</Button>
        </Link>
      </div>{" "}
      <div className="flex max-w-3xl flex-col items-center gap-3 px-2">
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          className="text-center text-lg text-muted-foreground"
        >
          Invite friends
        </TextAnimate>
        <HeroVideoDialog
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/q-FMpZKxo5o"
          thumbnailSrc="https://api.rtai.chat/storage/v1/object/public/Public_assets/Giv/Snapshot.PNG"
          thumbnailAlt="How to Invite a Friend to Chat "
        />
      </div>
    </div>
  );
}
