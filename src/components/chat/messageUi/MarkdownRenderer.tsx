import React, { memo, useCallback, useMemo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { marked } from "marked";
import { Button } from "../../ui/button";
import { useCopyToClipboard, useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";

// دالة لتحليل Markdown إلى كتل
function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

type MarkdownRendererProps = {
  children: string;
};

const MemoizedMarkdownBlock = memo(
  ({ children: markdown }: MarkdownRendererProps) => {
    const mD = useMediaQuery("(min-width: 375px)");
    const mL = useMediaQuery("(min-width: 425px)");

    const [, copy] = useCopyToClipboard();
    const handleCopy = useCallback(
      async (text: string) => {
        try {
          await copy(text);
          toast.success("Copied message to clipboard");
        } catch (error) {
          if (typeof error === "string") {
            console.log("error in MemoizedMarkdownBlock");
          }

          toast.error("Failed to copy message to clipboard");
        }
      },
      [copy],
    );
    return useMemo(
      () => (
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // دعم الكود مع زر النسخ
            code(props) {
              const {children, className, ...rest} = props

              const match = /language-(\w+)/.exec(className || "");
              return  match ? (
                <div className="group relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(markdown)}
                    className="invisible absolute h-8 w-8 p-0 hover:bg-transparent group-hover:visible"
                  >
                    <Copy />
                  </Button>

                  <div
                    className={cn(
                      "max-w-52 sm:max-w-full",
                      mD && "max-w-[270px]",
                      mL && "max-w-80",
                    )}
                  >
                    <SyntaxHighlighter
                      PreTag="div"
                      language={match[1]}
                  
                      style={coldarkDark}
                      lineProps={{ className: "code-line" }}
                      customStyle={{
                        maxWidth: "100%",
                        minWidth: "0",
                        overflowX: "auto", // تمكين التمرير الأفقي عند الحاجة
                        whiteSpace: "pre-wrap", // السماح بانكسار الأسطر الطويلة
                        direction: "ltr",
                      }}
                      codeTagProps={{
                        style: {
                          minWidth: "0",
                          whiteSpace: "pre-wrap",
                        },
                      }}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>{" "}
                  </div>
                </div>
              ) : (
                <code
                  dir="auto"
                  className={cn("whitespace-pre-wrap", className)}
                  {...rest}
                >
                  {children}
                </code>
              );
            },
            h1: ({ className, ...props }) => (
              <h1
                className={cn(
                  "mb-8 scroll-m-20 text-4xl font-extrabold tracking-tight last:mb-0",
                  className,
                )}
                {...props}
              />
            ),
            h2: ({ className, ...props }) => (
              <h2
                className={cn(
                  "mb-4 mt-8 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
                  className,
                )}
                {...props}
              />
            ),
            h3: ({ className, ...props }) => (
              <h3
                className={cn(
                  "mb-4 mt-6 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
                  className,
                )}
                {...props}
              />
            ),
            h4: ({ className, ...props }) => (
              <h4
                className={cn(
                  "mb-4 mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0",
                  className,
                )}
                {...props}
              />
            ),
            h5: ({ className, ...props }) => (
              <h5
                className={cn(
                  "my-4 text-lg font-semibold first:mt-0 last:mb-0",
                  className,
                )}
                {...props}
              />
            ),
            h6: ({ className, ...props }) => (
              <h6
                className={cn(
                  "my-4 font-semibold first:mt-0 last:mb-0",
                  className,
                )}
                {...props}
              />
            ),
            p: ({ className, ...props }) => (
              <p
                className={cn(
                  "mb-5 mt-2 whitespace-pre-wrap leading-7 first:mt-0 last:mb-0",
                  className,
                )}
                {...props}
              />
            ),
            a: ({ className, ...props }) => (
              <a
                className={cn(
                  "font-medium text-primary underline underline-offset-4",
                  className,
                )}
                {...props}
              />
            ),
            blockquote: ({ className, ...props }) => (
              <blockquote
                className={cn("border-l-2 pl-6 italic", className)}
                {...props}
              />
            ),
            ul: ({ className, ...props }) => (
              <ul
                dir="auto"
                className={cn("mx-2 my-5 !list-disc [&>li]:mt-2", className)}
                {...props}
              />
            ),
            ol: ({ className, ...props }) => (
              <ol
                dir="auto"
                className={cn("mx-4 my-5 !list-outside [&>li]:mt-2", className)}
                {...props}
              />
            ),
            hr: ({ className, ...props }) => (
              <hr className={cn("my-5 border-b", className)} {...props} />
            ),
            table: ({ className, ...props }) => (
              <table
                className={cn(
                  "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
                  className,
                )}
                {...props}
              />
            ),
            th: ({ className, ...props }) => (
              <th
                className={cn(
                  "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg [&[align=center]]:text-center [&[align=right]]:text-right",
                  className,
                )}
                {...props}
              />
            ),
            td: ({ className, ...props }) => (
              <td
                className={cn(
                  "border-b border-l px-4 py-2 text-left last:border-r [&[align=center]]:text-center [&[align=right]]:text-right",
                  className,
                )}
                {...props}
              />
            ),
            tr: ({ className, ...props }) => (
              <tr
                className={cn(
                  "m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
                  className,
                )}
                {...props}
              />
            ),
            sup: ({ className, ...props }) => (
              <sup
                className={cn("[&>a]:text-xs [&>a]:no-underline", className)}
                {...props}
              />
            ),
            pre: ({ className, ...props }) => (
              <pre
                className={cn(
                  "overflow-x-auto whitespace-pre-wrap rounded-b-lg p-1",
                  className,
                )}
                {...props}
              />
            ),
          }}
        >
          {markdown}
        </Markdown>
      ),
      [handleCopy, mD, mL, markdown],
    );
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock key={`${id}-block_${index}`}>
        {block}
      </MemoizedMarkdownBlock>
    ));
  },
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
