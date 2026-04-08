// Bills tab — upcoming bills, due dates, Storm vs GF split
const Bills = (() => {
  function fmt(n) { return '$' + Math.round(n).toLocaleString(); }

  function render() {
    const box = document.getElementById("bills-content");
    box.textContent = '';

    const bills = DataManager.get('bills') || [];

    // Summary card
    const stormTotal = bills.reduce((s, b) => s + (b.stormShare || 0), 0);
    const angelyTotal = bills.reduce((s, b) => s + (b.angelyShare || 0), 0);
    const grandTotal = bills.reduce((s, b) => s + (b.total || 0), 0);

    const summary = document.createElement("div");
    summary.className = "bill-summary";

    const addRow = (label, value, cls) => {
      const row = document.createElement("div");
      row.className = "bill-summary-row" + (cls ? " " + cls : "");
      const l = document.createElement("span");
      l.className = "label";
      l.textContent = label;
      const v = document.createElement("span");
      v.className = "value";
      v.textContent = value;
      row.appendChild(l);
      row.appendChild(v);
      summary.appendChild(row);
    };

    addRow("Total bills", fmt(grandTotal));
    addRow("Storm pays", fmt(stormTotal));
    addRow("Angely pays", fmt(angelyTotal));
    addRow("Storm's monthly burn", fmt(stormTotal), "total");
    box.appendChild(summary);

    // Individual bills
    const sectionLabel = document.createElement("div");
    sectionLabel.className = "section-label";
    sectionLabel.textContent = "All Bills";
    box.appendChild(sectionLabel);

    // Sort by due day (null = end)
    const sorted = [...bills].sort((a, b) => (a.dueDay || 99) - (b.dueDay || 99));

    sorted.forEach(bill => {
      const div = document.createElement("div");
      div.className = "bill-card";

      const top = document.createElement("div");
      top.className = "bill-top";
      const nameEl = document.createElement("span");
      nameEl.className = "bill-name";
      nameEl.textContent = bill.name;
      if (bill.autopay) {
        const badge = document.createElement("span");
        badge.className = "bill-badge autopay";
        badge.textContent = "AUTO";
        nameEl.appendChild(badge);
      }
      const amtEl = document.createElement("span");
      amtEl.className = "bill-amount";
      amtEl.textContent = fmt(bill.total);
      top.appendChild(nameEl);
      top.appendChild(amtEl);
      div.appendChild(top);

      const detail = document.createElement("div");
      detail.className = "bill-detail";
      const parts = [];
      if (bill.dueDay) parts.push("Due: " + ordinal(bill.dueDay) + " of month");
      if (bill.paidVia) parts.push("Via: " + bill.paidVia);
      detail.textContent = parts.join(" \u2022 ");
      div.appendChild(detail);

      if (bill.stormShare > 0 && bill.angelyShare > 0) {
        const split = document.createElement("div");
        split.className = "bill-split";
        const storm = document.createElement("span");
        storm.className = "storm";
        storm.textContent = "Storm: " + fmt(bill.stormShare);
        const angely = document.createElement("span");
        angely.className = "angely";
        angely.textContent = "Angely: " + fmt(bill.angelyShare);
        split.appendChild(storm);
        split.appendChild(angely);
        div.appendChild(split);
      }

      box.appendChild(div);
    });
  }

  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  return { render };
})();
