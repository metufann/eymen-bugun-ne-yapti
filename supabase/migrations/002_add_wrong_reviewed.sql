-- ==============================================================================
-- Migration 002: Add wrong_reviewed to study_sessions table
-- ==============================================================================

ALTER TABLE public.study_sessions 
ADD COLUMN IF NOT EXISTS wrong_reviewed BOOLEAN NOT NULL DEFAULT false;
