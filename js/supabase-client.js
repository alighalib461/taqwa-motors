/**
 * Taqwa Motors - Supabase Client Configuration
 * Uses public publishable/anon credentials.
 * Service-role keys are NEVER used in client-side code.
 */

const SUPABASE_URL = 'https://xzbtbhkefwbxzcrgojda.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6YnRiaGtlZndieHpjcmdvamRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NzU5ODIsImV4cCI6MjEwNDM1MTk4Mn0.4TwufNm2-CdpOGw2teHESCpEsWnI_H0x7blbE7av8Hk';

// Initialize Supabase Client
let _supabaseInstance = null;

function getSupabaseClient() {
  if (!_supabaseInstance) {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      _supabaseInstance = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } else if (window.supabase && window.supabase.createClient) {
      _supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } else {
      console.error('Supabase library not loaded. Ensure CDN script is included.');
    }
  }
  return _supabaseInstance;
}

window.getSupabaseClient = getSupabaseClient;
window.SUPABASE_URL = SUPABASE_URL;
