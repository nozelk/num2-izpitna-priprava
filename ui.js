(() => {
  "use strict";

  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const M = (tex, fallback = tex, display = false) => {
    const mode = display ? ' data-display="block"' : "";
    const className = display ? "js-math math-display" : "js-math math-inline";
    return `<span class="${className}" data-tex="${escapeHtml(tex)}"${mode}>${escapeHtml(fallback)}</span>`;
  };

  const panel = (tex, fallback = tex, label = "zapis", tone = "") => {
    const toneAttr = tone ? ` data-tone="${escapeHtml(tone)}"` : "";
    return `<div class="math-panel" data-label="${escapeHtml(label)}"${toneAttr}>${M(tex, fallback, true)}</div>`;
  };

  const notation = (intro, entries) => `
    <p>${intro}</p>
    <dl class="notation-grid">
      ${entries.map(entry => `
        <div class="notation-item">
          <dt class="notation-symbol">${M(entry.tex, entry.symbol)}</dt>
          <dd class="notation-meaning"><strong>${entry.name}</strong>${entry.meaning}</dd>
        </div>`).join("")}
    </dl>`;

  const theorem = (name, body) => `
    <div class="theorem-card" data-name="${escapeHtml(name)}">${body}</div>`;

  const sourceNote = (source, note = "") => `
    <div class="source-note"><strong>Vir v gradivu:</strong> ${source}${note ? ` · ${note}` : ""}</div>`;

  const proof = ({ idea, steps, conclusion, source }) => {
    const hasInlineQed = String(conclusion).includes("proof-square");
    return `
      <p class="proof-lead"><strong>Ideja.</strong> ${idea}</p>
      <div class="proof-steps">
        ${steps.map(step => `
          <div class="proof-step">
            <strong>${step.title}</strong>
            <div>${step.body}</div>
            ${step.reason ? `
              <aside class="proof-reason">
                <strong>Zakaj ta korak velja?</strong>
                <p>${step.reason}</p>
              </aside>` : ""}
          </div>`).join("")}
      </div>
      <p>${conclusion}</p>
      ${hasInlineQed ? "" : '<div class="qed">konec dokaza</div>'}
      ${source ? sourceNote(source) : ""}`;
  };

  const logicChain = rows => `<div class="logic-chain">${rows.map(row => `
    <div class="logic-row"><strong>${row.left}</strong><span class="arrow">${row.arrow || "→"}</span><small>${row.right}</small></div>`).join("")}</div>`;

  const section = (type, label, title, html) => ({ type, label, title, html });

  const decorateRecaps = () => {
    const DATA = window.STUDY_DATA;
    if (!DATA) return;
    DATA.topics.forEach(item => {
      const recap = item.sections.find(candidate => candidate.type === "recap");
      if (recap && !recap.html.includes("recap-prefix")) {
        recap.html = `<span class="recap-prefix">zadnji hitri pregled</span>${recap.html}`;
      }
    });
  };

  window.StudyUI = { M, panel, notation, theorem, proof, logicChain, sourceNote, section, decorateRecaps };
})();
