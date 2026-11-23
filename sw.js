// Bill Tracker service worker: works offline and shows bill reminders.
const CACHE = 'bill-tracker-v4';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith('bill-tracker-') && k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

// Network first so updates show up right away; fall back to the saved copy when offline.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match('index.html')))
  );
});

// Background reminders (Chrome on Android, when the app is installed and the browser allows it).
async function backgroundReminder() {
  const c = await caches.open('bill-reminders');
  const res = await c.match('reminder-data.json');
  if (!res) return;
  const {remindDays = 3, bills = []} = await res.json();
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const todayKey = now.toISOString().slice(0, 10);
  const last = await c.match('last-notified');
  if (last && (await last.text()) === todayKey) return;
  const days = s => { const [y, m, d] = s.split('-').map(Number); return Math.round((new Date(y, m - 1, d) - now) / 86400000); };
  const due = bills.filter(b => days(b.due) <= remindDays).sort((a, b) => a.due.localeCompare(b.due));
  if (!due.length) return;
  const words = b => { const d = days(b.due); return d < 0 ? `${-d} day${d === -1 ? '' : 's'} overdue` : d === 0 ? 'due today' : d === 1 ? 'due tomorrow' : `due in ${d} days`; };
  const money = n => Number(n || 0).toLocaleString(undefined, {style: 'currency', currency: 'USD'});
  const title = due.length === 1 ? `${due[0].name} is ${words(due[0])}` : `${due.length} bills coming due`;
  const body = due.slice(0, 6).map(b => `${b.name}: ${money(b.amount)}, ${words(b)}`).join('\n');
  await self.registration.showNotification(title, {body, tag: 'bill-reminder', icon: 'icon-192.png', badge: 'icon-192.png'});
  await c.put('last-notified', new Response(todayKey));
}
self.addEventListener('periodicsync', e => { if (e.tag === 'bill-reminders') e.waitUntil(backgroundReminder()); });

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(list => {
    for (const w of list) if ('focus' in w) return w.focus();
    return self.clients.openWindow('./');
  }));
});
