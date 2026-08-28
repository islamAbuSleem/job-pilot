-- Feature 04 — Initial database schema
-- Tables: profiles, agent_runs, jobs, agent_logs
-- RLS: every policy gates on user_id = (SELECT auth.uid())
-- Privileges: explicit per-table grants; anon gets nothing on these tables.

-- ============================================================================
-- profiles
-- ============================================================================
CREATE TABLE public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name           TEXT,
  email               TEXT,
  phone               TEXT,
  location            TEXT,
  current_title       TEXT,
  experience_level    TEXT,
  years_experience    INTEGER,
  skills              TEXT[],
  industries          TEXT[],
  work_experience     JSONB,
  education           JSONB,
  job_titles_seeking  TEXT[],
  remote_preference   TEXT,
  preferred_locations TEXT[],
  salary_expectation  TEXT,
  cover_letter_tone   TEXT,
  linkedin_url        TEXT,
  portfolio_url       TEXT,
  work_authorization  TEXT,
  resume_pdf_url      TEXT,
  is_complete         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles_insert_self" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

REVOKE ALL ON public.profiles FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- ============================================================================
-- agent_runs
-- ============================================================================
CREATE TABLE public.agent_runs (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status             TEXT NOT NULL,
  job_title_searched TEXT,
  location_searched  TEXT,
  jobs_found         INTEGER,
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at       TIMESTAMPTZ,
  CONSTRAINT agent_runs_status_check CHECK (status IN ('running', 'completed', 'failed'))
);

CREATE INDEX agent_runs_user_id_idx ON public.agent_runs (user_id);
CREATE INDEX agent_runs_user_id_started_at_idx ON public.agent_runs (user_id, started_at DESC);

ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_runs_select_own" ON public.agent_runs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_runs_insert_own" ON public.agent_runs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_runs_update_own" ON public.agent_runs
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

REVOKE ALL ON public.agent_runs FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.agent_runs TO authenticated;

-- ============================================================================
-- jobs
-- ============================================================================
CREATE TABLE public.jobs (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id             UUID REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source             TEXT NOT NULL,
  source_url         TEXT,
  external_apply_url TEXT,
  title              TEXT,
  company            TEXT,
  location           TEXT,
  salary             TEXT,
  job_type           TEXT,
  about_role         TEXT,
  responsibilities   TEXT[],
  requirements       TEXT[],
  nice_to_have       TEXT[],
  benefits           TEXT[],
  about_company      TEXT,
  match_score        INTEGER,
  match_reason       TEXT,
  matched_skills     TEXT[],
  missing_skills     TEXT[],
  company_research   JSONB,
  found_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT jobs_source_check CHECK (source IN ('search', 'url'))
);

CREATE INDEX jobs_user_id_idx ON public.jobs (user_id);
CREATE INDEX jobs_user_id_found_at_idx ON public.jobs (user_id, found_at DESC);
CREATE INDEX jobs_run_id_idx ON public.jobs (run_id);
CREATE INDEX jobs_user_id_match_score_idx ON public.jobs (user_id, match_score DESC);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select_own" ON public.jobs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "jobs_insert_own" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "jobs_update_own" ON public.jobs
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "jobs_delete_own" ON public.jobs
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON public.jobs FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;

-- ============================================================================
-- agent_logs
-- ============================================================================
CREATE TABLE public.agent_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id     UUID NOT NULL REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  level      TEXT NOT NULL,
  job_id     UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT agent_logs_level_check CHECK (level IN ('info', 'success', 'warning', 'error'))
);

CREATE INDEX agent_logs_user_id_idx ON public.agent_logs (user_id);
CREATE INDEX agent_logs_run_id_idx ON public.agent_logs (run_id);
CREATE INDEX agent_logs_user_id_created_at_idx ON public.agent_logs (user_id, created_at DESC);

ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_logs_select_own" ON public.agent_logs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_logs_insert_own" ON public.agent_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

REVOKE ALL ON public.agent_logs FROM anon, authenticated;
GRANT SELECT, INSERT ON public.agent_logs TO authenticated;
