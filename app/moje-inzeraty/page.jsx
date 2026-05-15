"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ExternalLink, FileText, PlusCircle } from 'lucide-react';

import { listingsApi } from '../_lib/client-api';

const statusMap = {
  rozpracovany: { label: 'Rozpracovaný', color: 'bg-warning/10 text-warning border-warning/20' },
  analyzovany: { label: 'Analyzovaný', color: 'bg-accent/10 text-accent border-accent/20' },
  hotovy: { label: 'Hotový', color: 'bg-success/10 text-success border-success/20' },
};

const categoryMap = {
  elektronika: 'Elektronika',
  naradi: 'Nářadí',
  'naradÄ‚Â­': 'Nářadí',
  'naradĂ„â€šĂ‚Â­': 'Nářadí',
  domaci_technika: 'Domácí technika',
  mobily_tablety: 'Mobily & tablety',
  pc_notebooky: 'PC & notebooky',
  foto_video: 'Foto & video',
  audio: 'Audio',
  ostatni: 'Ostatní',
  'ostatnÄ‚Â­': 'Ostatní',
  'ostatnĂ„â€šĂ‚Â­': 'Ostatní',
};

const formatDate = (value) =>
  new Date(value).toLocaleString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await listingsApi.list('-created_date', 100);
        setListings(result);
      } catch (err) {
        setError(err.message || 'Nepodařilo se načíst inzeráty.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-manrope text-2xl font-bold">Moje inzeráty</h1>
          <p className="text-sm text-muted-foreground mt-1">Všechny vaše připravené inzeráty</p>
        </div>
        <Link href="/novy-inzerat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
          <PlusCircle className="w-4 h-4" />
          Nový inzerát
        </Link>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Načítám inzeráty...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && listings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground mb-4">Zatím žádné inzeráty</p>
          <Link href="/novy-inzerat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
            <PlusCircle className="w-4 h-4" />
            Vytvořit první inzerát
          </Link>
        </div>
      ) : null}

      {!loading && !error && listings.length > 0 && (
        <div className="space-y-3">
          {listings.map((listing) => {
            const status = statusMap[listing.status] || statusMap.rozpracovany;
            return (
              <Link key={listing.id} href={`/inzerat/${listing.id}`} className="block">
                <div className="rounded-2xl border border-border bg-card p-5 transition-all duration-150 hover:border-primary/30 hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {listing.photo_urls?.[0] ? (
                        <Image
                          src={listing.photo_urls[0]}
                          alt={listing.title || 'Fotografie inzerátu'}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">{listing.title || 'Bez názvu'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {listing.brand && <span className="text-sm text-muted-foreground">{listing.brand}</span>}
                          {listing.model && <span className="text-sm text-muted-foreground">{listing.model}</span>}
                          {listing.category && (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground">
                              {categoryMap[listing.category] || listing.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(listing.created_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {listing.generated_listings?.balanced?.price && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Vyvážená cena</p>
                          <p className="font-manrope font-bold text-lg">
                            {listing.generated_listings.balanced.price.toLocaleString('cs-CZ')} Kč
                          </p>
                        </div>
                      )}
                      <span className={`rounded-full border px-3 py-1 text-xs ${status.color}`}>{status.label}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
