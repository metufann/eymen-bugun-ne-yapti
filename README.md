# eymenbugunneyapti 🚀

Tek bir öğrenci için ortak kullanılacak, web üzerinden herkese açık, modern ve **PlayStation 5 ilhamlı mikro-etkileşimlere sahip premium LGS çalışma takip uygulaması**.

Bu uygulama artık localStorage tabanlı değildir; tüm veriler merkezi bir **Supabase PostgreSQL** veritabanı üzerinde saklanır ve **Real-time WebSockets** sayesinde bilgisayar, telefon veya farklı bir tarayıcıdan anında senkronize olur.

---

## 🛠️ Teknoloji Stack'i

- **Frontend:** React 19, TypeScript, Vite
- **Stil & Tasarım:** Tailwind CSS, JetBrains Mono & Inter Fontları, Glassmorphism, UI/UX Pro Max Tasarım Mimarisi
- **İkonlar & Efektler:** Lucide React, Canvas Confetti
- **Backend & Database:** Supabase (PostgreSQL 15+, Row Level Security, Realtime Publication)
- **Deployment:** Vercel uyumlu

---

## 🚀 Hızlı Başlangıç

### 1. Depoyu klonlayın ve bağımlılıkları kurun:
```bash
cd /Users/metufan/Desktop/eymenbugunneyapti
npm install
```

### 2. Ortam Değişkenlerini Tanımlayın (`.env`):
Proje kök dizinindeki `.env` dosyasını açıp kendi Supabase proje bilgilerinizi girin:

```env
VITE_SUPABASE_UR=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh......
```

> **Önemli Güvenlik Notu:** Kesinlikle `service_role` key'ini frontend'e veya `.env` içerisine eklemeyin! Frontend sadece public `anon key` kullanır.

---

## 🗄️ Supabase Veritabanı Kurulumu (Migration)

Tabloları ve RLS politikalarını tek tek elle oluşturmanız **gerekmez**. 
Proje içerisindeki hazır SQL migration dosyası ile tek adımda veritabanını ayağa kaldırabilirsiniz:

1. [Supabase Dashboard](https://supabase.com/dashboard) adresine gidin.
2. Projenizi seçip sol menüden **SQL Editor** sekmesine tıklayın.
3. [`supabase/migrations/001_initial_schema.sql`](file:///Users/metufan/Desktop/eymenbugunneyapti/supabase/migrations/001_initial_schema.sql) dosyasının tüm içeriğini kopyalayıp editöre yapıştırın ve **Run** butonuna basın.

Bu işlem otomatik olarak şunları yapar:
- `study_sessions` ve `settings` tablolarını oluşturur.
- Gerekli tüm veri doğrulama kısıtlamalarını (`CHECK correct + wrong <= questions`) ekler.
- Hızlı sorgular için `date` ve `subject` indexlerini atar.
- **Row Level Security (RLS)** politikalarını güvenle aktif eder (`SELECT`, `INSERT`, `UPDATE` public; zararlı toplu `DELETE` engellendi).
- **Supabase Realtime** yayınını açar (farklı cihazlarda sayfa yenilemeden anlık güncelleme).

---

## 💻 Geliştirme ve Yerel Sunucu

```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı test edebilirsiniz.

---

## 🏗️ Production Build

```bash
npm run build
```

---

## 🌐 Vercel Deployment

1. Projeyi GitHub reponuza push edin.
2. [Vercel](https://vercel.com)'de **New Project** diyerek reponuzu bağlayın.
3. **Environment Variables** bölümüne şunları ekleyin:
   - `VITE_SUPABASE_UR`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy** butonuna tıklayın.

Tebrikler! Artık `eymenbugunneyapti` tüm aile üyeleri, öğretmenler ve Eymen tarafından anlık olarak her cihazdan takip edilebilir. 🎉
