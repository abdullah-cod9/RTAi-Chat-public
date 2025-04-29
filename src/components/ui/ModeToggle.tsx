"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import  ComboBoxResponsive from "./myButtons/ComboBoxResponsive";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const t = useTranslations("Chat.settings.general");

  const handleOpenChange = () => {
    setOpen(!open);
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  return (
    <ComboBoxResponsive
      ref={popoverRef}
      side="bottom"
      openValue={open}
      trigger={
        <Button variant="outline" onClick={handleOpenChange}>
          {t(`theme.option`, { option: theme })}
        </Button>
      }
    >
      <div className="flex flex-col gap-2 p-1 ">
        <Button
          variant="ghost"
          onClick={() => {
            setTheme("light");
            handleOpenChange();
          }}
          className={cn('cursor-default',theme === "light" && "bg-border")}
        >
          {t(`theme.option`, { option: "light" })}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setTheme("dark");
            handleOpenChange();
          }}
          className={cn('cursor-default',theme === "dark" && "bg-secondary")}
        >
          {t(`theme.option`, { option: "dark" })}{" "}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setTheme("system");
            handleOpenChange();
          }}
          className={cn('cursor-default',theme === "system" && "bg-border")}
        >
          {t(`theme.option`, { option: "system" })}
        </Button>
      </div>
    </ComboBoxResponsive>
  );
}
