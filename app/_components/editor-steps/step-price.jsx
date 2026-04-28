"use client";

import { useState } from 'react';
import { AlertCircle, BarChart3, Loader2, Target, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { aiApi } from '../../_lib/client-api';

export default function StepPrice({ data, identification, analysis, priceData, onPriceDone }) {
  const [loading, setLoading] = useState(false);

  const runPriceResearch = async () => {
    setLoading(true);

    try {
      const result = await aiApi.price({
        product: data,
        analysis,
        identification,
      });

      onPriceDone(result);
      toast.success('Cenový návrh je připraven.');
    } catch (error) {
      toast.error(error.message || 'Cenový průzkum se nepodařilo dokončit.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (value) => (value ? `${value.toLocaleString('cs-CZ')} Kč` : '—');

  const strategies = priceData
    ? [
        {
          key: 'fast',
          label: 'Rychlý prodej',
          desc: 'Prodej do 1 týdne',
          price: priceData.price_fast_sale,
          icon: TrendingDown,
          color: 'border-warning/30 bg-warning/5',
          recommended: false,
        },
        {
          key: 'balanced',
          label: 'Vyvážený prodej',
          desc: 'Prodej do 2-4 týdnů',
          price: priceData.price_balanced,
          icon: Target,
          color: 'border-primary/30 bg-primary/5',
          recommended: true,
        },
        {
          key: 'premium',
          label: 'Vyšší cena',
          desc: 'Trpělivý prodej',
          price: priceData.price_premium,
          icon: TrendingUp,
          color: 'border-success/30 bg-success/5',
          recommended: false,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-manrope text-lg font-bold mb-1">Cenový průzkum</h2>
        <p className="text-sm text-muted-foreground">
          Backend použije OpenAI pro návrh realistické ceny na základě stavu, výbavy a zadaných údajů.
        </p>
      </div>

      {!priceData && (
        <Card className="p-8 text-center border border-dashed border-border">
          <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4 opacity-60" />
          <h3 className="font-manrope font-semibold text-base mb-2">Spustit cenový návrh</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Výsledek vrátí cenové rozpětí, doporučené strategie a stručné vysvětlení.
          </p>
          <Button onClick={runPriceResearch} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Zpracovávám...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4" /> Spustit průzkum
              </>
            )}
          </Button>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Zpracovávám cenový návrh...</span>
        </div>
      )}

      {priceData && !loading && (
        <div className="space-y-5 animate-fade-in">
          <Card className="p-5 border border-border">
            <p className="font-semibold text-sm mb-2">Situace na trhu</p>
            <p className="text-sm text-muted-foreground">{priceData.market_overview}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Cenové rozpětí:</span>
              <Badge variant="outline" className="text-xs font-bold">
                {fmt(priceData.price_range_min)} - {fmt(priceData.price_range_max)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Spolehlivost: {priceData.data_confidence}
              </Badge>
            </div>
            {priceData.data_note && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {priceData.data_note}
              </p>
            )}
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {strategies.map((strategy) => (
              <Card key={strategy.key} className={`p-4 border ${strategy.color} relative`}>
                {strategy.recommended && (
                  <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground text-xs">
                    Doporučeno
                  </Badge>
                )}
                <strategy.icon className="w-5 h-5 mb-2 text-primary" />
                <p className="font-semibold text-sm">{strategy.label}</p>
                <p className="text-xs text-muted-foreground mb-2">{strategy.desc}</p>
                <p className="font-manrope font-bold text-xl text-foreground">{fmt(strategy.price)}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5 border border-border">
            <p className="font-semibold text-sm mb-2">Zdůvodnění odhadu</p>
            <p className="text-sm text-muted-foreground">{priceData.price_rationale}</p>
          </Card>

          {priceData.price_factors?.length > 0 && (
            <Card className="p-5 border border-border">
              <p className="font-semibold text-sm mb-3">Faktory ovlivňující cenu</p>
              <div className="space-y-2">
                {priceData.price_factors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-xs font-bold mt-0.5 flex-shrink-0">
                      {factor.impact === 'pozitivni' ? '▲' : factor.impact === 'negativni' ? '▼' : '●'}
                    </span>
                    <div>
                      <span className="text-sm font-medium">{factor.factor}</span>
                      <span className="text-xs text-muted-foreground ml-2">{factor.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {priceData.comparable_items?.length > 0 && (
            <Card className="p-5 border border-border">
              <p className="font-semibold text-sm mb-3">Srovnatelné nabídky</p>
              <div className="space-y-2">
                {priceData.comparable_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{item.description}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.platform}
                      </Badge>
                      <span className="font-semibold text-sm">{fmt(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Button onClick={runPriceResearch} variant="outline" size="sm" className="gap-2">
            <BarChart3 className="w-3.5 h-3.5" /> Aktualizovat průzkum
          </Button>
        </div>
      )}
    </div>
  );
}
