import React, { JSX, memo, useState } from "react";
import { Button } from "../../ui/button";
import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import TooltipButton from "../../ui/myButtons/TooltipButton";
import { cn } from "@/lib/utils";
import { aIModels, ModelsType } from "@/models/settings";
import ComboBoxResponsive from "@/components/ui/myButtons/ComboBoxResponsive";
import {
  BrainCircuit,
  BrainCog,
  LucideFileSearch,
  Paperclip,
} from "lucide-react";
import UpgradeNow from "../UpgradeNow";
import { useTranslations } from "next-intl";
import { Plan } from "@/app/actions/db/actions";

type Props = {
  onSelectModel: (model: ModelsType) => void;
  selectValue: string;
  plan: Plan
  is_anonymous: boolean;
};

const iconComponents: Record<string, JSX.Element> = {
  RiAttachment2: <Paperclip />,
  HiOutlineDocumentSearch: <LucideFileSearch />,
  LuBrainCircuit: <BrainCircuit />,
};
export default memo(function SelectModel({
  onSelectModel,
  selectValue,
  plan,
  is_anonymous,
}: Props) {
  const t = useTranslations("Chat.chatUi.header.footer.selectModel");
  const [open, setOpen] = useState(false);
  const handleOpenChing = (e: boolean) => {
    setOpen(e);
  };
  const handleSelectModel = (model: ModelsType) => {
    if (plan.featuresPlan.accessModels.includes(model)) {
      onSelectModel(model);
      setOpen(false);
    }
  };
  return (
    <ComboBoxResponsive
      openValue={open}
      onOpen={handleOpenChing}
      trigger={
        <Button
          autoFocus={false}
          variant={"outline"}
          className="border-0 shadow-md md:h-9 md:w-fit md:px-4 md:py-2"
          size={"icon"}
        >
          <BrainCog className="md:hidden" />
          <span className="hidden md:flex">
            {aIModels
              .flatMap((p) => p.models)
              .find((m) => m.model === selectValue)?.label ?? selectValue}
          </span>
        </Button>
      }
      side="top"
    >
      {plan.subscriptionType === "free" && (
        <UpgradeNow is_anonymous={is_anonymous} />
      )}
      <Command
        className={cn("w-full shadow-md")}
        onFocusCapture={(e) => {
          e.stopPropagation();
        }}
      >
        <CommandList className="w-full">
          {aIModels.map((p) => (
            <CommandGroup key={p.provider} heading={p.provider}>
              {p.models.map((m) => (
                <div
                  aria-disabled={
                    !plan.featuresPlan.accessModels.filter(m => is_anonymous ? m !== 'gpt-image-1': m).includes(m.model)
                  }
                  data-state={m.model === selectValue}
                  key={m.model}
                  className="mt-1 flex w-full items-center justify-between rounded-sm p-3 hover:bg-muted aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50 aria-[disabled=true]:hover:bg-transparent data-[state=true]:bg-muted"
                  onClick={() => {
                    handleSelectModel(m.model);
                  }}
                >
                  <p>
                    <span>{m.label}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    {open &&
                      m.icon.map((i) => (
                        <TooltipButton
                          key={i.icon}
                          tooltipContent={t("tooltips", { tip: i.tip })}
                        >
                          <Button
                            aria-label={i.tip}
                            className={cn(
                              "h-6 w-6 p-0",
                              i.icon === "RiAttachment2" &&
                                "bg-[rgba(253,230,138,0.1)] text-yellow-500 hover:bg-[rgba(253,230,138,0.1)] hover:text-yellow-600",
                              i.icon === "HiOutlineDocumentSearch" &&
                                "bg-[rgba(255,95,95,0.1)] text-red-500 hover:bg-[rgba(255,95,95,0.1)] hover:text-red-600",
                              i.icon === "LuBrainCircuit" &&
                                "bg-[rgba(177,59,201,0.1)] text-purple-500 hover:bg-[rgba(177,59,201,0.1)] hover:text-purple-600",
                            )}
                            size={"sm"}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {iconComponents[i.icon]}
                          </Button>
                        </TooltipButton>
                      ))}
                  </div>
                </div>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </ComboBoxResponsive>
  );
});
