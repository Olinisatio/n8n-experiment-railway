/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL (Project Settings → API). Blank = local-only mode. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon / publishable key. Safe in the client; guarded by RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
