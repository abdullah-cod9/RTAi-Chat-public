import {tool } from 'ai';
import { z } from 'zod';

export const myToolSet = {
  firstTool: tool({
    description: 'Greets the user',
    parameters: z.object({ name: z.string() }),
    execute: async ({ name }) => `Hello, ${name}!`,
  }),
  secondTool: tool({
    description: 'Tells the user their age',
    parameters: z.object({ age: z.number() }),
    execute: async ({ age }) => `You are ${age} years old!`,
  }),
};

// type MyToolCall = ToolCallUnion<typeof myToolSet>;
// type MyToolResult = ToolResultUnion<typeof myToolSet>;