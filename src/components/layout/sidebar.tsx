"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Landmark,
  TrendingUp,
  ShoppingBag,
  Tag,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Visão geral", icon: Compass },
  { href: "/dividas", label: "Dívidas", icon: Landmark },
  { href: "/rendimentos", label: "Rendimentos", icon: TrendingUp },
  { href: "/gastos", label: "Gastos", icon: ShoppingBag },
  { href: "/categorias", label: "Categorias", icon: Tag },
  { href: "/metas", label: "Metas", icon: Target },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-line bg-paper-raised sm:flex sm:flex-col">
      <div className="px-6 pt-9 pb-8">
        <Link href="/" className="block">
          <span className="font-display text-[1.55rem] italic leading-none text-ink">
            Régua
          </span>
          <span className="mt-1 block text-xs tracking-wide text-ink-muted">
            controle de dívidas e gastos
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent-soft text-accent font-medium"
                      : "text-ink-muted hover:bg-black/[0.03] hover:text-ink"
                  )}
                >
                  <Icon size={17} strokeWidth={active ? 2.25 : 1.75} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-6 py-5 text-xs text-ink-muted">
        Meta: sair do vermelho até dez/2026
      </div>
    </aside>
  );
}
