import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  tooltipContent: string | React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left" | undefined;
};

const TooltipButton = React.memo(function TooltipButton({
  tooltipContent,
  children,
  side,
  ...props
}: Props) {
  return (
    <TooltipProvider >
      <Tooltip >
        <TooltipTrigger {...props} asChild>
          {children}
        </TooltipTrigger>
        {tooltipContent && (
          <TooltipContent dir="auto" side={side} className="border bg-background text-foreground">
            {typeof tooltipContent === "string" ? (
              <p dir="auto" className="text-xm font-sans md:text-sm">{tooltipContent}</p>
            ) : (
              tooltipContent
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});

export default TooltipButton;
