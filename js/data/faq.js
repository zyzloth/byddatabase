// Tez-tez beriladigan savollar. Javobdagi [2.8] kabi havolalar jarayon qadamiga, {r:4} lavozimga aylanadi.
// alt — savolning boshqa ko'rinishlari (qidiruv aniqligi uchun).

window.FAQ = [
  // Lidlar
  { q: "Yangi lidga qancha vaqtda javob berish kerak?", alt: ["lidga javob muddati", "mijozga qachon qo'ng'iroq qilish kerak", "birinchi aloqa necha daqiqa"],
    a: "Sotuv menejeri lid biriktirilgandan keyin **15 daqiqa ichida** birinchi aloqa qilishi shart [1.6]. 15 daqiqada aloqa bo'lmasa, lid avtomatik eskalatsiya qilinadi: sotuv bo'limi boshlig'iga xabar boradi va lid boshqa menejerga beriladi [1.7].", roles: [6, 5, 4] },
  { q: "Lidni CRMga qo'lda qancha vaqtda kiritish kerak?", alt: ["qo'ng'iroq qilgan mijozni qayerga yozaman", "lidni kiritish", "call-markaz lid"],
    a: "Sayt va direct'dan kelgan lidlar CRMga avtomatik tushadi [1.2]. Qo'ng'iroq, tashrif yoki boshqa kanaldan kelgan lidni call-markaz, resepshn yoki SMM xodimi **5 daqiqa ichida** qo'lda kiritadi [1.3]. Keyin CRM telefon raqami bo'yicha dublikatni tekshiradi [1.4].", roles: [12, 11, 27] },
  { q: "Lid qaysi menejerga biriktiriladi?", alt: ["lid taqsimlash", "mijozni kimga beraman", "menejerlar mijoz talashadi", "navbat"],
    a: "Biriktirishni CRM avtomatik qiladi [1.5]: **eski mijoz** — oldingi menejeriga, **yangi mijoz** — navbat bo'yicha. Bu menejerlar o'rtasidagi «mijoz talashish»ning oldini oladi.", roles: [4, 6, 11] },
  { q: "Mijoz sotib olmasa yoki lid yo'qolsa nima qilinadi?", alt: ["yo'qotilgan lid", "mijoz rad etdi", "maqsadsiz lid"],
    a: "Ehtiyoj aniqlangandan keyin [1.8] lid maqsadli bo'lmasa, u **«Yo'qotildi»** deb yopiladi va **sababi majburiy** yoziladi [1.9]. Mijoz keyinroq qaror qilsa — **«Kechiktirildi»**: qayta aloqa sanasi belgilanadi va o'sha sanada jarayon 1.6 dan davom etadi [1.10].", roles: [6, 4] },
  { q: "Mijoz test-drayvga kelmasa nima qilaman?", alt: ["mijoz kelmadi", "tashrifga kelmadi", "qayta qo'ng'iroq"],
    a: "CRM tashrifdan **1 kun va 2 soat oldin** eslatma yuboradi [1.12]. Mijoz baribir kelmasa, menejer qayta qo'ng'iroq qilib yangi sana belgilaydi [1.13]. **3 urinishdan keyin** lid «Kechiktirildi» holatiga o'tadi [1.10].", roles: [6] },
  { q: "Test-drayvga yozishdan oldin nimani tekshirish kerak?", alt: ["test-drayv mashinasi band", "test-drayv yozish"],
    a: "Tashrif yoki test-drayvga yozishda **mashina bo'shligi tekshiriladi** [1.11]. Test-drayv mashinasini tayyor va zaryadlangan holda saqlash — haydovchi/porter vazifasi {r:13}.", roles: [6, 13] },

  // Sotuv
  { q: "Chegirmani kim tasdiqlaydi?", alt: ["chegirma berish", "skidka", "limitdan katta chegirma", "chegirma limiti"],
    a: "Menejer yakuniy narxni hisoblaydi: **narx − chegirma − trade-in** [2.7]. Chegirma limit ichida bo'lsa, menejer o'zi beradi. **Limitdan oshsa** — sotuv bo'limi boshlig'i **2 soat ichida** tasdiqlaydi [2.8].", roles: [4, 6] },
  { q: "Mashinani qanday bronlash kerak?", alt: ["bron qilish", "mashina bron", "VIN bo'yicha bron", "mashina yo'q bo'lsa"],
    a: "Mijoz qaror qilgach, logist mashinani **VIN bo'yicha** bronlaydi [2.5] — bu bitta mashinani ikki mijozga va'da qilishning oldini oladi. Kerakli mashina omborda bo'lmasa, 6-jarayon (Yangi avtomobillar ta'minoti) boshlanadi. «Yo'lda» holatidagi mashinani ham oldindan bronlash mumkin [6.7].", roles: [9, 6] },
  { q: "Mijoz o'ylab ko'raman desa nima qilinadi?", alt: ["o'ylab ko'radi", "qaror qilmadi"],
    a: "Mijoz taqdimotdan keyin qaror qilmasa — **24 soatda qayta aloqa** qilinadi; **7 kunda** natija bo'lmasa, imkoniyat yopiladi [2.4].", roles: [6] },
  { q: "Shartnoma qanday tuziladi?", alt: ["shartnoma shabloni", "shartnoma tayyorlash"],
    a: "Shartnoma faqat **CRM shablonidan** tuziladi [2.10]. Shablonlarni yurist tasdiqlaydi va yangilaydi {r:31}. To'lov kassada shartnoma raqamiga bog'lab qabul qilinadi [2.11].", roles: [6, 5, 31] },
  { q: "To'lov qanday qabul qilinadi?", alt: ["kassa", "pul qabul qilish", "to'lov shartnomaga bog'lash", "qisman to'lov"],
    a: "Kassir to'lovni **shartnoma raqamiga bog'lab** qabul qiladi [2.11]. CRM to'lovni belgilaydi, bronni tasdiqlaydi va mijozga SMS yuboradi [2.12]. To'liq to'lanmagan bo'lsa, kassir qoldiqni kuzatadi — muddat o'tsa signal beriladi [2.13].", roles: [25] },

  // Topshirish
  { q: "Mashina topshirishdan oldin nima qilinadi?", alt: ["topshirishga tayyorlash", "PDI", "mashina topshirish tartibi"],
    a: "To'liq to'lovdan keyin: topshirish sanasi kelishiladi (**kamida 3 ish kuni**) [3.2]; parallel ravishda YHXX va davlat raqami [3.8] hamda ombordan chiqarish [3.3] boshlanadi. Keyin **PDI tekshiruvi BYD cheklisti** bo'yicha [3.4], qo'shimcha jihozlar [3.6], yuvish va tayyorlash [3.7]. Topshirishda mijozga tanishtiruv, ilova va zaryadlash ko'rsatiladi [3.11].", roles: [6, 20, 10, 9] },
  { q: "PDI dan o'tmasa nima bo'ladi?", alt: ["PDI kamchilik", "tekshiruvdan o'tmadi"],
    a: "Kamchilik servisda tuzatiladi va mashina **qayta PDI** dan o'tkaziladi [3.5]. Tekshiruvsiz mashina topshirilmaydi.", roles: [20, 17] },
  { q: "Mashina yoki hujjat tayyor bo'lmasa mijozga nima deyiladi?", alt: ["topshirish kechikdi", "sana o'zgardi"],
    a: "Sotuv menejeri mijozga **oldindan xabar beradi** va yangi sana kelishadi [3.9] — mijoz kelib qolganidan keyin emas.", roles: [6] },
  { q: "Topshirishdan keyin nazorat qo'ng'irog'i qachon qilinadi?", alt: ["nazorat qo'ng'irog'i", "mijoz bahosi", "mijoz mamnunmi"],
    a: "Mijozlar bilan aloqalar menejeri **3 kun ichida** qo'ng'iroq qiladi va **1–10 ball** bo'yicha baho oladi [3.14]. Mijoz mamnun bo'lsa — servis bazasiga o'tadi; norozi bo'lsa — shikoyat jarayoni boshlanadi (10-jarayon).", roles: [29] },

  // Kredit
  { q: "Kredit arizasi qanday rasmiylashtiriladi?", alt: ["kredit olish", "lizing", "bankka ariza", "bo'lib to'lash"],
    a: "F&I menejeri shartlarni tushuntiradi [4.2], mijoz pasport va daromad ma'lumotnomasini topshiradi [4.3], hujjatlar bank cheklisti bo'yicha tekshiriladi [4.4] va ariza **bir vaqtda 2–3 bankka** yuboriladi [4.5]. Bank **1–3 ish kunida** ko'rib chiqadi [4.6].", roles: [7] },
  { q: "Bank kreditni rad etsa nima qilinadi?", alt: ["kredit rad etildi", "bank rad"],
    a: "F&I menejeri **muqobil taklif** beradi: boshqa bank yoki kattaroq boshlang'ich to'lov [4.7], so'ng ariza qayta yuboriladi.", roles: [7] },
  { q: "KASKO qachon taklif qilinadi?", alt: ["sug'urta", "kasko"],
    a: "Bank tasdiqlagandan keyin F&I menejeri **shartlar va KASKO bo'yicha yozma taklif** beradi [4.8]. KASKO kredit arizasi bosqichida ham taklif qilinadi [2.9].", roles: [7] },

  // Trade-in
  { q: "Trade-in mashinaning narxi qanday hisoblanadi?", alt: ["eski mashinani baholash", "trade-in narx", "baholash"],
    a: "Trade-in mutaxassisi bozor narxini **kamida 5 ta e'lon** bo'yicha aniqlaydi [5.3], servis diagnostika akti tuzadi [5.4], huquqiy tekshiruv (taqiq, garov) o'tkaziladi [5.5]. Narx = **bozor − ta'mir − marja** [5.6]. Narxni sotuv bo'limi boshlig'i **2 soat ichida** tasdiqlaydi [5.7]. Butun baholash **1 kun** [2.6].", roles: [8, 4] },
  { q: "Trade-in mashina sotilmasa nima qilinadi?", alt: ["trade-in 45 kun", "turib qolgan trade-in"],
    a: "Mashina **45 kunda** sotilmasa, sotuv bo'limi boshlig'i narxni qayta ko'rib chiqadi yoki ulgurji sotishga qaror qiladi [5.11]. Sotilgach CRM foyda yoki zararni hisoblaydi [5.12].", roles: [8, 4] },

  // Ta'minot
  { q: "Zavoddan qaysi mashinalarni buyurtma qilishni kim hal qiladi?", alt: ["zavodga buyurtma", "model va rang tanlash", "buyurtma rejasi"],
    a: "Logist talab tahlilini qiladi (qoldiq, bron, lidlar, sotuv tezligi) [6.2]. Rejani rahbariyat tasdiqlaydi (model, rang, soni) [6.3], moliyaviy direktor pul oqimi bo'yicha tasdiqlaydi [6.4], so'ng logist BYD dilerlik tizimida buyurtma beradi [6.5].", roles: [9, 2, 4, 3] },
  { q: "Zavoddan kelgan mashinada shikast bo'lsa nima qilinadi?", alt: ["shikastlangan mashina", "akt va da'vo"],
    a: "Logist qabulda VIN, komplekt, kalit va fotoni tekshiradi [6.8]. Shikast topilsa **24 soat ichida** akt tuziladi va zavodga da'vo beriladi [6.9]. Keyin sifat nazorati batareya va dasturni tekshiradi [6.10].", roles: [9, 20] },
  { q: "Mashina omborda uzoq tursa nima bo'ladi?", alt: ["90 kun", "ombor qoldig'i", "sotilmayotgan mashina"],
    a: "Logist saqlashni nazorat qiladi (zaryad, inventarizatsiya) [6.12]. Mashina **90 kundan ortiq** tursa, rahbariyat aksiya yoki narx tuzatish haqida qaror qabul qiladi [6.13].", roles: [9, 2, 4] },

  // Servis
  { q: "Servisga mashina qanday qabul qilinadi?", alt: ["servis qabul", "zakaz-naryad ochish", "mashinani qabul qilish"],
    a: "Call-markaz postlar bandligi bo'yicha yozadi [7.2], CRM **1 kun oldin** eslatma yuboradi [7.3]. Servis maslahatchisi qabulda **foto, probeg** qayd qiladi va **zakaz-naryad** ochadi [7.4]. Tsex **1–2 soatda** diagnostika qiladi [7.5].", roles: [15, 12] },
  { q: "Smeta mijoz bilan qanday kelishiladi?", alt: ["narx va muddat", "smeta", "ta'mir narxi"],
    a: "Diagnostikadan keyin servis maslahatchisi **ish, qism va muddat** ko'rsatilgan smeta tuzadi [7.6]. Mijoz rozi bo'lmasa, mashina qaytariladi va faqat diagnostika to'lovi olinadi [7.7].", roles: [15] },
  { q: "Ta'mirdan keyin mashina qanday topshiriladi?", alt: ["sifat tekshiruvi", "test-yurish", "servisdan topshirish"],
    a: "Ta'mirda **normo-soat qayd etiladi** [7.9]. Sifat nazorati test-yurish qiladi [7.10]; o'tmasa qayta ta'mirga qaytadi. So'ng mijozga bajarilgan ishlar haqida xabar beriladi [7.11], kassada to'lov va chek [7.12], topshirishda **eski qismlar ko'rsatiladi** [7.13].", roles: [15, 17, 20] },
  { q: "Normo-soat qayerda qayd etiladi?", alt: ["usta ish vaqti", "normo soat"],
    a: "Normo-soat ta'mir bosqichida tsexda qayd etiladi [7.9] — bu ustalar ish haqi va servis daromadini hisoblash uchun asos.", roles: [17, 19, 18, 14] },

  // Kafolat
  { q: "Kafolat holati qanday rasmiylashtiriladi?", alt: ["garantiya", "kafolat ariza", "kafolat arizasi qanday", "kafolatli ta'mir"],
    a: "Kafolat mutaxassisi shartlarni tekshiradi: **muddat, probeg, texnik xizmat** [8.2]. Kafolatga kirmasa — pullik ta'mir va sabab tushuntiriladi. Kirsa — tsex dalillarni to'playdi (kodlar, foto, video) [8.4], ariza zavodga **muddat ichida** yuboriladi [8.5].", roles: [16, 15] },
  { q: "Zavod kafolat arizasini rad etsa nima qilinadi?", alt: ["kafolat rad etildi"],
    a: "Kafolat mutaxassisi **qo'shimcha ma'lumot** yuboradi yoki **e'tiroz** bildiradi [8.7], so'ng ariza qayta ko'rib chiqiladi.", roles: [16] },
  { q: "Eski kafolat qismini qancha saqlash kerak?", alt: ["eski qism saqlash", "almashtirilgan qism"],
    a: "Almashtirilgan eski qism **zavod belgilagan muddatgacha** ehtiyot qismlar omborida saqlanadi [8.10]. Bu kompensatsiya da'vosi [8.11] uchun dalil.", roles: [22, 23, 16] },
  { q: "Kafolat kompensatsiyasi pulini kim nazorat qiladi?", alt: ["zavod kompensatsiya", "kafolat qaytarimi"],
    a: "Kafolat mutaxassisi ish va qism bo'yicha kompensatsiya da'vosini beradi [8.11]; moliya bo'limi zavoddan kelgan tushumni **solishtirib nazorat qiladi** [8.12].", roles: [16, 24, 3] },

  // Ehtiyot qismlar
  { q: "Ehtiyot qismni qanday olish mumkin?", alt: ["qism berish", "ombordan qism olish", "detal olish", "qism yetishmasa", "kerakli qism omborda yo'q"],
    a: "Qism **faqat hujjat bo'yicha** beriladi [9.7] — «keyin yozaman» mumkin emas. Omborda bo'lmasa, ehtiyot qismlar boshlig'i buyurtma beradi va **kutilgan sanani servisga** aytadi [9.2].", roles: [23, 22, 15] },
  { q: "Qism tugab qolsa buyurtma qanday beriladi?", alt: ["minimal qoldiq", "qoldiqni to'ldirish"],
    a: "Har chiqimdan keyin [9.8] qoldiq minimaldan kam bo'lsa, **buyurtma avtomatik boshlanadi**. Limit ichidagi to'lov moliya tomonidan avtomatik tasdiqlanadi [9.3].", roles: [22] },
  { q: "Inventarizatsiya qachon o'tkaziladi?", alt: ["inventarizatsiya", "o'lik qoldiq"],
    a: "**Har oy oxirida** inventarizatsiya: hisob va haqiqiy qoldiq solishtiriladi [9.9]. So'ng **180 kundan ortiq** turgan o'lik qoldiq tahlil qilinadi [9.10].", roles: [22, 23] },

  // Shikoyat
  { q: "Mijoz shikoyat qilsa nima qilish kerak?", alt: ["shikoyat", "norozi mijoz", "mijoz arz qildi"],
    a: "Shikoyatni qabul qilgan **har qanday xodim** uni **1 soat ichida CRMga** kiritadi [10.2]. Mijozlar bilan aloqalar menejeri tasniflaydi [10.4] va **24 soat ichida** mijoz bilan bog'lanadi [10.5]. Bo'lim boshlig'i **3 ish kunida** sabab va yechim topadi [10.6].", roles: [29] },
  { q: "Shikoyat bo'yicha qarorni kim qabul qiladi?", alt: ["shikoyat qarori", "bosh direktor qarori"],
    a: "Yechim bo'lim boshlig'i vakolatida bo'lsa — u hal qiladi. Aks holda **bosh direktor** qaror qabul qiladi [10.7]. Mijoz yechimdan qoniqmasa, bosh direktor qayta ko'rib chiqadi [10.10].", roles: [2, 29] },

  // Tuzilma
  { q: "Mijozlar bilan aloqalar menejeri nega bosh direktorga bo'ysunadi?", alt: ["mijozlar bilan aloqalar menejeri mustaqil"],
    a: "Bo'limlardan mustaqil bo'lishi uchun — aks holda bo'limlar o'z xatolarini yashiradi {r:29}.", roles: [29] },
  { q: "Kim kimga bo'ysunadi?", alt: ["tuzilma", "org sxema", "rahbar kim", "kimga bo'ysunaman", "bo'ysunish tartibi"],
    a: "Barcha bo'lim boshliqlari **bosh direktorga** bo'ysunadi {r:2}, bosh direktor — egasiga {r:1}. Bosh buxgalter moliyaviy direktorga {r:24}, kassir bosh buxgalterga {r:25}. Diagnost va mexaniklar tsex ustasiga {r:17}. To'liq sxema «Tuzilma» bo'limida.", roles: [] },
  { q: "CRMni kim yuritadi?", alt: ["CRM administrator", "dasturga kirish huquqi", "parol"],
    a: "CRM va boshqa dasturlarni, kirish huquqlarini, integratsiyalarni va ma'lumotlar zaxirasini **CRM / IT administrator** yuritadi {r:30}.", roles: [30] }
];
