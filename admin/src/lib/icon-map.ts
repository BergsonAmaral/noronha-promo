import {
  Compass,
  Waves,
  BedDouble,
  Utensils,
  Car,
  Camera,
  Store,
  Heart,
  Ticket,
  type LucideIcon,
} from "lucide-react";

// Mapeia o nome do ícone salvo no banco (coluna `icone` de categorias)
// para o componente Lucide correspondente.
export const ICON_MAP: Record<string, LucideIcon> = {
  compass: Compass,
  waves: Waves,
  "bed-double": BedDouble,
  utensils: Utensils,
  car: Car,
  camera: Camera,
  store: Store,
  heart: Heart,
  ticket: Ticket,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Compass;
}
