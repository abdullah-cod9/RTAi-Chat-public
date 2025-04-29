/* eslint-disable react/jsx-no-literals */
"use client";
import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
  memo,
} from "react";
import JoditEditor, { Jodit } from "jodit-react";
import AiPlugins from "./plugins/AiPlugins";
import { pageBreak } from "./components/editorButton/buttons";
import { Button } from "../ui/button";
import TooltipButton from "../ui/myButtons/TooltipButton";
import { useEditorStore } from "@/stores/counter-store";
import { useOnClickOutside } from "usehooks-ts";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";



export default memo(function MyJodit({userId}:{userId:string}) {
  const editor = useRef<Jodit>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { setEditorStore, editorStore } = useEditorStore();
  const [e, setE] = useState(false);
  const [chunks, setChunks] = useState<string[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const config = useMemo(
    () => ({
      buttons: [...Jodit.defaultOptions.buttons, pageBreak],

      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif", "svg", "webp"], // this line is not much important , use if you only strictly want to allow some specific image format
      },
      // className: "h-[70%] mt-10  !w-[800px]",
      // editorClassName: "bg-primary text-foreground !w-full",
      createAttributes: {
        table: {
          style:
            "border:1px solid #C5C6C8FF;border-collapse:collapse;width: 100%;",
        },
        tr: { dir: "auto", style: " border: 1px solid #C5C6C8FF;" },
        td: { dir: "auto", style: " border: 1px solid #C5C6C8FF;" },
        p: { dir: "auto" },
        li: { dir: "auto" },
        ul: { dir: "auto" },
      },
      language: "en",
      defaultActionOnPaste: "insert_clear_html" as const,
      defaultActionOnPasteFromWord: "insert_clear_html" as const,
      scrollToPastedContent: true,
      askBeforePasteHTML: false,
      countHTMLChars: false,
      countTextSpaces: false,
      showWordsCounter: false,
      showCharsCounter: false,
      disablePlugins: [
        "iframe",
        "ai-assistant",
        "file",
        "print",
        "speechRecognize",
        "classSpan",
        "clipboard",
        "copyformat",
        "source",
        "about",
        "fullsize",
        "preview",
      ],
      //  enableDragAndDropFileToEditor: true
      addNewLineOnDBLClick: true,
      hidePoweredByJodit: true,
      events: {
        afterInit: (instance: Jodit) => {
          editor.current = instance;
        },
      },
      cleanHTML: {
        removeOnError: true,
        removeEmptyElements: true,
      },
      height: "auto",
      width: "100%",
      minWidth: 50,
      minHeight: 700,
      maxWidth: 700,
      maxHeight: 800,
    }),
    [],
  );
  useEffect(() => {
    if (editor.current) {
      setE(true);
    }
  }, []);

  const handleWordImport = useCallback((html: string) => {
    setChunks(splitHtmlString(html, 50));
  }, []);

  const handleChangeBlur = useCallback(
    (e: string) => {
      setChunks((prev) => {
        const updatedChunks = [...prev];
        updatedChunks[currentChunkIndex] = e;
        return updatedChunks;
      });
    },
    [currentChunkIndex],
  );

  const handleNext = useCallback(() => {
    if (currentChunkIndex < chunks.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  }, [chunks.length, currentChunkIndex]);

  const handlePrevious = useCallback(() => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(currentChunkIndex - 1);
    }
  }, [currentChunkIndex]);
  const handleClickOutside = useCallback(() => {
    setEditorStore(chunks.join(""));
  }, [chunks, setEditorStore]);

  useOnClickOutside(divRef as React.RefObject<HTMLElement>, handleClickOutside);
  const handleClearAll = useCallback(async () => {
    if (editor.current) {
      editor.current.setEditorValue("");
      setCurrentChunkIndex(0);
      setChunks([""]);
    }
  }, []);
  return (
    <div className="flex w-full gap-3 px-1 sm:px-3">
      <div ref={divRef} className="w-full lg:ml-10">
        <JoditEditor
          ref={editor}
          value={chunks[currentChunkIndex]}
          config={config}
          // onChange={handleChangeBlur} //handle the changes
          onBlur={handleChangeBlur}
        />
      </div>
      <div className="space-y-10">
        {e && (
          <AiPlugins
            handleClearAll={handleClearAll}
            editorData={editorStore}
            handleWordImport={handleWordImport}
            onEditor={editor as React.RefObject<Jodit>}userId={userId}
          />
        )}
        <div className="mt-auto flex flex-col items-center rounded-lg border [&_svg]:size-5">
          <TooltipButton side="left" tooltipContent="Next">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={handleNext}
              className="w-full rounded-b-none border-b"
              disabled={currentChunkIndex >= chunks.length - 1}
            >
              <ArrowLeft />
            </Button>
          </TooltipButton>
          {chunks.length - 1 <= 99 ? (
            <p className="flex h-7 w-full items-center justify-center border-b text-center">
              {chunks.length > 0 ? chunks.length : 1} / {currentChunkIndex + 1}
            </p>
          ) : (
            <p className="flex h-fit w-full items-center justify-center border-b text-center">
              {chunks.length > 0 ? chunks.length : 1}
              <br /> / <br />
              {currentChunkIndex + 1}
            </p>
          )}
          <TooltipButton side="left" tooltipContent="Back">
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={handlePrevious}
              className="w-full rounded-t-none"
              disabled={currentChunkIndex === 0}
            >
              <ArrowRight />
            </Button>
          </TooltipButton>
        </div>
      </div>
    </div>
  );
});
function splitHtmlString(htmlString: string, elementsPerChunk: number) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const elements = Array.from(doc.body.childNodes);

  const chunks = [];
  for (let i = 0; i < elements.length; i += elementsPerChunk) {
    const chunk = elements.slice(i, i + elementsPerChunk);
    const chunkHtml = chunk
      .map((el) => (el instanceof Element ? el.outerHTML : el.textContent))
      .join("");
    chunks.push(chunkHtml);
  }

  return chunks;
}
