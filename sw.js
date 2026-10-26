// 新荏田西ポータル Service Worker
// ページ本体はネット優先（更新がすぐ届く）、オフライン時は最後に開いた版を表示する。
// 気象データなどの API は常にネットから取得し、キャッシュしない。

const VERSION = 'v1';
const CACHE = `portal-${VERSION}`;
const PRECACHE = [
  './',
  'manifest.webmanifest',
  'favicon.ico',
  'favicon-32.png',
  'favicon-180.png',
  'app-icons/icon-192.png',
  'app-icons/icon-512.png',
  'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js',
];
// 見た目に必要な外部ファイル（アイコン用ライブラリ・フォント）
const STATIC_HOSTS = ['unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('portal-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // ページ本体: ネット優先
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { putCache('./', res.clone()); return res; })
        .catch(() => caches.match('./'))
    );
    return;
  }

  // 同じサイトの画像など・外部の静的ファイル: キャッシュを先に返し、裏で更新
  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin || STATIC_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then(hit => {
        const net = fetch(req)
          .then(res => { if (res.ok || res.type === 'opaque') putCache(req, res.clone()); return res; })
          .catch(() => hit);
        return hit || net;
      })
    );
  }
  // それ以外（気象 API・アクセス解析）は何もしない＝通常どおりネットへ
});

function putCache(key, res) {
  caches.open(CACHE).then(c => c.put(key, res));
}
