-- Phase 14: AI Academic Assistant & Vector Search

-- 1. Enable pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Create resource_chunks table to store document embeddings
CREATE TABLE public.resource_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding extensions.vector(768), -- standard size for modern embeddings like text-embedding-004
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for chunks (inherit from resources)
ALTER TABLE public.resource_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read chunks of published resources" ON public.resource_chunks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.resources r WHERE r.id = resource_id AND r.status = 'published')
);

-- 3. Create index for fast semantic search (HNSW index)
CREATE INDEX ON public.resource_chunks USING hnsw (embedding vector_cosine_ops);

-- 4. Create function to match documents
CREATE OR REPLACE FUNCTION match_resource_chunks (
  query_embedding extensions.vector(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  resource_id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    rc.id,
    rc.resource_id,
    rc.content,
    1 - (rc.embedding <=> query_embedding) AS similarity
  FROM public.resource_chunks rc
  JOIN public.resources r ON rc.resource_id = r.id
  WHERE 1 - (rc.embedding <=> query_embedding) > match_threshold
    AND r.status = 'published'
  ORDER BY rc.embedding <=> query_embedding
  LIMIT match_count;
$$;
