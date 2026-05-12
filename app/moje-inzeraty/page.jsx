"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ExternalLink, FileText, PlusCircle } from 'lucide-react';

import { listingsApi } from '../_lib/client-api';

const statusMap = {
  rozpracovany: { label: 'Rozpracovan\u00fd', color: 'bg-warning/10 text-warning border-warning/20' },
  analyzovany: { label: 'Analyzovan\u00fd', color: 'bg-accent/10 text-accent border-accent/20' },
  hotovy: { label: 'Hotov\u00fd', color: 'bg-success/10 text-success border-success/20' },
};

const categoryMap = {
  elektronika: 'Elektronika',
  naradi: 'N\u00e1\u0159ad\u00ed',
  'naradĂ­': 'N\u00e1\u0159ad\u00ed',
  'naradÄ‚Â­': 'N\u00e1\u0159ad\u00ed',
  domaci_technika: 'Dom\u00e1c\u00ed technika',
  mobily_tablety: 'Mobily & tablety',
  pc_notebooky: 'PC & notebooky',
  foto_video: 'Foto & video',
  audio: 'Audio',
  ostatni: 'Ostatn\u00ed',
  'ostatnĂ­': 'Ostatn\u00ed',
  'ostatnÄ‚Â­': 'Ostatn\u00ed',
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
        setError(err.message || 'Nepoda\u0159ilo se na\u010d\u00edst inzer\u00e1ty.');
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
          <h1 className="font-manrope text-2xl font-bold">Moje inzer\u00e1ty</h1>
          <p className="text-sm text-muted-foreground mt-1">V\u0161echny va\u0161e p\u0159ipraven\u00e9 inzer\u00e1ty</p>
        </div>
        <Link href="/novy-inzerat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
          <PlusCircle className="w-4 h-4" />
          Nov\u00fd inzer\u00e1t
        </Link>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Na\u010d\u00edt\u00e1m inzer\u00e1ty...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && listings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground mb-4">Zat\u00edm \u017e\u00e1dn\u00e9 inzer\u00e1ty</p>
          <Link href="/novy-inzerat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
            <PlusCircle className="w-4 h-4" />
            Vytvo\u0159it prvn\u00ed inzer\u00e1t
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
                          alt={listing.title || 'Fotografie inzeratu'}
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
                        <h3 className="font-semibold text-foreground">{listing.title || 'Bez n\u00e1zvu'}</h3>
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
                          <p className="text-xs text-muted-foreground">Vyv\u00e1\u017een\u00e1 cena</p>
                          <p className="font-manrope font-bold text-lg">
                            {listing.generated_listings.balanced.price.toLocaleString('cs-CZ')} K\u010d
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
