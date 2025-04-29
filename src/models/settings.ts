import { openai } from "@ai-sdk/openai";

type OpenaiModels =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "o3-mini"
  | "o4-mini"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4"
  | "text-embedding-3-small"
  | "gpt-image-1";
export type ModelsType = OpenaiModels;
export type EncodingModel = "gpt-4o-mini" | "gpt-4o" | "o3-mini" | "gpt-4";
export const reasoningModels: ModelsType[] = ["o3-mini", "o4-mini"];
export const models = new Map<ModelsType, ReturnType<typeof openai>>([
  ["gpt-4o-mini", openai("gpt-4o-mini")],
  ["gpt-4o", openai("gpt-4o")],
  ["o3-mini", openai.responses("o3-mini")],
  ["o4-mini", openai.responses("o4-mini")],
  ["gpt-4.1", openai("gpt-4.1")],
  ["gpt-4.1-mini", openai("gpt-4.1-mini")],
  ["gpt-4.1-nano", openai("gpt-4.1-nano")],
  ["gpt-image-1", openai("gpt-4o")],
]);

export const windowSize = new Map<ModelsType, number>([
  ["gpt-4o-mini", 50000],
  ["gpt-4o", 15000],
  ["o3-mini", 50000],
  ["o4-mini", 50000],
  ["gpt-4.1", 15000],
  ["gpt-4.1-mini", 50000],
  ["gpt-4.1-nano", 50000],
  ["gpt-image-1", 15000],
]);
export const price = new Map<ModelsType, { input: number; output: number }>([
  ["gpt-4o-mini", { input: 0.15, output: 0.6 }],
  ["gpt-4o", { input: 2.5, output: 10.0 }],
  ["o3-mini", { input: 1.1, output: 4.4 }],
  ["o4-mini", { input: 1.1, output: 4.4 }],
  ["gpt-4.1", { input: 2.0, output: 8.0 }],
  ["gpt-4.1-mini", { input: 0.4, output: 1.6 }],
  ["gpt-4.1-nano", { input: 0.1, output: 0.4 }],
  ["text-embedding-3-small", { input: 0.02, output: 0 }],
  ["gpt-image-1", { input: 5, output: 0 }],
]);
export const imagePrice = new Map<
  ModelsType,
  { input: number; output: number }
>([["gpt-image-1", { input: 10, output: 40 }]]);

export const encodingModel = new Map<ModelsType, EncodingModel>([
  ["gpt-4.1", "gpt-4"],
  ["gpt-4.1-mini", "gpt-4"],
  ["gpt-4.1-nano", "gpt-4"],
  ["gpt-image-1", "gpt-4"],
  ["gpt-4o", "gpt-4o"],
  ["gpt-4o-mini", "gpt-4o-mini"],
  ["o3-mini", "o3-mini"],
  ["o4-mini", "o3-mini"],
]);

export type AiModels = {
  provider: "OpenAI";
  models: {
    model: ModelsType;
    label: string;
    icon: {
      tip: string;
      icon: "RiAttachment2" | "HiOutlineDocumentSearch" | "LuBrainCircuit";
    }[];
  }[];
}[];
export const aIModels: AiModels = [
  {
    provider: "OpenAI",
    models: [
      {
        model: "gpt-4o-mini",
        label: "GPT-4o-mini",
        icon: [
          {
            tip: "supports_image_analysis",
            icon: "RiAttachment2",
          },
          {
            tip: "supports_rag",
            icon: "HiOutlineDocumentSearch",
          },
        ],
      },
      {
        model: "gpt-4o",
        label: "GPT-4o",
        icon: [
          {
            tip: "supports_image_analysis",
            icon: "RiAttachment2",
          },
          {
            tip: "supports_rag",
            icon: "HiOutlineDocumentSearch",
          },
        ],
      },
      {
        model: "gpt-4.1",
        label: "GPT-4.1",
        icon: [
          {
            tip: "supports_image_analysis",
            icon: "RiAttachment2",
          },
          {
            tip: "supports_rag",
            icon: "HiOutlineDocumentSearch",
          },
        ],
      },
      {
        model: "gpt-4.1-mini",
        label: "GPT-4.1-mini",
        icon: [
          {
            tip: "supports_image_analysis",
            icon: "RiAttachment2",
          },
          {
            tip: "supports_rag",
            icon: "HiOutlineDocumentSearch",
          },
        ],
      },
      {
        model: "gpt-4.1-nano",
        label: "GPT-4.1-nano",
        icon: [
          {
            tip: "supports_image_analysis",
            icon: "RiAttachment2",
          },
          {
            tip: "supports_rag",
            icon: "HiOutlineDocumentSearch",
          },
        ],
      },
      {
        model: "o3-mini",
        label: "o3-mini",
        icon: [
          {
            tip: "supports_image_analysis",
            icon: "RiAttachment2",
          },
          {
            tip: "reasoning",
            icon: "LuBrainCircuit",
          },
        ],
      },
      {
        model: "o4-mini",
        label: "o4-mini",
        icon: [
          {
            tip: "supports_image_analysis",
            icon: "RiAttachment2",
          },
          {
            tip: "reasoning",
            icon: "LuBrainCircuit",
          },
        ],
      },
      {
        model: "gpt-image-1",
        label: "GPT Image 1",
        icon: [
          {
            tip: "supports_image_analysis",
            icon: "RiAttachment2",
          },
        ],
      },
    ],
  },
];
