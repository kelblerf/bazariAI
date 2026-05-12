"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, ChevronLeft, Copy, Edit, Target, TrendingDown, TrendingUp } from 'lucide-react';

import { listingsApi } from '../../_lib/client-api';

function CopyBtn({ text, label = 'Kop\u00edrovat' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium">
      {copied ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Zkop\u00edrov\u00e1no!' : label}
    </button>
  );
}

const variantConfig = {
  fast: { label: 'Rychl\u00fd prodej', icon: TrendingDown, color: 'text-warning' },
  balanced: { label: 'Vyv\u00e1\u017een\u00fd', icon: Target, color: 'text-primary' },
  premium: { label: 'Vy\u0161\u0161\u00ed cena', icon: TrendingUp, color: 'text-success' },
};

export default function ListingDetailNextPage() {
  const params = useParams();
  const listingId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!listingId) {
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await listingsApi.get(listingId);
        setListing(result);
      } catch (err) {
        setError(err.message || 'Nepoda\u0159ilo se na\u010d\u00edst detail inzer\u00e1tu.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [listingId]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-sm text-destructive">{error || 'Inzer\u00e1t nebyl nalezen.'}</p>
      </div>
    );
  }

  const gl = listing.generated_listings;
  const aa = listing.ai_analysis;
  const pr = listing.price_research;

  const buildFullText = (variant) => {
    if (!variant) return '';
    return `${variant.title}\n\n${variant.description}\n\nCena: ${variant.price?.toLocaleString('cs-CZ')} K\u010d\nStav: ${variant.condition}\n${variant.category ? `Kategorie: ${variant.category}\n` : ''}Kl\u00ed\u010dov\u00e1 slova: ${variant.keywords?.join(', ')}\n\nP\u0159ed\u00e1n\u00ed: ${variant.delivery}\nPlatba: ${variant.payment}`;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <ChevronLeft className="w-4 h-4" /> Zp\u011bt
          </Link>
          <div>
            <h1 className="font-manrope text-2xl font-bold">{listing.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {listing.brand && <span className="text-sm text-muted-foreground">{listing.brand}</span>}
              {listing.model && <span className="text-sm text-muted-foreground">{listing.model}</span>}
            </div>
          </div>
        </div>
        <Link href={`/inzerat/${listing.id}/upravit`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
          <Edit className="w-4 h-4" /> Upravit
        </Link>
      </div>

      {listing.photo_urls?.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-3">
            {listing.photo_urls.map((url, index) => (
              <Image
                key={url + index}
                src={url}
                alt={`${listing.title} - foto ${index + 1}`}
                width={800}
                height={800}
                sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                className={`rounded-xl object-cover border border-border ${index === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
              />
            ))}
          </div>
        </div>
      )}

      {pr && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Rychl\u00fd prodej', price: pr.price_fast_sale, icon: TrendingDown, color: 'text-warning' },
            { label: 'Vyv\u00e1\u017een\u00e1 cena', price: pr.price_balanced, icon: Target, color: 'text-primary' },
            { label: 'Vy\u0161\u0161\u00ed cena', price: pr.price_premium, icon: TrendingUp, color: 'text-success' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-card p-4">
              <item.icon className={`w-4 h-4 ${item.color} mb-1`} />
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`font-manrope font-bold text-xl ${item.color}`}>{item.price?.toLocaleString('cs-CZ')} K\u010d</p>
            </div>
          ))}
        </div>
      )}

      {gl && (
        <div className="mb-8 space-y-5">
          <h2 className="font-manrope font-bold text-lg">Varianty inzer\u00e1tu</h2>
          {Object.entries(variantConfig).map(([key, config]) => {
            const variant = gl[key];
            if (!variant) return null;

            return (
              <div key={key} className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>{config.label}</p>
                    <h3 className="font-semibold text-lg mt-1">{variant.title}</h3>
                    <p className="font-manrope font-bold text-3xl text-foreground mt-1">{variant.price?.toLocaleString('cs-CZ')} K\u010d</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <CopyBtn text={variant.title} label="Titulek" />
                    <CopyBtn text={variant.description} label="Popis" />
                    <CopyBtn text={buildFullText(variant)} label="Cel\u00fd inzer\u00e1t" />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/10 p-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{variant.description}</p>
                </div>

                {variant.bullet_points?.length > 0 && (
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">P\u0159ehled vlastnost\u00ed</p>
                    <ul className="space-y-1">
                      {variant.bullet_points.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-0.5">\u2022</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {aa && (
        <div className="space-y-3 mb-8">
          <h2 className="font-manrope font-bold text-lg">Shrnut\u00ed anal\u00fdzy</h2>
          {aa.positive_aspects?.length > 0 && (
            <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
              <p className="font-semibold text-xs text-success uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Siln\u00e9 str\u00e1nky
              </p>
              <ul className="space-y-1">
                {aa.positive_aspects.map((item, index) => (
                  <li key={index} className="text-sm">\u2713 {item}</li>
                ))}
              </ul>
            </div>
          )}
          {aa.detected_defects?.length > 0 && (
            <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
              <p className="font-semibold text-xs text-warning uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Vady a upozorn\u011bn\u00ed
              </p>
              <ul className="space-y-1">
                {aa.detected_defects.map((item, index) => (
                  <li key={index} className="text-sm">\u26a0 {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
