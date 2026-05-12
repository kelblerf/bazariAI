"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle, Clock, FileText, PlusCircle, Trash2 } from 'lucide-react';

import { listingsApi } from './_lib/client-api';

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
  new Date(value).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

export default function DashboardPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await listingsApi.list('-created_date', 50);
      setListings(result);
    } catch (err) {
      setError(err.message || 'Nepoda\u0159ilo se na\u010d\u00edst inzer\u00e1ty.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadInitialListings = async () => {
      try {
        const result = await listingsApi.list('-created_date', 50);

        if (!isActive) {
          return;
        }

        setListings(result);
      } catch (err) {
        if (!isActive) {
          return;
        }

        setError(err.message || 'Nepoda\u0159ilo se na\u010d\u00edst inzer\u00e1ty.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadInitialListings();

    return () => {
      isActive = false;
    };
  }, []);

  const handleDelete = async (id, event) => {
    event.preventDefault();
    event.stopPropagation();

    await listingsApi.delete(id);
    await load();
  };

  const stats = {
    total: listings.length,
    hotove: listings.filter((item) => item.status === 'hotovy').length,
    rozpracovane: listings.filter((item) => item.status === 'rozpracovany').length,
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-manrope text-2xl font-bold text-foreground">P\u0159ehled</h1>
          <p className="text-muted-foreground mt-1 text-sm">Spr\u00e1va va\u0161ich bazarov\u00fdch inzer\u00e1t\u016f</p>
        </div>
        <Link href="/novy-inzerat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
          <PlusCircle className="w-4 h-4" />
          Nov\u00fd inzer\u00e1t
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Celkem inzer\u00e1t\u016f', value: stats.total, icon: FileText, color: 'text-primary' },
          { label: 'Hotov\u00fdch', value: stats.hotove, icon: CheckCircle, color: 'text-success' },
          { label: 'Rozpracovan\u00fdch', value: stats.rozpracovane, icon: Clock, color: 'text-warning' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{item.label}</p>
                <p className={`text-3xl font-manrope font-bold mt-1 ${item.color}`}>{item.value}</p>
              </div>
              <item.icon className={`w-8 h-8 ${item.color} opacity-20`} />
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Na\u010d\u00edt\u00e1m inzer\u00e1ty...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-manrope text-xl font-bold mb-2">Zat\u00edm \u017e\u00e1dn\u00e9 inzer\u00e1ty</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
            BazarPro v\u00e1m pom\u016f\u017ee vytvo\u0159it profesion\u00e1ln\u00ed inzer\u00e1t pro Sbazar, Aukro a dal\u0161\u00ed servery.
          </p>
          <Link href="/novy-inzerat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
            <PlusCircle className="w-4 h-4" />
            Vytvo\u0159it prvn\u00ed inzer\u00e1t
          </Link>
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-manrope font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Va\u0161e inzer\u00e1ty
          </h2>
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
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{listing.title || 'Bez n\u00e1zvu'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {listing.category && (
                            <span className="text-xs text-muted-foreground">
                              {categoryMap[listing.category] || listing.category}
                            </span>
                          )}
                          {listing.brand && <span className="text-xs text-muted-foreground">\u00b7 {listing.brand}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(listing.created_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {listing.generated_listings?.balanced?.price && (
                        <span className="font-manrope font-bold text-foreground">
                          {listing.generated_listings.balanced.price.toLocaleString('cs-CZ')} K\u010d
                        </span>
                      )}
                      <span className={`rounded-full border px-3 py-1 text-xs ${status.color}`}>{status.label}</span>
                      <button
                        onClick={(event) => handleDelete(listing.id, event)}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
