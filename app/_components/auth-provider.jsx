"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getSupabaseBrowser } from '../_lib/supabase-browser';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Supabase session load failed', error);
      }

      setSession(data.session || null);
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setUser(nextSession?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      async signInWithOtp(email) {
        const supabase = getSupabaseBrowser();
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/prihlaseni`,
          },
        });

        if (error) {
          throw error;
        }
      },
      async signOut() {
        const supabase = getSupabaseBrowser();
        const { error } = await supabase.auth.signOut();

        if (error) {
          toast.error(error.message || 'Odhlášení se nepodařilo.');
          return;
        }

        toast.success('Odhlášeno');
      },
    }),
    [loading, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
};
