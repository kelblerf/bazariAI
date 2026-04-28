"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const categories = [
  { value: 'elektronika', label: 'Elektronika' },
  { value: 'naradi', label: 'Nářadí' },
  { value: 'domaci_technika', label: 'Domácí technika' },
  { value: 'mobily_tablety', label: 'Mobily & tablety' },
  { value: 'pc_notebooky', label: 'PC & notebooky' },
  { value: 'foto_video', label: 'Foto & video' },
  { value: 'audio', label: 'Audio' },
  { value: 'ostatni', label: 'Ostatní' },
];

const technicalConditions = [
  { value: 'vynikajici', label: 'Vynikající - jako nový' },
  { value: 'velmi_dobry', label: 'Velmi dobrý - minimální opotřebení' },
  { value: 'dobry', label: 'Dobrý - viditelné opotřebení' },
  { value: 'horsi_stav', label: 'Horší stav - funkční, ale s vadami' },
  { value: 'na_dily', label: 'Na díly / nefunkční' },
];

const visualConditions = [
  { value: 'jako_novy', label: 'Jako nový - bez vad' },
  { value: 'velmi_dobry', label: 'Velmi dobrý - drobné škrábance' },
  { value: 'dobry', label: 'Dobrý - běžné opotřebení' },
  { value: 's_defekty', label: 'S defekty - viditelné poškození' },
  { value: 'spatny', label: 'Špatný - výrazné poškození' },
];

const functionalityOptions = [
  { value: 'plne_funkcni', label: 'Plně funkční' },
  { value: 'castecne_funkcni', label: 'Částečně funkční' },
  { value: 'nefunkcni', label: 'Nefunkční' },
  { value: 'neovereno', label: 'Neověřeno' },
];

const deliveryOptions = [
  { value: 'osobni_odber', label: 'Pouze osobní odběr' },
  { value: 'doruceni', label: 'Pouze zaslání' },
  { value: 'oboji', label: 'Osobní odběr i zaslání' },
];

const paymentOptions = [
  { value: 'hotovost', label: 'Hotovost' },
  { value: 'prevod', label: 'Bankovní převod' },
  { value: 'oboji', label: 'Hotovost i převod' },
];

export default function StepProduct({ data, onChange }) {
  const set = (field) => (e) => onChange({ ...data, [field]: e.target?.value ?? e });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-manrope text-lg font-bold mb-1">Základní informace o produktu</h2>
        <p className="text-sm text-muted-foreground">Vyplňte vše, co víte. Čím více informací, tím přesnější bude analýza a výsledný inzerát.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="title">Název produktu *</Label>
          <Input id="title" placeholder="např. Ryobi ONE+ aku vrtačka" value={data.title || ''} onChange={set('title')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brand">Značka</Label>
          <Input id="brand" placeholder="např. Bosch, Samsung, Makita..." value={data.brand || ''} onChange={set('brand')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="model">Model</Label>
          <Input id="model" placeholder="např. GSB 18V-55, Galaxy S21..." value={data.model || ''} onChange={set('model')} />
        </div>

        <div className="space-y-1.5">
          <Label>Kategorie</Label>
          <Select value={data.category || ''} onValueChange={set('category')}>
            <SelectTrigger><SelectValue placeholder="Vyberte kategorii" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="age">Stáří výrobku (roky)</Label>
          <Input id="age" type="number" min={0} placeholder="např. 2" value={data.age_years || ''} onChange={set('age_years')} />
        </div>

        <div className="space-y-1.5">
          <Label>Technický stav</Label>
          <Select value={data.technical_condition || ''} onValueChange={set('technical_condition')}>
            <SelectTrigger><SelectValue placeholder="Zvolte stav" /></SelectTrigger>
            <SelectContent>
              {technicalConditions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Vizuální stav</Label>
          <Select value={data.visual_condition || ''} onValueChange={set('visual_condition')}>
            <SelectTrigger><SelectValue placeholder="Zvolte stav" /></SelectTrigger>
            <SelectContent>
              {visualConditions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Funkčnost</Label>
          <Select value={data.functionality || ''} onValueChange={set('functionality')}>
            <SelectTrigger><SelectValue placeholder="Zvolte funkčnost" /></SelectTrigger>
            <SelectContent>
              {functionalityOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Způsob předání</Label>
          <Select value={data.delivery_method || ''} onValueChange={set('delivery_method')}>
            <SelectTrigger><SelectValue placeholder="Způsob předání" /></SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Způsob platby</Label>
          <Select value={data.payment_method || ''} onValueChange={set('payment_method')}>
            <SelectTrigger><SelectValue placeholder="Způsob platby" /></SelectTrigger>
            <SelectContent>
              {paymentOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="original_price">Původní pořizovací cena (Kč)</Label>
          <Input id="original_price" type="number" min={0} placeholder="např. 4500" value={data.original_price || ''} onChange={set('original_price')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="desired_price">Vaše představa o ceně (Kč)</Label>
          <Input id="desired_price" type="number" min={0} placeholder="např. 2000" value={data.desired_price || ''} onChange={set('desired_price')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Lokalita</Label>
          <Input id="location" placeholder="např. Praha 5, Brno-střed..." value={data.location || ''} onChange={set('location')} />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="accessories">Příslušenství v balení</Label>
          <Input id="accessories" placeholder="např. Nabíječka, 2x baterie, originální kufr, manuál" value={data.accessories || ''} onChange={set('accessories')} />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="defects">Závady a vady</Label>
          <Textarea id="defects" rows={2} placeholder="Popište všechny známé závady, škrábance, nefunkční části..." value={data.defects || ''} onChange={set('defects')} />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="reason">Důvod prodeje</Label>
          <Input id="reason" placeholder="např. Přechod na jiný systém, nepotřebuji, upgrade..." value={data.reason_for_sale || ''} onChange={set('reason_for_sale')} />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label htmlFor="notes">Poznámky</Label>
          <Textarea id="notes" rows={2} placeholder="Cokoliv dalšího, co by kupujícího mohlo zajímat..." value={data.notes || ''} onChange={set('notes')} />
        </div>
      </div>
    </div>
  );
}
