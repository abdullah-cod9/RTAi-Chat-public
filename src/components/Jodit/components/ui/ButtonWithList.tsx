import { Button } from "@/components/ui/button";
import React, { MouseEventHandler } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Status } from "@/lib/consts";
import ButtonList from "./ButtonList";

type Props = {
  children: React.ReactNode;
  selectedStatus: Status | null;
  setSelectedStatus: (status: Status) => void;
  statuses: Status[];
  drawerTitle: string;
  tooltipContent: string;
  onClick: MouseEventHandler<HTMLButtonElement>
  disabled:boolean
  disableSearch?:boolean
  className?: string
  TriggerClassName?: string
};

export default function ButtonWithList({
  children,
  selectedStatus,
  setSelectedStatus,
  statuses,
  drawerTitle,
  tooltipContent,
  onClick,
  disabled,
  disableSearch,
  className,
  TriggerClassName
}: Props) {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild >
            <Button className={cn("rounded-none", className)} onClick={onClick} variant="ghost" size={"icon"} disabled={disabled}>
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="font-sans text-xm md:text-sm">{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ButtonList
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statuses={statuses}
        drawerTitle={drawerTitle}
        disableSearch={disableSearch}
        TriggerClassName={TriggerClassName}
      />
    </div>
  );
}


