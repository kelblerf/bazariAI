"use client";

import { useState } from 'react';
import { CheckCircle, Copy, FileText, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { aiApi } from '../../_lib/client-api';

const conditionLabels = {
  vynikajici: 'Vynikající',
  velmi_dobry: 'Velmi dobrý',
  dobry: 'Dobrý',
  horsi_stav: 'Horší stav',
  na_dily: 'Na díly',
  jako_novy: 'Jako nový',
  s_defekty: 'S defekty',
  spatny: 'Špatný',
  neovereno: 'Neověřeno',
};

const variantConfig = {
  fast: { label: 'Rychlý prodej' },
  balanced: { label: 'Vyvážený prodej' },
  premium: { label: 'Vyšší cena' },
};

function CopyButton({ text, label = 'Kopírovat' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Zkopírováno!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={copy} className="gap-1.5 text-xs">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Zkopírováno' : label}
    </Button>
  );
}

function VariantCard({ variant }) {
  if (!variant) {
    return null;
  }

  const fullText = `${variant.title}\n\n${variant.description}\n\nCena: ${variant.price?.toLocaleString('cs-CZ')} Kč\n\nStav: ${variant.condition}\n\nKlíčová slova: ${variant.keywords?.join(', ')}\n\nPředání: ${variant.delivery}\nPlatba: ${variant.payment}`;

  return (
    <div className="space-y-4">
      <Card className="p-4 border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-1">Strategie</p>
        <p className="text-sm">{variant.strategy_explanation}</p>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Titulek</p>
          <CopyButton text={variant.title} label="Kopírovat titulek" />
        </div>
        <Card className="p-3 border border-border bg-muted/30">
          <p className="font-semibold text-foreground">{variant.title}</p>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Doporučená cena</p>
          <p className="font-manrope font-bold text-2xl text-foreground">
            {variant.price?.toLocaleString('cs-CZ')} Kč
          </p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-xs text-muted-foreground">Stav</p>
          <Badge variant="outline" className="text-xs">
            {variant.condition}
          </Badge>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Hlavní popis</p>
          <CopyButton text={variant.description} label="Kopírovat popis" />
        </div>
        <Card className="p-4 border border-border bg-muted/10">
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{variant.description}</p>
        </Card>
      </div>

      {variant.short_description && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stručná verze</p>
            <CopyButton text={variant.short_description} label="Kopírovat" />
          </div>
          <Card className="p-4 border border-border bg-muted/10">
            <p className="text-sm text-foreground">{variant.short_description}</p>
          </Card>
        </div>
      )}

      {variant.bullet_points?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Přehled vlastností</p>
            <CopyButton text={variant.bullet_points.map((item) => `• ${item}`).join('\n')} label="Kopírovat" />
          </div>
          <Card className="p-4 border border-border">
            <ul className="space-y-1.5">
              {variant.bullet_points.map((item, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Předání</p>
          <p className="text-sm">{variant.delivery}</p>
        </Card>
        <Card className="p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Platba</p>
          <p className="text-sm">{variant.payment}</p>
        </Card>
      </div>

      {variant.keywords?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Klíčová slova</p>
          <div className="flex flex-wrap gap-1.5">
            {variant.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-border">
        <CopyButton text={fullText} label="Kopírovat celý inzerát" />
      </div>
    </div>
  );
}

export default function StepGenerate({ data, identification, analysis, priceData, listings, onListingsDone }) {
  const [loading, setLoading] = useState(false);

  const generateListings = async () => {
    setLoading(true);

    try {
      const result = await aiApi.generate({
        product: {
          ...data,
          technical_condition_label: conditionLabels[data.technical_condition] || data.technical_condition || '',
          visual_condition_label: conditionLabels[data.visual_condition] || data.visual_condition || '',
        },
        identification,
        analysis,
        pricing: priceData,
      });

      onListingsDone(result);
      toast.success('Varianty inzerátu byly vygenerovány.');
    } catch (error) {
      toast.error(error.message || 'Generování inzerátu se nepodařilo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-manrope text-lg font-bold mb-1">Generování inzerátu</h2>
        <p className="text-sm text-muted-foreground">
          Backend vytvoří tři varianty textu inzerátu přes OpenAI a vrátí je ve strukturované podobě.
        </p>
      </div>

      {!listings && (
        <Card className="p-8 text-center border border-dashed border-border">
          <FileText className="w-12 h-12 text-primary mx-auto mb-4 opacity-60" />
          <h3 className="font-manrope font-semibold text-base mb-2">Vygenerovat inzeráty</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Připravíme tři textové varianty podle produktu, analýzy a navržené ceny.
          </p>
          <Button onClick={generateListings} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generuji...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Generovat inzeráty
              </>
            )}
          </Button>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <div>
            <p className="text-foreground font-medium">Píšu inzeráty...</p>
            <p className="text-sm text-muted-foreground">Tohle může chvíli trvat.</p>
          </div>
        </div>
      )}

      {listings && !loading && (
        <div className="space-y-5 animate-fade-in">
          <Tabs defaultValue="balanced">
            <TabsList className="grid grid-cols-3 w-full">
              {Object.entries(variantConfig).map(([key, cfg]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {cfg.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.keys(variantConfig).map((key) => (
              <TabsContent key={key} value={key} className="mt-5">
                <VariantCard variant={listings[key]} />
              </TabsContent>
            ))}
          </Tabs>

          {listings.improvements?.length > 0 && (
            <Card className="p-5 border border-accent/20 bg-accent/5 mt-6">
              <p className="font-semibold text-sm text-accent mb-3">Doporučení před zveřejněním</p>
              <ul className="space-y-1.5">
                {listings.improvements.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-accent mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {listings.risks?.length > 0 && (
            <Card className="p-5 border border-warning/20 bg-warning/5">
              <p className="font-semibold text-sm text-warning mb-3">Upozornění a rizika</p>
              <ul className="space-y-1.5">
                {listings.risks.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-warning mt-0.5">!</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Button onClick={generateListings} variant="outline" size="sm" className="gap-2">
            <Zap className="w-3.5 h-3.5" /> Přegenerovat varianty
          </Button>
        </div>
      )}
    </div>
  );
}
