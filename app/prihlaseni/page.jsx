"use client";

import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAuth } from '../_components/auth-provider';

export default function LoginPage() {
  const { signInWithOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);

    try {
      await signInWithOtp(email);
      setSent(true);
      toast.success('Přihlašovací odkaz byl odeslán.');
    } catch (error) {
      toast.error(error.message || 'Nepodařilo se odeslat přihlašovací odkaz.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <Card className="w-full max-w-md p-8 border border-border shadow-sm">
        <div className="mb-6">
          <h1 className="font-manrope text-2xl font-bold text-foreground">Přihlášení</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Přihlaste se e-mailem. Pošleme vám bezpečný odkaz pro vstup do aplikace.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="např. petr@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={sending} className="w-full gap-2">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Poslat přihlašovací odkaz
          </Button>
        </form>

        {sent && (
          <p className="text-sm text-success mt-4">
            Odkaz jsme poslali na zadaný e-mail. Otevřete ho na stejném zařízení a dokončete přihlášení.
          </p>
        )}
      </Card>
    </div>
  );
}
