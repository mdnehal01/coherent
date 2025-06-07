import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://drhvvanncymvggorxuhn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyaHZ2YW5uY3ltdmdnb3J4dWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDMxNTcsImV4cCI6MjA2MTIxOTE1N30.3ObuCteiGJFAtdsHsbWRuaojbPIfRvYj8sxxu6LWe6o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);