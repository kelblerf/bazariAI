"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LayoutDashboard, LogOut, PlusCircle, Tag } from 'lucide-react';

import { useAuth } from './auth-provider';

const navItems = [
  { href: '/', label: 'Přehled', icon: LayoutDashboard, external: false },
  { href: '/novy-inzerat', label: 'Nový inzerát', icon: PlusCircle, external: false },
  { href: '/moje-inzeraty', label: 'Moje inzeráty', icon: FileText, external: false },
];

const navClass = (active) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
    active
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
  }`;

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Tag className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-manrope font-800 text-base text-foreground leading-tight">BazarPro</h1>
            <p className="text-xs text-muted-foreground">Průvodce prodejem</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={navClass(pathname === href)}>
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        {user?.email && <div className="text-xs text-muted-foreground text-center mb-3">{user.email}</div>}
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Odhlásit
        </button>
        <div className="text-xs text-muted-foreground text-center">Sbazar · Aukro · Bazoš</div>
      </div>
    </aside>
  );
}
