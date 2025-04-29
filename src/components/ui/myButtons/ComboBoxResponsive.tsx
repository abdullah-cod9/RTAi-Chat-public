"use client";
import { useMediaQuery } from "usehooks-ts";

import React, { Ref, useState, useCallback, memo } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title?: string;
  side?: "top" | "right" | "bottom" | "left";
  alignOffset?: number;
  onOpen?: (open: boolean) => void;
  openValue?: boolean;
  ref?: Ref<HTMLDivElement> | undefined;
  triggerClose?: React.ReactNode;
  description?: string;
  align?: "center" | "start" | "end";
};

export default memo(function ComboBoxResponsive({
  children,
  trigger,
  title,
  side = "left",
  onOpen,
  openValue,
  ref,
  alignOffset,
  triggerClose,
  align,
}: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCloseAutoFocus = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  if (isDesktop) {
    return (
      <Popover open={openValue ?? open} onOpenChange={onOpen ?? setOpen}>
        <PopoverTrigger autoFocus={openValue ?? open} asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent 
          onCloseAutoFocus={handleCloseAutoFocus}
          alignOffset={alignOffset}
          align={align}
          side={side}
          className="p-1 md:max-w-60"
        >
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer
      open={openValue ?? open}
      onOpenChange={onOpen ?? setOpen}
      autoFocus={true} 
    >
      <DrawerTrigger asChild autoFocus={true}>
        {trigger}
      </DrawerTrigger>
      <DrawerContent  ref={ref}>
        <DrawerHeader  className="m-0 p-0">
          <DrawerTitle dir="auto"  className="p-2">{title}</DrawerTitle>
          <DrawerDescription className="border-b"></DrawerDescription>
        </DrawerHeader>
        <div className="p-1 md:max-w-60">{children}</div>
        {triggerClose && (
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>{triggerClose}</DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
)