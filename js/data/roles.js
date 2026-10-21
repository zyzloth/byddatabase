// Lavozimlar tuzilmasi (Avtosalon_lavozimlar_va_audit_savollari.docx asosida).

window.DEPARTMENTS = [
  { id: "rahbariyat", name: "Yuqori rahbariyat", icon: "crown", roles: [1, 2, 3] },
  { id: "sotuv", name: "Sotuv bo'limi", icon: "car", roles: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { id: "servis", name: "Servis bo'limi (STO)", icon: "wrench", roles: [14, 15, 16, 17, 18, 19, 20, 21] },
  { id: "qismlar", name: "Ehtiyot qismlar bo'limi", icon: "box", roles: [22, 23] },
  { id: "moliya", name: "Moliya bo'limi", icon: "coins", roles: [24, 25] },
  { id: "marketing", name: "Marketing va PR bo'limi", icon: "megaphone", roles: [26, 27] },
  { id: "kadrlar", name: "Kadrlar bo'limi", icon: "users", roles: [28] },
  { id: "sifat", name: "Mijozlar xizmati sifati", icon: "heart", roles: [29] },
  { id: "it", name: "IT va huquq", icon: "shield", roles: [30, 31] },
  { id: "mamuriy", name: "Ma'muriy-xo'jalik xizmati", icon: "building", roles: [32, 33, 34] }
];

// boss — kimga bo'ysunadi (lavozim raqami). bossNote — matnli izoh.
window.ROLES = [
  { id: 1, name: "Dilerlik tarmog'i egasi (ta'sischi)", dept: "rahbariyat", boss: null, duty: "Avtosalon va servisning asosiy egasi yoki aksiyadori. Strategik maqsadlar va katta investitsiya qarorlari." },
  { id: 2, name: "Bosh direktor", dept: "rahbariyat", boss: 1, duty: "Butun dilerlik markazining kundalik faoliyati, savdo va servis rejalari. Barcha bo'lim boshliqlari unga bo'ysunadi." },
  { id: 3, name: "Moliyaviy direktor", dept: "rahbariyat", boss: 2, duty: "Barcha pul oqimlari, soliqlar, BYD zavodi bilan hisob-kitoblar, byudjet va moliyaviy hisobot." },

  { id: 4, name: "Sotuv bo'limi boshlig'i", dept: "sotuv", boss: 2, duty: "Yangi avtomobillar savdosi, test-drayvlar, sotuv rejalari va menejerlar ishini boshqaradi." },
  { id: 5, name: "Katta sotuv maslahatchisi", dept: "sotuv", boss: 4, duty: "Murakkab mijozlar va korporativ sotuvlar, yangi menejerlarga ustozlik, shartnomalar tuzish." },
  { id: 6, name: "Sotuv menejeri", dept: "sotuv", boss: 4, duty: "Lid bilan ishlash, mijozga model tanlashda yordam (Song Plus, Chazor, Han va boshqalar), test-drayv, shartnoma." },
  { id: 7, name: "Moliya va sug'urta (F&I) menejeri", dept: "sotuv", boss: 4, duty: "Kredit, lizing, muddatli to'lov rasmiylashtirish, banklar bilan ishlash, KASKO sotish." },
  { id: 8, name: "Trade-in mutaxassisi / baholovchi", dept: "sotuv", boss: 4, duty: "Mijozning eski mashinasini baholash va yangisiga almashtirishda qabul qilish, trade-in mashinalarni sotish." },
  { id: 9, name: "Yangi avtomobillar ombori mas'uli (logist)", dept: "sotuv", boss: 4, duty: "Zavodga buyurtma, mashinalarni VIN bo'yicha qabul qilish, ombor qoldig'i, bronlar hisobi." },
  { id: 10, name: "Hujjatlar bo'yicha mutaxassis", dept: "sotuv", boss: 4, duty: "Mashinalarni YHXX (yo'l harakati xavfsizligi xizmati)da ro'yxatdan o'tkazish, davlat raqamlari." },
  { id: 11, name: "Resepshn xodimi", dept: "sotuv", boss: 4, duty: "Kirgan mijozlarni kutib olish, qayd qilish va kerakli bo'limga yo'naltirish." },
  { id: 12, name: "Call-markaz operatori", dept: "sotuv", boss: 4, duty: "Qo'ng'iroqlarga javob, test-drayv va servisga navbatga yozish (sotuv va servis uchun umumiy)." },
  { id: 13, name: "Avtosalon haydovchisi / porter", dept: "sotuv", boss: 4, duty: "Mashinalarni hudud bo'ylab harakatlantirish, test-drayv mashinalarini tayyor va zaryadlangan holda saqlash." },

  { id: 14, name: "Servis bo'limi boshlig'i", dept: "servis", boss: 2, duty: "Texnik xizmat ko'rsatish bo'limining to'liq ishi, servis rejasi va daromadi." },
  { id: 15, name: "Servis maslahatchisi / qabul qiluvchi usta", dept: "servis", boss: 14, duty: "Mashinani qabul qilish, zakaz-naryad ochish, mijoz va ustalar o'rtasida ko'prik." },
  { id: 16, name: "Kafolat (garantiya) mutaxassisi", dept: "servis", boss: 14, duty: "Kafolatli ta'mirlarni BYD zavodiga rasmiylashtirish va xarajatlarni qaytarib olish." },
  { id: 17, name: "Tsex ustasi", dept: "servis", boss: 14, duty: "Ta'mirlash tsexidagi mexanik va elektriklar ishini joyida taqsimlash va nazorat qilish." },
  { id: 18, name: "Avtoelektrik-diagnost", dept: "servis", boss: 17, duty: "Yuqori kuchlanishli batareyalar, platalar va dasturiy ta'minot diagnostikasi." },
  { id: 19, name: "Avtomexanik / slesar", dept: "servis", boss: 17, duty: "Mexanik ta'mir, texnik xizmat (TO), shina, tormoz, osma qismlar." },
  { id: 20, name: "Sifat nazorati muhandisi", dept: "servis", boss: 14, duty: "Ta'mirlangan va zavoddan kelgan yangi mashinalarni topshirishdan oldin BYD standartlari bo'yicha tekshirish." },
  { id: 21, name: "Avtoyuvuvchi", dept: "servis", boss: 14, duty: "Topshiriladigan va ko'rgazmadagi mashinalarni yuvish va sayqallash." },

  { id: 22, name: "Ehtiyot qismlar bo'limi boshlig'i", dept: "qismlar", boss: 2, duty: "Original ehtiyot qismlar va batareyalar omborini boshqarish, zavodga buyurtma, qoldiq nazorati." },
  { id: 23, name: "Omborchi", dept: "qismlar", boss: 22, duty: "Detallarni qabul qilish, berish va hisobini yuritish." },

  { id: 24, name: "Bosh buxgalter", dept: "moliya", boss: 3, duty: "Buxgalteriya va soliq hisobi, hisobotlar, 1C yuritish nazorati." },
  { id: 25, name: "Buxgalter / g'aznachi (kassir)", dept: "moliya", boss: 24, duty: "Mijozlardan to'lovlarni qabul qilish, kassa, hisob-fakturalar." },

  { id: 26, name: "Marketing va PR bo'limi boshlig'i", dept: "marketing", boss: 2, duty: "Reklama, lidlar oqimi, yangi modellar taqdimoti, BYD bilan qo'shma marketing." },
  { id: 27, name: "SMM / kontent-meyker", dept: "marketing", boss: 26, duty: "Foto/video materiallar, ijtimoiy tarmoq sahifalarini yuritish." },

  { id: 28, name: "Kadrlar bo'limi boshlig'i (HR menejer)", dept: "kadrlar", boss: 2, duty: "Ishga olish, suhbatlar, onboarding, BYD standartlari bo'yicha treninglar, shtat jadvali." },

  { id: 29, name: "Mijozlar bilan aloqalar menejeri", dept: "sifat", boss: 2, duty: "Shikoyat va takliflar, sotuv va servisdan keyin nazorat qo'ng'iroqlari, mijoz qoniqishini o'lchash. Bo'limlardan mustaqil bo'lishi uchun to'g'ridan-to'g'ri bosh direktorga bo'ysunadi." },

  { id: 30, name: "CRM / IT administrator", dept: "it", boss: 2, duty: "CRM va boshqa dasturlarni yuritish, kirish huquqlari, integratsiyalar, ma'lumotlar zaxirasi." },
  { id: 31, name: "Yurist (autsors bo'lishi mumkin)", dept: "it", boss: 2, duty: "Shartnoma shablonlari, kredit va mijoz nizolari, BYD bilan shartnoma." },

  { id: 32, name: "Kuryer / shofyor", dept: "mamuriy", boss: 2, bossNote: "Bosh direktor (yoki ma'muriy menejer)", duty: "Ofis, banklar, YHXX va dilerlar o'rtasida hujjat tashish." },
  { id: 33, name: "Qo'riqlash xizmati xodimi", dept: "mamuriy", boss: 2, bossNote: "Bosh direktor (yoki ma'muriy menejer)", duty: "Hudud va mashinalar xavfsizligi, mashina va kalitlar kirish-chiqishini qayd qilish." },
  { id: 34, name: "Farrosh", dept: "mamuriy", boss: 2, bossNote: "Bosh direktor (yoki ma'muriy menejer)", duty: "Avtosalon va ofis tozaligi." }
];

