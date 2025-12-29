-- PostgreSQL initialization script for Reverse Roadmap RAG service
-- This script will be run when the pgvector container starts for the first time

-- Create extension for pgvector if not exists
CREATE EXTENSION IF NOT EXISTS vector;

-- Create tables for RAG service if they don't exist
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    metadata JSONB,
    embedding vector(1536) -- Assuming OpenAI's embedding dimensions, adjust as needed
);

CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    role VARCHAR(50), -- 'user' or 'assistant'
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_embedding ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE documents TO pgvector;
GRANT ALL PRIVILEGES ON TABLE conversations TO pgvector;
GRANT ALL PRIVILEGES ON TABLE messages TO pgvector;

-- Additional setup for pgvector
-- This ensures the vector extension is properly loaded
-- and ready for use with the RAG service