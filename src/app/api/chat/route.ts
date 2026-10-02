import { createClient } from '@/lib/supabase/server';
import { chatModel, embeddingModel } from '@/lib/ai/provider';
import { streamText, embed } from 'ai';

// Next.js API route configuration
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1].content;

    const supabase = await createClient();

    // 1. Generate an embedding for the user's query
    const { embedding } = await embed({
      model: embeddingModel,
      value: latestMessage,
    });

    // 2. Perform vector search in Supabase using the match_resource_chunks function
    const { data: chunks, error } = await supabase.rpc('match_resource_chunks', {
      query_embedding: embedding,
      match_threshold: 0.6,
      match_count: 5
    });

    if (error) {
      console.error("Vector search error:", error);
    }

    // 3. Construct the RAG Context
    let contextText = "";
    let sources: string[] = [];
    
    if (chunks && chunks.length > 0) {
      const resourceIds = Array.from(new Set(chunks.map((c: any) => c.resource_id)));
      
      // Fetch human-readable titles for the AI
      const { data: resources } = await supabase.from('resources').select('id, title').in('id', resourceIds);
      const resourceMap = new Map(resources?.map(r => [r.id, r.title]) || []);

      contextText = chunks.map((c: any) => `[Source: ${resourceMap.get(c.resource_id)} (ID: ${c.resource_id})]\n${c.content}`).join("\n\n");
      sources = resourceIds as string[];
    }

    // 4. Construct System Prompt safely
    const systemPrompt = `You are AGNES ACADEMIA's AI Study Assistant.
You help college students with academic topics. 
Important Rules:
1. When answering, prefer the verified college resources provided below.
2. If the provided resources do not answer the question, state clearly that the platform does not currently have this specific material, but you can still offer a general explanation.
3. NEVER invent college policies, syllabus details, or pretend a topic will definitely appear in an exam.
4. Keep answers structured, clear, and academic.
5. ALWAYS append a "Sources" section at the end of your response if you used provided resources. Format them as markdown links: e.g., \`[Resource Name](/resources/resource-id)\`. Do not include links if no resources were found.

Verified Context from AGNES Resources:
${contextText ? contextText : "No relevant college resources found for this specific query."}`;

    // 5. Stream the response back to the client
    const result = await streamText({
      model: chatModel,
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse({
      headers: {
        'x-sources': JSON.stringify(sources) // Pass sources back to client for rendering citation cards
      }
    });
  } catch (err: any) {
    console.error("API Chat Error:", err);
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500 });
  }
}
