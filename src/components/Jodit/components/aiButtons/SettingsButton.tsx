import React, { memo, useState } from "react";
import { Button } from "@/components/ui/button";

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

import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import {
  Languages,
  standardColors,
  Status,
  TextPosition,
  textTopics,
} from "@/lib/consts";
import ButtonList from "../ui/ButtonList";
import { useMediaQuery } from "usehooks-ts";
import { Stars } from "react-bootstrap-icons";

type Props = {
  responseLanguage: Status;
  setResponseLanguage: (status: Status) => void;
  responsePosition: Status;
  setResponsePosition: (status: Status) => void;
  responseColour: Status;
  setResponseColour: (status: Status) => void;
  textTopic: Status;
  setTextTopic: (status: Status) => void;
  models: Status;
  setModels: (status: Status) => void;
};

export default memo( function SettingsButton({
  responseLanguage,
  setResponseLanguage,
  responsePosition,
  setResponsePosition,
  responseColour,
  setResponseColour,
  textTopic,
  setTextTopic,
  // models,
  // setModels,
}: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 425px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <TooltipButton tooltipContent="Editor settings" side="left">
            <Button
              size={"icon"}
              variant="ghost"
              className="w-[52px] rounded-none rounded-b-sm text-foreground [&_svg]:size-5"
            >
              <Stars />
            </Button>
          </TooltipButton>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          className="flex w-[200px] translate-x-1 flex-col rounded-md border p-0"
          align="start"
        >
          <ButtonList
            buttonName="Response language"
            statuses={Languages}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none rounded-t-sm  bg-background"
            selectedStatus={responseLanguage}
            setSelectedStatus={setResponseLanguage}
          />
          <ButtonList
            buttonName="Response position"
            statuses={TextPosition}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none  bg-background"
            selectedStatus={responsePosition}
            setSelectedStatus={setResponsePosition}
            disableSearch
          />
          <ButtonList
            buttonName="Response colour"
            statuses={standardColors}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none  bg-background"
            selectedStatus={responseColour}
            setSelectedStatus={setResponseColour}
            disableSearch
          />
          <ButtonList
            buttonName="Text topic"
            statuses={textTopics}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none  bg-background"
            selectedStatus={textTopic}
            setSelectedStatus={setTextTopic}
          />
          {/* <ButtonList
            buttonName="Models"
            statuses={Models}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none rounded-b-sm  bg-background"
            selectedStatus={models}
            setSelectedStatus={setModels}
            disableSearch
          /> */}
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size={"icon"}
          variant="ghost"
          className="w-[52px] rounded-none rounded-b-sm bg-background text-foreground [&_svg]:size-5"
        >
          <Stars />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle className="sr-only"></DrawerTitle>
          <DrawerDescription className="sr-only"></DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 border-t">
          <ButtonList
            buttonName="Response language"
            statuses={Languages}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none rounded-t-sm  bg-background"
            selectedStatus={responseLanguage}
            setSelectedStatus={setResponseLanguage}
          />
          <ButtonList
            buttonName="Response position"
            statuses={TextPosition}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none  bg-background"
            selectedStatus={responsePosition}
            setSelectedStatus={setResponsePosition}
            disableSearch
          />
          <ButtonList
            buttonName="Response colour"
            statuses={standardColors}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none  bg-background"
            selectedStatus={responseColour}
            setSelectedStatus={setResponseColour}
            disableSearch
          />
          <ButtonList
            buttonName="Text topic"
            statuses={textTopics}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none  bg-background"
            selectedStatus={textTopic}
            setSelectedStatus={setTextTopic}
          />
          {/* <ButtonList
            buttonName="Models"
            statuses={Models}
            PopoverContentClassName="mr-0 translate-x-1"
            TriggerClassName=" rounded-none  bg-background"
            selectedStatus={models}
            setSelectedStatus={setModels}
            disableSearch
          /> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
)