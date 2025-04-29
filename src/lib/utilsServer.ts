"use server";
import officeparser from "officeparser";

export async function convertToAscii(inputString: string) {
  // remove non ascii characters
  const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
  return asciiString;
}
export async function parseFile(
  buffer: Buffer,
): Promise<string> {
  return await officeparser.parseOfficeAsync(buffer);
}