export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'map';

export const lines = (s?: string) => (s || '').split('\n').map((l) => l.trim()).filter(Boolean);

export const paragraphs = (s?: string) => (s || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

const MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const DAYS = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];

export function dateParts(iso: string) {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(+d)) return { day: '–', month: '', weekday: '', full: iso };
  return {
    day: String(d.getDate()),
    month: MONTHS[d.getMonth()],
    weekday: DAYS[d.getDay()],
    full: `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  };
}

export const formatNL = (iso?: string) => {
  if (!iso) return '–';
  const d = new Date(iso);
  return isNaN(+d) ? '–' : `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
};

export const todayISO = () => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const telHref = (p: string) => 'tel:' + p.replace(/[^\d+]/g, '');

export const CATEGORY_LABELS: Record<string, string> = { live: 'Live', dj: 'DJ', feest: 'Feest', quiz: 'Quiz' };
