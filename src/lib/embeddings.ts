import { calculateRemainingCredits } from "@/app/actions/db/actions";
import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import { revalidatePath } from "next/cache";
const embeddingModel = openai.embedding("text-embedding-3-small");

export async function getEmbeddings(
  chunks: string[],
  userId:string
): Promise<Array<{ embedding: number[]; content: string }>> {
  try {
    const { embeddings, usage } = await embedMany({
      model: embeddingModel,
      values: chunks,
      
    });
    if (!embeddings) {
      throw new Error("No embedding data received from OpenAI");
    }
    
    const res = await calculateRemainingCredits(userId,
      'text-embedding-3-small',
      usage.tokens,
      0,
   
    );
    if (!res) {
      revalidatePath("/", "layout");
    }
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}

export const generateEmbedding = async (userId:string,value: string, ): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding, usage } = await embed({
    model: embeddingModel,
    value: input,
  });
  calculateRemainingCredits(userId,
    'text-embedding-3-small',
    usage.tokens,
    0,
  );
  return embedding;
};
