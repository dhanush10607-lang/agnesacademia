import { createClient } from '@/lib/supabase/server';
import { embeddingModel } from '@/lib/ai/provider';
import { embedMany } from 'ai';

export const maxDuration = 120; // 2 minutes for processing

export async function POST(req: Request) {
  try {
    // Dynamically require pdf-parse to avoid static evaluation issues during Next.js build
    const pdfParse = require('pdf-parse');

    const { resource_id } = await req.json();
    if (!resource_id) return new Response('Missing resource_id', { status: 400 });

    const supabase = await createClient();

    // Verify Admin Role (Optional but recommended)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    // Fetch the resource details
    const { data: resource, error: resError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', resource_id)
      .single();

    if (resError || !resource) {
      return new Response('Resource not found', { status: 404 });
    }

    if (resource.file_type !== 'application/pdf') {
      return new Response('Only PDFs are supported for processing currently', { status: 400 });
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('academic_files')
      .download(resource.file_path);

    if (downloadError || !fileData) {
      return new Response('Failed to download file', { status: 500 });
    }

    // Extract text using pdf-parse
    const buffer = Buffer.from(await fileData.arrayBuffer());
    let pdfText = '';
    try {
      const parsed = await pdfParse(buffer);
      pdfText = parsed.text;
    } catch (e) {
      console.error("PDF Parsing error:", e);
      return new Response('Failed to parse PDF', { status: 500 });
    }

    // Very basic chunking logic (roughly 1000 characters per chunk)
    const rawChunks = pdfText.match(/[\s\S]{1,1000}(?=\s|$)/g) || [];
    // Filter out tiny or empty chunks
    const chunks = rawChunks.map(c => c.trim()).filter(c => c.length > 50);

    if (chunks.length === 0) {
      return new Response('No extractable text found in PDF', { status: 400 });
    }

    // Generate embeddings using Google AI SDK
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });

    // Insert into Supabase pgvector
    const inserts = chunks.map((content, index) => ({
      resource_id: resource.id,
      chunk_index: index,
      content,
      embedding: embeddings[index]
    }));

    // First, clear any old chunks for this resource
    await supabase.from('resource_chunks').delete().eq('resource_id', resource.id);
    
    // Insert new chunks
    const { error: insertError } = await supabase.from('resource_chunks').insert(inserts);

    if (insertError) {
      console.error("Embedding insertion error:", insertError);
      return new Response('Failed to save embeddings', { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, chunksProcessed: chunks.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error("Resource processing error:", err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
