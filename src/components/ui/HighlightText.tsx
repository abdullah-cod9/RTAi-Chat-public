/* eslint-disable react/jsx-no-literals */
"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "./hero-highlight";

export function HighlightText() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        Explore our comprehensive suite of AI tools and unlock their potential
        to {" "}
        <Highlight className="">
        simplify and enhance your daily tasks.
        </Highlight>
      </motion.h1>
    </HeroHighlight>
  );
}
