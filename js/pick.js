// Pick tab — card recommendation engine
const Pick = (() => {
  const CARDS = {
    bofa_cr:     { name: "BofA Cash Rewards",  last4: "NEW",  brand: "visa",       exp: "TBD",     status: "active", limit: 8000 },
    amex_bce:    { name: "Amex BCE",           last4: "1003", brand: "amex",       exp: "5/2029",  status: "active", limit: 7000 },
    discover:    { name: "Discover",           last4: "7545", brand: "discover",   exp: "7/2031",  status: "active" },
    custom_cash: { name: "Citi Custom Cash",   last4: "8538", brand: "mastercard", exp: "TBD",     status: "active", limit: 3200 },
    savor_one:   { name: "SavorOne",           last4: "4967", brand: "mastercard", exp: "8/2028",  status: "active", limit: 10000 },
    double_cash: { name: "Citi Double Cash",   last4: "7915", brand: "mastercard", exp: "12/2028", status: "active", limit: 4300 },
    wf_active:   { name: "WF Active Cash",    last4: "8546", brand: "visa",       exp: "2/2029",  status: "active", limit: 4000 },
    chase:       { name: "Chase Amazon",       last4: "2460", brand: "visa",       exp: "11/2026", status: "idle",   limit: 8500 },
    bilt:        { name: "BILT Blue",          last4: "TBD",  brand: "mastercard", exp: "TBD",     status: "active", limit: 1750 },
    bofa_unl:    { name: "BofA Unlimited",     last4: "8836", brand: "visa",       exp: "6/2031",  status: "idle",   limit: 8000 },
    robinhood:   { name: "Robinhood Gold",     last4: "7880", brand: "visa",       exp: "4/2030",  status: "cancelling", limit: 6000 },
  };

  const DISCOVER_QUARTERS = { "2026-Q2": ["restaurant", "home_improvement"] };
  const ACTIVITIES = [
    { id: "restaurant",       emoji: "\uD83C\uDF7D\uFE0F", label: "Restaurant" },
    { id: "coffee",           emoji: "\u2615",              label: "Coffee" },
    { id: "movies",           emoji: "\uD83C\uDFAC",        label: "Movies" },
    { id: "entertainment",    emoji: "\uD83C\uDFAE",        label: "Entertainment" },
    { id: "gas",              emoji: "\u26FD",               label: "Gas" },
    { id: "online",           emoji: "\uD83D\uDED2",        label: "Online" },
    { id: "home_improvement", emoji: "\uD83D\uDEE0\uFE0F",  label: "Home Improve" },
    { id: "streaming",        emoji: "\uD83D\uDCFA",        label: "Streaming" },
    { id: "drugstore",        emoji: "\uD83D\uDC8A",        label: "Drugstore" },
    { id: "grocery",          emoji: "\uD83E\uDDFA",        label: "Grocery" },
    { id: "amazon",           emoji: "\uD83D\uDCE6",        label: "Amazon" },
    { id: "rent",             emoji: "\uD83C\uDFE0",        label: "Rent" },
    { id: "casino",           emoji: "\uD83C\uDFB0",        label: "Casino" },
    { id: "other",            emoji: "\uD83D\uDCB3",        label: "Other" },
  ];

  function getQuarterKey() {
    const d = new Date();
    return d.getFullYear() + "-Q" + Math.ceil((d.getMonth() + 1) / 3);
  }
  function discoverCovers(cat) { return (DISCOVER_QUARTERS[getQuarterKey()] || []).includes(cat); }
  function bofaCRBonusActive() { return new Date() < new Date("2026-09-17"); }

  function getCardRecs(actId) {
    const r = [];
    const add = (c, rate, note) => r.push({ cardId: c, rate, note });
    switch (actId) {
      case "restaurant": case "coffee":
        if (discoverCovers("restaurant")) add("discover", "5%", "Quarterly bonus (through Jun 30)");
        add("custom_cash", "5%", "Dining as top category \u2022 $500/mo cap");
        add("savor_one", "3%", "Dining category");
        add("double_cash", "2%", "Fallback");
        break;
      case "movies": case "entertainment":
        add("savor_one", "3%", "Entertainment category");
        add("double_cash", "2%", "Fallback");
        break;
      case "gas":
        add("amex_bce", "3%", "Gas stations \u2022 $6K/yr cap");
        add("double_cash", "2%", "Fallback");
        break;
      case "online": case "amazon":
        if (bofaCRBonusActive()) add("bofa_cr", "6%", "First-year bonus (until Sep 17) \u2022 $2,500/qtr cap");
        else add("bofa_cr", "3%", "Online shopping \u2022 $2,500/qtr cap");
        add("amex_bce", "3%", "U.S. online retail \u2022 $6K/yr cap");
        add("double_cash", "2%", "Fallback");
        break;
      case "home_improvement":
        if (discoverCovers("home_improvement")) add("discover", "5%", "Quarterly bonus (through Jun 30)");
        add("double_cash", "2%", "Fallback");
        break;
      case "streaming":
        add("savor_one", "3%", "Streaming category");
        add("double_cash", "2%", "Fallback");
        break;
      case "drugstore":
        add("double_cash", "2%", "Best available rate");
        break;
      case "grocery":
        r.push({ cardId: null, rate: "0%", note: "WinCo = debit/cash only. No credit card rewards." });
        break;
      case "rent":
        add("bilt", "~1%", "Only card that earns on rent. Free, no annual fee.");
        break;
      case "casino":
        add("wf_active", "2%", "Dedicated casino washing card");
        break;
      case "other":
        add("double_cash", "2%", "Flat 2% on everything");
        break;
    }
    return r;
  }

  const selected = new Set();
  const actLabels = Object.fromEntries(ACTIVITIES.map(a => [a.id, a.label]));

  function el(id) { return document.getElementById(id); }

  function render() {
    const grid = el("activity-grid");
    grid.textContent = '';
    ACTIVITIES.forEach(a => {
      const btn = document.createElement("div");
      btn.className = "activity-btn" + (selected.has(a.id) ? " selected" : "");
      const em = document.createElement("span");
      em.className = "emoji";
      em.textContent = a.emoji;
      const lb = document.createElement("span");
      lb.className = "label";
      lb.textContent = a.label;
      btn.appendChild(em);
      btn.appendChild(lb);
      btn.addEventListener("click", () => {
        if (selected.has(a.id)) selected.delete(a.id); else selected.add(a.id);
        render();
      });
      grid.appendChild(btn);
    });
    renderResults();
  }

  function renderResults() {
    const box = el("results");
    box.textContent = '';
    if (selected.size === 0) {
      const p = document.createElement("div");
      p.className = "no-selection";
      p.textContent = "Tap what you\u2019re about to do";
      box.appendChild(p);
      return;
    }
    const cardMap = new Map();
    const msgs = [];
    for (const actId of selected) {
      const recs = getCardRecs(actId);
      const top = recs[0];
      if (!top) continue;
      if (!top.cardId) { msgs.push(top.note); continue; }
      if (cardMap.has(top.cardId)) cardMap.get(top.cardId).activities.push(actId);
      else cardMap.set(top.cardId, { rate: top.rate, note: top.note, activities: [actId] });
    }
    const entries = [...cardMap.entries()];
    const hdr = document.createElement("div");
    hdr.className = "results-header";
    hdr.textContent = entries.length === 1 ? "Bring this card" : "Bring these " + entries.length + " cards";
    box.appendChild(hdr);

    entries.forEach(([cardId, info]) => {
      const card = CARDS[cardId];
      const rc = document.createElement("div");
      rc.className = "result-card";

      const top = document.createElement("div");
      top.className = "card-top";
      const nameSpan = document.createElement("span");
      nameSpan.className = "card-name";
      const dot = document.createElement("span");
      dot.className = "brand-dot brand-" + card.brand;
      nameSpan.appendChild(dot);
      nameSpan.appendChild(document.createTextNode(card.name));
      const rateSpan = document.createElement("span");
      rateSpan.className = "card-rate";
      rateSpan.textContent = info.rate;
      top.appendChild(nameSpan);
      top.appendChild(rateSpan);
      rc.appendChild(top);

      const detail = document.createElement("div");
      detail.className = "card-detail";
      detail.textContent = info.note;
      rc.appendChild(detail);

      const last4 = document.createElement("div");
      last4.className = "card-last4";
      last4.textContent = "*" + card.last4;
      last4.style.marginTop = "4px";
      rc.appendChild(last4);

      const cats = document.createElement("div");
      cats.className = "card-categories";
      info.activities.forEach(aId => {
        const tag = document.createElement("span");
        tag.className = "cat-tag active";
        tag.textContent = actLabels[aId];
        cats.appendChild(tag);
      });
      rc.appendChild(cats);
      box.appendChild(rc);
    });

    msgs.forEach(m => {
      const mc = document.createElement("div");
      mc.className = "result-card";
      const d = document.createElement("div");
      d.className = "card-detail";
      d.textContent = m;
      mc.appendChild(d);
      box.appendChild(mc);
    });
  }

  return { render, CARDS };
})();
