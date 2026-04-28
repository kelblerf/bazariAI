"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { listingsApi } from '../_lib/client-api';
import StepAnalysis from './editor-steps/step-analysis';
import StepGenerate from './editor-steps/step-generate';
import StepIdentify from './editor-steps/step-identify';
import StepPhotos from './editor-steps/step-photos';
import StepPrice from './editor-steps/step-price';
import StepProduct from './editor-steps/step-product';

const steps = [
  { id: 'product', label: 'Produkt', number: 1 },
  { id: 'photos', label: 'Fotografie', number: 2 },
  { id: 'identify', label: 'Identifikace', number: 3 },
  { id: 'analysis', label: 'Analýza', number: 4 },
  { id: 'price', label: 'Cena', number: 5 },
  { id: 'generate', label: 'Inzerát', number: 6 },
];

export default function ListingEditor({ initialListingId = null }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(initialListingId));
  const [listingId, setListingId] = useState(initialListingId);

  const [formData, setFormData] = useState({ title: '' });
  const [photos, setPhotos] = useState([]);
  const [identification, setIdentification] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [generatedListings, setGeneratedListings] = useState(null);

  useEffect(() => {
    if (!initialListingId) {
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const found = await listingsApi.get(initialListingId);

        setFormData({
          title: found.title || '',
          brand: found.brand || '',
          model: found.model || '',
          category: found.category || '',
          age_years: found.age_years || '',
          technical_condition: found.technical_condition || '',
          visual_condition: found.visual_condition || '',
          functionality: found.functionality || '',
          accessories: found.accessories || '',
          defects: found.defects || '',
          reason_for_sale: found.reason_for_sale || '',
          location: found.location || '',
          delivery_method: found.delivery_method || '',
          payment_method: found.payment_method || '',
          original_price: found.original_price || '',
          desired_price: found.desired_price || '',
          notes: found.notes || '',
        });
        setPhotos(found.photo_urls || []);
        if (found.ai_identification) setIdentification(found.ai_identification);
        if (found.ai_analysis) setAnalysis(found.ai_analysis);
        if (found.price_research) setPriceData(found.price_research);
        if (found.generated_listings) setGeneratedListings(found.generated_listings);
      } catch (error) {
        toast.error(error.message || 'Nepodařilo se načíst inzerát.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [initialListingId]);

  const status = useMemo(() => {
    if (generatedListings) return 'hotovy';
    if (analysis) return 'analyzovany';
    if (identification) return 'identifikovany';
    return 'rozpracovany';
  }, [analysis, generatedListings, identification]);

  const payload = useMemo(
    () => ({
      ...formData,
      photo_urls: photos,
      ai_identification: identification,
      ai_analysis: analysis,
      price_research: priceData,
      generated_listings: generatedListings,
      status,
    }),
    [analysis, formData, generatedListings, identification, photos, priceData, status]
  );

  const save = async (extraData = {}) => {
    setSaving(true);

    try {
      if (listingId) {
        await listingsApi.update(listingId, {
          ...payload,
          ...extraData,
        });
      } else {
        const created = await listingsApi.create({
          ...payload,
          ...extraData,
        });
        setListingId(created.id);
        router.replace(`/inzerat/${created.id}/upravit`);
      }
      toast.success('Uloženo');
    } finally {
      setSaving(false);
    }
  };

  const goNext = async () => {
    await save();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepCompleted = (idx) => {
    if (idx === 0) return formData.title?.trim();
    if (idx === 1) return photos.length > 0;
    if (idx === 2) return !!identification;
    if (idx === 3) return !!analysis;
    if (idx === 4) return !!priceData;
    if (idx === 5) return !!generatedListings;
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Načítám editor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <Link href="/">
              <ChevronLeft className="w-4 h-4" /> Zpět
            </Link>
          </Button>
          <div className="h-5 w-px bg-border" />
          <h1 className="font-manrope font-bold text-base">{formData.title || 'Nový inzerát'}</h1>
        </div>
        <Button onClick={() => save()} disabled={saving} variant="outline" size="sm" className="gap-1.5">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Uložit
        </Button>
      </div>

      <div className="bg-card border-b border-border px-8 py-3">
        <div className="flex items-center gap-1 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-1 flex-1">
              <button
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex-1 justify-center',
                  idx === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : stepCompleted(idx)
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : 'bg-muted text-muted-foreground hover:bg-secondary'
                )}
              >
                {stepCompleted(idx) && idx !== currentStep ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold',
                      idx === currentStep ? 'bg-primary-foreground/20' : 'bg-current/20'
                    )}
                  >
                    {step.number}
                  </span>
                )}
                {step.label}
              </button>
              {idx < steps.length - 1 && (
                <div className={cn('h-px flex-none w-4', stepCompleted(idx) ? 'bg-success/30' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 animate-fade-in">
        {currentStep === 0 && <StepProduct data={formData} onChange={setFormData} />}
        {currentStep === 1 && <StepPhotos photos={photos} onPhotosChange={setPhotos} />}
        {currentStep === 2 && (
          <StepIdentify
            data={formData}
            photos={photos}
            identification={identification}
            onIdentificationDone={setIdentification}
            onApplySuggestedUpdates={(updates) =>
              setFormData((prev) => ({
                ...prev,
                brand: updates.brand || prev.brand,
                model: updates.model || prev.model,
                category: updates.category || prev.category,
                accessories: updates.accessories || prev.accessories,
                notes: [prev.notes, updates.notes].filter(Boolean).join('\n').trim(),
              }))
            }
          />
        )}
        {currentStep === 3 && (
          <StepAnalysis
            data={formData}
            photos={photos}
            identification={identification}
            analysis={analysis}
            onAnalysisDone={setAnalysis}
            onDataUpdate={(upd) => setFormData((prev) => ({ ...prev, ...upd }))}
          />
        )}
        {currentStep === 4 && (
          <StepPrice
            data={formData}
            identification={identification}
            analysis={analysis}
            priceData={priceData}
            onPriceDone={setPriceData}
          />
        )}
        {currentStep === 5 && (
          <StepGenerate
            data={formData}
            identification={identification}
            analysis={analysis}
            priceData={priceData}
            listings={generatedListings}
            onListingsDone={async (listings) => {
              setGeneratedListings(listings);
              await save({ generated_listings: listings, status: 'hotovy' });
            }}
          />
        )}
      </div>

      <div className="sticky bottom-0 bg-card border-t border-border px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button onClick={goPrev} disabled={currentStep === 0} variant="outline" className="gap-1.5">
            <ChevronLeft className="w-4 h-4" /> Předchozí
          </Button>
          <span className="text-xs text-muted-foreground">
            Krok {currentStep + 1} z {steps.length}
          </span>
          {currentStep < steps.length - 1 ? (
            <Button onClick={goNext} disabled={saving} className="gap-1.5">
              Další <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={async () => {
                await save();
                router.push('/');
              }}
              disabled={saving}
              className="gap-1.5 bg-success hover:bg-success/90 text-white"
            >
              <CheckCircle className="w-4 h-4" /> Dokončit a uložit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
