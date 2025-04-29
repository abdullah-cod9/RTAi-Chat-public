import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
import { useMediaQuery } from "usehooks-ts";
type Props = {
  trigger?: React.ReactNode;
  triggerClose?: React.ReactNode;
  title?: string;
  description?: React.ReactElement<HTMLParagraphElement>;
  children: React.ReactNode;
  openValue?: boolean;
  onOpenTrigger?: (open: boolean) => void;
  className?: string;
};

export default function DialogButton({
  trigger,
  title,
  description,
  children,
  triggerClose,
  openValue,
  onOpenTrigger,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={openValue ?? open} onOpenChange={onOpenTrigger ?? setOpen}>
        {trigger ? (
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        ) : (
          <VisuallyHidden>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
          </VisuallyHidden>
        )}
        <DialogContent  
          className={className}
          onFocusCapture={(e) => {
            e.stopPropagation();
          }}
        >
          {title || description ? (
            <DialogHeader dir="auto"  className="px-0">
              <DialogTitle >{title}</DialogTitle>
              <DialogDescription >{description}</DialogDescription>
            </DialogHeader>
          ) : (
            <VisuallyHidden>
              <DialogHeader  className="px-0">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
            </VisuallyHidden>
          )}
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer
      open={openValue ?? open}
      onOpenChange={onOpenTrigger ?? setOpen}
      autoFocus={openValue ?? open}
    >
      {trigger ? (
        <DrawerTrigger autoFocus={openValue ?? open} asChild>
          {trigger}
        </DrawerTrigger>
      ) : (
        <VisuallyHidden>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        </VisuallyHidden>
      )}
      <DrawerContent
        className={className}
        onFocusCapture={(e) => {
          e.stopPropagation();
        }}
      >
        {title || description ? (
          <DrawerHeader dir="auto" className="flex flex-col items-start text-start">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
        ) : (
          <VisuallyHidden>
            <DrawerHeader className="px-0">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
          </VisuallyHidden>
        )}
        <div className="p-2 md:max-w-52">{children}</div>
        {triggerClose ? (
          <DrawerFooter className="p-2 md:max-w-52">
            <DrawerClose asChild>{triggerClose}</DrawerClose>
          </DrawerFooter>
        ) : (
          <VisuallyHidden>
            <DrawerFooter className="px-0">
              <DrawerClose asChild>{triggerClose}</DrawerClose>
            </DrawerFooter>
          </VisuallyHidden>
        )}
      </DrawerContent>
    </Drawer>
  );
}
