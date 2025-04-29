import React from "react";
import { Button } from "./button";
import { Reply } from "../chat/MessageList";
import { X } from "lucide-react";

type Props = {
  reply: Reply | null;
  closeReplyMessage: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

export default function ReplyMessage({ reply, closeReplyMessage }: Props) {
  if (reply) {
    return (
      <div
        dir="auto"
        className="flex items-center gap-3 rounded-md bg-background p-2"
      >
        <p className="line-clamp-3 text-xs">{reply.replyContent}</p>
        <Button aria-label="x" onClick={closeReplyMessage} size={"sm"} variant={"ghost"}>
          <X />
        </Button>
      </div>
    );
  }
}
