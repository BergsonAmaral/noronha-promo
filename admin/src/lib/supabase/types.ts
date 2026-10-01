// Tipos manuais enquanto o projeto Supabase não está linkado.
// Depois de rodar `supabase link`, substitua gerando os tipos reais com:
//   supabase gen types typescript --linked > src/lib/supabase/types.ts

export type UserRole = "cliente" | "parceiro" | "admin";
export type ParceiroStatus = "pendente" | "aprovado" | "rejeitado" | "inativo";
export type BeneficioStatus = "ativo" | "pausado" | "expirado";
export type TipoDesconto = "percentual" | "valor_fixo" | "outro";
export type ResgateStatus = "aguardando_pagamento" | "pago" | "utilizado" | "expirado" | "cancelado";

export interface Profile {
  id: string;
  role: UserRole;
  nome: string;
  email: string | null;
  telefone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  created_at: string;
}

export interface Parceiro {
  id: string;
  user_id: string | null;
  categoria_id: string | null;
  nome_negocio: string;
  descricao: string | null;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  endereco: string | null;
  logo_url: string | null;
  status: ParceiroStatus;
  observacoes_admin: string | null;
  created_at: string;
  updated_at: string;
}

export interface Beneficio {
  id: string;
  parceiro_id: string;
  categoria_id: string | null;
  titulo: string;
  descricao: string | null;
  tipo_desconto: TipoDesconto;
  valor_desconto: number | null;
  preco: number;
  condicoes: string | null;
  imagem_url: string | null;
  validade_inicio: string | null;
  validade_fim: string | null;
  limite_resgates: number | null;
  status: BeneficioStatus;
  created_at: string;
  updated_at: string;
}

export interface Resgate {
  id: string;
  beneficio_id: string;
  cliente_id: string;
  codigo: string;
  status: ResgateStatus;
  valor_pago: number | null;
  pago_em: string | null;
  resgatado_em: string;
  utilizado_em: string | null;
}

export interface Mensagem {
  id: string;
  parceiro_id: string;
  remetente_id: string;
  remetente_role: UserRole;
  mensagem: string;
  lida: boolean;
  created_at: string;
}

export interface Avaliacao {
  id: string;
  parceiro_id: string;
  cliente_id: string;
  resgate_id: string | null;
  nota: number;
  comentario: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  consentimento: boolean;
  origem: string | null;
  created_at: string;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  periodicidade: string;
  ativo: boolean;
  ordem: number;
  created_at: string;
}

// Shape mínimo exigido pelo @supabase/ssr — não precisa estar 100% completo
// para o cliente funcionar, mas ajuda o autocomplete do .from('tabela').
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      categorias: { Row: Categoria; Insert: Partial<Categoria>; Update: Partial<Categoria> };
      parceiros: { Row: Parceiro; Insert: Partial<Parceiro>; Update: Partial<Parceiro> };
      beneficios: { Row: Beneficio; Insert: Partial<Beneficio>; Update: Partial<Beneficio> };
      resgates: { Row: Resgate; Insert: Partial<Resgate>; Update: Partial<Resgate> };
      leads: { Row: Lead; Insert: Partial<Lead>; Update: Partial<Lead> };
      planos: { Row: Plano; Insert: Partial<Plano>; Update: Partial<Plano> };
    };
  };
};
