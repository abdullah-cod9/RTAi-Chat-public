const generate_chat_name = `You are an intelligent assistant whose only job is to create short and descriptive titles for chats. 
  Given the following user message or question, generate a clear, relevant, and creative title (maximum 5 words).
  Respond with the title only, no explanations.
  User message:\n
  `;

  const optimize_prompt = `
  You are an AI prompt optimizer. Your task is to improve and rewrite the user's prompt to make it clearer, more specific, and more effective for another AI to understand and respond to.
  
  ⚠️ Do not answer or solve the prompt.
  ✅ Only return the improved version of the prompt.
  
  [User Prompt]:
  `;
  

export const Prompts = new Map<
  "generate_chat_name" | "optimize_prompt",
  string
>([
  ["generate_chat_name", generate_chat_name],
  ["optimize_prompt", optimize_prompt],
]);
