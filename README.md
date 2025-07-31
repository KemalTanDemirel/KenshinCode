# KenshinCode - Şifreleme Aracı

Site Bağlantısı:https://kenshincode.onrender.com

Bu proje, düz bir **Polybius karesi** kullanarak metinleri şifreleyen ve şifreli metni çözen basit ve işlevsel bir şifreleme sistemidir. Web tabanlı bir arayüz ile kullanıcı dostu biçimde çalışır.

## 🔐 Nedir Bu?

Polybius karesi, antik Yunan döneminden beri bilinen bir ikame şifreleme yöntemidir. Harfler, 5x5 (veya geliştirilmiş hâliyle 6x6 / 7x7) kare şeklinde düzenlenmiş bir tabloya yerleştirilir. Her harf, satır ve sütun numaralarının birleşimi ile temsil edilir.

Bu projede Latin alfabesi ile 6x6'lık bir kare kullanılmıştır. Rakamlar ve bazı özel karakterler de desteklenebilir.

---

## 🛠 Özellikler

- Harfleri Polybius sistemine göre **şifreler**
- Şifreli verileri **orijinal hâline çözer**
- Anlaşılır, minimalist web arayüzü
- Kod tamamen **JavaScript, HTML ve CSS** ile yazılmıştır
- Offline çalışabilir (tarayıcı yeterlidir)

---

## 🧪 Örnek Kullanım

**Şifreleme:**

```
Mesaj: HELLO
Çıktı: 23 15 31 31 34
```

**Çözme:**

```
Girdi: 23 15 31 31 34
Çıktı: HELLO
```

---

## 📁 Dosya Yapısı

```
/polybius-cipher
├── index.html       → Arayüz
├── style.css        → Stil dosyası
└── script.js        → Şifreleme & Çözme mantığı
```

---

## 📌 Bilinen Sınırlamalar

- Boşluklar, noktalama işaretleri ve Türkçe karakterler (ç, ğ, ş vb.) varsayılan olarak desteklenmez. Gerekirse genişletilebilir.
- Harfler büyük/küçük duyarlı değildir (her şey büyük harfe çevrilir).
- Şifre çözme işleminde, her 2 haneli sayı doğru sırayla girilmelidir.

---

## 👤 Yazar

**Kemal Tan Demirel**  
Bu proje bir eğitim & kriptografi merakı kapsamında geliştirilmiştir.

---

## 📜 Lisans

MIT Lisansı – Bu projeyi özgürce kullanabilir, dağıtabilir ve değiştirebilirsiniz.
