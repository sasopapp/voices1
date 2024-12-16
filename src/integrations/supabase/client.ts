import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jawvjzabljmzakcfkxhw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphd3ZqemFibGptemFrY2ZreGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMjg2NDIsImV4cCI6MjA0OTkwNDY0Mn0.YCzh8xIesZ02GD4dcVzpUECqUgmqUqQIJTswlkWvJ_M";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'voiceover-auth-token',
      storage: window.localStorage
    }
  }
);