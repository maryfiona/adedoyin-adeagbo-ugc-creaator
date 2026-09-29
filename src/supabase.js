import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hxhjbmpkxkuspyqofxml.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aGpibXBreGt1c3B5cW9meG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTcwNzcsImV4cCI6MjEwNjE5MzA3N30.yTGLdmq7Jb688TlQAw1rG4XsYmbWiHLt-b7lf2omlGw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
