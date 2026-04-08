// All Cards tab — full reference list
const Cards = (() => {
  const ALL_CARDS_INFO = [
    { id: "bofa_cr", role: "Primary \u2014 Online Shopping (6%/3%)", notes: "Choice category: online shopping. 6% until Sep 17 (first-year bonus), then 3%. $2,500/qtr cap, drops to 1% after. Also 2% grocery/wholesale." },
    { id: "amex_bce", role: "Online now / backup after BofA arrives (3%)", notes: "3% U.S. online retail, supermarkets, gas \u2014 each $6K/yr cap (separate). Primary online card until new BofA arrives." },
    { id: "discover", role: "Dining 5% (Apr\u2013Jun 2026)", notes: "Current quarter: Restaurants & Home Improvement through Jun 30. $1,500/qtr cap. ACTIVATE EACH QUARTER at discover.com." },
    { id: "custom_cash", role: "Dining/Coffee 5% (when Discover quarter \u2260 restaurants)", notes: "ONLY use for restaurants/coffee. Auto-detects top category. $500/mo cap. Stash until Jul 1 while Discover covers dining." },
    { id: "savor_one", role: "Backup dining/entertainment (3%)", notes: "3% dining, entertainment, streaming, grocery (not Walmart). Backup if Custom Cash or Discover hit caps." },
    { id: "double_cash", role: "Everything else (2%)", notes: "1% on purchase + 1% on payment = 2%. 5% hotels/car via Citi Travel portal. Flat 2%, no caps." },
    { id: "wf_active", role: "Casino washing (2%)", notes: "Unlimited 2%. Dedicated to sweepstakes volume. Don\u2019t mix bills here." },
    { id: "bilt", role: "Rent (~1%)", notes: "Free card, no annual fee. $1,750 limit \u2014 can\u2019t cover full $1,851 rent yet. Split payment or request CLI in 3\u20136 months." },
    { id: "chase", role: "Amazon 3% (idle)", notes: "3% Amazon/Whole Foods. Redundant with Amex BCE. Keep for credit age. Exp 11/2026." },
    { id: "bofa_unl", role: "Idle (credit age)", notes: "2% until Dec 26, 2026, then 1.5%. Worse than Double Cash long-term." },
    { id: "robinhood", role: "CANCELLING", notes: "Move all recurring charges off, then cancel Gold subscription." },
  ];

  function render() {
    const box = document.getElementById("all-cards-list");
    box.textContent = '';
    const CARDS = Pick.CARDS;

    const makeSection = (label) => {
      const s = document.createElement("div");
      s.className = "section-label";
      s.textContent = label;
      return s;
    };

    box.appendChild(makeSection("In Rotation"));
    ALL_CARDS_INFO.forEach(info => {
      const card = CARDS[info.id];
      if (card.status !== "active") return;
      box.appendChild(makeCardEl(card, info));
    });

    box.appendChild(makeSection("Idle / Cancelling"));
    ALL_CARDS_INFO.forEach(info => {
      const card = CARDS[info.id];
      if (card.status === "active") return;
      box.appendChild(makeCardEl(card, info, true));
    });
  }

  function makeCardEl(card, info, inactive) {
    const div = document.createElement("div");
    div.className = "all-card" + (inactive ? " inactive" : "");

    const top = document.createElement("div");
    top.className = "ac-top";
    const name = document.createElement("span");
    name.className = "ac-name";
    const dot = document.createElement("span");
    dot.className = "brand-dot brand-" + card.brand;
    name.appendChild(dot);
    name.appendChild(document.createTextNode(card.name));
    const l4 = document.createElement("span");
    l4.className = "ac-last4";
    l4.textContent = "*" + card.last4 + " \u2022 " + card.exp;
    top.appendChild(name);
    top.appendChild(l4);
    div.appendChild(top);

    const role = document.createElement("div");
    role.className = "ac-role";
    role.textContent = info.role;
    div.appendChild(role);

    const notes = document.createElement("div");
    notes.className = "ac-notes";
    notes.textContent = info.notes;
    div.appendChild(notes);

    return div;
  }

  return { render };
})();
