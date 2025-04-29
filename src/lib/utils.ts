"use client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  differenceInYears,
  differenceInMonths,
  differenceInWeeks,
  differenceInDays,

  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { ModelsType } from "@/models/settings";
// import { parseStringPromise } from "xml2js";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const parser = new DOMParser();

export async function getTextInf(stylesXml: string) {
  const stylesDoc = parser.parseFromString(stylesXml, "application/xml");
  const styles = stylesDoc.getElementsByTagName("w:styles");

  const getTextType = Array.from(styles).flatMap((sty) => {
    const s = sty.getElementsByTagName("w:style");
    const style = Array.from(s).flatMap((sty) => {
      const nameText = sty.getElementsByTagName("w:name");
      const name = Array.from(nameText).map((s) => s.getAttribute("w:val"))[0];
      return {
        id: sty.getAttribute("w:styleId"),
        type: sty.getAttribute("w:type"),
        name,
      };
    });
    return style;
  });
  return getTextType;
}
export async function getListInf(numberingXml: string): Promise<
  {
    NumId: string | null;
    lvl: string | null;
    numFmt: string | null;
    lvlText: string | null;
  }[]
> {
  const numberingDoc = parser.parseFromString(numberingXml, "application/xml");
  const abstractNum = numberingDoc.getElementsByTagName("w:abstractNum");

  const abstractNumDetails = Array.from(abstractNum)
    .map((abstractNum) => {
      const NumId = abstractNum.getAttribute("w:abstractNumId");

      const levels = Array.from(abstractNum.getElementsByTagName("w:lvl")).map(
        (lv) => {
          const numFmt = Array.from(lv.getElementsByTagName("w:numFmt")).map(
            (num) => num.getAttribute("w:val"),
          )[0];
          const lvlText = Array.from(lv.getElementsByTagName("w:lvlText")).map(
            (num) => num.getAttribute("w:val"),
          )[0];
          const lvl = lv.getAttribute("w:ilvl");

          return {
            lvl,
            numFmt,
            lvlText,
          };
        },
      );
      return levels.map((le) => ({
        ...le,
        NumId,
      }));
    })
    .flat(1);

  return abstractNumDetails;
}
export async function getRelsInf(
  relsXml: string,
): Promise<{ id: string; target: string; type: string }[]> {
  const relsDoc = parser.parseFromString(relsXml, "application/xml");

  const relationships = relsDoc.getElementsByTagName("Relationship");
  const rels = Array.from(relationships)
    .map((rel) => {
      const id = rel.getAttribute("Id");
      const type = rel.getAttribute("Type")?.split("/").pop();
      const target =
        type === "image"
          ? rel.getAttribute("Target")?.split("/").pop()
          : rel.getAttribute("Target");

      if (id && target) {
        return {
          id,
          target,
          type,
        };
      }
    })
    .filter(
      (rel): rel is { id: string; target: string; type: string } =>
        rel !== undefined,
    )
    .filter((t) => t.type === "image" || t.type === "hyperlink");
  return rels;
}

export const getMimeType = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

export function isMob(): boolean {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

export function gatDate(dateDb: string) {
  const now = new Date();
  const date = new Date(dateDb);

  if (differenceInYears(now, date) >= 1) {
    return `${differenceInYears(now, date)}y`;
  } else if (differenceInMonths(now, date) >= 1) {
    return `${differenceInMonths(now, date)}mo`;
  } else if (differenceInWeeks(now, date) >= 1) {
    return `${differenceInWeeks(now, date)}w`;
  } else if (differenceInDays(now, date) >= 1) {
    return `${differenceInDays(now, date)}d`;
  } else if (differenceInHours(now, date) >= 1) {
    return `${differenceInHours(now, date)}h`;
  } else {
    return `${differenceInMinutes(now, date)}m`;
  }
}




