export type ColorKey =
  | 'accent'
  | 'accentLight'
  | 'accentDark'
  | 'cream'
  | 'offwhite'
  | 'bg'
  | 'bg2'
  | 'surface'
  | 'text'
  | 'muted';

export type Colors = Record<ColorKey, string>;

export type PageKey = 'home' | 'evenementen' | 'fotos' | 'contact';

/** Alle paginavelden zijn strings; lijsten = één item per regel. */
export type PageFields = Record<string, string>;

export type HoursRow = { label: string; value: string };

export type Settings = {
  gaId: string;
  email: string;
  phone: string;
  street: string;
  postcode: string;
  city: string;
  region: string;
  mapsUrl: string;
  hours: HoursRow[];
  instagram: string;
  facebook: string;
  tiktok: string;
  creditLabel: string;
  creditUrl: string;
};

export type EventCategory = 'live' | 'dj' | 'feest' | 'quiz';

export type EventItem = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: EventCategory;
  description: string;
  image: string;
  status: 'gepubliceerd' | 'concept';
};

export type Photo = { id: string; url: string; alt: string };

export type Album = {
  id: string;
  name: string;
  slug: string;
  description: string;
  visible: boolean;
  photos: Photo[];
};

export type Content = {
  pages: Record<PageKey, PageFields>;
  colors: Colors;
  settings: Settings;
  events: EventItem[];
  albums: Album[];
  updatedAt: string;
};

export type Submission = {
  id: string;
  createdAt: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  date: string;
  message: string;
};

export type SectionKey = 'colors' | 'settings' | 'events' | 'albums';
