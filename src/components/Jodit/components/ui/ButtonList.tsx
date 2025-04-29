import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { cn, isMob } from "@/lib/utils";
import { Status } from "@/lib/consts";
import { CaretDown } from "react-bootstrap-icons";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  selectedStatus: Status | null;
  setSelectedStatus: (status: Status) => void;
  statuses: Status[];
  drawerTitle?: string;
  buttonName?: string;
  TriggerClassName?: string;
  PopoverContentClassName?: string;
  disableSearch?: boolean;
  disabledButton?: boolean;
};

export default function ButtonList({
  selectedStatus,
  setSelectedStatus,
  statuses,
  drawerTitle,
  buttonName,
  TriggerClassName,
  PopoverContentClassName,
  disableSearch = false,
  disabledButton,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handleClick = () => {
      setIsDesktop(!isMob());
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {buttonName ? (
            <Button
              className={cn("w-full text-sm", TriggerClassName)}
              variant="ghost"
              disabled={disabledButton}
            >
              {buttonName}
            </Button>
          ) : (
            <Button
              size={"icon"}
              variant="ghost"
              className={cn(
                "w-2 items-center justify-center rounded-none p-2",
                TriggerClassName,
              )}
            >
              <CaretDown />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          side="left"
          className={cn("mr-8 w-[200px] p-0", PopoverContentClassName)}
          align="start"
        >
          <StatusList
            setOpen={setOpen}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            statuses={statuses}
            drawerTitle={drawerTitle}
            isDesktop={isDesktop}
            disableSearch={disableSearch}
          />
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {buttonName ? (
          <Button
            className={cn("w-full justify-center text-sm", TriggerClassName)}
            variant="ghost"
          >
            {buttonName}
          </Button>
        ) : (
          <Button
            size={"icon"}
            variant="ghost"
            className={cn(
              "w-2 items-center justify-center rounded-none p-2",
              TriggerClassName,
            )}
          >
            <CaretDown />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle className="sr-only"></DrawerTitle>
          <DrawerDescription className="sr-only"></DrawerDescription>
        </DrawerHeader>

        <div className="mt-4 border-t">
          <StatusList
            setOpen={setOpen}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            statuses={statuses}
            drawerTitle={drawerTitle}
            isDesktop={isDesktop}
            disableSearch={disableSearch}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  selectedStatus,
  setSelectedStatus,
  statuses,
  drawerTitle,
  isDesktop,
  disableSearch,
}: {
  setOpen: (open: boolean) => void;
  selectedStatus: Status | null;
  setSelectedStatus: (status: Status) => void;
  statuses: Status[];
  drawerTitle?: string;
  isDesktop: boolean;
  disableSearch: boolean;
}) {
  const t = useTranslations('Chat.jodit.statusList');
  return (
    <Command className="font-sans">
      {drawerTitle && (
        <p className="border-b p-1 px-3 font-medium">{drawerTitle}</p>
      )}
      {!disableSearch && <CommandInput placeholder={t('commandInput')} />}
      <CommandList>
        {!disableSearch && <CommandEmpty>{t('commandEmpty')}</CommandEmpty>}
        <CommandGroup>
          <div className="flex flex-col gap-2 py-1">
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
                  "hover:bg-accent",
                  status.value === selectedStatus?.value &&
                    !isDesktop &&
                    "224 71.4% 4.1% bg-accent text-accent-foreground",
                  status.color &&
                    "font-bold [text-shadow:_0_0px_8px_rgb(3_7_18)] dark:[text-shadow:_0_0px_8px_rgb(247_249_250)]",
                )}
                style={{ color: status.color }}
              >
                {status.label}
                <Check
                  className={cn(
                    "ml-auto text-accent-foreground",
                    status.value === selectedStatus?.value
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
