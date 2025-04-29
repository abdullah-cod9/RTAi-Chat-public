/* eslint-disable react/jsx-no-literals */
"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectNav() {
  const [essaySize, setEssaySize] = useState("1000");
  const [essayType, setEssayType] = useState("Formal");
  const [references, setReferences] = useState("");

  const handelEssaySize = async (value: string) => {
    setEssaySize(value);
    try {
      await fetch("/api/aiEssay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ essaySize }),
      });
    } catch (error) {
      console.error("err", error);
    }
  };
  const handelEssayType = async (value: string) => {
    setEssayType(value);
    try {
      await fetch("/api/aiEssay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ essayType }),
      });
    } catch (error) {
      console.error("err", error);
    }
  };
  const handelReferences = async (value: string) => {
    setReferences(value);
    try {
      await fetch("/api/aiEssay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ references }),
      });
    } catch (error) {
      console.error("err", error);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Select onValueChange={handelEssaySize}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Essay size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="300">1000 words, or ~2 pages</SelectItem>
          <SelectItem value="600">1750 words, or ~3.5 pages</SelectItem>
          <SelectItem value="900">2500 words, or ~5 pages</SelectItem>
        </SelectContent>
      </Select>
      {/*  */}
      <Select onValueChange={handelEssayType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Essay type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Formal">Formal</SelectItem>
          <SelectItem value="Informative">Informative</SelectItem>
          <SelectItem value="Analytical">Analytical</SelectItem>
          <SelectItem value="Persuasive">Persuasive</SelectItem>
          <SelectItem value="Narrative">Narrative</SelectItem>
          <SelectItem value="Descriptive">Descriptive</SelectItem>
          <SelectItem value="Casual">Casual</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handelReferences}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="References Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="MLA">MLA</SelectItem>
          <SelectItem value="APA">APA</SelectItem>
          <SelectItem value="IEEE">IEEE</SelectItem>
          <SelectItem value="Chicago">Chicago</SelectItem>
          <SelectItem value="Harvard">Harvard</SelectItem>
          <SelectItem value="Vancouver">Vancouver</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectNav;
