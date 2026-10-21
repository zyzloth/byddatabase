// 10 ta biznes-jarayon reglamenti (swimlane diagrammalardan olingan).
// Tugun turlari: start, step, auto (CRM avtomatik), decision, end, endbad, link (boshqa jarayonga o'tish).
// lane — yo'lak indeksi, col — ustun, r — yo'lak ichidagi qator (-1 yuqori, 0 o'rta, 1 pastki).
// risk: true — nazorat nuqtasi (muddat/qoida buzilsa pul yoki mijoz yo'qotiladi).

window.PROCESSES = [
  {
    id: 1,
    slug: "lid",
    title: "Lid va birinchi aloqa",
    short: "Mijoz murojaatidan tashrif yoki test-drayvgacha",
    owner: 4,
    goal: "Har bir murojaat CRMga tushadi, 15 daqiqada javob oladi va tashrifga aylanadi. Hech bir lid egasiz qolmaydi.",
    trigger: "Mijoz qo'ng'iroq, direct, sayt, OLX yoki tashrif orqali murojaat qiladi.",
    result: "Mijoz avtosalonga keldi → 2-jarayon (Sotuv).",
    kpi: ["Birinchi javob vaqti ≤ 15 daqiqa", "Lid → tashrif konversiyasi", "Yo'qotilgan lidlar sabablari bilan", "Dublikatlar soni"],
    lanes: [
      { name: "Mijoz", roles: [] },
      { name: "CRM", sub: "avtomatik", roles: [30], system: true },
      { name: "Call-markaz, resepshn, SMM", roles: [12, 11, 27] },
      { name: "Sotuv menejeri", roles: [6, 5] },
      { name: "Sotuv bo'limi boshlig'i", roles: [4] }
    ],
    nodes: [
      { id: "1.1", lane: 0, col: 0, type: "start", title: "Mijoz murojaat qiladi", note: "Qo'ng'iroq, direct, sayt, OLX, tashrif" },
      { id: "1.2", lane: 1, col: 1, type: "auto", title: "Lid avtomatik tushadi", note: "Manba belgilanadi" },
      { id: "1.3", lane: 2, col: 1, type: "step", title: "Lidni qo'lda kiritish", note: "5 daqiqa ichida", risk: true },
      { id: "1.4", lane: 1, col: 2, type: "auto", title: "Dublikat tekshiruvi", note: "Telefon raqami bo'yicha" },
      { id: "1.5", lane: 1, col: 3, type: "auto", title: "Menejerga biriktirish", note: "Eski mijoz: oldingi menejer. Yangi: navbat", risk: true },
      { id: "1.6", lane: 3, col: 4, type: "step", title: "Birinchi aloqa", note: "15 daqiqa ichida", risk: true },
      { id: "1.Q1", lane: 3, col: 5, type: "decision", title: "15 daqiqada aloqa bo'ldimi?" },
      { id: "1.7", lane: 4, col: 5, type: "step", title: "Eskalatsiya", note: "Boshliqqa xabar, boshqa menejerga" },
      { id: "1.8", lane: 3, col: 6, type: "step", title: "Ehtiyojni aniqlash", note: "Model, byudjet, to'lov turi, trade-in" },
      { id: "1.Q2", lane: 3, col: 7, type: "decision", title: "Maqsadli lidmi?" },
      { id: "1.9", lane: 3, col: 7, r: -1, type: "endbad", title: "Yo'qotildi", note: "Sabab majburiy", risk: true },
      { id: "1.10", lane: 3, col: 7, r: 1, type: "step", title: "Kechiktirildi", note: "Qayta aloqa sanasi, sanada 1.6 ga", risk: true },
      { id: "1.11", lane: 3, col: 8, type: "step", title: "Tashrif / test-drayvga yozish", note: "Mashina bo'shligi tekshiriladi", risk: true },
      { id: "1.12", lane: 1, col: 9, type: "auto", title: "Eslatma yuboriladi", note: "1 kun va 2 soat oldin" },
      { id: "1.Q3", lane: 0, col: 10, type: "decision", title: "Mijoz keldimi?", risk: true },
      { id: "1.13", lane: 3, col: 10, r: 1, type: "step", title: "Qayta qo'ng'iroq", note: "Yangi sana; 3 urinishdan keyin 1.10" },
      { id: "1.L2", lane: 3, col: 11, type: "link", to: 2, title: "Sotuv jarayoni", note: "2.1 dan davom etadi" }
    ],
    edges: [
      ["1.1", "1.2"], ["1.1", "1.3"], ["1.2", "1.4"], ["1.3", "1.4"], ["1.4", "1.5"], ["1.5", "1.6"],
      ["1.6", "1.Q1"], ["1.Q1", "1.8", "Ha"], ["1.Q1", "1.7", "Yo'q"], ["1.7", "1.6", "", true],
      ["1.8", "1.Q2"], ["1.Q2", "1.11", "Ha"], ["1.Q2", "1.9", "Yo'q"], ["1.Q2", "1.10", "Keyinroq"],
      ["1.11", "1.12"], ["1.12", "1.Q3"], ["1.Q3", "1.L2", "Ha"], ["1.Q3", "1.13", "Yo'q"], ["1.13", "1.11", "", true]
    ]
  },
  {
    id: 2,
    slug: "sotuv",
    title: "Sotuv jarayoni",
    short: "Avtosalondagi uchrashuvdan to'liq to'lovgacha",
    owner: 4,
    goal: "Mijoz avtosalonda taqdimot va test-drayvdan o'tadi, mashina VIN bo'yicha bronlanadi, narx limit ichida kelishiladi va to'lov shartnomaga bog'lanadi.",
    trigger: "Mijoz avtosalonga keladi (1-jarayondan).",
    result: "To'liq to'landi → 3-jarayon (Topshirish).",
    kpi: ["Tashrif → shartnoma konversiyasi", "Limitdan oshgan chegirmalar soni", "Bir mashina ikki mijozga va'da qilingan holatlar = 0", "To'lov qoldig'i muddatidan o'tganlar"],
    lanes: [
      { name: "Mijoz", roles: [] },
      { name: "Sotuv menejeri", roles: [6, 5] },
      { name: "Sotuv bo'limi boshlig'i", roles: [4] },
      { name: "F&I va trade-in", sub: "kredit, lizing, baholash", roles: [7, 8] },
      { name: "Logist", sub: "yangi avtomobillar ombori", roles: [9] },
      { name: "Kassir", sub: "moliya bo'limi", roles: [25] },
      { name: "CRM", sub: "avtomatik", roles: [30], system: true }
    ],
    nodes: [
      { id: "2.1", lane: 0, col: 0, type: "start", title: "Mijoz avtosalonga keladi", note: "1-jarayondan" },
      { id: "2.2", lane: 1, col: 1, type: "step", title: "Kutib olish", note: "Tashrif CRMda belgilanadi" },
      { id: "2.3", lane: 1, col: 2, type: "step", title: "Taqdimot va test-drayv", note: "Model, komplektatsiya, narx", risk: true },
      { id: "2.Q1", lane: 1, col: 3, type: "decision", title: "Qaror qildimi?" },
      { id: "2.4", lane: 1, col: 3, r: 1, type: "step", title: "O'ylab ko'radi", note: "24 soatda qayta aloqa; 7 kunda yopiladi", risk: true },
      { id: "2.5", lane: 4, col: 4, type: "step", title: "Mashinani bronlash", note: "VIN bo'yicha; yo'q bo'lsa 6-jarayon", risk: true },
      { id: "2.Q2", lane: 1, col: 5, type: "decision", title: "Trade-in bormi?" },
      { id: "2.6", lane: 3, col: 5, type: "step", title: "Trade-in baholash", note: "5-jarayon, 1 kun", risk: true },
      { id: "2.7", lane: 1, col: 6, type: "step", title: "Yakuniy narx", note: "Narx − chegirma − trade-in" },
      { id: "2.Q3", lane: 1, col: 7, type: "decision", title: "Chegirma limitdan oshadimi?", risk: true },
      { id: "2.8", lane: 2, col: 7, type: "step", title: "Chegirmani tasdiqlash", note: "2 soat ichida" },
      { id: "2.Q4", lane: 1, col: 8, type: "decision", title: "To'lov turi?" },
      { id: "2.9", lane: 3, col: 8, type: "step", title: "Kredit / lizing arizasi", note: "4-jarayon, KASKO taklifi", risk: true },
      { id: "2.10", lane: 1, col: 9, type: "step", title: "Shartnoma", note: "CRM shablonidan", risk: true },
      { id: "2.11", lane: 5, col: 10, type: "step", title: "To'lovni qabul qilish", note: "Shartnoma raqamiga bog'lanadi", risk: true },
      { id: "2.12", lane: 6, col: 11, type: "auto", title: "To'lov belgilanadi", note: "Bron tasdiqlanadi, SMS" },
      { id: "2.Q5", lane: 5, col: 12, type: "decision", title: "To'liq to'landimi?" },
      { id: "2.13", lane: 5, col: 12, r: 1, type: "step", title: "Qoldiqni kuzatish", note: "Muddat o'tsa signal" },
      { id: "2.L3", lane: 1, col: 13, type: "link", to: 3, title: "Topshirish", note: "3.1 dan davom etadi" }
    ],
    edges: [
      ["2.1", "2.2"], ["2.2", "2.3"], ["2.3", "2.Q1"], ["2.Q1", "2.5", "Ha"], ["2.Q1", "2.4", "Yo'q"], ["2.4", "2.3", "", true],
      ["2.5", "2.Q2"], ["2.Q2", "2.6", "Ha"], ["2.Q2", "2.7", "Yo'q"], ["2.6", "2.7"], ["2.7", "2.Q3"],
      ["2.Q3", "2.8", "Ha"], ["2.Q3", "2.Q4", "Yo'q"], ["2.8", "2.Q4"], ["2.Q4", "2.10", "Naqd"], ["2.Q4", "2.9", "Kredit"],
      ["2.9", "2.10"], ["2.10", "2.11"], ["2.11", "2.12"], ["2.12", "2.Q5"], ["2.Q5", "2.L3", "Ha"], ["2.Q5", "2.13", "Yo'q"], ["2.13", "2.L3"]
    ]
  },
  {
    id: 3,
    slug: "topshirish",
    title: "Avtomobilni topshirish",
    short: "To'liq to'lovdan kalit topshirish va nazorat qo'ng'irog'igacha",
    owner: 4,
    goal: "Mashina PDI tekshiruvidan o'tgan, hujjatlari tayyor, toza holda kelishilgan sanada topshiriladi; 3 kunda mijoz fikri olinadi.",
    trigger: "CRMda to'liq to'lov belgilandi (2-jarayondan).",
    result: "Mijoz mamnun → servis bazasiga (7-jarayon). Norozi → shikoyat (10-jarayon).",
    kpi: ["Kelishilgan sanada topshirilganlar ulushi", "PDI dan birinchi urinishda o'tganlar", "Nazorat qo'ng'irog'i bahosi (1–10)", "YHXX ro'yxatdan o'tkazish muddati"],
    lanes: [
      { name: "Mijoz", roles: [] },
      { name: "Sotuv menejeri", roles: [6, 5] },
      { name: "Hujjatlar bo'yicha mutaxassis", sub: "YHXX", roles: [10] },
      { name: "Logist", sub: "yangi avtomobillar ombori", roles: [9] },
      { name: "Sifat nazorati muhandisi", roles: [20] },
      { name: "Servis", sub: "tsex, avtoyuvuvchi", roles: [17, 19, 21] },
      { name: "Mijozlar bilan aloqalar menejeri", roles: [29] },
      { name: "CRM", sub: "avtomatik", roles: [30], system: true }
    ],
    nodes: [
      { id: "3.1", lane: 7, col: 0, type: "start", title: "To'liq to'landi", note: "2-jarayondan" },
      { id: "3.2", lane: 1, col: 1, type: "step", title: "Topshirish sanasini kelishish", note: "Kamida 3 ish kuni", risk: true },
      { id: "3.8", lane: 2, col: 2, type: "step", title: "YHXX va davlat raqami", note: "Parallel boshlanadi", risk: true },
      { id: "3.3", lane: 3, col: 2, type: "step", title: "Ombordan chiqarish", note: "VIN bo'yicha" },
      { id: "3.4", lane: 4, col: 3, type: "step", title: "PDI tekshiruvi", note: "BYD cheklisti", risk: true },
      { id: "3.Q1", lane: 4, col: 4, type: "decision", title: "PDI dan o'tdimi?" },
      { id: "3.5", lane: 5, col: 4, type: "step", title: "Kamchilikni tuzatish", note: "So'ng qayta PDI" },
      { id: "3.6", lane: 5, col: 5, type: "step", title: "Qo'shimcha jihozlar", note: "Shartnomada bo'lsa" },
      { id: "3.7", lane: 5, col: 6, type: "step", title: "Yuvish va tayyorlash", note: "Topshirish kuni" },
      { id: "3.Q2", lane: 1, col: 7, type: "decision", title: "Mashina va hujjat tayyormi?" },
      { id: "3.9", lane: 1, col: 7, r: 1, type: "step", title: "Mijozga oldindan xabar", note: "Yangi sana" },
      { id: "3.10", lane: 7, col: 8, type: "auto", title: "Eslatma va porterga vazifa", note: "Topshirishdan oldin" },
      { id: "3.11", lane: 1, col: 9, type: "step", title: "Topshirish", note: "Tanishtirish, ilova, zaryadlash", risk: true },
      { id: "3.12", lane: 0, col: 10, type: "step", title: "Dalolatnomani imzolash", note: "Kalit va hujjatlar" },
      { id: "3.13", lane: 7, col: 11, type: "auto", title: "CRM yangilanadi", note: "Servis kartochkasi, texnik xizmat eslatmasi", risk: true },
      { id: "3.14", lane: 6, col: 12, type: "step", title: "Nazorat qo'ng'irog'i", note: "3 kun ichida, baho 1–10" },
      { id: "3.Q3", lane: 6, col: 13, type: "decision", title: "Mijoz mamnunmi?" },
      { id: "3.L7", lane: 6, col: 14, type: "link", to: 7, title: "Servis", note: "Mijoz servis bazasida" },
      { id: "3.L10", lane: 6, col: 13, r: 1, type: "link", to: 10, title: "Shikoyat", note: "Sabab aniqlanadi" }
    ],
    edges: [
      ["3.1", "3.2"], ["3.2", "3.8"], ["3.2", "3.3"], ["3.3", "3.4"], ["3.8", "3.Q2"], ["3.4", "3.Q1"],
      ["3.Q1", "3.6", "Ha"], ["3.Q1", "3.5", "Yo'q"], ["3.5", "3.4", "", true], ["3.6", "3.7"], ["3.7", "3.Q2"],
      ["3.Q2", "3.10", "Ha"], ["3.Q2", "3.9", "Yo'q"], ["3.9", "3.2", "", true], ["3.10", "3.11"], ["3.11", "3.12"],
      ["3.12", "3.13"], ["3.13", "3.14"], ["3.14", "3.Q3"], ["3.Q3", "3.L7", "Ha"], ["3.Q3", "3.L10", "Yo'q"]
    ]
  },
  {
    id: 4,
    slug: "kredit",
    title: "Kredit va lizing",
    short: "Kredit tanlovidan bank pulini olishgacha",
    owner: 7,
    goal: "Ariza bir vaqtda 2–3 bankka yuboriladi, rad etilsa muqobil taklif beriladi, bank puli muddatida kelishi nazorat qilinadi.",
    trigger: "Mijoz to'lov turida kredit/lizingni tanladi (2-jarayon, Q4).",
    result: "Bank puli tushdi → 2-jarayon, Q5 (To'liq to'landimi?).",
    kpi: ["Arizani ko'rib chiqish muddati (1–3 ish kuni)", "Tasdiqlanish ulushi", "KASKO sotilgan ulush", "Bank o'tkazmasi kechikishi"],
    lanes: [
      { name: "Mijoz", roles: [] },
      { name: "Sotuv menejeri", roles: [6, 5] },
      { name: "F&I menejeri", sub: "kredit, lizing, sug'urta", roles: [7] },
      { name: "Bank", sub: "tashqi", roles: [], external: true },
      { name: "Kassir", sub: "moliya bo'limi", roles: [25] },
      { name: "CRM", sub: "avtomatik", roles: [30], system: true }
    ],
    nodes: [
      { id: "4.1", lane: 1, col: 0, type: "start", title: "Mijoz kredit tanladi", note: "2-jarayon, Q4" },
      { id: "4.2", lane: 2, col: 1, type: "step", title: "Shartlarni tushuntirish", note: "Banklar, boshlang'ich va oylik to'lov" },
      { id: "4.3", lane: 0, col: 2, type: "step", title: "Hujjatlarni topshirish", note: "Pasport, daromad ma'lumotnomasi" },
      { id: "4.4", lane: 2, col: 3, type: "step", title: "Hujjatlarni tekshirish", note: "Bank cheklisti", risk: true },
      { id: "4.5", lane: 2, col: 4, type: "step", title: "Bankka ariza", note: "2–3 bankka bir vaqtda", risk: true },
      { id: "4.6", lane: 3, col: 5, type: "step", title: "Bank ko'rib chiqadi", note: "1–3 ish kuni" },
      { id: "4.Q1", lane: 2, col: 6, type: "decision", title: "Bank tasdiqladimi?" },
      { id: "4.7", lane: 2, col: 6, r: 1, type: "step", title: "Muqobil taklif", note: "Boshqa bank, katta boshlang'ich to'lov" },
      { id: "4.8", lane: 2, col: 7, type: "step", title: "Shartlar va KASKO", note: "Yozma taklif", risk: true },
      { id: "4.Q2", lane: 0, col: 8, type: "decision", title: "Mijoz rozimi?" },
      { id: "4.L24", lane: 1, col: 8, type: "link", to: 2, title: "O'ylab ko'radi", note: "2.4" },
      { id: "4.9", lane: 4, col: 9, type: "step", title: "Boshlang'ich to'lov", note: "Kassa" },
      { id: "4.10", lane: 3, col: 10, type: "step", title: "Bank shartnomasi", note: "Garov rasmiylashtiriladi" },
      { id: "4.11", lane: 3, col: 11, type: "step", title: "Pul o'tkaziladi", note: "Bank muddati", risk: true },
      { id: "4.12", lane: 5, col: 12, type: "auto", title: "Tushum belgilanadi", note: "Komissiya hisoblanadi" },
      { id: "4.L2", lane: 1, col: 13, type: "link", to: 2, title: "Sotuv, Q5", note: "To'liq to'landimi?" }
    ],
    edges: [
      ["4.1", "4.2"], ["4.2", "4.3"], ["4.3", "4.4"], ["4.4", "4.5"], ["4.5", "4.6"], ["4.6", "4.Q1"],
      ["4.Q1", "4.8", "Ha"], ["4.Q1", "4.7", "Yo'q"], ["4.7", "4.5", "", true], ["4.8", "4.Q2"],
      ["4.Q2", "4.9", "Ha"], ["4.Q2", "4.L24", "Yo'q"], ["4.9", "4.10"], ["4.10", "4.11"], ["4.11", "4.12"], ["4.12", "4.L2"]
    ]
  },
  {
    id: 5,
    slug: "trade-in",
    title: "Trade-in",
    short: "Eski mashinani baholash, qabul qilish va qayta sotish",
    owner: 8,
    goal: "Eski mashina bozor narxi, diagnostika va huquqiy tekshiruv asosida baholanadi; qabul qilingan mashina 45 kunda sotiladi, foyda/zarar hisoblanadi.",
    trigger: "Sotuvda mijozning trade-in mashinasi bor (2-jarayon, Q2).",
    result: "Mashina sotildi, foyda yoki zarar CRMda hisoblandi.",
    kpi: ["Baholash muddati ≤ 1 kun", "Ombordagi trade-in mashinalar yoshi", "45 kunda sotilganlar ulushi", "Har bir mashina bo'yicha foyda/zarar"],
    lanes: [
      { name: "Mijoz", roles: [] },
      { name: "Sotuv menejeri", roles: [6, 5] },
      { name: "Trade-in mutaxassisi", roles: [8] },
      { name: "Servis", sub: "diagnost, tsex", roles: [18, 17, 19] },
      { name: "Sotuv bo'limi boshlig'i", roles: [4] },
      { name: "CRM", sub: "avtomatik", roles: [30], system: true }
    ],
    nodes: [
      { id: "5.1", lane: 1, col: 0, type: "start", title: "Trade-in so'rovi", note: "2-jarayon, Q2" },
      { id: "5.2", lane: 1, col: 1, type: "step", title: "Dastlabki ma'lumot", note: "Model, yil, probeg, foto" },
      { id: "5.3", lane: 2, col: 2, type: "step", title: "Bozor narxi", note: "Kamida 5 ta e'lon" },
      { id: "5.4", lane: 3, col: 3, type: "step", title: "Diagnostika", note: "Diagnostika akti", risk: true },
      { id: "5.5", lane: 2, col: 4, type: "step", title: "Huquqiy tekshiruv", note: "Taqiq, garov yo'qligi" },
      { id: "5.6", lane: 2, col: 5, type: "step", title: "Narx hisoblash", note: "Bozor − ta'mir − marja", risk: true },
      { id: "5.7", lane: 4, col: 6, type: "step", title: "Narxni tasdiqlash", note: "2 soat ichida" },
      { id: "5.Q1", lane: 0, col: 7, type: "decision", title: "Mijoz rozimi?" },
      { id: "5.LA", lane: 1, col: 7, type: "link", to: 2, title: "Trade-insiz", note: "2.7 Yakuniy narx" },
      { id: "5.8", lane: 2, col: 8, type: "step", title: "Qabul qilish", note: "Dalolatnoma, kalit, hujjat" },
      { id: "5.LB", lane: 1, col: 9, type: "link", to: 2, title: "Narxdan chegirish", note: "2.7 Yakuniy narx" },
      { id: "5.9", lane: 3, col: 9, type: "step", title: "Sotuvga tayyorlash", note: "Ta'mir, yuvish, foto" },
      { id: "5.10", lane: 2, col: 10, type: "step", title: "Sotuvga qo'yish", note: "E'lonlar, showroom", risk: true },
      { id: "5.Q2", lane: 2, col: 11, type: "decision", title: "45 kunda sotildimi?" },
      { id: "5.11", lane: 4, col: 11, type: "step", title: "Narxni qayta ko'rish", note: "Yoki ulgurji sotish" },
      { id: "5.12", lane: 5, col: 12, type: "end", title: "Sotildi", note: "Foyda yoki zarar hisoblanadi", risk: true }
    ],
    edges: [
      ["5.1", "5.2"], ["5.2", "5.3"], ["5.3", "5.4"], ["5.4", "5.5"], ["5.5", "5.6"], ["5.6", "5.7"], ["5.7", "5.Q1"],
      ["5.Q1", "5.LA", "Yo'q"], ["5.Q1", "5.8", "Ha"], ["5.8", "5.LB"], ["5.8", "5.9"], ["5.9", "5.10"], ["5.10", "5.Q2"],
      ["5.Q2", "5.12", "Ha"], ["5.Q2", "5.11", "Yo'q"], ["5.11", "5.10", "", true]
    ]
  },
  {
    id: 6,
    slug: "taminot",
    title: "Yangi avtomobillar ta'minoti",
    short: "Talab tahlilidan zavod buyurtmasi va omborga kirimgacha",
    owner: 9,
    goal: "Buyurtma talab tahliliga asoslanadi, moliyaviy tasdiqdan o'tadi; kelgan mashina VIN bo'yicha qabul qilinadi va 90 kundan ortiq turib qolmaydi.",
    trigger: "Oylik rejalashtirish yoki 2.5 da kerakli mashina yo'q.",
    result: "Mashina sotuvga tayyor → 2-jarayon, 2.5 (Bron).",
    kpi: ["Ombordagi mashinalar o'rtacha yoshi", "90 kundan ortiq turganlar soni", "Shikast bo'yicha da'vo 24 soatda", "Buyurtmadan kelishgacha muddat"],
    lanes: [
      { name: "Rahbariyat", sub: "bosh direktor, sotuv boshlig'i", roles: [2, 4] },
      { name: "Logist", roles: [9] },
      { name: "Moliyaviy direktor", roles: [3] },
      { name: "BYD zavodi", sub: "tashqi", roles: [], external: true },
      { name: "Sifat nazorati muhandisi", roles: [20] },
      { name: "CRM", sub: "avtomatik", roles: [30], system: true }
    ],
    nodes: [
      { id: "6.1", lane: 1, col: 0, type: "start", title: "Oylik rejalashtirish", note: "Yoki 2.5 da mashina yo'q" },
      { id: "6.2", lane: 1, col: 1, type: "step", title: "Talab tahlili", note: "Qoldiq, bron, lidlar, sotuv tezligi", risk: true },
      { id: "6.3", lane: 0, col: 2, type: "step", title: "Buyurtma rejasini tasdiqlash", note: "Model, rang, soni" },
      { id: "6.4", lane: 2, col: 3, type: "step", title: "Moliyaviy tasdiq", note: "Pul oqimi bo'yicha" },
      { id: "6.5", lane: 1, col: 4, type: "step", title: "Zavodga buyurtma", note: "BYD dilerlik tizimi" },
      { id: "6.6", lane: 3, col: 5, type: "step", title: "Ishlab chiqarish va jo'natish", note: "Kelish sanasi" },
      { id: "6.7", lane: 5, col: 6, type: "auto", title: "«Yo'lda» holati", note: "Oldindan bron mumkin" },
      { id: "6.8", lane: 1, col: 7, type: "step", title: "Qabul qilish", note: "VIN, komplekt, kalit, foto", risk: true },
      { id: "6.Q1", lane: 1, col: 8, type: "decision", title: "Shikast bormi?" },
      { id: "6.9", lane: 1, col: 8, r: 1, type: "step", title: "Akt va da'vo", note: "24 soat ichida" },
      { id: "6.10", lane: 4, col: 9, type: "step", title: "Kirish tekshiruvi", note: "Batareya, dastur" },
      { id: "6.11", lane: 5, col: 10, type: "auto", title: "Omborga kirim", note: "1C, joy belgilanadi" },
      { id: "6.12", lane: 1, col: 11, type: "step", title: "Saqlash nazorati", note: "Zaryad, inventarizatsiya", risk: true },
      { id: "6.Q2", lane: 0, col: 12, type: "decision", title: "90 kundan ortiq turibdimi?" },
      { id: "6.13", lane: 0, col: 12, r: 1, type: "step", title: "Aksiya yoki narx tuzatish", note: "Rahbariyat qarori" },
      { id: "6.L2", lane: 1, col: 13, type: "link", to: 2, title: "Sotuvga tayyor", note: "2.5 Bron" }
    ],
    edges: [
      ["6.1", "6.2"], ["6.2", "6.3"], ["6.3", "6.4"], ["6.4", "6.5"], ["6.5", "6.6"], ["6.6", "6.7"], ["6.7", "6.8"],
      ["6.8", "6.Q1"], ["6.Q1", "6.9", "Ha"], ["6.Q1", "6.10", "Yo'q"], ["6.9", "6.10"], ["6.10", "6.11"], ["6.11", "6.12"],
      ["6.12", "6.Q2"], ["6.Q2", "6.13", "Ha"], ["6.Q2", "6.L2", "Yo'q"], ["6.13", "6.L2"]
    ]
  },
  {
    id: 7,
    slug: "servis",
    title: "Servis: texnik xizmat va ta'mir",
    short: "Servisga yozilishdan mashinani topshirishgacha",
    owner: 14,
    goal: "Mashina zakaz-naryad bilan qabul qilinadi, smeta mijoz bilan kelishiladi, normo-soat qayd etiladi, sifat tekshiruvisiz mashina topshirilmaydi.",
    trigger: "Mijoz qo'ng'iroq, bot yoki texnik xizmat eslatmasi orqali murojaat qiladi.",
    result: "Mashina topshirildi, tarix va keyingi texnik xizmat eslatmasi CRMda.",
    kpi: ["Yozilishdan topshirishgacha vaqt", "Qayta ta'mirga qaytganlar", "Qism kutayotgan mashinalar soni", "Normo-soat bandligi"],
    lanes: [
      { name: "Mijoz", roles: [] },
      { name: "Call-markaz", roles: [12] },
      { name: "Servis maslahatchisi", roles: [15] },
      { name: "Tsex", sub: "usta, diagnost, mexanik", roles: [17, 18, 19] },
      { name: "Ehtiyot qismlar", sub: "omborchi", roles: [23, 22] },
      { name: "Sifat nazorati", roles: [20] },
      { name: "Kassir", roles: [25] },
      { name: "CRM", sub: "avtomatik", roles: [30], system: true }
    ],
    nodes: [
      { id: "7.1", lane: 0, col: 0, type: "start", title: "Mijoz murojaat qiladi", note: "Qo'ng'iroq, bot, eslatma" },
      { id: "7.2", lane: 1, col: 1, type: "step", title: "Servisga yozish", note: "Postlar bandligi bo'yicha", risk: true },
      { id: "7.3", lane: 7, col: 2, type: "auto", title: "Eslatma", note: "1 kun oldin" },
      { id: "7.4", lane: 2, col: 3, type: "step", title: "Qabul", note: "Foto, probeg, zakaz-naryad", risk: true },
      { id: "7.5", lane: 3, col: 4, type: "step", title: "Diagnostika", note: "1–2 soat" },
      { id: "7.Q1", lane: 2, col: 5, type: "decision", title: "Kafolat holatimi?" },
      { id: "7.L8", lane: 2, col: 5, r: 1, type: "link", to: 8, title: "Kafolat", note: "8.1 dan" },
      { id: "7.6", lane: 2, col: 6, type: "step", title: "Smeta", note: "Ish, qism, muddat", risk: true },
      { id: "7.Q2", lane: 0, col: 7, type: "decision", title: "Mijoz rozimi?" },
      { id: "7.7", lane: 2, col: 7, r: 1, type: "endbad", title: "Mashina qaytariladi", note: "Faqat diagnostika to'lovi" },
      { id: "7.8", lane: 4, col: 8, type: "step", title: "Qismlarni berish", note: "Yo'q bo'lsa 9-jarayon", risk: true },
      { id: "7.9", lane: 3, col: 9, type: "step", title: "Ta'mir", note: "Normo-soat qayd etiladi", risk: true },
      { id: "7.10", lane: 5, col: 10, type: "step", title: "Sifat tekshiruvi", note: "Test-yurish" },
      { id: "7.Q3", lane: 5, col: 11, type: "decision", title: "Tekshiruvdan o'tdimi?" },
      { id: "7.11", lane: 2, col: 12, type: "step", title: "Mijozga xabar", note: "Bajarilgan ishlar" },
      { id: "7.12", lane: 6, col: 13, type: "step", title: "To'lov", note: "Chek" },
      { id: "7.13", lane: 2, col: 14, type: "step", title: "Mashinani topshirish", note: "Eski qismlar ko'rsatiladi" },
      { id: "7.14", lane: 7, col: 15, type: "auto", title: "Tarix va eslatmalar", note: "Keyingi texnik xizmat, nazorat qo'ng'irog'i" }
    ],
    edges: [
      ["7.1", "7.2"], ["7.2", "7.3"], ["7.3", "7.4"], ["7.4", "7.5"], ["7.5", "7.Q1"], ["7.Q1", "7.L8", "Ha"], ["7.Q1", "7.6", "Yo'q"],
      ["7.6", "7.Q2"], ["7.Q2", "7.8", "Ha"], ["7.Q2", "7.7", "Yo'q"], ["7.8", "7.9"], ["7.9", "7.10"], ["7.10", "7.Q3"],
      ["7.Q3", "7.11", "Ha"], ["7.Q3", "7.9", "Yo'q", true], ["7.11", "7.12"], ["7.12", "7.13"], ["7.13", "7.14"]
    ]
  },
  {
    id: 8,
    slug: "kafolat",
    title: "Kafolat",
    short: "Kafolat holatidan zavod kompensatsiyasigacha",
    owner: 16,
    goal: "Kafolat sharti tekshiriladi, dalillar to'planadi, ariza zavodga muddat ichida yuboriladi va kompensatsiya puli moliya tomonidan solishtiriladi.",
    trigger: "Servis diagnostikasida kafolat holati aniqlandi (7-jarayon, Q1).",
    result: "Kafolat yopildi: mashina topshirildi, zavod xarajatni qopladi.",
    kpi: ["Arizani yuborish muddati", "Zavod rad etgan arizalar ulushi", "Qoplanmagan summa", "Eski qismlarni saqlash intizomi"],
    lanes: [
      { name: "Servis maslahatchisi", roles: [15] },
      { name: "Tsex", sub: "diagnost, usta", roles: [18, 17, 19] },
      { name: "Kafolat mutaxassisi", roles: [16] },
      { name: "BYD zavodi", sub: "tashqi", roles: [], external: true },
      { name: "Ehtiyot qismlar", roles: [22, 23] },
      { name: "Moliya", roles: [24, 3] }
    ],
    nodes: [
      { id: "8.1", lane: 0, col: 0, type: "start", title: "Kafolat holati", note: "7-jarayon, Q1" },
      { id: "8.2", lane: 2, col: 1, type: "step", title: "Shartlarni tekshirish", note: "Muddat, probeg, texnik xizmat" },
      { id: "8.Q1", lane: 2, col: 2, type: "decision", title: "Kafolatga kiradimi?" },
      { id: "8.L7a", lane: 0, col: 2, type: "link", to: 7, title: "Pullik ta'mir", note: "Sabab tushuntiriladi, 7.6" },
      { id: "8.4", lane: 1, col: 3, type: "step", title: "Dalillar", note: "Kodlar, foto, video" },
      { id: "8.5", lane: 2, col: 4, type: "step", title: "Zavodga ariza", note: "Muddat ichida", risk: true },
      { id: "8.6", lane: 3, col: 5, type: "step", title: "Zavod ko'rib chiqadi" },
      { id: "8.Q2", lane: 2, col: 6, type: "decision", title: "Tasdiqlandimi?" },
      { id: "8.7", lane: 2, col: 6, r: 1, type: "step", title: "Qo'shimcha ma'lumot", note: "Yoki e'tiroz" },
      { id: "8.8", lane: 4, col: 7, type: "step", title: "Kafolat qismi", note: "Ombordan yoki zavoddan" },
      { id: "8.9", lane: 1, col: 8, type: "step", title: "Ta'mir va tekshiruv", note: "7.9–7.10" },
      { id: "8.L7b", lane: 0, col: 9, type: "link", to: 7, title: "Mijozga topshirish", note: "7.11 dan" },
      { id: "8.10", lane: 4, col: 9, type: "step", title: "Eski qismni saqlash", note: "Zavod muddatigacha", risk: true },
      { id: "8.11", lane: 2, col: 10, type: "step", title: "Kompensatsiya da'vosi", note: "Ish va qism" },
      { id: "8.12", lane: 5, col: 11, type: "step", title: "Tushumni nazorat", note: "Solishtirish", risk: true },
      { id: "8.E", lane: 5, col: 12, type: "end", title: "Kafolat yopildi" }
    ],
    edges: [
      ["8.1", "8.2"], ["8.2", "8.Q1"], ["8.Q1", "8.L7a", "Yo'q"], ["8.Q1", "8.4", "Ha"], ["8.4", "8.5"], ["8.5", "8.6"], ["8.6", "8.Q2"],
      ["8.Q2", "8.8", "Ha"], ["8.Q2", "8.7", "Yo'q"], ["8.7", "8.5", "", true], ["8.8", "8.9"], ["8.9", "8.L7b"], ["8.9", "8.10"],
      ["8.10", "8.11"], ["8.11", "8.12"], ["8.12", "8.E"]
    ]
  },
  {
    id: 9,
    slug: "ehtiyot-qismlar",
    title: "Ehtiyot qismlar",
    short: "Qismga talabdan berish, to'ldirish va inventarizatsiyagacha",
    owner: 22,
    goal: "Qism faqat hujjat bo'yicha beriladi, qoldiq minimaldan tushsa buyurtma avtomatik boshlanadi, har oy inventarizatsiya va o'lik qoldiq tahlili qilinadi.",
    trigger: "Servis, kafolat yoki mijozdan qismga talab.",
    result: "Talab qondirildi; qoldiq nazoratda.",
    kpi: ["Talabni ombordan darhol qondirish ulushi", "Qism kutish vaqti", "180 kundan ortiq o'lik qoldiq", "Inventarizatsiya farqi"],
    lanes: [
      { name: "Servis / mijoz", sub: "talab", roles: [15, 17] },
      { name: "Ehtiyot qismlar boshlig'i", roles: [22] },
      { name: "Omborchi", roles: [23] },
      { name: "Yetkazib beruvchi", sub: "BYD zavodi", roles: [], external: true },
      { name: "Moliya", roles: [3, 24] },
      { name: "CRM / 1C", sub: "avtomatik", roles: [30], system: true }
    ],
    nodes: [
      { id: "9.1", lane: 0, col: 0, type: "start", title: "Qismga talab", note: "Servis, kafolat, mijoz" },
      { id: "9.Q1", lane: 2, col: 1, type: "decision", title: "Omborda bormi?" },
      { id: "9.2", lane: 1, col: 2, type: "step", title: "Buyurtma", note: "Kutilgan sana servisga", risk: true },
      { id: "9.3", lane: 4, col: 3, type: "step", title: "To'lov tasdig'i", note: "Limit ichida avtomatik" },
      { id: "9.4", lane: 3, col: 4, type: "step", title: "Yetkazib berish" },
      { id: "9.5", lane: 2, col: 5, r: -1, type: "step", title: "Qabul", note: "Hujjat bilan solishtirish" },
      { id: "9.6", lane: 5, col: 6, type: "auto", title: "Kirim va joy kodi", note: "Buyurtmachiga xabar" },
      { id: "9.7", lane: 2, col: 7, type: "step", title: "Qismni berish", note: "Faqat hujjat bo'yicha", risk: true },
      { id: "9.8", lane: 5, col: 8, type: "auto", title: "Chiqim", note: "Qoldiq kamayadi" },
      { id: "9.Q2", lane: 5, col: 9, type: "decision", title: "Qoldiq minimaldan kammi?" },
      { id: "9.2b", label: "9.2", lane: 1, col: 9, type: "step", title: "Qoldiqni to'ldirish", note: "Buyurtma avtomatik boshlanadi" },
      { id: "9.E", lane: 5, col: 10, type: "end", title: "Talab qondirildi" },
      { id: "9.M", lane: 1, col: 10, type: "start", title: "Har oy oxiri" },
      { id: "9.9", lane: 1, col: 11, type: "step", title: "Inventarizatsiya", note: "Hisob va haqiqiy qoldiq" },
      { id: "9.10", lane: 1, col: 12, type: "step", title: "O'lik qoldiq tahlili", note: "180 kundan ortiq", risk: true }
    ],
    edges: [
      ["9.1", "9.Q1"], ["9.Q1", "9.2", "Yo'q"], ["9.Q1", "9.7", "Ha"], ["9.2", "9.3"], ["9.3", "9.4"], ["9.4", "9.5"], ["9.5", "9.6"],
      ["9.6", "9.7"], ["9.7", "9.8"], ["9.8", "9.Q2"], ["9.Q2", "9.2b", "Ha"], ["9.Q2", "9.E", "Yo'q"], ["9.M", "9.9"], ["9.9", "9.10"]
    ]
  },
  {
    id: 10,
    slug: "shikoyat",
    title: "Shikoyatlar bilan ishlash",
    short: "Shikoyatni qabul qilishdan oylik tahlilgacha",
    owner: 29,
    goal: "Har qanday kanaldan kelgan shikoyat 1 soatda CRMga tushadi, 24 soatda mijoz bilan bog'lanadi, 3 ish kunida sabab va yechim topiladi; oylik tahlil reglamentlarni yangilaydi.",
    trigger: "Mijoz har qanday kanal orqali shikoyat qiladi yoki past baho beradi.",
    result: "Shikoyat yopildi; jarayon yaxshilanadi.",
    kpi: ["Ro'yxatga olish ≤ 1 soat", "Birinchi aloqa ≤ 24 soat", "Yechim ≤ 3 ish kuni", "Qayta ko'rib chiqishga qaytganlar"],
    lanes: [
      { name: "Mijoz", roles: [] },
      { name: "Qabul qilgan xodim", sub: "har qanday bo'lim", roles: "all" },
      { name: "Mijozlar bilan aloqalar menejeri", roles: [29] },
      { name: "Bo'lim boshlig'i", sub: "sotuv, servis va b.", roles: [4, 14, 22, 26] },
      { name: "Bosh direktor", roles: [2] },
      { name: "CRM", sub: "avtomatik", roles: [30], system: true }
    ],
    nodes: [
      { id: "10.1", lane: 0, col: 0, type: "start", title: "Shikoyat", note: "Har qanday kanal yoki past baho" },
      { id: "10.2", lane: 1, col: 1, type: "step", title: "Ro'yxatga olish", note: "1 soat ichida CRMga", risk: true },
      { id: "10.3", lane: 5, col: 2, type: "auto", title: "Mas'ulga biriktirish", note: "Muddatlar hisoblanadi" },
      { id: "10.4", lane: 2, col: 3, type: "step", title: "Tasniflash", note: "Bo'lim, jiddiylik" },
      { id: "10.5", lane: 2, col: 4, type: "step", title: "Mijoz bilan bog'lanish", note: "24 soat ichida" },
      { id: "10.6", lane: 3, col: 5, type: "step", title: "Sabab va yechim", note: "3 ish kuni", risk: true },
      { id: "10.Q1", lane: 2, col: 6, type: "decision", title: "Boshliq vakolatidami?" },
      { id: "10.7", lane: 4, col: 6, type: "step", title: "Qaror", note: "Bosh direktor" },
      { id: "10.8", lane: 2, col: 7, type: "step", title: "Yechimni kelishish", note: "Mijoz bilan" },
      { id: "10.9", lane: 3, col: 8, type: "step", title: "Bajarish", note: "Kelishilgan muddatda" },
      { id: "10.Q2", lane: 0, col: 9, type: "decision", title: "Mijoz qoniqdimi?" },
      { id: "10.10", lane: 4, col: 9, type: "step", title: "Qayta ko'rib chiqish", note: "Bosh direktor" },
      { id: "10.11", lane: 5, col: 10, type: "auto", title: "Yopish", note: "Sabab, xarajat, muddat" },
      { id: "10.12", lane: 2, col: 11, type: "step", title: "Oylik tahlil", note: "Reglamentlar yangilanadi", risk: true },
      { id: "10.E", lane: 2, col: 12, type: "end", title: "Jarayon yaxshilanadi" }
    ],
    edges: [
      ["10.1", "10.2"], ["10.2", "10.3"], ["10.3", "10.4"], ["10.4", "10.5"], ["10.5", "10.6"], ["10.6", "10.Q1"],
      ["10.Q1", "10.8", "Ha"], ["10.Q1", "10.7", "Yo'q"], ["10.7", "10.8"], ["10.8", "10.9"], ["10.9", "10.Q2"],
      ["10.Q2", "10.11", "Ha"], ["10.Q2", "10.10", "Yo'q"], ["10.10", "10.8", "", true], ["10.11", "10.12"], ["10.12", "10.E"]
    ]
  }
];
