const formatValue = (value, fallback = 'neuvedeno') => {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return value
}

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'neuvedeno'
  }

  return `${value} Kc`
}

const formatArray = (items, fallback = 'neuvedeno') => {
  if (!Array.isArray(items) || items.length === 0) {
    return fallback
  }

  return items.join(', ')
}

export const buildIdentificationMessages = ({ product, photos }) => [
  {
    role: 'system',
    content:
      'Jsi zkuseny specialista na identifikaci produktu podle nazvu, fotek a verejne dostupnych informaci na webu. Odpovidej pouze cesky. Tvym cilem je co nejpresneji urcit typ produktu, modelovou radu, konektory, bezne prislusenstvi a navrhnout, co doplnit do formulare. Nic si nevymyslej a nejiste udaje oznac jako pravdepodobne.',
  },
  {
    role: 'user',
    content: [
      {
        type: 'input_text',
        text: `Identifikuj tento produkt co nejpresneji.

Zadani:
- Nazev: ${formatValue(product.title)}
- Znacka: ${formatValue(product.brand)}
- Model: ${formatValue(product.model)}
- Kategorie: ${formatValue(product.category)}
- Prislusenstvi: ${formatValue(product.accessories)}
- Poznamky: ${formatValue(product.notes, 'zadne')}
- Pocet fotek: ${photos.length}

Ukony:
1. Urci pravdepodobny presny produkt nebo modelovou radu.
2. Rozpoznej detaily jako koncovky, kabely, konektory, stitky a typicke soucasti.
3. Navrhni, ktere hodnoty by slo predvyplnit do formulare.
4. Vrat i doplnujici otazky jen tam, kde bez nich nejde byt presnejsi.`,
      },
      ...photos.map((photo) => ({
        type: 'input_image',
        image_url: photo,
      })),
    ],
  },
]

export const buildAnalysisMessages = ({ product, photos, identification }) => [
  {
    role: 'system',
    content:
      'Jsi zkuseny cesky specialista na bazarovy prodej a identifikaci produktu. Odpovidej pouze cesky, vecne a pravdive. Pouzij nazev produktu, fotografie a pokud je k dispozici web search, dohledej pravdepodobny presny typ, parametry a bezne prislusenstvi. Nic si nevymyslej. Pokud si nejsi jisty, uved to opatrne.',
  },
  {
    role: 'user',
    content: [
      {
        type: 'input_text',
        text: `Proved analyzu produktu a vrat strukturovany vystup.

Produkt:
- Nazev: ${formatValue(product.title)}
- Znacka: ${formatValue(product.brand)}
- Model: ${formatValue(product.model)}
- Kategorie: ${formatValue(product.category)}
- Stari: ${formatValue(product.age_years, 'neuvedeno')} let
- Technicky stav: ${formatValue(product.technical_condition)}
- Vizualni stav: ${formatValue(product.visual_condition)}
- Funkcnost: ${formatValue(product.functionality)}
- Prislusenstvi: ${formatValue(product.accessories)}
- Zavady: ${formatValue(product.defects, 'zadne zname')}
- Duvod prodeje: ${formatValue(product.reason_for_sale)}
- Lokalita: ${formatValue(product.location)}
- Predani: ${formatValue(product.delivery_method)}
- Platba: ${formatValue(product.payment_method)}
- Puvodni cena: ${formatMoney(product.original_price)}
- Pozadovana cena: ${formatMoney(product.desired_price)}
- Poznamky: ${formatValue(product.notes, 'zadne')}
- Pocet fotek: ${photos.length}

Predchozi identifikace:
- Pravdepodobny typ: ${formatValue(identification?.likely_product_match)}
- Produktova rada: ${formatValue(identification?.product_family)}
- Jistota identifikace: ${formatValue(identification?.confidence)}
- Rozpoznane parametry: ${formatArray(identification?.identified_specs)}
- Rozpoznane konektory: ${formatArray(identification?.detected_connectors)}
- Pravdepodobne soucasti baleni: ${formatArray(identification?.likely_included_parts)}
- Doporucene doplneni formulare: znacka=${formatValue(identification?.suggested_updates?.brand)}, model=${formatValue(identification?.suggested_updates?.model)}, kategorie=${formatValue(identification?.suggested_updates?.category)}

Ukony:
1. Pokus se urcit pravdepodobny presny typ nebo produktovou radu.
2. Pokud to jde, dohledaj typicke parametry a casti baleni nebo konektory.
3. Vsimni si detailu na fotkach, napriklad koncovek, kabelu, tlacitek, stitku a oznaceni.
4. Vysvetli silne stranky produktu, mozne vady, co chybi a jake doplnujici otazky by bylo vhodne polozit.

Pouzij vysledek identifikace jako hlavni voditko a nove hledej jen to, co z nej jeste chybi nebo je potreba overit.
Pokud web nebo fotky naznacuji konkretni detail, treba typ automobilove koncovky, uved ho v identified_specs nebo likely_included_parts.`,
      },
      ...photos.map((photo) => ({
        type: 'input_image',
        image_url: photo,
      })),
    ],
  },
]

export const buildPricingMessages = ({ product, analysis, identification }) => [
  {
    role: 'system',
    content:
      'Jsi zkuseny analytik ceskeho bazaroveho trhu. Odpovidej pouze cesky. Pokud je k dispozici web search, vyuzij ho pro porovnani aktualnich nabidek. Kdyz nemas dost dat, bud konzervativni a jasne oznam nizsi jistotu.',
  },
  {
    role: 'user',
    content: `Navrhni realisticke bazarove ceny pro tento produkt.

Produkt:
- Nazev: ${formatValue(product.title)}
- Znacka: ${formatValue(product.brand)}
- Model: ${formatValue(product.model)}
- Kategorie: ${formatValue(product.category)}
- Stari: ${formatValue(product.age_years, 'neuvedeno')} let
- Technicky stav: ${formatValue(product.technical_condition)}
- Vizualni stav: ${formatValue(product.visual_condition)}
- Funkcnost: ${formatValue(product.functionality)}
- Prislusenstvi: ${formatValue(product.accessories)}
- Zavady: ${formatValue(product.defects, 'zadne zname')}
- Puvodni cena: ${formatMoney(product.original_price)}
- Pozadovana cena: ${formatMoney(product.desired_price)}

Analyza:
- Odhad stavu: ${formatValue(analysis?.estimated_condition)}
- Pravdepodobny typ: ${formatValue(analysis?.likely_product_match)}
- Rozpoznane parametry: ${formatArray(analysis?.identified_specs)}
- Silne stranky: ${formatArray(analysis?.positive_aspects)}
- Upozorneni: ${formatArray(analysis?.warnings)}
- Zjistene vady: ${formatArray(analysis?.detected_defects)}

Predchozi identifikace:
- Pravdepodobny typ: ${formatValue(identification?.likely_product_match)}
- Produktova rada: ${formatValue(identification?.product_family)}
- Konektory: ${formatArray(identification?.detected_connectors)}
- Pravdepodobne soucasti baleni: ${formatArray(identification?.likely_included_parts)}
- Rozpoznane parametry: ${formatArray(identification?.identified_specs)}

Navrhni cenove rozpeti a tri strategie prodeje pro cesky bazarovy trh. Vychazej primarne z identifikovaneho typu produktu, konektoru a vybavy. Pokud jsou k dispozici cerstva data z webu, opiraj se o ne. Pokud nejsou, prizpusob tomu jistotu a poznamku.`,
  },
]

export const buildGenerationMessages = ({ product, analysis, pricing, identification }) => [
  {
    role: 'system',
    content:
      'Jsi profesionalni copywriter pro cesky bazarovy trh. Pis cesky, duveryhodne, konkretne a prodejne. Nevymyslej parametry, ktere nejsou dolozene.',
  },
  {
    role: 'user',
    content: `Vytvor tri varianty bazaroveho inzeratu: rychly prodej, vyvazeny prodej a premium.

Produkt:
- Nazev: ${formatValue(product.title)}
- Znacka: ${formatValue(product.brand)}
- Model: ${formatValue(product.model)}
- Kategorie: ${formatValue(product.category)}
- Stari: ${formatValue(product.age_years, 'neuvedeno')} let
- Technicky stav: ${formatValue(product.technical_condition_label || product.technical_condition)}
- Vizualni stav: ${formatValue(product.visual_condition_label || product.visual_condition)}
- Funkcnost: ${formatValue(product.functionality)}
- Prislusenstvi: ${formatValue(product.accessories)}
- Zavady: ${formatValue(product.defects, 'zadne zname')}
- Duvod prodeje: ${formatValue(product.reason_for_sale)}
- Lokalita: ${formatValue(product.location)}
- Predani: ${formatValue(product.delivery_method)}
- Platba: ${formatValue(product.payment_method)}
- Poznamky: ${formatValue(product.notes, 'zadne')}

Analyza:
- Shrnuti: ${formatValue(analysis?.product_summary)}
- Silne stranky: ${formatArray(analysis?.positive_aspects)}
- Vady: ${formatArray(analysis?.detected_defects)}
- Upozorneni: ${formatArray(analysis?.warnings)}

Predchozi identifikace:
- Pravdepodobny typ: ${formatValue(identification?.likely_product_match)}
- Produktova rada: ${formatValue(identification?.product_family)}
- Konektory: ${formatArray(identification?.detected_connectors)}
- Rozpoznane parametry: ${formatArray(identification?.identified_specs)}
- Pravdepodobne soucasti baleni: ${formatArray(identification?.likely_included_parts)}

Ceny:
- Rychly prodej: ${formatMoney(pricing?.price_fast_sale)}
- Vyvazeny prodej: ${formatMoney(pricing?.price_balanced)}
- Premium: ${formatMoney(pricing?.price_premium)}
- Cenovy komentar: ${formatValue(pricing?.price_rationale)}

Pouzij identifikaci i analyzu dohromady. Pokud identifikace nasla konkretni konektor, modelovou radu nebo soucast baleni, promítni to do titulku, popisu a bodu vyhod jen tehdy, kdyz to neni v rozporu s analyzou.
Texty musi byt pripravene pro ceske bazarove servery a otevrene pojmenovat skutecne vady produktu.`,
  },
]
