# Batuhan Çakmak – Portfolio

Statik portfolyo sitesi + sertleştirilmiş, bağımlılıksız (zero-dependency) Node sunucusu.

## Yapı
```
server.js            sunucu (npm paketi yok, npm install gerekmez)
package.json
Dockerfile
.env.example
public/
  index.html         sayfa
  404.html
  css/style.css      tüm stiller
  js/boot.js         ilk çalışan küçük betik (preloader güvenliği)
  js/main.js         animasyonlar ve etkileşimler
  assets/            portre, CV (PDF), favicon
  images/            ← proje resimlerini BURAYA koy
  robots.txt
  .well-known/security.txt
```

## Çalıştırma
```
node server.js                 # http://localhost:3000
node --env-file=.env server.js # .env kullanmak için (Node 20.6+)
```
Gereken sürüm: Node 18 veya üstü.

## images/ klasörü (GitHub'daki adlarla)
Lab: `01-dashboard-overview.png`, `03-macbook-management-network.png`, `04-dns-dig-web-record.png`, `06-dns-name-resolution-ping.png`, `09-dhcp-lease-process.png`, `12-nginx-service-active.png`, `13-physical-lab-overview.jpg`, `14-cable-crimping-tools.jpg`, `15-cable-test-result.jpg`, `16-testing-workstation.jpg`, `17-utp-wire-preparation.jpg`, `18-windows-dhcp-client-lease.png`, `19-switch-vlan-overview.png`, `20-switch-layer3-routing.png`
HAN37: `control-center.png`, `arduino-hardware.jpg`, `login.png`, `calendar.png`
Packet Tracer: `topology.png`
N-Queens: `main-window.png`, `easy-mode.png`, `hard-mode.png`, `game-settings.png`

Dosya yoksa sayfa bozulmaz; o kutu adıyla birlikte boş kalır. Adlar küçük/büyük harf dahil birebir aynı olmalı.

## Güvenlik
- Katı Content-Security-Policy: inline script ve inline stil yok; sadece kendi dosyaları ve Google Fonts.
- HSTS ve `upgrade-insecure-requests` yalnızca HTTPS isteklerinde gönderilir.
- `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP, CORP.
- Path traversal koruması, nokta dosyaları engelli (`/.well-known` hariç), sadece izinli dosya uzantıları servis edilir, klasör listeleme yok.
- Sadece GET, HEAD, OPTIONS; diğerleri 405.
- IP başına dakikada istek sınırı (varsayılan 240), aşılırsa 429.
- URL uzunluk sınırı, header/istek zaman aşımları, `ALLOWED_HOSTS` ile host doğrulama.
- ETag ve 304, Brotli/gzip sıkıştırma, JSON satırlı erişim logu, `/healthz`, düzgün kapanma (SIGTERM).
- Backend'de form, veritabanı veya kullanıcı girdisi yok; saldırı yüzeyi bilinçli olarak küçük.

## Yayına alma
Docker:
```
docker build -t portfolio .
docker run -d -p 3000:3000 --restart unless-stopped portfolio
```
Önüne Caddy veya nginx koyup HTTPS'i orada sonlandır, sonra `TRUST_PROXY=1` ve `ALLOWED_HOSTS=alanadin.com,www.alanadin.com` ayarla. Statik bir hosta (Netlify, Cloudflare Pages) yükleyeceksen `public/` klasörünü yükle ve yukarıdaki güvenlik başlıklarını o servisin ayarlarından ekle.

## Alan adı alınca eklenecekler
`<link rel="canonical">`, `sitemap.xml`, `og:image` (paylaşım görseli) ve `og:url`.

## Notlar
- Yazı tipleri Google Fonts'tan yüklenir. Tamamen kendi sunucundan sunmak istersen fontları `public/assets/fonts` altına koyup `style-src`/`font-src` kurallarından Google'ı çıkar.
- CV: `public/assets/BATUHAN_CAKMAK_CV.pdf`. Güncellersen aynı adla değiştir.
