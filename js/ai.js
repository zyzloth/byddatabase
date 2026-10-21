// Claude orqali javob (ixtiyoriy). API kalit faqat shu brauzerda (localStorage) saqlanadi.
(function () {
  const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.39.0/+esm";
  const MODEL = "claude-opus-5-5";
  const KEY = "byd-kb-api-key";

  const SYSTEM = `Siz BYD avtosalonining ichki bilimlar bazasi yordamchisisiz. Xodimlarning savollariga faqat o'zbek tilida (lotin yozuvida), qisqa va aniq javob bering.
Qoidalar:
- Faqat quyidagi bilimlar bazasidagi ma'lumotlarga tayaning. Bazada javob bo'lmasa, buni ochiq ayting va kimga murojaat qilish kerakligini (mas'ul lavozimni) ko'rsating.
- Qadamlarga havola berishda raqamni kvadrat qavsda yozing, masalan [2.8] yoki [7.4]. Sayt ularni avtomatik havolaga aylantiradi.
- Muddatlar, mas'ul lavozim va nazorat nuqtalarini **qalin** qilib ajrating.
- Javob 3–8 jumladan oshmasin; kerak bo'lsa qisqa ro'yxat ishlating.`;

  let sdk = null;
  const getKey = () => { try { return localStorage.getItem(KEY) || ""; } catch { return ""; } };
  const setKey = k => { try { k ? localStorage.setItem(KEY, k) : localStorage.removeItem(KEY); } catch {} };

  async function ask(history, onText) {
    const apiKey = getKey();
    if (!apiKey) throw new Error("API kalit kiritilmagan");
    if (!sdk) sdk = (await import(SDK_URL)).default;
    const client = new sdk({ apiKey, dangerouslyAllowBrowser: true });
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 4000,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        { type: "text", text: SYSTEM },
        { type: "text", text: window.KB.kbText(), cache_control: { type: "ephemeral" } }
      ],
      messages: history
    });
    stream.on("text", t => onText(t));
    const msg = await stream.finalMessage();
    if (msg.stop_reason === "refusal") throw new Error("Claude bu savolga javob bermadi.");
    return msg.content.filter(b => b.type === "text").map(b => b.text).join("");
  }

  window.AI = { ask, getKey, setKey, MODEL };
})();
