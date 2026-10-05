-- ==============================================================================
-- eymenbugunneyapti - Supabase Database Initial Migration
-- LGS Çalışma Takip Uygulaması Şeması ve RLS Güvenlik Politikaları
-- ==============================================================================

-- 1. STUDY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    subject TEXT NOT NULL,
    questions INTEGER NOT NULL DEFAULT 0 CHECK (questions >= 0),
    minutes INTEGER NOT NULL DEFAULT 0 CHECK (minutes >= 0),
    correct INTEGER NOT NULL DEFAULT 0 CHECK (correct >= 0),
    wrong INTEGER NOT NULL DEFAULT 0 CHECK (wrong >= 0),
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_correct_wrong_total CHECK (correct + wrong <= questions)
);

-- 2. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lgs_date DATE NOT NULL DEFAULT '2027-06-06',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS study_sessions_date_idx ON public.study_sessions(date DESC);
CREATE INDEX IF NOT EXISTS study_sessions_subject_idx ON public.study_sessions(subject);
CREATE INDEX IF NOT EXISTS study_sessions_completed_idx ON public.study_sessions(completed);

-- 4. DEFAULT SETTINGS INSERT
INSERT INTO public.settings (lgs_date)
SELECT '2027-06-06'
WHERE NOT EXISTS (SELECT 1 FROM public.settings LIMIT 1);

-- 5. AUTO-UPDATE UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_study_sessions_updated_at ON public.study_sessions;
CREATE TRIGGER set_study_sessions_updated_at
    BEFORE UPDATE ON public.study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.settings;
CREATE TRIGGER set_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- study_sessions RLS Policies (Public read, insert, update. Delete disallowed without auth for safety)
DROP POLICY IF EXISTS "Public can view study sessions" ON public.study_sessions;
CREATE POLICY "Public can view study sessions"
    ON public.study_sessions
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can create study sessions" ON public.study_sessions;
CREATE POLICY "Public can create study sessions"
    ON public.study_sessions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update study sessions" ON public.study_sessions;
CREATE POLICY "Public can update study sessions"
    ON public.study_sessions
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- settings RLS Policies
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings"
    ON public.settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can update settings" ON public.settings;
CREATE POLICY "Public can update settings"
    ON public.settings
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert initial settings" ON public.settings;
CREATE POLICY "Public can insert initial settings"
    ON public.settings
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 7. ENABLE REALTIME REPLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
