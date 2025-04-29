export type Xml = {
  "w:document": {
    "w:body": {
      "w:p"?: PXml[];
      "w:tbl"?: TableXml | TableXml[];
    };
  };
};

export type PXml = {
  "w:pPr"?: pPr;
  "w:r"?: wr[];
  "w:hyperlink"?: Hyperlink[];
};

export type Hyperlink = {
  "w:r"?: wr;
  GR?: {
    "A_r:id"?: string;
  };
};
export type wr = {
  "w:rPr"?: {
    "w:color"?: {
      GR: {
        "A_w:val"?: string;
      };
    };
    "w:highlight"?: {
      GR: {
        "A_w:val"?: string;
      };
    };
    "w:b"?: true;
    "w:bCs"?: true;
    "w:i"?: true;
    "w:iCs"?: true;
    "w:strike"?: true;
    "w:u"?: {
      GR?: {
        "A_w:val"?: "single";
      };
    };
    "w:vertAlign"?: {
      GR?: {
        "A_w:val"?: "superscript" | "subscript";
      };
    };
  };
  "w:t"?: {
    "#text": string;
    GR?: { "A_xml:space"?: "preserve" };
  };
  "w:sz"?: {
    GR?: {
      "A_w:val"?: number;
    };
  };
  "w:drawing"?: {
    "wp:anchor"?: {
      "a:graphic"?: {
        "a:graphicData"?: {
          "pic:pic"?: {
            "pic:nvPicPr"?: object;
            "pic:blipFill"?: {
              "a:blip"?: {
                GR?: {
                  "A_r:embed"?: string;
                };
              };
            };
          };
        };
      };
      GR?: {
        A_behindDoc?: number;
      };
    };
    "wp:inline"?: {
      "a:graphic"?: {
        "a:graphicData"?: {
          "pic:pic"?: {
            "pic:nvPicPr"?: object;
            "pic:blipFill"?: {
              "a:blip"?: {
                GR?: {
                  "A_r:embed"?: string;
                };
              };
            };
          };
        };
      };
    };
  };
  "w:lastRenderedPageBreak"?: { "#text": string };
};

export type pPr = {
  "w:pStyle"?: {
    GR?: {
      "A_w:val"?: number;
    };
  };
  "w:numPr"?: {
    "w:ilvl": {
      GR: {
        "A_w:val": number;
      };
    };
    "w:numId": {
      GR: {
        "A_w:val": number;
      };
    };
  };
  "w:bidi"?: {
    GR?: {
      "A_w:val"?: number;
    };
  };
  "w:jc"?: {
    GR?: {
      "A_w:val"?: "left" | "center" | "right";
    };
  };
  "w:rPr"?: {
    "w:rtl"?: {
      "#text": "";
    };
  };
};

export type TextInf =
  | {
      id: string | null;
      type: string | null;
      name: string | null;
    }[]
  | null;
export type ListInf =
  | {
      NumId: string | null;
      lvl: string | null;
      numFmt: string | null;
      lvlText: string | null;
    }[]
  | null;
export type RelsInf = {
  id: string;
  target: string;
  type: "image" | "hyperlink";
}[];

export type ImagesBase64 =
  | {
      fileName: string;
      dataUri: string;
    }[]
  | undefined;

export type TableXml = {
  "w:tblPr"?: {
    "w:tblStyle"?: {
      GR?: {
        "A_w:val"?: string;
      };
    };
    "w:tblW"?: {
      GR?: {
        "A_w:w"?: number;
        "A_w:type"?: string;
      };
    };
    "w:tblLook"?: {
      GR?: {
        "A_w:val"?: "04A0";
        "A_w:firstRow"?: number;
        "A_w:lastRow"?: number;
        "A_w:firstColumn"?: number;
        "A_w:lastColumn": number;
        "A_w:noHBand"?: number;
        "A_w:noVBand"?: number;
      };
    };
  };

  "w:tblGrid"?: {
    "w:gridCol"?: [
      {
        GR?: {
          "A_w:w"?: number;
        };
      },
      {
        GR?: {
          "A_w:w"?: number;
        };
      },
    ];
  };
  "w:tr"?: TR[];
};
export type TC = {
  "w:tcPr"?: {
    "w:tcW"?: {
      GR?: {
        "A_w:w"?: number;
        "A_w:type"?: string;
      };
    };
    "w:shd"?: {
      GR?: {
        "A_w:fill"?: string;
      };
    };
    "w:gridSpan"?: {
      GR?: {
        "A_w:val"?: number;
      };
    };
    "w:vMerge"?: {
      "#text"?: "";
      GR?: {
        "A_w:val"?: "restart";
      };
    };
  };
  "w:p": PXml[];
};
export type TR = {
  "w:tc"?: TC[];
  "w:trPr"?: {
    "w:trHeight"?: {
      GR?: {
        "A_w:val"?: number;
      };
    };
  };
};

export type i18nMessages = {
  HomePage: {
    title: string;
    about: string;
  };
  UserButton: {
    settings: {
      title: string;
      general: {
        title: string;
        theme: {
          title: string;
          dark: string;
          light: string;
          system: string;
        };
        language: {
          title: string;
          auto: string;
          ar: string;
          en: string;
        };
      };
    };
  };
};

export type Translations =
  | "Chat.chatSetting.responseLanguage"
  | "Chat.chatSetting.ChatWith";

export type MessageList = {
  role: "admin" | "member";
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
  replyContent: string | null;
  replyToID: string | null;
};

export type MyCoreUserMessage = {
  role: "user";
  content: UserContent;
};
export type UserContent = string | Array<TextPart | ImagePart | FilePart>;
interface TextPart {
  type: "text";
  /**
  The text content.
     */
  text: string;
}
/**
Image content part of a prompt. It contains an image.
 */
interface ImagePart {
  type: "image";
  /**
  Image data. Can either be:
  
  - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
  - URL: a URL that points to the image
     */
  image: DataContent | URL;
  /**
  Optional mime type of the image.
     */
  mimeType?: string;
}

// File content part of a prompt. It contains a file.

interface FilePart {
  type: "file";
  /**
  File data. Can either be:
  
  - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
  - URL: a URL that points to the image
     */
  data: DataContent | URL;
  /**
  Mime type of the file.
     */
  mimeType: string;
}
type DataContent = string | Uint8Array | ArrayBuffer | Buffer;
export type Parts = TextUIPart | ReasoningUIPart | SourceUIPart | FileUIPart;

type TextUIPart = {
  type: "text";
  /**
   * The text content.
   */
  text: string;
};
export type ReasoningUIPart = {
  type: "reasoning";
  /**
   * The reasoning text.
   */
  reasoning: string;
  details: Array<
    | {
        type: "text";
        text: string;
        signature?: string;
      }
    | {
        type: "redacted";
        data: string;
      }
  >;
};
type SourceUIPart = {
  type: "source";
  /**
   * The source.
   */
  source: LanguageModelV1Source;
};
type LanguageModelV1Source = {
  /**
   * A URL source. This is return by web search RAG models.
   */
  sourceType: "url";
  /**
   * The ID of the source.
   */
  id: string;
  /**
   * The URL of the source.
   */
  url: string;
  /**
   * The title of the source.
   */
  title?: string;
};
type FileUIPart = {
  type: "file";
  mimeType: string;
  data: string;
};
export type FileUpload = {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType:
    | "pdf"
    | "webp"
    | "gif"
    | "jpeg"
    | "png"
    | "docx"
    | "pptx"
    | "xlsx"
    | "txt";
  signedUrl: string;
  text: string | null;
  isRAG: boolean
};
export const supportedDocumentTypes = ["pdf", "docx", "pptx", "xlsx"] ;
export const supportedImagesTypes = ["webp", "gif", "jpeg", "png", "jpg"];
export type SupportedDocumentTypes = "pdf" | "docx" | "pptx" | "xlsx";
export type SupportedImagesTypes = "webp" | "gif" | "jpeg" | "png" | "jpg";
export const CodeMessages = new Map<AuthCode, string>([
  [
    "400",
    "Captcha verification failed. Please try again. If the issue persists, feel free to contact support.",
  ],
  [
    "403",
    "You don't have permission to do that. If you think this is a mistake, please contact support.",
  ],
]);
export const CodeTitle = new Map<AuthCode, string>([
  ["400", "400 Bad Request"],
  ["403", "403 Forbidden"],
]);
export const authCodes = ["400", "403"] as const;
export type AuthCode = (typeof authCodes)[number];