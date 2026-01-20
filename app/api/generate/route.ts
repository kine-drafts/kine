import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { text } = await generateText({
    // UPDATED: Using the latest 3.0 Flash model
    model: google('gemini-3-flash-preview'), 
    system: `
      You are Kine. Convert the user's request into a strict Mermaid.js graph.
      Rules:
      1. Use 'graph TD' (top-down) or 'graph LR' (left-right).
      2. Return ONLY the raw mermaid string. NO markdown code blocks (\`\`\`).
      3. Keep node labels short (under 5 words).
    `,
    prompt: prompt,
  });

  return Response.json({ mermaid: text });
}
