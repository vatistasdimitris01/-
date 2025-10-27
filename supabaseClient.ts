import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbsgklmcpuprxqykzirz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtic2drbG1jcHVwcnhxeWt6aXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTkxMzEsImV4cCI6MjA3NzEzNTEzMX0.nXS_9rRXtkdSnle4nG8vO4_foIAzizuIQTQSf7ZzPmk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
