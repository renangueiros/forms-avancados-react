import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://dqnyhikpbrypdbunogts.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbnloaWtwYnJ5cGRidW5vZ3RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTE3NDE0MSwiZXhwIjoyMDI0NzUwMTQxfQ.AgEFmRlSJT6Kr7iEmpZZX8LtqsFxO5wJJtJxsxHvQqM"
);
