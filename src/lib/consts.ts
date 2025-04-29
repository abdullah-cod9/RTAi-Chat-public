export type Status = {
  value: string;
  label: string;
  color?: string;
};
export const textTopics: Status[] = [
  { value: "general", label: "General" },
  { value: "medical", label: "Medical" },
  { value: "legal", label: "Legal" },
  { value: "technical", label: "Technical" },
  { value: "business", label: "Business" },
  { value: "academic", label: "Academic" },
  { value: "literary", label: "Literary" },
  { value: "financial", label: "Financial" },
  { value: "scientific", label: "Scientific" },
  { value: "marketing", label: "Marketing" },
  { value: "historical", label: "Historical" },
  { value: "journalistic", label: "Journalistic" },
  { value: "educational", label: "Educational" },
  { value: "technology", label: "Technology" },
  { value: "artistic", label: "Artistic" },
  { value: "sports", label: "Sports" },
  { value: "political", label: "Political" },
  { value: "travel", label: "Travel" },
  { value: "culinary", label: "Culinary" },
  { value: "social", label: "Social" },
];

export const Languages: Status[] = [
  { value: "auto", label: "Auto" },
  { value: "arabic", label: "Arabic" },
  { value: "chinese", label: "Chinese" },
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "greek", label: "Greek" },
  { value: "hebrew", label: "Hebrew" },
  { value: "hindi", label: "Hindi" },
  { value: "hungarian", label: "Hungarian" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "kurdish", label: "Kurdish" },
  { value: "persian", label: "Persian" },
  { value: "romanian", label: "Romanian" },
  { value: "russian", label: "Russian" },
  { value: "spanish", label: "Spanish" },
  { value: "turkish", label: "Turkish" },
  { value: "ukrainian", label: "Ukrainian" },
];

export const questionPattern: Status[] = [
  { value: "true/false", label: "True/False" },
  { value: "fill in the blanks", label: "Fill in the blanks" },
  { value: "MCQ", label: "MCQ" },
  { value: "short answers", label: "Short answers" },
];
export const TextPosition: Status[] = [
  { value: "under", label: "Under selected text" },
  { value: "after", label: "After selected text" },
  { value: "replace", label: "Replace selected text" },
];
export const Models: Status[] = [
  { value: "gpt-4o-mini", label: "GPT-4o-mini", },
  { value: "gpt-4o", label: "GPT-4o",  },
];
export const standardColors: Status[] = [
  { value: "rgb(255, 0, 0)", label: "Red", color: "rgb(255, 0, 0)" },
  { value: "rgb(0, 255, 0)", label: "Green", color: "rgb(0, 255, 0)" },
  { value: "rgb(0, 0, 255)", label: "Blue", color: "rgb(0, 0, 255)" },
  { value: "rgb(255, 255, 0)", label: "Yellow", color: "rgb(255, 255, 0)" },
  { value: "rgb(0, 255, 255)", label: "Cyan", color: "rgb(0, 255, 255)" },
  { value: "rgb(255, 0, 255)", label: "Magenta", color: "rgb(255, 0, 255)" },
  { value: "rgb(0, 0, 0)", label: "Black", color: "rgb(0, 0, 0)" },
  { value: "rgb(255, 255, 255)", label: "White", color: "rgb(255, 255, 255)" },
];

export const editTextOptions: Status[] = [
  { value: "Fix spelling & grammar", label: "Fix spelling & grammar" },
  { value: "Make the text shorter", label: "Make shorter" },
  { value: "Make the text longer", label: "Make longer" },
  {
    value:
      "Continue writing the text where the text ended, Important Note: Do not rewrite the old text, just continue.",
    label: "Continue writing",
  },
  { value: "Summarize the text", label: "Summarize" },
];

export const textToneOptions: Status[] = [
  { value: "academic", label: "Academic" },
  { value: "business", label: "Business" },
  { value: "casual", label: "Casual" },
  { value: "child friendly", label: "Child friendly" },
  { value: "Conversational", label: "Conversational" },
  { value: "Emotional", label: "Emotional" },
  { value: "Humorous", label: "Humorous" },
  { value: "Informative", label: "Informative" },
  { value: "Inspirational", label: "Inspirational" },
  { value: "Narrative", label: "Narrative" },
  { value: "Objective", label: "Objective" },
  { value: "Persuasive", label: "Persuasive" },
  { value: "Poetic", label: "Poetic" },
];

export const ChatWithOption: Status[] = [
  { value: "ai", label: "Ai" },
  { value: "friend", label: "Friend" },
];
