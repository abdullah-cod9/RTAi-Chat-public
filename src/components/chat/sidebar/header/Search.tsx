import React, { useState, memo } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChatResult } from "@/app/actions/db/actions";
import Link from "next/link";
import DialogButton from "@/components/ui/myButtons/DialogButton";
import { Button } from "@/components/ui/button";
import TooltipButton from "@/components/ui/myButtons/TooltipButton";
import { gatDate } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { Chat } from "react-bootstrap-icons";
import {Search as BsSearch} from 'react-bootstrap-icons'
import { useTranslations } from "next-intl";
type Props = {
  chats: ChatResult[];
};
export const Search = memo(function Search({ chats }: Props) {
  const [open, setOpen] = useState(false);
const t = useTranslations('Chat.sidebar.header.search')
  const sortChats = chats
    .flatMap((c) => {
      if ("chats" in c) {
        return c.chats.map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.name,
          createdAt: ch.createdAt,
        }));
      } else {
        return {
          id: c.id,
          name: c.name,
          type: c.type,
          createdAt: c.createdAt,
        };
      }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  useHotkeys("ctrl+k", (k) => {
    k.preventDefault();
    setOpen((open) => !open);
  });

  {
    /* <CommandGroup heading="Suggestions"></CommandGroup> */
  }
  return (
    <DialogButton
    onOpenTrigger={setOpen}
    openValue={open}
    trigger={
      <TooltipButton tooltipContent={t('trigger')} side="bottom">
        <Button aria-label={t('trigger')} size={"icon"} variant={"ghost"} className="[&_svg]:size-5">
          <BsSearch />
        </Button>
      </TooltipButton>
    }
    triggerClose={
      <Button variant={"outline"} className="mx-4">
        {t('triggerClose')}
      </Button>
    }
    className="m-0 p-1"
  >
    <Command className="h-80">
      <CommandInput placeholder={t('placeholder')} />
      <CommandList className="h-full">
        <CommandEmpty>{t('noResults')}</CommandEmpty>
        {sortChats.map((c) => (
          <CommandItem key={c.id} className="p-1">
            <Link
              className="flex w-full items-center gap-2 rounded-sm p-2 hover:bg-muted"
              href={`${c.id}`}
            >
              <Chat />
              <span className="truncate">{c.name}</span>
              <span className="sr-only">{c.type}</span>
              <span className="ml-auto text-foreground/50">
                {gatDate(c.createdAt)}
              </span>
            </Link>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  </DialogButton>
  
  );
});
