import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

// Initialize Supabase
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
