-- Feature 04 (continued) — Storage RLS for the `resumes` bucket
-- Goal: an authenticated user can only read, write, update, or delete
-- files in the `resumes` bucket that they themselves uploaded.
-- Path convention `resumes/{user_id}/resume.pdf` is enforced in app code
-- (see Features 06 and 08); the database only enforces ownership.

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resumes_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket = 'resumes'
    AND uploaded_by = (SELECT auth.uid()::text)
  );

CREATE POLICY "resumes_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket = 'resumes'
    AND uploaded_by = (SELECT auth.uid()::text)
  );

CREATE POLICY "resumes_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket = 'resumes'
    AND uploaded_by = (SELECT auth.uid()::text)
  )
  WITH CHECK (
    bucket = 'resumes'
    AND uploaded_by = (SELECT auth.uid()::text)
  );

CREATE POLICY "resumes_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket = 'resumes'
    AND uploaded_by = (SELECT auth.uid()::text)
  );
