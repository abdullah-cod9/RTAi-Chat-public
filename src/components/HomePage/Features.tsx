import React from "react";
import { TextAnimate } from "../magicui/text-animate";

export default function Features() {
  return (
    <div className="space-y-4 mt-20">
      <TextAnimate
        animation="blurInUp"
        by="character"
        once
        className="text-center text-2xl sm:text-4xl"
      >
        Other features
      </TextAnimate>
      <div className="flex flex-wrap gap-3 px-4">
        <div className="space-y-2 bg-muted dark:bg-muted/20 rounded-md p-1 max-w-72">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-center text-lg"
          >
            Attachment support
          </TextAnimate>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-center text-lg text-muted-foreground"
          >
            Includes RAG & CAG support with up to 50 document uploads.
          </TextAnimate>
        </div>
        <div className="space-y-2 bg-muted dark:bg-muted/20 rounded-md p-1 max-w-72">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-center text-lg"
          >
            Multiple AI Models
          </TextAnimate>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-center text-lg text-muted-foreground"
          >
            Choose from the latest models like &quot;gpt-4o-mini&quot;,
            &quot;gpt-4o&quot;, &quot;o3-mini&quot;, &quot;o4-mini&quot;,
            &quot;gpt-4.1&quot;, &quot;gpt-4.1-mini&quot;,
            &quot;gpt-4.1-nano&quot;, &quot;gpt-image-1&quot; — and more coming
            soon!
          </TextAnimate>
        </div>
        <div className="space-y-2 bg-muted dark:bg-muted/20 rounded-md p-1 max-w-72">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-center text-lg"
          >
            1,500+ messages per month
          </TextAnimate>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-center text-lg text-muted-foreground"
          >
            Our flexible token system adapts to your usage — lighter models give
            you over 1,500 messages per month, while heavier models use more
            tokens. Vary based on the model and content size.
          </TextAnimate>
        </div>
        <div className="space-y-2 bg-muted dark:bg-muted/20 rounded-md p-1 max-w-72">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-center text-lg"
          >
            Folders
          </TextAnimate>
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-center text-lg text-muted-foreground"
          >
            Organize your chats into folders if you have many chats
          </TextAnimate>
        </div>
      </div>
    </div>
  );
}
