import { HoverEffect } from "./CardHoverEffect";

export function CardHover() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Ai Editor",
    description:
      "Explore our AI-powered rich text editor, offering easy, precise text editing and formatting. With smart features for correction, enhancement, and content generation, it makes your writing more professional",
    link: "/aiEditor",
  },
  {
    title: "Ai Essay",
    description:
      "Generate essays effortlessly with our AI-powered essay generator, designed for quick, high-quality content creation.",
    link: "/aiEssay",
  },
  {
    title: "Ai ChatPDF",
    description:
      "With Ai ChatPDF, you can ask questions about your documents to gain a deeper understanding of your study material. making your learning process faster and more efficient.",
    link: "/chatPdf",
  },
  {
    title: "Ai .....",
    description:
      "Stay tuned for our exciting upcoming tools!",
    link: "/tools",
  },
];
