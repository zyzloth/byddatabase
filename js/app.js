// Ilova: marshrutlash va sahifalar.
(function () {
  const P = window.PROCESSES, R = window.ROLES, D = window.DEPARTMENTS, F = window.FAQ;
  const { roleById, procById, nodeById } = window.KB;
  const app = document.getElementById("app");

  // ---------- yordamchilar ----------
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const stepHref = id => { const x = nodeById[id]; return x ? `#/jarayon/${x.proc.id}?qadam=${encodeURIComponent(id)}` : "#/jarayonlar"; };
  const stepLabel = id => {
    const n = nodeById[id]?.node;
    if (!n) return id;
    if (n.label) return n.label;
    if (n.type === "decision") return id.split(".")[1];
    if (n.type === "link") return `→ ${n.to}-jar.`;
    if (/\.(E|M)$/.test(id)) return "•";
    return id;
  };
  const roleLink = id => `<a class="role-link" href="#/lavozim/${id}">${esc(roleById[id].name)}</a>`;

  // **qalin**, [2.8] → qadam havolasi, {r:4} → lavozim havolasi
  function md(text) {
    let h = esc(text)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/\{r:(\d+)\}/g, (_, id) => roleById[id] ? roleLink(+id) : "")
      .replace(/\[(\d{1,2}\.(?:\d{1,2}|Q\d)[a-z]?)\]/g, (m, id) => nodeById[id] ? `<a class="step-chip" href="${stepHref(id)}">${esc(stepLabel(id))}</a>` : m);
    h = h.split(/\n{2,}/).map(par => {
      const lines = par.split("\n");
      if (lines.every(l => /^\s*[-•]\s+/.test(l))) return "<ul>" + lines.map(l => "<li>" + l.replace(/^\s*[-•]\s+/, "") + "</li>").join("") + "</ul>";
      return "<p>" + lines.join("<br>") + "</p>";
    }).join("");
    return h;
  }
  const laneRoles = lane => lane.roles === "all" ? [] : lane.roles;
  const stepCount = p => p.nodes.filter(n => !["link", "end", "endbad", "start"].includes(n.type)).length;
  const riskCount = p => p.nodes.filter(n => n.risk).length;

  const ICONS = {
    crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
    car: '<path d="M5 16h14M3 16v-3l2-5h14l2 5v3"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    coins: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    megaphone: '<path d="M3 10v4h4l8 5V5L7 10z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3 2.2 3.5 5"/>',
    heart: '<path d="M12 20s-8-4.6-8-10a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.4-8 10-8 10z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    building: '<path d="M4 21V5l8-2v18M12 8h8v13M4 21h16M7.5 8h1.5M7.5 12h1.5M7.5 16h1.5M15.5 12h1.5M15.5 16h1.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
    flow: '<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><rect x="9" y="15" width="6" height="5" rx="1"/><path d="M9 6.5h6M18 9v3H12v3"/>',
    org: '<rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/><path d="M12 7v5M6 17v-5h12v5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>'
  };
  const icon = (n, cls = "ico") => `<svg viewBox="0 0 24 24" class="${cls}">${ICONS[n] || ""}</svg>`;

  // ---------- holat ----------
  let myRole = store.get("byd-kb-role", null);
  if (myRole && !roleById[myRole]) myRole = null;

  function setMyRole(id) {
    myRole = id; store.set("byd-kb-role", id);
    document.getElementById("rolePillText").textContent = id ? roleById[id].name : "Lavozimni tanlang";
    document.getElementById("rolePill").classList.toggle("set", !!id);
    router();
  }

  // ---------- drawer ----------
  const drawer = document.getElementById("drawer"), scrim = document.getElementById("scrim");
  function openDrawer(title, body) {
    document.getElementById("drawerTitle").innerHTML = title;
    document.getElementById("drawerBody").innerHTML = body;
    drawer.classList.add("open"); scrim.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    document.getElementById("drawerBody").scrollTop = 0;
  }
  function closeDrawer() {
    drawer.classList.remove("open"); scrim.classList.remove("open"); drawer.setAttribute("aria-hidden", "true");
    app.querySelectorAll(".sw-node.sel").forEach(n => n.classList.remove("sel"));
  }
  document.getElementById("drawerClose").onclick = closeDrawer;
  scrim.onclick = closeDrawer;
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
  drawer.addEventListener("click", e => { if (e.target.closest("a")) closeDrawer(); });

  function stepDetail(id) {
    const { node: n, proc: p } = nodeById[id];
    const lane = p.lanes[n.lane];
    const ins = p.edges.filter(e => e[1] === id), outs = p.edges.filter(e => e[0] === id);
    const typeName = { start: "Boshlanish", step: "Qadam", auto: "CRM avtomatik", decision: "Qaror nuqtasi", end: "Yakun", endbad: "Yakun (yo'qotish)", link: "Boshqa jarayonga o'tish" }[n.type];
    const relFaq = F.filter(f => f.a.includes("[" + id + "]"));
    const edgeItem = (other, label) => `<li><a href="${stepHref(other)}" class="step-chip">${esc(stepLabel(other))}</a> ${esc(nodeById[other].node.title)}${label ? ` <span class="tag">${esc(label)}</span>` : ""}</li>`;
    let body = `<div class="kv">
      <div><span>Jarayon</span><a href="#/jarayon/${p.id}">${p.id}. ${esc(p.title)}</a></div>
      <div><span>Turi</span>${typeName}</div>
      <div><span>Mas'ul</span><b>${esc(lane.name)}</b>${lane.sub ? ` <span class="muted">(${esc(lane.sub)})</span>` : ""}
        ${laneRoles(lane).length ? `<div class="role-links">${laneRoles(lane).map(roleLink).join("")}</div>` : lane.roles === "all" ? `<div class="muted small">Shikoyatni qabul qilgan har qanday xodim</div>` : ""}</div>
      ${n.note ? `<div><span>Muddat / qoida</span><b>${esc(n.note)}</b></div>` : ""}
    </div>`;
    if (n.risk) body += `<div class="callout risk"><b>Nazorat nuqtasi.</b> Bu qadamdagi muddat yoki qoida buzilsa, pul, vaqt yoki mijoz yo'qotiladi. Rahbar bu ko'rsatkichni CRM orqali kuzatadi.</div>`;
    if (n.type === "link") body += `<a class="btn wide" href="#/jarayon/${n.to}">${n.to}-jarayonga o'tish: ${esc(procById[n.to].title)} ${icon("arrow")}</a>`;
    if (ins.length) body += `<h4>Oldingi qadam</h4><ul class="plain">${ins.map(e => edgeItem(e[0], e[2])).join("")}</ul>`;
    if (outs.length) body += `<h4>Keyingi qadam</h4><ul class="plain">${outs.map(e => edgeItem(e[1], e[2])).join("")}</ul>`;
    if (relFaq.length) body += `<h4>Bog'liq savollar</h4>${relFaq.map(f => `<details class="faq"><summary>${esc(f.q)}</summary>${md(f.a)}</details>`).join("")}`;
    openDrawer(`<span class="mono">${esc(n.type === "link" ? "→" : stepLabel(id))}</span> ${esc(n.title)}`, body);
  }

  // ---------- sahifalar ----------
  function viewHome() {
    const suggestions = [0, 6, 23, 34].map(i => F[i].q);
    return `
    <section class="hero full">
      <div class="hero-inner">
        <div class="eyebrow light">BYD avtosaloni · bilimlar bazasi</div>
        <h1>Ish bo'yicha har qanday savolga javob</h1>
        <p>Savolingizni oddiy so'z bilan yozing: kim, qachon, qancha muddatda.</p>
        <form class="ask" id="heroAsk">
          ${icon("search")}
          <input name="q" placeholder="Masalan: chegirmani kim tasdiqlaydi?" autocomplete="off" aria-label="Savol">
          <button class="btn accent" type="submit">So'rash</button>
        </form>
        <div class="chips hero-chips">${suggestions.map(q => `<a class="chip" href="#/yordamchi?q=${encodeURIComponent(q)}">${esc(q)}</a>`).join("")}</div>
      </div>
    </section>`;
  }

  // Tanlangan lavozim bo'yicha «Sizning vazifalaringiz» bloki (Tuzilma sahifasida)
  function mineBlock() {
    let mine = "";
    if (myRole) {
      const steps = window.KB.stepsForRole(myRole);
      const byProc = {};
      steps.forEach(s => (byProc[s.proc.id] = byProc[s.proc.id] || []).push(s.node));
      mine = `<section class="card mine">
        <div class="card-head"><div><div class="eyebrow">Sizning vazifalaringiz</div><h2>${esc(roleById[myRole].name)}</h2></div>
        <a href="#/lavozim/${myRole}" class="btn ghost sm">Lavozim sahifasi ${icon("arrow")}</a></div>
        <p class="muted">${esc(roleById[myRole].duty)}</p>
        ${steps.length ? `<div class="mine-grid">${Object.entries(byProc).map(([pid, nodes]) => `
          <div class="mine-proc"><a href="#/jarayon/${pid}" class="mine-title">${pid}. ${esc(procById[pid].title)}</a>
          <div class="chips">${nodes.map(n => `<a class="step-pill ${n.risk ? "risk" : ""}" href="${stepHref(n.id)}"><span class="mono">${esc(stepLabel(n.id))}</span>${esc(n.title)}</a>`).join("")}</div></div>`).join("")}</div>`
        : `<p class="muted">Bu lavozim reglament diagrammalarida alohida yo'lak sifatida ko'rsatilmagan. Vazifalar lavozim yo'riqnomasida.</p>`}
      </section>`;
    }
    return mine || `<section class="card role-cta"><div>${icon("users", "ico lg")}</div><div><h3>Lavozimingizni tanlang</h3><p class="muted">Sizga tegishli qadamlar va muddatlar shu yerda va diagrammalarda ajratib ko'rsatiladi.</p></div><button class="btn" id="pickRole">Lavozimni tanlash</button></section>`;
  }

  function procGrid() {
    return `<div class="proc-grid">${P.map(p => `
      <a class="proc-card" href="#/jarayon/${p.id}">
        <div class="proc-num">${String(p.id).padStart(2, "0")}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.short)}</p>
        <div class="proc-meta"><span>${stepCount(p)} qadam</span><span class="risk-dot">${riskCount(p)} nazorat</span>
        ${myRole && p.lanes.some(l => l.roles === "all" || (Array.isArray(l.roles) && l.roles.includes(myRole))) ? `<span class="me">siz ishtirok etasiz</span>` : ""}</div>
      </a>`).join("")}</div>`;
  }

  function viewProcesses() {
    return `<div class="wrap">
      <div class="page-head"><div class="eyebrow">Reglamentlar</div><h1>Biznes-jarayonlar</h1>
      <p class="muted">Har bir jarayon swimlane diagrammasi ko'rinishida: yo'laklar — mas'ul lavozimlar, bloklar — qadamlar. Istalgan blokni bosing — muddat, mas'ul va keyingi qadam chiqadi.</p></div>
      ${legend()}
      ${procGrid()}
    </div>`;
  }

  function legend() {
    return `<div class="legend">
      <span><i class="lg-start"></i>Boshlanish / yakun</span>
      <span><i class="lg-step"></i>Qadam</span>
      <span><i class="lg-auto"></i>CRM avtomatik</span>
      <span><i class="lg-dec"></i>Qaror</span>
      <span><i class="lg-link"></i>Boshqa jarayon</span>
      <span><i class="lg-risk">!</i>Nazorat nuqtasi</span>
      <span><i class="lg-dash"></i>Qaytish</span>
    </div>`;
  }

  function viewProcess(id, params) {
    const p = procById[id];
    if (!p) return notFound();
    const owner = roleById[p.owner];
    const involved = [...new Set(p.lanes.flatMap(laneRoles))];
    const highlight = params.get("men") === "1" && myRole;
    const rows = p.nodes.filter(n => n.type !== "link").map(n => {
      const lane = p.lanes[n.lane];
      const outs = p.edges.filter(e => e[0] === n.id).map(e => `${e[2] ? `<span class="tag">${esc(e[2])}</span>` : ""}<a class="step-chip" href="${stepHref(e[1])}">${esc(stepLabel(e[1]))}</a>`).join(" ");
      const mine = myRole && (lane.roles === "all" || (Array.isArray(lane.roles) && lane.roles.includes(myRole)));
      return `<tr class="${mine ? "mine-row" : ""}" data-id="${n.id}">
        <td class="mono">${esc(stepLabel(n.id))}</td>
        <td><b>${esc(n.title)}</b>${n.risk ? ` <span class="risk-badge">nazorat</span>` : ""}${n.type === "auto" ? ` <span class="tag">avtomatik</span>` : ""}</td>
        <td>${esc(lane.name)}</td>
        <td>${esc(n.note || "")}</td>
        <td class="nowrap">${outs}</td></tr>`;
    }).join("");
    const prev = procById[id - 1], next = procById[id + 1];
    return `<div class="wrap">
      <div class="crumbs"><a href="#/jarayonlar">Reglamentlar</a> / ${p.id}-jarayon</div>
      <div class="page-head row">
        <div><div class="eyebrow">${p.id}-jarayon</div><h1>${esc(p.title)}</h1><p class="muted">${esc(p.short)}</p></div>
      </div>
      <div class="info-grid">
        <div class="card"><h4>Maqsad</h4><p>${esc(p.goal)}</p></div>
        <div class="card"><h4>Qachon boshlanadi</h4><p>${esc(p.trigger)}</p><h4>Natija</h4><p>${esc(p.result)}</p></div>
        <div class="card"><h4>Jarayon egasi</h4><p>${roleLink(p.owner)}</p><h4>KPI</h4><ul class="kpi">${p.kpi.map(k => `<li>${esc(k)}</li>`).join("")}</ul></div>
      </div>
      <div class="diagram-bar">
        ${legend()}
        ${myRole ? `<a class="btn sm ${highlight ? "" : "ghost"}" href="#/jarayon/${p.id}${highlight ? "" : "?men=1"}">${highlight ? "Hammasini ko'rsatish" : "Faqat mening qadamlarim"}</a>` : ""}
      </div>
      <div class="diagram-scroll" id="diagram"></div>
      <p class="hint muted small">Diagrammani yon tomonga suring. Blokni bosing — tafsilotlar ochiladi.</p>

      <div class="section-head"><h2>Qadamma-qadam reglament</h2></div>
      <div class="table-wrap"><table class="steps">
        <thead><tr><th>№</th><th>Qadam</th><th>Mas'ul</th><th>Muddat / qoida</th><th>Keyingi</th></tr></thead>
        <tbody>${rows}</tbody></table></div>

      <div class="section-head"><h2>Ishtirokchi lavozimlar</h2></div>
      <div class="chips">${involved.map(r => `<a class="chip ${r === myRole ? "on" : ""}" href="#/lavozim/${r}">${esc(roleById[r].name)}</a>`).join("")}</div>

      <div class="pager">
        ${prev ? `<a href="#/jarayon/${prev.id}" class="pager-a"><span>← Oldingi</span><b>${prev.id}. ${esc(prev.title)}</b></a>` : "<span></span>"}
        ${next ? `<a href="#/jarayon/${next.id}" class="pager-a right"><span>Keyingi →</span><b>${next.id}. ${esc(next.title)}</b></a>` : ""}
      </div>
    </div>`;
  }

  function mountProcess(id, params) {
    const p = procById[id]; if (!p) return;
    const el = document.getElementById("diagram");
    const sel = params.get("qadam");
    const draw = selected => window.Diagram.render(p, el, {
      highlightRole: params.get("men") === "1" ? myRole : null,
      selected,
      onNodeClick: nid => { draw(nid); stepDetail(nid); }
    });
    draw(sel);
    app.querySelectorAll("tr[data-id]").forEach(tr => tr.addEventListener("click", e => {
      if (e.target.closest("a")) return;
      draw(tr.dataset.id); stepDetail(tr.dataset.id);
    }));
    if (sel && nodeById[sel]) {
      el.scrollIntoView({ block: "center" });
      stepDetail(sel);
    }
  }

  function viewStructure() {
    const deptCard = d => `
      <div class="dept">
        <div class="dept-head">${icon(d.icon)}<b>${esc(d.name)}</b><span class="muted">${d.roles.length}</span></div>
        ${d.roles.map(id => {
          const r = roleById[id];
          const depth = r.boss && roleById[r.boss].dept === d.id ? (roleById[roleById[r.boss].boss]?.dept === d.id ? 2 : 1) : 0;
          return `<a class="role-row d${depth} ${id === myRole ? "on" : ""}" href="#/lavozim/${id}">
            <span class="mono num">${id}</span><span class="rn">${esc(r.name)}</span></a>`;
        }).join("")}
      </div>`;
    const top = D[0];
    return `<div class="wrap">
      <div class="page-head"><div class="eyebrow">Tuzilma</div><h1>Tashkiliy tuzilma</h1>
      <p class="muted">Lavozimlar daraja bo'yicha emas, bo'lim bo'yicha guruhlangan — bu org-sxema va RACI matritsasi uchun asos. Kichik avtosalonda vazifani mavjud xodim qo'shimcha bajarishi mumkin, lekin mas'ul shaxs aniq belgilanishi shart.</p></div>
      <div class="mine-wrap">${mineBlock()}</div>
      <div class="org">
        <a class="org-top" href="#/lavozim/1"><span class="eyebrow">Egasi</span><b>${esc(roleById[1].name)}</b></a>
        <div class="org-line"></div>
        <a class="org-top dark" href="#/lavozim/2"><span class="eyebrow light">Kundalik boshqaruv</span><b>${esc(roleById[2].name)}</b><span class="small">Barcha bo'lim boshliqlari unga bo'ysunadi</span></a>
        <div class="org-line"></div>
      </div>
      <div class="dept-grid">${D.filter(d => d.id !== "rahbariyat").map(deptCard).join("")}${deptCard({ ...top, name: "Moliya rahbariyati", roles: [3] })}</div>
    </div>`;
  }

  function viewRole(id) {
    const r = roleById[id];
    if (!r) return notFound();
    const d = D.find(x => x.id === r.dept);
    const chain = []; let b = r.boss;
    while (b) { chain.unshift(b); b = roleById[b].boss; }
    const subs = R.filter(x => x.boss === id && !(id === 2 && x.bossNote && false));
    const steps = window.KB.stepsForRole(id);
    const byProc = {};
    steps.forEach(s => (byProc[s.proc.id] = byProc[s.proc.id] || []).push(s.node));
    const faqs = F.filter(f => (f.roles || []).includes(id));
    return `<div class="wrap">
      <div class="crumbs"><a href="#/tuzilma">Tuzilma</a> / ${esc(d.name)}</div>
      <div class="page-head row">
        <div><div class="eyebrow">${icon(d.icon, "ico sm")} ${esc(d.name)} · №${r.id}</div>
          <h1>${esc(r.name)}</h1></div>
        <button class="btn ${id === myRole ? "" : "ghost"}" id="setMine">${id === myRole ? "✓ Bu mening lavozimim" : "Bu mening lavozimim"}</button>
      </div>
      <div class="info-grid two">
        <div class="card"><h4>Asosiy vazifasi</h4><p class="lead">${esc(r.duty)}</p></div>
        <div class="card"><h4>Bo'ysunish</h4>
          <div class="chain">${chain.map(c => `<a href="#/lavozim/${c}">${esc(roleById[c].name)}</a>`).join("<span>→</span>")}${chain.length ? "<span>→</span>" : ""}<b>${esc(r.name)}</b></div>
          ${r.bossNote ? `<p class="muted small">${esc(r.bossNote)}</p>` : ""}
          ${subs.length ? `<h4>Unga bo'ysunadi</h4><div class="chips">${subs.map(s => `<a class="chip" href="#/lavozim/${s.id}">${esc(s.name)}</a>`).join("")}</div>` : ""}
        </div>
      </div>
      <div class="section-head"><h2>Reglamentlardagi qadamlar</h2><span class="muted">${steps.length} ta</span></div>
      ${steps.length ? `<div class="mine-grid">${Object.entries(byProc).map(([pid, nodes]) => `
        <div class="mine-proc card"><a href="#/jarayon/${pid}?men=1" class="mine-title">${pid}. ${esc(procById[pid].title)}</a>
        <ul class="step-list">${nodes.map(n => `<li><a href="${stepHref(n.id)}"><span class="mono">${esc(stepLabel(n.id))}</span><span><b>${esc(n.title)}</b>${n.note ? `<em>${esc(n.note)}</em>` : ""}</span>${n.risk ? `<span class="risk-badge">nazorat</span>` : ""}</a></li>`).join("")}</ul></div>`).join("")}</div>`
      : `<p class="muted card">Bu lavozim reglament diagrammalarida alohida yo'lak sifatida ko'rsatilmagan.</p>`}
      ${faqs.length ? `<div class="section-head"><h2>Ko'p beriladigan savollar</h2></div>${faqs.map(f => `<details class="faq card"><summary>${esc(f.q)}</summary>${md(f.a)}</details>`).join("")}` : ""}
    </div>`;
  }

  // ---------- Savol-javob ----------
  const chat = { mode: store.get("byd-kb-mode", "kb"), messages: [] };

  function viewAssistant() {
    const hasKey = !!window.AI.getKey();
    return `<div class="wrap chat-wrap">
      <div class="page-head row">
        <div><div class="eyebrow">Savol-javob</div><h1>Bilimlar bazasidan so'rang</h1></div>
        <div class="seg" role="tablist">
          <button class="${chat.mode === "kb" ? "on" : ""}" data-mode="kb">${icon("search", "ico sm")} Bilimlar bazasi</button>
          <button class="${chat.mode === "ai" ? "on" : ""}" data-mode="ai">${icon("sparkle", "ico sm")} Claude AI</button>
        </div>
      </div>
      ${chat.mode === "ai" ? `<div class="card ai-key ${hasKey ? "ok" : ""}">
        ${hasKey ? `<span>Claude ulangan (model: <code>${window.AI.MODEL}</code>). Kalit faqat shu brauzerda saqlanadi.</span><button class="btn ghost sm" id="keyClear">Kalitni o'chirish</button>`
        : `<div><b>Claude API kaliti</b><p class="muted small">Claude bilimlar bazasini o'qib, erkin savollarga javob beradi. Kalit faqat shu brauzerda saqlanadi va to'g'ridan-to'g'ri Anthropic API ga yuboriladi.</p></div>
           <form id="keyForm" class="key-form"><input type="password" class="input" name="k" placeholder="sk-ant-…" autocomplete="off"><button class="btn">Saqlash</button></form>`}
      </div>` : ""}
      <div class="chat" id="chat">${chat.messages.length ? chat.messages.map(renderMsg).join("") : chatEmpty()}</div>
      <form class="ask chat-input" id="chatForm">
        <input name="q" placeholder="Savolingizni yozing…" autocomplete="off" aria-label="Savol">
        <button class="btn accent" type="submit" aria-label="Yuborish">${icon("send")}</button>
      </form>
    </div>`;
  }

  function chatEmpty() {
    const groups = [
      ["Sotuv", [0, 6, 9, 7]], ["Servis va kafolat", [23, 27, 29, 31]], ["Umumiy", [34, 37, 38, 18]]
    ];
    return `<div class="chat-empty">
      ${icon("chat", "ico xl")}
      <h3>Nima haqida bilmoqchisiz?</h3>
      <p class="muted">Muddat, mas'ul lavozim, keyingi qadam yoki qoida haqida so'rang. Masalan:</p>
      <div class="sugg">${groups.map(([t, ids]) => `<div><div class="eyebrow">${t}</div>${ids.map(i => F[i] ? `<button class="chip q" data-q="${esc(F[i].q)}">${esc(F[i].q)}</button>` : "").join("")}</div>`).join("")}</div>
    </div>`;
  }

  function renderMsg(m) {
    if (m.role === "user") return `<div class="msg user"><div class="bubble">${esc(m.text)}</div></div>`;
    return `<div class="msg bot"><div class="avatar">${m.ai ? icon("sparkle", "ico sm") : "B"}</div><div class="bubble">${m.html}</div></div>`;
  }

  function kbAnswerHtml(q) {
    const a = window.KB.answer(q);
    const stepCards = ids => `<div class="ans-steps">${ids.map(id => {
      const { node: n, proc: p } = nodeById[id];
      return `<a class="ans-step" href="${stepHref(id)}"><span class="mono">${esc(stepLabel(id))}</span>
        <span><b>${esc(n.title)}</b><em>${esc(p.lanes[n.lane].name)}${n.note ? " · " + esc(n.note) : ""}</em><small>${p.id}. ${esc(p.title)}</small></span></a>`;
    }).join("")}</div>`;
    const related = a.related.length ? `<div class="ans-related"><div class="eyebrow">O'xshash savollar</div>${a.related.map(f => `<button class="chip q" data-q="${esc(f.q)}">${esc(f.q)}</button>`).join("")}</div>` : "";
    if (a.kind === "faq") {
      const refs = [...a.faq.a.matchAll(/\[(\d{1,2}\.\d{1,2}[a-z]?)\]/g)].map(m => m[1]).filter((v, i, s) => s.indexOf(v) === i && nodeById[v]).slice(0, 4);
      return `<div class="ans-q">${esc(a.faq.q)}</div>${md(a.faq.a)}
        ${a.faq.roles?.length ? `<div class="ans-roles"><span class="muted small">Mas'ullar:</span> ${a.faq.roles.map(roleLink).join("")}</div>` : ""}
        ${refs.length ? `<div class="eyebrow">Reglamentdagi qadamlar</div>${stepCards(refs)}` : ""}${related}`;
    }
    if (a.kind === "role") {
      const r = roleById[a.role];
      const n = window.KB.stepsForRole(r.id).length;
      return `<p><b>${esc(r.name)}</b> — ${esc(r.duty)}</p>
        <p class="muted">Kimga bo'ysunadi: ${r.bossNote ? esc(r.bossNote) : r.boss ? roleLink(r.boss) : "—"}. Reglamentlarda ${n} ta qadamda ishtirok etadi.</p>
        <a class="btn sm" href="#/lavozim/${r.id}">Lavozim sahifasi ${icon("arrow")}</a>${related}`;
    }
    if (a.kind === "process") {
      const p = procById[a.process];
      return `<p><b>${p.id}-jarayon. ${esc(p.title)}</b></p><p>${esc(p.goal)}</p>
        <p class="muted small">Boshlanishi: ${esc(p.trigger)}<br>Natija: ${esc(p.result)}</p>
        <a class="btn sm" href="#/jarayon/${p.id}">Diagrammani ochish ${icon("arrow")}</a>${related}`;
    }
    if (a.kind === "steps" && a.steps.length) {
      return `<p>Aniq tayyor javob topilmadi, lekin reglamentlarda quyidagi qadamlar savolingizga mos keladi:</p>${stepCards(a.steps)}${related}
        <p class="muted small">Erkin savollar uchun yuqoridagi <b>Claude AI</b> rejimini yoqing.</p>`;
    }
    return `<p>Bu savol bo'yicha bilimlar bazasida ma'lumot topilmadi.</p>
      <p class="muted">Savolni boshqacha yozib ko'ring (masalan, jarayon yoki lavozim nomi bilan), «Reglamentlar» bo'limini oching yoki <b>Claude AI</b> rejimini yoqing.</p>${related}`;
  }

  async function sendQuestion(q) {
    q = q.trim(); if (!q) return;
    const box = document.getElementById("chat");
    if (!chat.messages.length) box.innerHTML = "";
    chat.messages.push({ role: "user", text: q });
    box.insertAdjacentHTML("beforeend", renderMsg(chat.messages.at(-1)));

    if (chat.mode === "ai" && window.AI.getKey()) {
      const m = { role: "bot", ai: true, html: `<span class="typing"><i></i><i></i><i></i></span>`, raw: "" };
      chat.messages.push(m);
      box.insertAdjacentHTML("beforeend", renderMsg(m));
      const bubble = box.lastElementChild.querySelector(".bubble");
      box.lastElementChild.scrollIntoView({ block: "end", behavior: "smooth" });
      const history = chat.messages.slice(0, -1).filter(x => x.role === "user" || x.ai).map(x => ({ role: x.role === "user" ? "user" : "assistant", content: x.role === "user" ? x.text : x.raw }))
        .filter(x => x.content);
      try {
        await window.AI.ask(history, t => { m.raw += t; m.html = md(m.raw); bubble.innerHTML = m.html; });
        m.html = md(m.raw) + `<div class="ai-note">${icon("sparkle", "ico sm")} Claude javobi · reglamentlar asosida</div>`;
      } catch (e) {
        m.raw = "";
        m.html = `<div class="callout risk"><b>Claude bilan bog'lanib bo'lmadi:</b> ${esc(e.message || e)}</div><p class="muted small">Quyida bilimlar bazasidagi javob:</p>` + kbAnswerHtml(q);
      }
      bubble.innerHTML = m.html;
    } else {
      const m = { role: "bot", html: kbAnswerHtml(q) };
      chat.messages.push(m);
      box.insertAdjacentHTML("beforeend", renderMsg(m));
    }
    box.lastElementChild.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function mountAssistant(params) {
    const form = document.getElementById("chatForm");
    const input = form.q;
    form.onsubmit = e => { e.preventDefault(); const q = input.value; input.value = ""; sendQuestion(q); };
    app.querySelectorAll(".seg button").forEach(b => b.onclick = () => { chat.mode = b.dataset.mode; store.set("byd-kb-mode", chat.mode); render(); });
    const kf = document.getElementById("keyForm");
    if (kf) kf.onsubmit = e => { e.preventDefault(); const k = kf.k.value.trim(); if (k) { window.AI.setKey(k); render(); } };
    const kc = document.getElementById("keyClear");
    if (kc) kc.onclick = () => { window.AI.setKey(""); render(); };
    const q = params.get("q");
    if (q) { history.replaceState(null, "", "#/yordamchi"); sendQuestion(q); }
    else if (window.innerWidth > 700) input.focus();
  }
  app.addEventListener("click", e => {
    const b = e.target.closest("button.q");
    if (!b) return;
    if (location.hash.startsWith("#/yordamchi")) sendQuestion(b.dataset.q);
    else location.hash = "#/yordamchi?q=" + encodeURIComponent(b.dataset.q);
  });

  function notFound() {
    return `<div class="wrap"><div class="page-head"><h1>Sahifa topilmadi</h1><p><a href="#/">Bosh sahifaga qaytish</a></p></div></div>`;
  }

  // ---------- rol tanlash ----------
  const dlg = document.getElementById("roleDialog");
  function drawRoleList(filter = "") {
    const f = filter.toLowerCase().replace(/['‘’ʻ]/g, "");
    document.getElementById("roleList").innerHTML = D.map(d => {
      const rs = d.roles.filter(id => !f || roleById[id].name.toLowerCase().replace(/['‘’ʻ]/g, "").includes(f));
      if (!rs.length) return "";
      return `<div class="rl-group"><div class="eyebrow">${esc(d.name)}</div>${rs.map(id => `<button type="button" class="rl ${id === myRole ? "on" : ""}" data-role="${id}">${esc(roleById[id].name)}</button>`).join("")}</div>`;
    }).join("");
  }
  function openRoleDialog() { drawRoleList(); document.getElementById("roleFilter").value = ""; dlg.showModal(); }
  document.getElementById("rolePill").onclick = openRoleDialog;
  document.getElementById("roleFilter").oninput = e => drawRoleList(e.target.value);
  document.getElementById("roleList").onclick = e => { const b = e.target.closest("[data-role]"); if (b) { dlg.close(); setMyRole(+b.dataset.role); } };
  document.getElementById("roleClear").onclick = () => setMyRole(null);

  // ---------- mavzu, menyu ----------
  const root = document.documentElement;
  const theme = store.get("byd-kb-theme", null);
  if (theme) root.dataset.theme = theme;
  document.getElementById("themeBtn").onclick = () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    store.set("byd-kb-theme", root.dataset.theme);
  };
  document.getElementById("menuBtn").onclick = () => document.getElementById("nav").classList.toggle("open");

  // ---------- marshrutlash ----------
  let lastPath = "";
  function render() {
    const raw = location.hash.slice(1) || "/";
    const [path, qs] = raw.split("?");
    const params = new URLSearchParams(qs || "");
    const parts = path.split("/").filter(Boolean);
    let html, mount = null, nav = "home";
    switch (parts[0]) {
      case undefined: html = viewHome(); mount = () => {
        document.getElementById("heroAsk").onsubmit = e => { e.preventDefault(); const q = e.target.q.value.trim(); if (q) location.hash = "#/yordamchi?q=" + encodeURIComponent(q); };
      }; break;
      case "jarayonlar": html = viewProcesses(); nav = "jarayon"; break;
      case "jarayon": html = viewProcess(+parts[1], params); mount = () => mountProcess(+parts[1], params); nav = "jarayon"; break;
      case "tuzilma": html = viewStructure(); nav = "tuzilma"; mount = () => {
        const pr = document.getElementById("pickRole"); if (pr) pr.onclick = openRoleDialog;
      }; break;
      case "lavozim": html = viewRole(+parts[1]); nav = "tuzilma"; mount = () => {
        const b = document.getElementById("setMine"); if (b) b.onclick = () => setMyRole(+parts[1] === myRole ? null : +parts[1]);
      }; break;
      case "yordamchi": html = viewAssistant(); mount = () => mountAssistant(params); nav = "yordamchi"; break;
      default: html = notFound();
    }
    closeDrawer();
    app.innerHTML = html;
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === nav));
    document.getElementById("nav").classList.remove("open");
    if (path !== lastPath) window.scrollTo(0, 0);
    lastPath = path;
    mount && mount();
  }
  const router = render;
  window.addEventListener("hashchange", render);
  setMyRole(myRole);
})();
