import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "@/app/store";
import { useToast } from "@/hooks/use-toast";
import React from "react";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export function useCopyToClipboard() {
  const { toast } = useToast();

  // Function to copy text to the clipboard
  const copyToClipboard = async (text: string) => {
    if (!navigator.clipboard) {
      toast({
        description: "Clipboard API not supported",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "The ID has been copied to the clipboard",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({ description: "Failed to copy the ID", variant: "destructive" });
    }
  };

  return copyToClipboard;
}

export function useMyToast() {
  const { toast } = useToast();

  const myToast = (
    text: string,
    variant: "default" | "destructive" | null | undefined = "default",
  ) => {
    toast({
      description: text,
      variant: variant,
    });
  };
  return myToast;
}

export const useDragScroll = () => {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);

  const ref = React.useCallback((nodeEle: HTMLDivElement) => {
    setNode(nodeEle);
  }, []);

  const handleMouseDown = React.useCallback(
    (e: MouseEvent) => {
      if (!node) {
        return;
      }
      const startPos = {
        left: node.scrollLeft,
        top: node.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        node.scrollTop = startPos.top - dy;
        node.scrollLeft = startPos.left - dx;
        updateCursor(node);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        resetCursor(node);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [node],
  );

  const handleTouchStart = React.useCallback(
    (e: TouchEvent) => {
      if (!node) {
        return;
      }
      const touch = e.touches[0];
      const startPos = {
        left: node.scrollLeft,
        top: node.scrollTop,
        x: touch.clientX,
        y: touch.clientY,
      };

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.x;
        const dy = touch.clientY - startPos.y;
        node.scrollTop = startPos.top - dy;
        node.scrollLeft = startPos.left - dx;
        updateCursor(node);
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        resetCursor(node);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [node],
  );

  const updateCursor = (ele: HTMLElement) => {
    ele.style.cursor = "grabbing";
    ele.style.userSelect = "none";
  };

  const resetCursor = (ele: HTMLElement) => {
    ele.style.cursor = "grab";
    ele.style.removeProperty("user-select");
  };

  React.useEffect(() => {
    if (!node) {
      return;
    }
    node.addEventListener("mousedown", handleMouseDown);
    node.addEventListener("touchstart", handleTouchStart);
    return () => {
      node.removeEventListener("mousedown", handleMouseDown);
      node.removeEventListener("touchstart", handleTouchStart);
    };
  }, [handleMouseDown, handleTouchStart, node]);

  return [ref];
};
