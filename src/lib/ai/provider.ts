import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { embed, generateText, streamText } from 'ai';

// Initialize the Google Generative AI provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Using gemini-flash-latest for general chat
export const chatModel = google('gemini-flash-latest');

// Using standard text embedding model for vector search
export const embeddingModel = google.textEmbeddingModel('gemini-embedding-2');

export async function generateEmbeddings(text: string) {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}

export async function generateAcademicResponse(prompt: string, systemPrompt: string) {
  const { text } = await generateText({
    model: chatModel,
    system: systemPrompt,
    prompt: prompt,
  });
  return text;
}
