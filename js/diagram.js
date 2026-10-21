// Swimlane diagrammasini ma'lumotlardan chizish (HTML tugunlar + SVG bog'lanishlar).
(function () {
  const LABEL_W = 176, COL_W = 176, NODE_W = 150, NODE_H = 60, ROW_GAP = 22, PAD = 20, LEFT = 22;
  const ROW_H = NODE_H + ROW_GAP;

  function layout(proc) {
    const lanes = proc.lanes.map((l, i) => {
      const rs = proc.nodes.filter(n => n.lane === i).map(n => n.r || 0);
      const minR = Math.min(0, ...rs), maxR = Math.max(0, ...rs);
      return { ...l, minR, maxR, h: PAD * 2 + (maxR - minR + 1) * NODE_H + (maxR - minR) * ROW_GAP };
    });
    let y = 0;
    lanes.forEach(l => { l.top = y; y += l.h; });
    const maxCol = Math.max(...proc.nodes.map(n => n.col));
    const width = LABEL_W + LEFT + (maxCol + 1) * COL_W + 10;
    const pos = {};
    proc.nodes.forEach(n => {
      const l = lanes[n.lane];
      const x = LABEL_W + LEFT + n.col * COL_W;
      const yy = l.top + PAD + ((n.r || 0) - l.minR) * ROW_H;
      pos[n.id] = { x, y: yy, w: NODE_W, h: NODE_H, cx: x + NODE_W / 2, cy: yy + NODE_H / 2, col: n.col };
    });
    return { lanes, pos, width, height: y };
  }

  function route(a, b) {
    const gap = (COL_W - NODE_W) / 2;
    if (a.col === b.col) {
      return b.cy > a.cy
        ? { d: `M${a.cx},${a.y + a.h} V${b.y}`, lx: a.cx + 6, ly: a.y + a.h + 14 }
        : { d: `M${a.cx},${a.y} V${b.y + b.h}`, lx: a.cx + 6, ly: a.y - 6 };
    }
    if (b.col > a.col) {
      const sx = a.x + a.w, ex = b.x;
      if (Math.abs(a.cy - b.cy) < 2) return { d: `M${sx},${a.cy} H${ex}`, lx: sx + 5, ly: a.cy - 6 };
      const mx = sx + gap;
      return { d: `M${sx},${a.cy} H${mx} V${b.cy} H${ex}`, lx: sx + 4, ly: a.cy - 6 };
    }
    // orqaga qaytish: pastdan aylanib o'tadi
    const yb = Math.max(a.y + a.h, b.y + b.h) + 12;
    return { d: `M${a.cx},${a.y + a.h} V${yb} H${b.cx} V${b.y + b.h}`, lx: a.cx + 6, ly: a.y + a.h + 14 };
  }

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function render(proc, el, opts = {}) {
    const L = layout(proc);
    const hl = opts.highlightRole;
    const laneHas = l => hl && (l.roles === "all" || (Array.isArray(l.roles) && l.roles.includes(hl)));

    let html = `<div class="sw" style="width:${L.width}px;height:${L.height}px">`;
    L.lanes.forEach((l, i) => {
      html += `<div class="sw-lane ${i % 2 ? "odd" : ""} ${laneHas(l) ? "is-mine" : ""}" style="top:${l.top}px;height:${l.h}px">
        <div class="sw-lane-label"><b>${esc(l.name)}</b>${l.sub ? `<span>${esc(l.sub)}</span>` : ""}</div></div>`;
    });
    html += `<svg class="sw-edges" width="${L.width}" height="${L.height}">
      <defs><marker id="arr-${proc.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,1 L9,5 L0,9 z" class="sw-arrow"/></marker></defs>`;
    proc.edges.forEach(([from, to, label, dashed]) => {
      const r = route(L.pos[from], L.pos[to]);
      html += `<path d="${r.d}" class="sw-edge ${dashed ? "dashed" : ""}" data-from="${from}" data-to="${to}" marker-end="url(#arr-${proc.id})"/>`;
      if (label) html += `<text x="${r.lx}" y="${r.ly}" class="sw-elabel">${esc(label)}</text>`;
    });
    html += `</svg>`;
    proc.nodes.forEach(n => {
      const p = L.pos[n.id];
      const dim = hl && !laneHas(proc.lanes[n.lane]) ? "dim" : "";
      const num = n.type === "decision" ? n.id.split(".")[1] : (n.label || n.id);
      const showNum = !["link"].includes(n.type) && !/\.(E|M)$/.test(n.id);
      html += `<button class="sw-node t-${n.type} ${dim} ${opts.selected === n.id ? "sel" : ""}" data-id="${n.id}"
        style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px" aria-label="${esc((n.label || n.id) + " " + n.title)}">
        ${n.type === "link" ? `<span class="sw-num">→ ${n.to}-jarayon</span>` : showNum ? `<span class="sw-num">${esc(num)}</span>` : ""}
        <span class="sw-title">${esc(n.title)}</span>
        ${n.note ? `<span class="sw-note">${esc(n.note)}</span>` : ""}
        ${n.risk ? `<span class="sw-risk" title="Nazorat nuqtasi">!</span>` : ""}
      </button>`;
    });
    html += `</div>`;
    el.innerHTML = html;

    el.querySelectorAll(".sw-node").forEach(b => {
      b.addEventListener("click", () => opts.onNodeClick && opts.onNodeClick(b.dataset.id));
      b.addEventListener("mouseenter", () => el.querySelectorAll(`.sw-edge[data-from="${b.dataset.id}"],.sw-edge[data-to="${b.dataset.id}"]`).forEach(e => e.classList.add("hot")));
      b.addEventListener("mouseleave", () => el.querySelectorAll(".sw-edge.hot").forEach(e => e.classList.remove("hot")));
    });
    if (opts.selected && L.pos[opts.selected]) {
      const p = L.pos[opts.selected];
      el.scrollLeft = Math.max(0, p.x - el.clientWidth / 2 + p.w / 2);
    }
  }

  window.Diagram = { render };
})();
