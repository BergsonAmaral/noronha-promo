import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O app fica publicado em noronhapromo.com.br/portal (rewrite feito no
  // site público via vercel.json) — basePath faz o Next.js gerar todas as
  // rotas, links e assets já com esse prefixo.
  basePath: "/portal",
};

export default nextConfig;
