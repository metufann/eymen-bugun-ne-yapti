-- ==============================================================================
-- Migration 003: Allow public delete on study_sessions
-- ==============================================================================

DROP POLICY IF EXISTS "Public can delete study sessions" ON public.study_sessions;
CREATE POLICY "Public can delete study sessions"
    ON public.study_sessions
    FOR DELETE
    TO anon, authenticated
    USING (true);
