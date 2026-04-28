"use client";

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from './auth-provider';

export default function AuthScreen({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAuthPage = pathname === '/prihlaseni';

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user && !isAuthPage) {
      router.replace('/prihlaseni');
    }

    if (user && isAuthPage) {
      router.replace('/');
    }
  }, [isAuthPage, loading, router, user]);

  if (loading || (!user && !isAuthPage) || (user && isAuthPage)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Ověřuji přihlášení...
        </div>
      </div>
    );
  }

  return children;
}
