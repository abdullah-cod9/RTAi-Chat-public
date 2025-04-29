import { nanoid } from "nanoid";

export async function ExportPdfPlugin(
  htmlContent: string,
  pdfName: string | null,
) {
  const uniqueId = nanoid();

  const getPdf = await fetch("/api/getPdfMake", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ htmlContent }),
  });

  if (getPdf.ok) {
    const blob = await getPdf.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${pdfName || uniqueId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (getPdf.status === 429) {
    return {error : {message: getPdf.statusText}}
  } else {
    return {error : {message: 'An unexpected error occurred.'}}
  }
}
