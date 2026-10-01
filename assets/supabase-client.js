// Cliente Supabase do site público. A anon key é segura para expor no
// navegador — o acesso real é controlado pelas políticas de RLS do banco
// (ver supabase/migrations). Nunca coloque a service_role key aqui.
const SUPABASE_URL = "https://msurmhghjrdlpbduhewq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdXJtaGdoanJkbHBiZHVoZXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4OTQ2MDIsImV4cCI6MjEwNjQ3MDYwMn0.TVWK6U45VQxL2fE0wcW_zh7zKn6_Io6KtPq-cNqxeCo";

// Nome diferente de "supabase" de propósito: o script da CDN já expõe um
// objeto global `supabase` (a biblioteca em si); `const supabase = ...`
// aqui colidiria com ele e quebrava com "Identifier already declared".
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
