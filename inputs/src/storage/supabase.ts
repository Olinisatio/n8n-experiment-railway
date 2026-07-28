/**
 * Supabase client, created only when the project is configured via env vars.
 *
 * When `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are absent the app runs in
 * local-only mode (data stays in this browser) — that's the mode the Artifact
 * preview and the test suite use, since neither can (or should) reach the
 * network. The anon/publishable key is meant to live in client code; row-level
 * security in the database is what actually protects each user's data.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Tests always exercise the local-only path — never touch the network there.
const isTest = import.meta.env.MODE === 'test';

export const isSupabaseConfigured: boolean = Boolean(url && anonKey) && !isTest;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
