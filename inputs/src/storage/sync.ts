/**
 * Cloud sync for the signed-in user's data. One JSON blob per user in the
 * `app_data` table, protected by row-level security so each user only ever
 * reads or writes their own row. The blob is the same {@link AppData} the app
 * keeps locally, so the local cache stays a drop-in fallback when offline.
 */
import type { AppData } from '../domain/types';
import { validateAppData } from './schema';
import { supabase } from './supabase';

const TABLE = 'app_data';

/**
 * Fetch the signed-in user's data. Returns `null` when they have no row yet
 * (a brand-new cloud account), and throws on a real network/permission error
 * so the caller can fall back to the local cache.
 */
export async function loadRemote(userId: string): Promise<AppData | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return validateAppData(data.data);
}

/** Upsert the signed-in user's data blob (last write wins on their row). */
export async function saveRemote(userId: string, data: AppData): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { user_id: userId, data, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  if (error) throw error;
}
