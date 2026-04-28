"use client";

import { useState } from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, Info, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { aiApi } from '../../_lib/client-api';

export default function StepAnalysis({ data, photos, identification, analysis, onAnalysisDone, onDataUpdate }) {
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);

    try {
      const result = await aiApi.analyze({
        product: data,
        photos: photos.slice(0, 6),
        identification,
      });

      onAnalysisDone(result);
      toast.success('Analýza je hotová.');
    } catch (error) {
      toast.error(error.message || 'Analýzu se nepodařilo dokončit.');
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = (idx, answer) => {
    const updated = { ...analysis };
    updated.followup_questions[idx].answer = answer;
    onAnalysisDone(updated);
  };

  const updateDataFromAnswer = (idx) => {
    const question = analysis.followup_questions[idx];
    if (question.answer) {
      onDataUpdate({ notes: `${data.notes || ''}\n${question.question}: ${question.answer}`.trim() });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-manrope text-lg font-bold mb-1">Analýza produktu</h2>
        <p className="text-sm text-muted-foreground">
          Backend bezpečně pošle data a fotky do OpenAI a vrátí strukturovanou analýzu produktu.
        </p>
      </div>

      {!analysis && (
        <Card className="p-8 text-center border border-dashed border-border">
          <Zap className="w-12 h-12 text-primary mx-auto mb-4 opacity-60" />
          <h3 className="font-manrope font-semibold text-base mb-2">Spustit AI analýzu</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Analýza posoudí zadané informace a fotografie, odhadne stav a ukáže, co ještě doplnit.
          </p>
          <Button onClick={runAnalysis} disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzuji...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Spustit analýzu
              </>
            )}
          </Button>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Analyzuji produkt a fotografie...</span>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-5 animate-fade-in">
          <Card className="p-5 border border-border">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm mb-1">Shrnutí produktu</p>
                <p className="text-sm text-muted-foreground">{analysis.product_summary}</p>
                {analysis.likely_product_match && (
                  <p className="text-sm text-foreground mt-2">
                    Pravděpodobná identifikace: <span className="font-medium">{analysis.likely_product_match}</span>
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {analysis.product_type_detected}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Odhad stavu: {analysis.estimated_condition} ({analysis.condition_confidence} jistota)
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {(analysis.identified_specs?.length > 0 || analysis.likely_included_parts?.length > 0) && (
            <Card className="p-5 border border-primary/20 bg-primary/5">
              <p className="font-semibold text-sm mb-3">Rozpoznané detaily produktu</p>
              {analysis.identified_specs?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Parametry a rozpoznané znaky</p>
                  <ul className="space-y-1">
                    {analysis.identified_specs.map((item, index) => (
                      <li key={index} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.likely_included_parts?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Pravděpodobné součásti a příslušenství</p>
                  <ul className="space-y-1">
                    {analysis.likely_included_parts.map((item, index) => (
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

          {analysis.positive_aspects?.length > 0 && (
            <Card className="p-5 border border-success/20 bg-success/5">
              <p className="font-semibold text-sm text-success mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Silné stránky
              </p>
              <ul className="space-y-1">
                {analysis.positive_aspects.map((item, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-success mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {analysis.detected_defects?.length > 0 && (
            <Card className="p-5 border border-warning/20 bg-warning/5">
              <p className="font-semibold text-sm text-warning mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Zjištěné nebo možné vady
              </p>
              <ul className="space-y-1">
                {analysis.detected_defects.map((item, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-warning mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {analysis.warnings?.length > 0 && (
            <Card className="p-5 border border-destructive/20 bg-destructive/5">
              <p className="font-semibold text-sm text-destructive mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Upozornění
              </p>
              <ul className="space-y-1">
                {analysis.warnings.map((item, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-destructive mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {analysis.photo_assessment && (
            <Card className="p-5 border border-border">
              <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" /> Hodnocení fotografií
              </p>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="text-xs">
                  Kvalita: {analysis.photo_assessment.quality}
                </Badge>
                {!analysis.photo_assessment.count_sufficient && (
                  <Badge className="text-xs border bg-warning/10 text-warning border-warning/20">
                    Nedostatek fotografií
                  </Badge>
                )}
              </div>
              {analysis.photo_assessment.missing_photos?.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Chybějící fotografie:</p>
                  <ul className="space-y-0.5">
                    {analysis.photo_assessment.missing_photos.map((item, index) => (
                      <li key={index} className="text-sm text-foreground">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.photo_assessment.recommendations?.length > 0 && (
                <ul className="space-y-0.5">
                  {analysis.photo_assessment.recommendations.map((item, index) => (
                    <li key={index} className="text-xs text-muted-foreground">
                      → {item}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          {analysis.followup_questions?.length > 0 && (
            <Card className="p-5 border border-accent/20 bg-accent/5">
              <p className="font-semibold text-sm text-accent mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Doplňující otázky
              </p>
              <div className="space-y-4">
                {analysis.followup_questions.map((question, index) => (
                  <div key={index} className="space-y-1.5">
                    <Label className="text-sm font-medium">{question.question}</Label>
                    <p className="text-xs text-muted-foreground">{question.reason}</p>
                    <Input
                      placeholder="Vaše odpověď..."
                      value={question.answer || ''}
                      onChange={(event) => answerQuestion(index, event.target.value)}
                      onBlur={() => updateDataFromAnswer(index)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Button onClick={runAnalysis} variant="outline" size="sm" className="gap-2">
            <Zap className="w-3.5 h-3.5" /> Znovu analyzovat
          </Button>
        </div>
      )}
    </div>
  );
}
