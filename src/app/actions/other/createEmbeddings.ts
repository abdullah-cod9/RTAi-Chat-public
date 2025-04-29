import { getEmbeddings } from "@/lib/embeddings";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { encodingForModel } from "js-tiktoken";
import { parseFile } from "@/lib/utilsServer";

export default async function createEmbeddings(
  userId: string,
  buffer: Buffer<ArrayBufferLike>,
) {
  
  const encoding = encodingForModel("text-embedding-3-small");

  try {
    const text = await parseFile(buffer);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 20,
      separators: [
        "\n\n",
        "\n",
        " ",
        ".",
        ",",
        "\u200b",
        "\uff0c",
        "\u3001",
        "\uff0e",
        "\u3002",
        "",
      ],
      lengthFunction: (text) => encoding.encode(text).length,
    });
    const chunks = await splitter.createDocuments([text]);
    const embedding = await getEmbeddings(
      chunks.map((c) => c.pageContent.replaceAll("\n", " ")),userId
    );

    return embedding;
  } catch (error) {
    console.error(error);
  }
}
