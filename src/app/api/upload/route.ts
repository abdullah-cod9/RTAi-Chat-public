import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { v4 } from "uuid";
import { parseFile } from "@/lib/utilsServer";
import { supportedImagesTypes, supportedDocumentTypes, FileUpload } from "@/lib/myTypes";
import { userUploadFile } from "@/app/actions/db/actions";

export const config = {
  api: {
    bodyParser: false,
  },
};



const getFileType = (file: File) => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase() as FileUpload['fileType']
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
  if (fileType === "unknown") {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload a valid file." },
      { status: 400 },
    );
  }

  const filePath = `${supportedImagesTypes.includes(fileType) ? "images" : "files"}/${uuid}`;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ error: uploadError }, text] = await Promise.all([
    supabase.storage
      .from(process.env.SUPABASE_BUCKETS_NAME!)
      .upload(filePath, buffer, {
        contentType: file.type,
      }),
    supportedDocumentTypes.includes(fileType)
      ? fileType === "txt"
        ? buffer.toString("utf-8")
        : parseFile(buffer)
      : Promise.resolve(null),
      userUploadFile(user.id)
  ]);
  
  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }
  const { data: signedUrl, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKETS_NAME!)
    .createSignedUrl(filePath, 3600);
  if (error) {
    console.error("Upload error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    fileName,
    filePath,
    fileSize,
    fileType,
    signedUrl: signedUrl.signedUrl,
    text,
  });
}
