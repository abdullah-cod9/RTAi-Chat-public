"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import  ComboBoxResponsive  from "../ui/myButtons/ComboBoxResponsive";
import { setUserLocale } from "@/app/actions/other/action";
import { Locale } from "@/i18n/config";
import { useTranslations } from "next-intl";

type Status = {
  value: string;
  label: string;
};
const statuses: Status[] = [
  {
    value: "auto",
    label: "Auto",
  },
  {
    value: "en",
    label: "English",
  },
  {
    value: "ar",
    label: "Arabic",
  },
];
export default function LocaleSwitcherSelect() {
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<Status>(statuses[0]);
  const [open, setOpen] = useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const t = useTranslations("Chat.settings.general");

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
  const toggleLanguage = (value: string) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };
  return (
    <ComboBoxResponsive
      openValue={open}
      ref={popoverRef}
      side="bottom"
      trigger={
        <Button
          disabled={isPending}
          variant={"outline"}
          onClick={() => setOpen(!open)}
        >
          {t(`language.option`, {option: selectedStatus.value})}
        </Button>
        
      }
    >
      <Command >
        {/* <CommandInput placeholder="Search for language..." /> */}
        <CommandList>
          {/* <CommandEmpty>No results found.</CommandEmpty> */}
          <CommandGroup>
            {statuses.map((status) => (
              <CommandItem
                key={status.value}
                value={status.value}
                className="hover:bg-muted"
                onSelect={(value) => {
                  setSelectedStatus(status);
                  setOpen(false);
                  toggleLanguage(value);
                }}
              >
          {t(`language.option`, {option: status.value})}
          </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </ComboBoxResponsive>
  );
}
