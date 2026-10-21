// Bilimlar bazasi bo'yicha qidiruv va javob tuzish (internetsiz ishlaydi).
(function () {
  const P = window.PROCESSES, R = window.ROLES, F = window.FAQ, D = window.DEPARTMENTS;

  const roleById = Object.fromEntries(R.map(r => [r.id, r]));
  const procById = Object.fromEntries(P.map(p => [p.id, p]));
  const nodeById = {};
  P.forEach(p => p.nodes.forEach(n => { nodeById[n.id] = { node: n, proc: p }; }));

  const STOP = new Set(("nima nimani nimaga qanday qanaqa kim kimni kimning qachon qancha necha nechta kerak bu shu u va bilan uchun men menga meni " +
    "mening siz sizga biz ham yoki agar bolsa bolib boladi bormi mi nega qaysi qayerda qayerga qilinadi qilish qilaman qilsa qiladi " +
    "kerakmi edi ekan emas yoq ha the bir har").split(" "));

  const SUFFIXES = ["larining", "laridan", "lariga", "larida", "larini", "lardan", "larga", "larda", "larni", "lari", "lar",
    "ning", "dagi", "imiz", "ingiz", "dan", "gan", "kan", "ydi", "adi", "ladi", "lash", "lik", "ish", "ni", "ga", "ka", "qa",
    "da", "mi", "si", "di", "im"];

  function norm(s) {
    return String(s).toLowerCase()
      .replace(/[‘’ʻʼ`´']/g, "")
      .replace(/[^a-z0-9а-яёқўғҳ.\s-]/g, " ")
      .replace(/-/g, " ");
  }
  const phrase = s => norm(s).replace(/[?.]/g, " ").replace(/s+/g, " ").trim();
  function stem(t) {
    for (let i = 0; i < 2; i++) {
      const s = SUFFIXES.find(x => t.length - x.length >= 3 && t.endsWith(x));
      if (!s) break;
      t = t.slice(0, -s.length);
    }
    return t;
  }
  function tokens(s) {
    return norm(s).split(/\s+/).filter(t => t && !STOP.has(t) && !/^\.+$/.test(t)).map(t => t.replace(/\.$/, "")).map(stem).filter(t => t.length > 1);
  }

  // --- Hujjatlar ---
  const docs = [];
  function add(type, ref, fields) {
    const tf = new Map();
    fields.forEach(([text, w]) => tokens(text).forEach(t => tf.set(t, (tf.get(t) || 0) + w)));
    docs.push({ type, ref, tf, phrases: type === "faq" ? [F[ref].q, ...(F[ref].alt || [])].map(phrase) : [] });
  }
  F.forEach((f, i) => add("faq", i, [[f.q, 3], [(f.alt || []).join(" "), 2.5], [f.a.replace(/\[[\d.a-z]+\]|\{r:\d+\}|\*\*/g, ""), 0.6]]));
  P.forEach(p => {
    add("process", p.id, [[p.title, 3], [p.short, 1.5], [p.goal, 1], [p.trigger, 0.6], [p.result, 0.6]]);
    p.nodes.forEach(n => {
      if (n.type === "link") return;
      const lane = p.lanes[n.lane];
      const laneRoles = Array.isArray(lane.roles) ? lane.roles.map(id => roleById[id].name).join(" ") : "";
      add("step", n.id, [[n.title, 3], [n.note || "", 1.6], [lane.name + " " + (lane.sub || ""), 1], [laneRoles, 0.5], [p.title, 0.7]]);
    });
  });
  R.forEach(r => add("role", r.id, [[r.name, 3], [r.duty, 1], [D.find(d => d.id === r.dept).name, 0.6]]));

  const df = new Map();
  docs.forEach(d => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const N = docs.length;
  const idf = t => Math.log(1 + N / (df.get(t) || 0.5));

  function matchWeight(q, t) {
    if (q === t) return 1;
    const [a, b] = q.length < t.length ? [q, t] : [t, q];
    if (a.length >= 4 && b.startsWith(a)) return 0.75;
    if (a.length >= 5 && b.startsWith(a.slice(0, 5))) return 0.5;
    return 0;
  }

  function search(query, limit = 12) {
    const qt = [...new Set(tokens(query))];
    const nq = phrase(query);
    // qadam raqami bilan so'ralsa (masalan «2.8»)
    const direct = (norm(query).match(/\b\d{1,2}\.\d{1,2}\b/g) || []).filter(id => nodeById[id]);
    if (!qt.length && !direct.length) return [];
    const results = docs.map(d => {
      let score = 0, hits = 0;
      qt.forEach(q => {
        let best = 0, bestT = null;
        d.tf.forEach((w, t) => { const m = matchWeight(q, t); if (m * w > best) { best = m * w; bestT = t; } });
        if (best > 0) { hits++; score += (Math.min(best, 4) + Math.min(best, 12) * 0.05) * idf(df.has(q) ? q : bestT); }
      });
      const coverage = qt.length ? hits / qt.length : 0;
      score *= 0.4 + coverage;
      if (d.type === "step" && direct.includes(d.ref)) score += 50;
      d.phrases.forEach(ph => {
        if (ph === nq) score += 20;
        else if (nq.length >= 6 && ph.includes(nq)) score += 6;
        else if (ph.length >= 8 && nq.includes(ph)) score += 8;
      });
      return { ...d, score, coverage };
    }).filter(r => r.score > 0.5);
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  // Savolga tuzilgan javob: { kind, faq, steps[], roles[], processes[] }
  function answer(query) {
    const res = search(query, 20);
    const faq = res.filter(r => r.type === "faq");
    const steps = res.filter(r => r.type === "step").slice(0, 5).map(r => r.ref);
    const roles = res.filter(r => r.type === "role").slice(0, 3).map(r => r.ref);
    const procs = res.filter(r => r.type === "process").slice(0, 2).map(r => r.ref);
    const top = res[0];
    const out = { query, steps, roles, processes: procs, faq: null, related: [] };
    if (!top) { out.kind = "none"; return out; }
    // «… vazifasi», «… lavozimi» yoki lavozim nomining o'zi so'ralsa — lavozim kartasi
    const role = res.find(r => r.type === "role");
    const roleIntent = /vazifa|lavozim|majburiyat/.test(norm(query));
    if (role && role.coverage >= 0.5 && (roleIntent || (role.coverage === 1 && role === top))) {
      out.kind = "role"; out.role = role.ref;
      out.related = faq.slice(0, 3).map(r => F[r.ref]);
      return out;
    }
    if (faq.length && faq[0].score >= top.score * 0.8 && faq[0].coverage >= 0.5) {
      out.kind = "faq";
      out.faq = F[faq[0].ref];
      out.related = faq.slice(1, 4).filter(r => r.score > faq[0].score * 0.45).map(r => F[r.ref]);
    } else if (top.type === "role" && top.coverage >= 0.6) {
      out.kind = "role"; out.role = top.ref;
      out.related = faq.slice(0, 3).map(r => F[r.ref]);
    } else if (top.type === "process" && top.coverage >= 0.6) {
      out.kind = "process"; out.process = top.ref;
      out.related = faq.slice(0, 3).map(r => F[r.ref]);
    } else {
      out.kind = "steps";
      out.related = faq.slice(0, 3).map(r => F[r.ref]);
    }
    return out;
  }

  // Lavozim ishtirok etadigan qadamlar
  function stepsForRole(roleId) {
    const out = [];
    P.forEach(p => p.nodes.forEach(n => {
      if (n.type === "link" || n.type === "end" || n.type === "endbad") return;
      const roles = p.lanes[n.lane].roles;
      if (roles === "all" || (Array.isArray(roles) && roles.includes(roleId))) out.push({ node: n, proc: p });
    }));
    return out;
  }

  // Claude uchun bilimlar bazasini matn ko'rinishiga keltirish
  function kbText() {
    const lines = ["# BYD avtosaloni bilimlar bazasi", "", "## Lavozimlar"];
    D.forEach(d => {
      lines.push(`### ${d.name}`);
      d.roles.forEach(id => {
        const r = roleById[id];
        lines.push(`- #${r.id} ${r.name}: ${r.duty} Kimga bo'ysunadi: ${r.bossNote || (r.boss ? roleById[r.boss].name : "—")}.`);
      });
    });
    lines.push("", "## Jarayonlar (reglamentlar)");
    P.forEach(p => {
      lines.push(`### ${p.id}-jarayon. ${p.title}`, `Maqsad: ${p.goal}`, `Boshlanishi: ${p.trigger}`, `Natija: ${p.result}`, `KPI: ${p.kpi.join("; ")}`, "Qadamlar:");
      p.nodes.forEach(n => {
        const lane = p.lanes[n.lane].name;
        const label = n.label || n.id;
        const outs = p.edges.filter(e => e[0] === n.id).map(e => `${e[2] ? e[2] + " → " : "→ "}${(nodeById[e[1]].node.label || e[1])}`).join(", ");
        const kind = n.type === "decision" ? "Qaror" : n.type === "link" ? `O'tish: ${n.to}-jarayon` : n.type === "auto" ? "CRM avtomatik" : "";
        lines.push(`- [${label}] ${kind ? kind + ": " : ""}${n.title}${n.note ? " (" + n.note + ")" : ""}. Mas'ul: ${lane}.${n.risk ? " Nazorat nuqtasi." : ""}${outs ? " Keyingi: " + outs : ""}`);
      });
    });
    lines.push("", "## Tez-tez beriladigan savollar");
    F.forEach(f => lines.push(`- S: ${f.q}`, `  J: ${f.a.replace(/\{r:(\d+)\}/g, (_, id) => "(" + roleById[id].name + ")").replace(/\*\*/g, "")}`));
    return lines.join("\n");
  }

  window.KB = { search, answer, stepsForRole, kbText, roleById, procById, nodeById, tokens };
})();
