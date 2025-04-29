import JSZip from "jszip";
import { getListInf, getRelsInf, getTextInf } from "@/lib/utils";

export async function ImportWordPlugins(
  xmlFile: File,
): Promise<string | undefined> {
  const arrayBuffer = await xmlFile.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const documentXml = zip.file("word/document.xml");
  const styles = zip.file("word/styles.xml");
  const numbering = zip.file("word/numbering.xml");
  const rels = zip.file("word/_rels/document.xml.rels");

  const imageFolder = zip.folder("word/media");

  if (documentXml && rels) {
    const docXml = await documentXml.async("string");
    const relsXml = await rels.async("string");
    const stylesXml = styles ? await styles.async("string") : null;
    const numberingXml = numbering
      ? await numbering.async("string")
      : undefined;
    const textInf = stylesXml ? await getTextInf(stylesXml) : null;
    const listInf = numberingXml ? await getListInf(numberingXml) : null;
    const relsInf = await getRelsInf(relsXml);

    const imagesBase64 = imageFolder
      ? (
          await Promise.all(
            Object.values(imageFolder.files).map(async (file) => {
              if (!file.dir) {
                const fileName = file.name.split("/").pop() || file.name;
                const validImageExtensions = ["jpeg", "jpg", "png", "gif"];
                const fileExtension = fileName.split(".").pop()?.toLowerCase();

                if (
                  fileExtension &&
                  validImageExtensions.includes(fileExtension)
                ) {
                  const base64Data = await file.async("base64");
                  return {
                    fileName,
                    dataUri: `data:image/${fileExtension};base64,${base64Data}`,
                  };
                }
              }
              return null;
            }),
          )
        ).filter((i) => i !== null)
      : undefined;

    // const imagesBase64 = (await Promise.all(imagePromises)).filter(
    //   (i) => i !== undefined,
    // );
    try {
      const body: {
        docXml: string;
        textInf:
          | {
              id: string | null;
              type: string | null;
              name: string | null;
            }[]
          | null;
        relsInf?: {
          id: string;
          target: string;
          type: string;
        }[];
        imagesBase64?: {
          fileName: string;
          dataUri: string;
        }[];
        listInf?: {
          NumId: string | null;
          lvl: string | null;
          numFmt: string | null;
          lvlText: string | null;
        }[];
      } = {
        docXml,
        textInf,
        relsInf,
      };

      if (relsInf && relsInf.length > 0) {
        body.relsInf = relsInf;
      }
      if (imagesBase64 && imagesBase64.length > 0) {
        console.log(imagesBase64);
        
        body.imagesBase64 = imagesBase64;
      }
      if (listInf && listInf?.length > 0) {
        body.listInf = listInf;
      }
      console.log(body);

      const res = await fetch("/api/importWord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data.html;
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  } else {
    return undefined;
  }
}
