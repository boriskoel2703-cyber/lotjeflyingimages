import type { Colors, Content, PageKey } from './types';

export const DEFAULT_COLORS: Colors = {
  accent: '#8b914c',
  accentLight: '#a3ab62',
  accentDark: '#4c522d',
  cream: '#e9dcc0',
  offwhite: '#f3edde',
  bg: '#12110c',
  bg2: '#191812',
  surface: '#1c1b14',
  text: '#f3edde',
  muted: '#a8a491',
};

export const COLOR_LABELS: Record<keyof Colors, string> = {
  accent: 'Accent (hoofdkleur)',
  accentLight: 'Accent licht',
  accentDark: 'Accent donker',
  cream: 'Crème',
  offwhite: 'Gebroken wit',
  bg: 'Achtergrond',
  bg2: 'Achtergrond secties',
  surface: 'Kaarten & velden',
  text: 'Tekst',
  muted: 'Gedempte tekst',
};

export type FieldType = 'text' | 'textarea' | 'image' | 'list';
export type FieldDef = { key: string; label: string; type: FieldType; help?: string; group?: string };

const TITLE_HELP = 'Zet een woord tussen *sterretjes* voor de schuine serif-letter. Een punt of vraagteken aan het eind krijgt de accentkleur.';

const simplePage = (extra: FieldDef[] = []): FieldDef[] => [
  { key: 'eyebrow', label: 'Label boven titel', type: 'text', group: 'Kop' },
  { key: 'title', label: 'Titel', type: 'text', help: TITLE_HELP, group: 'Kop' },
  { key: 'intro', label: 'Introtekst', type: 'textarea', group: 'Kop' },
  ...extra,
  {
    key: 'body',
    label: 'Extra inhoud',
    type: 'textarea',
    group: 'Inhoud',
    help: 'Optioneel. Lege regel = nieuwe alinea. Shortcodes: [album map-slug] toont één fotomap, [albums] toont alle zichtbare mappen.',
  },
  { key: 'metaDescription', label: 'Meta-omschrijving (Google)', type: 'textarea', group: 'SEO' },
];

export const PAGE_SCHEMA: Record<PageKey, FieldDef[]> = {
  home: [
    { key: 'heroChip', label: 'Label (chip)', type: 'text', group: 'Hero' },
    { key: 'heroLocation', label: 'Locatieregel', type: 'text', group: 'Hero' },
    { key: 'title', label: 'Titel regel 1', type: 'text', help: TITLE_HELP, group: 'Hero' },
    { key: 'title2', label: 'Titel regel 2', type: 'text', help: TITLE_HELP, group: 'Hero' },
    { key: 'heroText', label: 'Introtekst', type: 'textarea', group: 'Hero' },
    { key: 'heroImage', label: 'Achtergrondfoto', type: 'image', group: 'Hero' },
    { key: 'marquee', label: 'Lopende band (één per regel)', type: 'list', group: 'Hero' },
    { key: 'cafeEyebrow', label: 'Label', type: 'text', group: 'Het café' },
    { key: 'cafeTitle', label: 'Titel', type: 'text', help: TITLE_HELP, group: 'Het café' },
    { key: 'cafeText', label: 'Tekst (lege regel = nieuwe alinea)', type: 'textarea', group: 'Het café' },
    { key: 'cafeLead', label: 'Intro rechts', type: 'textarea', group: 'Het café' },
    { key: 'stats', label: 'Cijfers (per regel: waarde | omschrijving)', type: 'list', group: 'Het café' },
    { key: 'tiles', label: 'Tegels (6 regels, vaste iconen)', type: 'list', group: 'Het café' },
    { key: 'agendaEyebrow', label: 'Label', type: 'text', group: 'Agenda' },
    { key: 'agendaTitle', label: 'Titel', type: 'text', help: TITLE_HELP, group: 'Agenda' },
    { key: 'agendaEmpty', label: 'Tekst als er geen events zijn', type: 'text', group: 'Agenda' },
    { key: 'servicesEyebrow', label: 'Label', type: 'text', group: 'Jouw feest' },
    { key: 'servicesTitle', label: 'Titel', type: 'text', help: TITLE_HELP, group: 'Jouw feest' },
    { key: 'servicesText', label: 'Tekst rechts', type: 'textarea', group: 'Jouw feest' },
    { key: 's1Title', label: 'Blok 1 – titel', type: 'text', group: 'Jouw feest' },
    { key: 's1Text', label: 'Blok 1 – tekst', type: 'textarea', group: 'Jouw feest' },
    { key: 's1Items', label: 'Blok 1 – punten', type: 'list', group: 'Jouw feest' },
    { key: 's2Title', label: 'Blok 2 – titel', type: 'text', group: 'Jouw feest' },
    { key: 's2Text', label: 'Blok 2 – tekst', type: 'textarea', group: 'Jouw feest' },
    { key: 's2Items', label: 'Blok 2 – punten', type: 'list', group: 'Jouw feest' },
    { key: 's3Title', label: 'Blok 3 – titel', type: 'text', group: 'Jouw feest' },
    { key: 's3Text', label: 'Blok 3 – tekst', type: 'textarea', group: 'Jouw feest' },
    { key: 's3Items', label: 'Blok 3 – punten', type: 'list', group: 'Jouw feest' },
    { key: 'ctaChip', label: 'Label (chip)', type: 'text', group: 'Call to action' },
    { key: 'ctaTitle', label: 'Titel', type: 'text', help: TITLE_HELP, group: 'Call to action' },
    { key: 'ctaText', label: 'Tekst', type: 'textarea', group: 'Call to action' },
    { key: 'ctaImage', label: 'Achtergrondfoto', type: 'image', group: 'Call to action' },
    { key: 'metaDescription', label: 'Meta-omschrijving (Google)', type: 'textarea', group: 'SEO' },
  ],
  evenementen: simplePage([
    { key: 'footnote', label: 'Notitie onder de agenda', type: 'text', group: 'Inhoud' },
    { key: 'empty', label: 'Tekst als er geen events zijn', type: 'text', group: 'Inhoud' },
  ]),
  fotos: simplePage([{ key: 'empty', label: "Tekst als er geen foto's zijn", type: 'text', group: 'Inhoud' }]),
  contact: simplePage([
    { key: 'formNote', label: 'Notitie naast verzendknop', type: 'text', group: 'Formulier' },
    { key: 'successText', label: 'Bedankt-melding', type: 'text', group: 'Formulier' },
  ]),
};

export const PAGE_LABELS: Record<PageKey, string> = {
  home: 'home',
  evenementen: 'evenementen',
  fotos: 'fotos',
  contact: 'contact',
};

const D = '2026-09-08T10:00:00.000Z';

export function defaultContent(): Content {
  return {
    updatedAt: D,
    colors: { ...DEFAULT_COLORS },
    settings: {
      gaId: '',
      email: 'info@feestcafelotje.nl',
      phone: '0630408711',
      street: '',
      postcode: '',
      city: 'Zeewolde',
      region: 'Flevoland',
      mapsUrl: '',
      hours: [
        { label: 'Ma – Wo', value: 'Gesloten' },
        { label: 'Do', value: '17:00 – 01:00' },
        { label: 'Vr – za', value: '15:00 – 03:00' },
        { label: 'Zo', value: '13:00 – 01:00' },
      ],
      instagram: '',
      facebook: '',
      tiktok: '',
      creditLabel: 'flyingimages.nl',
      creditUrl: 'https://flyingimages.nl',
    },
    events: [],
    albums: [],
    pages: {
      home: {
        _updatedAt: D,
        heroChip: 'Feestcafé',
        heroLocation: 'Zeewolde · Flevoland',
        title: 'Jouw feest.',
        title2: '*Ons* podium.',
        heroText:
          "In het hart van Zeewolde. Voor feesten, live muziek, dj's en alles ertussen — van de eerste borrel tot de laatste dans.",
        heroImage: '',
        marquee: "Feesten\nLive muziek\nDj's\nZaal huren\nBruiloften\nBorrels\nPubquiz",
        cafeEyebrow: 'Het café',
        cafeTitle: 'Een feestcafé met een warm hart en een volle dansvloer.',
        cafeText:
          'Lotje is het feestcafé van Zeewolde. De deuren staan open voor wie wil borrelen, dansen, zingen of het grootste feest van het jaar viert.\n\nOf je nu komt voor een vrijdagmiddagborrel, een liveband in het weekend of de zaal helemaal voor jezelf: bij Lotje wordt je feest het feest.',
        cafeLead: 'Van een gezellige borrel tot je grootste feest ooit — je bent hier aan het goede adres.',
        stats: '150+ | Feestgangers per avond\n02:00 | Open tot in het weekend\n100% | Feest, elke keer weer',
        tiles: 'Borrelen\nFeesten\nLive muziek\nKaraoke\nPubquiz\nZaal huren',
        agendaEyebrow: 'Agenda',
        agendaTitle: 'Wat staat er op de planning?',
        agendaEmpty: 'Binnenkort staan hier de volgende avonden. Houd de agenda in de gaten!',
        servicesEyebrow: 'Jouw feest',
        servicesTitle: 'Alles onder één dak.',
        servicesText: 'Vertel ons wat je in gedachten hebt — wij bouwen het feest om je heen.',
        s1Title: 'Zaal & podium',
        s1Text: 'Huur de zaal voor jouw feest. Met podium, dansvloer en een sfeer die vanzelf feestelijk wordt.',
        s1Items: 'Geluid & licht inbegrepen\nTot 150+ gasten\nDagdeel of hele avond',
        s2Title: "DJ's & live acts",
        s2Text: 'Van huisdj tot liveband: wij regelen de muziek, jij regelt de danspasjes.',
        s2Items: "Vaste huisdj's\nLive bands & acts\nEigen artiest? Wij regelen het",
        s3Title: 'Bar & catering',
        s3Text: 'Een bar die vol blijft en een buffet dat niemand laat staan. Alles naar wens samen te stellen.',
        s3Items: 'Tap & cocktailbar\nFeestbuffet & borrelplanken\nAll-in arrangementen',
        ctaChip: 'Plan je feest',
        ctaTitle: 'Klaar voor *jouw* feest bij Lotje?',
        ctaText: 'Stuur een berichtje of bel ons. We denken graag mee over datum, muziek en de rest van je avond.',
        ctaImage: '',
        metaDescription:
          "Feestcafé Lotje in Zeewolde — jouw feest, ons podium. Zaal huren, live muziek, dj's en een bar die de hele avond doorstroomt.",
      },
      evenementen: {
        _updatedAt: D,
        eyebrow: 'Evenementen',
        title: 'De agenda van Lotje.',
        intro:
          "Live muziek, dj's, quizzen en feesten — dit staat er bij ons op de planning. Wil je erbij zijn of een eigen feest organiseren? Dat regel je via de contactpagina.",
        footnote: 'Staat je feest er niet bij? Eigen feesten, borrels en zaalhuur regel je via',
        empty: 'Er staan nog geen evenementen gepland — kom binnenkort terug!',
        body: '',
        metaDescription: "Agenda van Feestcafé Lotje in Zeewolde: live muziek, dj's, pubquizzen en feesten.",
      },
      fotos: {
        _updatedAt: D,
        eyebrow: "Foto's",
        title: 'Sfeer proeven bij Lotje.',
        intro: 'Een indruk van onze avonden: dansvloer, bar, live muziek en alles daartussen. Klik op een foto voor het volledige beeld.',
        empty: "Er zijn nog geen foto's geüpload — kom binnenkort terug!",
        body: '[albums]',
        metaDescription: "Foto's van feesten, live muziek en avonden bij Feestcafé Lotje in Zeewolde.",
      },
      contact: {
        _updatedAt: '2026-10-09T10:00:00.000Z',
        eyebrow: 'Contact',
        title: 'Plan je feest of borrel.',
        intro: 'Vertel ons wat je in gedachten hebt, wij denken graag mee over datum, muziek, eten en de rest van je avond.',
        formNote: 'Niet alles invullen? Geen probleem — we overleggen gewoon.',
        successText: 'Bedankt! We hebben je aanvraag ontvangen en nemen snel contact met je op.',
        body: '',
        metaDescription: 'Plan je feest, borrel of zaalhuur bij Feestcafé Lotje in Zeewolde.',
      },
    },
  };
}

/** Vult ontbrekende velden aan met defaults, zodat nieuwe velden altijd bestaan. */
export function mergeContent(stored: Partial<Content> | null | undefined): Content {
  const d = defaultContent();
  if (!stored) return d;
  const pages = { ...d.pages };
  (Object.keys(d.pages) as PageKey[]).forEach((k) => {
    pages[k] = { ...d.pages[k], ...(stored.pages?.[k] || {}) };
  });
  return {
    updatedAt: stored.updatedAt || d.updatedAt,
    pages,
    colors: { ...d.colors, ...(stored.colors || {}) },
    settings: { ...d.settings, ...(stored.settings || {}) },
    events: Array.isArray(stored.events) ? stored.events : [],
    albums: Array.isArray(stored.albums) ? stored.albums : [],
  };
}
