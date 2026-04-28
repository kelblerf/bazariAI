"use client";

import { useState } from 'react';
import { CheckCircle, Loader2, PlugZap, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { aiApi } from '../../_lib/client-api';

export default function StepIdentify({ data, photos, identification, onIdentificationDone, onApplySuggestedUpdates }) {
  const [loading, setLoading] = useState(false);

  const runIdentification = async () => {
    setLoading(true);

    try {
      const result = await aiApi.identify({
        product: data,
        photos: photos.slice(0, 6),
      });

      onIdentificationDone(result);
      toast.success('Identifikace produktu je hotová.');
    } catch (error) {
      toast.error(error.message || 'Identifikaci produktu se nepodařilo dokončit.');
    } finally {
      setLoading(false);
    }
  };

  const applySuggestions = () => {
    if (!identification?.suggested_updates) {
      return;
    }

    onApplySuggestedUpdates(identification.suggested_updates);
    toast.success('Doporučené údaje byly propsané do formuláře.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-manrope text-lg font-bold mb-1">Identifikace produktu</h2>
        <p className="text-sm text-muted-foreground">
          Mezivýsledek pro rozpoznání přesného typu, konektorů, součástí balení a dalších technických detailů ještě před analýzou stavu.
        </p>
      </div>

      {!identification && (
        <Card className="p-8 text-center border border-dashed border-border">
          <Search className="w-12 h-12 text-primary mx-auto mb-4 opacity-60" />
          <h3 className="font-manrope font-semibold text-base mb-2">Rozpoznat produkt</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            AI použije název, fotky a webové dohledání, aby našla pravděpodobný typ produktu a důležité technické detaily.
          </p>
          <Button onClick={runIdentification} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Rozpoznávám...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Spustit identifikaci
              </>
            )}
          </Button>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Hledám přesný typ produktu a technické detaily...</span>
        </div>
      )}

      {identification && !loading && (
        <div className="space-y-5 animate-fade-in">
          <Card className="p-5 border border-border">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm mb-1">Pravděpodobná identifikace</p>
                <p className="text-base font-medium text-foreground">{identification.likely_product_match}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{identification.product_family}</Badge>
                  <Badge variant="outline" className="text-xs">Jistota: {identification.confidence}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {identification.detected_connectors?.length > 0 && (
            <Card className="p-5 border border-primary/20 bg-primary/5">
              <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                <PlugZap className="w-4 h-4 text-primary" /> Rozpoznané konektory a porty
              </p>
              <ul className="space-y-1">
                {identification.detected_connectors.map((item, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {(identification.identified_specs?.length > 0 || identification.likely_included_parts?.length > 0) && (
            <Card className="p-5 border border-border">
              {identification.identified_specs?.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold text-sm mb-2">Rozpoznané parametry</p>
                  <ul className="space-y-1">
                    {identification.identified_specs.map((item, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {identification.likely_included_parts?.length > 0 && (
                <div>
                  <p className="font-semibold text-sm mb-2">Pravděpodobné součásti balení</p>
                  <ul className="space-y-1">
                    {identification.likely_included_parts.map((item, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {identification.search_keywords?.length > 0 && (
            <Card className="p-5 border border-accent/20 bg-accent/5">
              <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Klíčová slova pro další dohledání
              </p>
              <div className="flex flex-wrap gap-1.5">
                {identification.search_keywords.map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">{item}</Badge>
                ))}
              </div>
            </Card>
          )}

          {identification.followup_questions?.length > 0 && (
            <Card className="p-5 border border-warning/20 bg-warning/5">
              <p className="font-semibold text-sm mb-3">Doporučené doplňující otázky</p>
              <ul className="space-y-2">
                {identification.followup_questions.map((item, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{item.question}</span>
                    <span className="text-muted-foreground"> — {item.reason}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="flex gap-3">
            <Button onClick={applySuggestions}>Použít doporučené údaje</Button>
            <Button onClick={runIdentification} variant="outline" className="gap-2">
              <Search className="w-4 h-4" /> Zkusit znovu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
