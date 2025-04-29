import { Button } from "@/components/ui/button";
import React, { MouseEventHandler } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DropdownTextarea from "./DropdownTextarea";

type Props = {
  children: React.ReactNode;
  tooltipContent: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onSave: MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  value: string | number | readonly string[];
  onClose: (open: boolean) => void;
};

export default function ButtonWithTextarea({
  children,
  tooltipContent,
  onClick,
  onSave,
  disabled,
  value,
  onChange,
  onClose
}: Props) {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-none"
              onClick={onClick}
              variant="ghost"
              size={"icon"}
              disabled={disabled}
            >
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-xm font-sans md:text-sm">{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownTextarea
        onClose={onClose}
        onChange={onChange}
        value={value}
        onClick={onSave}
      />
    </div>
  );
}
