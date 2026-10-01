// Cliente Supabase do site público. A anon key é segura para expor no
// navegador — o acesso real é controlado pelas políticas de RLS do banco
// (ver supabase/migrations). Nunca coloque a service_role key aqui.
const SUPABASE_URL = "https://oorgsbotvvvkxfongnxj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vcmdzYm90dnZ2a3hmb25nbnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NTg4NTIsImV4cCI6MjEwNjQzNDg1Mn0.kyh610LuzXTStyfSLVB7KL73wm-8Lvs9CrKzN61ULik";

// Nome diferente de "supabase" de propósito: o script da CDN já expõe um
// objeto global `supabase` (a biblioteca em si); `const supabase = ...`
// aqui colidiria com ele e quebrava com "Identifier already declared".
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
