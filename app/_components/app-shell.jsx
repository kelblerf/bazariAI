"use client";

import { usePathname } from 'next/navigation';

import Sidebar from './sidebar';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/prihlaseni';

  if (isAuthPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
