# BYD Bilimlar bazasi

BYD avtosaloni xodimlari uchun ichki portal: 10 ta reglament (swimlane diagrammalar), 34 lavozimli tuzilma va savol-javob.

## Ishga tushirish

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

So'ng brauzerda http://localhost:8080 ni oching. Build yoki o'rnatish kerak emas.

## Tuzilishi

- `js/data/processes.js` — 10 ta jarayon: yo'laklar, qadamlar, bog'lanishlar
- `js/data/roles.js` — bo'limlar, lavozimlar
- `js/data/faq.js` — tayyor savol-javoblar
- `js/search.js` — internetsiz qidiruv va javob tuzish
- `js/diagram.js` — diagrammalarni ma'lumotdan chizish
- `js/ai.js` — ixtiyoriy Claude AI rejimi (API kalit brauzerda saqlanadi)
- `js/app.js` — sahifalar va marshrutlash
