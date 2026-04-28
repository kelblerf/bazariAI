"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle, Clock, FileText, PlusCircle, Trash2 } from 'lucide-react';

import { listingsApi } from './_lib/client-api';

const statusMap = {
  rozpracovany: { label: 'Rozpracovaný', color: 'bg-warning/10 text-warning border-warning/20' },
  analyzovany: { label: 'Analyzovaný', color: 'bg-accent/10 text-accent border-accent/20' },
  hotovy: { label: 'Hotový', color: 'bg-success/10 text-success border-success/20' },
};

const categoryMap = {
  elektronika: 'Elektronika',
  naradi: 'Nářadí',
  'naradĂ­': 'Nářadí',
  domaci_technika: 'Domácí technika',
  mobily_tablety: 'Mobily & tablety',
  pc_notebooky: 'PC & notebooky',
  foto_video: 'Foto & video',
  audio: 'Audio',
  ostatni: 'Ostatní',
  'ostatnĂ­': 'Ostatní',
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
      setError(err.message || 'Nepodařilo se načíst inzeráty.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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
          <h1 className="font-manrope text-2xl font-bold text-foreground">Přehled</h1>
          <p className="text-muted-foreground mt-1 text-sm">Správa vašich bazarových inzerátů</p>
        </div>
        <Link href="/novy-inzerat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
          <PlusCircle className="w-4 h-4" />
          Nový inzerát
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Celkem inzerátů', value: stats.total, icon: FileText, color: 'text-primary' },
          { label: 'Hotových', value: stats.hotove, icon: CheckCircle, color: 'text-success' },
          { label: 'Rozpracovaných', value: stats.rozpracovane, icon: Clock, color: 'text-warning' },
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

      {loading && <p className="text-sm text-muted-foreground">Načítám inzeráty...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-manrope text-xl font-bold mb-2">Zatím žádné inzeráty</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
            BazarPro vám pomůže vytvořit profesionální inzerát pro Sbazar, Aukro a další servery.
          </p>
          <Link href="/novy-inzerat" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
            <PlusCircle className="w-4 h-4" />
            Vytvořit první inzerát
          </Link>
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-manrope font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Vaše inzeráty
          </h2>
          {listings.map((listing) => {
            const status = statusMap[listing.status] || statusMap.rozpracovany;
            return (
              <Link key={listing.id} href={`/inzerat/${listing.id}`} className="block">
                <div className="rounded-2xl border border-border bg-card p-5 transition-all duration-150 hover:border-primary/30 hover:shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {listing.photo_urls?.[0] ? (
                        <img src={listing.photo_urls[0]} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{listing.title || 'Bez názvu'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {listing.category && (
                            <span className="text-xs text-muted-foreground">
                              {categoryMap[listing.category] || listing.category}
                            </span>
                          )}
                          {listing.brand && <span className="text-xs text-muted-foreground">· {listing.brand}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(listing.created_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {listing.generated_listings?.balanced?.price && (
                        <span className="font-manrope font-bold text-foreground">
                          {listing.generated_listings.balanced.price.toLocaleString('cs-CZ')} Kč
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
