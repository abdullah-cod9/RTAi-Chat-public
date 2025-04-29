"use client";

import React, { Ref, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import TooltipButton from "./TooltipButton";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Status } from "@/lib/consts";
import { useTranslations } from "next-intl";
import { Translations } from "@/lib/myTypes";
import { useMediaQuery } from "usehooks-ts";
import { Check } from "lucide-react";
import { Button } from "../button";

type Props = {
  childButton: React.ReactNode;
  setSelectedStatus: (status: Status) => void;
  selectValue: Status;
  statuses: Status[];
  inputPlaceholder?: string;
  commandEmptyTitle?: string;
  disableSearch?: boolean;
  drawerTitle?: string;
  tooltipContent?: string;
  side?: "top" | "right" | "bottom" | "left";
  alignOffset?: number;
  onOpen?: (open: boolean) => void;
  openValue?: boolean;
  ref?: Ref<HTMLDivElement> | undefined;
  i18Translations?: Translations;
};

export function ComboBoxResponsiveList({
  setSelectedStatus,
  selectValue,
  statuses,
  inputPlaceholder,
  commandEmptyTitle,
  disableSearch,
  childButton,
  drawerTitle,
  tooltipContent,
  side = "left",
  onOpen,
  openValue,
  ref,
  alignOffset,
  i18Translations,
}: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) {
    return (
      <Drawer
        open={openValue ?? open}
        onOpenChange={onOpen ?? setOpen}
        autoFocus={openValue ?? open}
      >
        <DrawerTrigger asChild>{childButton}</DrawerTrigger>
        <DrawerContent ref={ref}>
          <DrawerHeader className="m-0 p-0">
            <DrawerTitle className="p-2">{drawerTitle}</DrawerTitle>
            <DrawerDescription className="border-b"></DrawerDescription>
          </DrawerHeader>
          <StatusList
            setOpen={setOpen}
            setSelectedStatus={setSelectedStatus}
            selectValue={selectValue}
            inputPlaceholder={inputPlaceholder}
            commandEmptyTitle={commandEmptyTitle}
            disableSearch={disableSearch}
            statuses={statuses}
            i18Translations={i18Translations}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={openValue ?? open} onOpenChange={onOpen ?? setOpen}>
      <PopoverTrigger asChild>
        <TooltipButton tooltipContent={tooltipContent || undefined}>
          {childButton}
        </TooltipButton>
      </PopoverTrigger>
      <PopoverContent
        alignOffset={alignOffset}
        ref={ref}
        side={side}
        className="p-0 w-fit mb-20 mr-10"
        align="start"
        
      >
        <StatusList
          setOpen={setOpen}
          setSelectedStatus={setSelectedStatus}
          selectValue={selectValue}
          inputPlaceholder={inputPlaceholder}
          commandEmptyTitle={commandEmptyTitle}
          disableSearch={disableSearch}
          statuses={statuses}
          i18Translations={i18Translations}
        />
      </PopoverContent>
    </Popover>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
  selectValue,
  statuses,
  inputPlaceholder,
  commandEmptyTitle,
  disableSearch,
  i18Translations,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status) => void;
  selectValue: Status;
  statuses: Status[];
  inputPlaceholder?: string;
  commandEmptyTitle?: string;
  disableSearch?: boolean;
  i18Translations?: Translations;
}) {
  const t = useTranslations(i18Translations);
  return (
    <Command>
      {!disableSearch && <CommandInput placeholder={inputPlaceholder} />}
      <CommandList>
        {!disableSearch && <CommandEmpty>{commandEmptyTitle}</CommandEmpty>}
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) ||
                    statuses[0],
                );
                setOpen(false);
              }}
              className={cn(
                "pt-1 flex items-center justify-between hover:bg-transparent sm:hover:bg-muted",
              )}
              dir="auto"
            >
              {i18Translations
                ? t("option", { option: status.value })
                : status.label}
              <Button size={"icon"} variant={"ghost"} className="hover:bg-transparent cursor-default">
                {selectValue.value === status.value && <Check />}
              </Button>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
