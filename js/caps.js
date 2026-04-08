// Caps tab — spend cap tracking with progress bars
const Caps = (() => {
  function bofaCRBonusActive() { return new Date() < new Date("2026-09-17"); }

  const CAPS_DATA = [
    { id: "bofa_cr_quarterly", cardId: "bofa_cr", title: "BofA Cash Rewards \u2014 Online Shopping",
      subtitle: bofaCRBonusActive() ? "6% (first-year bonus) \u2192 1% after cap" : "3% \u2192 1% after cap",
      limit: 2500, resetNote: "Resets Jan 1, Apr 1, Jul 1, Oct 1",
      fallback: "Switch to Amex BCE *1003 (3%)" },
    { id: "custom_cash_monthly", cardId: "custom_cash", title: "Citi Custom Cash \u2014 Dining",
      subtitle: "5% \u2192 1% after cap", limit: 500, resetNote: "Resets each billing cycle",
      fallback: "Switch to SavorOne *4967 (3%) or Discover *7545 (5% if quarterly)" },
    { id: "discover_quarterly", cardId: "discover", title: "Discover \u2014 Restaurants & Home Improvement",
      subtitle: "5% \u2192 1% after cap (Apr\u2013Jun 2026)", limit: 1500,
      resetNote: "Resets each quarter. ACTIVATE at discover.com!",
      fallback: "Switch to Citi Custom Cash *8538 (5%) for dining" },
    { id: "amex_bce_yearly", cardId: "amex_bce", title: "Amex BCE \u2014 Online Retail",
      subtitle: "3% \u2192 1% after cap", limit: 6000, resetNote: "Resets annually",
      fallback: "Switch to Citi Double Cash *7915 (2%)" },
  ];

  function render() {
    const box = document.getElementById("caps-list");
    box.textContent = '';
    const CARDS = Pick.CARDS;

    CAPS_DATA.forEach(cap => {
      const spent = DataManager.getCapSpend(cap.id);
      const pct = Math.min((spent / cap.limit) * 100, 100);
      const card = CARDS[cap.cardId];
      const color = pct >= 90 ? "red" : pct >= 70 ? "yellow" : "green";

      const div = document.createElement("div");
      div.className = "cap-card";

      const title = document.createElement("h3");
      const tdot = document.createElement("span");
      tdot.className = "brand-dot brand-" + card.brand;
      title.appendChild(tdot);
      title.appendChild(document.createTextNode(cap.title));
      div.appendChild(title);

      const sub = document.createElement("div");
      sub.className = "cap-subtitle";
      sub.textContent = cap.subtitle;
      div.appendChild(sub);

      const track = document.createElement("div");
      track.className = "cap-bar-track";
      const fill = document.createElement("div");
      fill.className = "cap-bar-fill " + color;
      fill.style.width = pct + "%";
      track.appendChild(fill);
      div.appendChild(track);

      const nums = document.createElement("div");
      nums.className = "cap-numbers";
      const spentSpan = document.createElement("span");
      spentSpan.textContent = "$" + spent.toFixed(0) + " spent";
      const limitSpan = document.createElement("span");
      limitSpan.textContent = "$" + cap.limit + " cap";
      nums.appendChild(spentSpan);
      nums.appendChild(limitSpan);
      div.appendChild(nums);

      const inputRow = document.createElement("div");
      inputRow.className = "cap-input-row";
      const dollar = document.createElement("span");
      dollar.style.cssText = "color:#888;font-size:13px";
      dollar.textContent = "$";
      const input = document.createElement("input");
      input.className = "cap-input";
      input.type = "number";
      input.inputMode = "decimal";
      input.value = spent;
      const saveBtn = document.createElement("button");
      saveBtn.className = "cap-save";
      saveBtn.textContent = "Save";
      saveBtn.addEventListener("click", () => {
        DataManager.setCapSpend(cap.id, parseFloat(input.value) || 0);
        render();
      });
      inputRow.appendChild(dollar);
      inputRow.appendChild(input);
      inputRow.appendChild(saveBtn);
      div.appendChild(inputRow);

      const hint = document.createElement("div");
      hint.className = "cap-reset-hint";
      hint.textContent = cap.resetNote;
      div.appendChild(hint);

      if (pct >= 70) {
        const warn = document.createElement("div");
        warn.className = "cap-warning";
        warn.textContent = "\u26A0 " + cap.fallback;
        div.appendChild(warn);
      }

      box.appendChild(div);
    });
  }

  return { render };
})();
