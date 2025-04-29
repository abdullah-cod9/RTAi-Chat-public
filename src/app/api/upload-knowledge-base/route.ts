import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { v4 } from "uuid";
import { saveEmbedding, userUploadFile } from "@/app/actions/db/actions";
import createEmbeddings from "@/app/actions/other/createEmbeddings";

export const config = {
  api: {
    bodyParser: false,
  },
};

const getFileType = (file: File) => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase() as
    | "pdf"
    | "docx"
    | "pptx"
    | "xlsx"
    | undefined;

  return fileExtension ?? "unknown";
};

export async function POST(req: NextRequest) {
  const [supabase, formData] = await Promise.all([
    createClient(),
    req.formData(),
  ]);
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const [{ data, error: userError }, arrayBuffer] = await Promise.all([
    supabase.auth.getUser(),
    file.arrayBuffer(),
  ]);
  if (userError || !data?.user) {
    redirect("/login");
  }

  const fileType = getFileType(file);
  const fileName = file.name.split(".").slice(0, -1).join(".");
  const fileSize = file.size;
  const uuid = v4();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = `files/${uuid}`;

  if (fileType === "unknown") {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload a valid file." },
      { status: 400 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { error: uploadError } = await supabase.storage
    .from(process.env.SUPABASE_BUCKETS_NAME!)
    .upload(filePath, buffer, {
      contentType: file.type,
    });
  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }
  userUploadFile(user.id);
  const embeddings = await createEmbeddings(user.id, buffer);
  if (!embeddings) {
    return NextResponse.json(
      { error: "Embeddings is undefined" },
      { status: 401 },
    );
  }
  if (embeddings.length > 0) {
    await saveEmbedding(
      user.id,
      fileName,
      filePath,
      fileSize,
      fileType,
      embeddings,
    );
  }

  return NextResponse.json({
    message: "ok",
  });
}
