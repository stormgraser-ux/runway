// Digest tab — weekly summary viewer
const Digest = (() => {
  function fmt(n) { return '$' + Math.round(Math.abs(n)).toLocaleString(); }

  function render() {
    const box = document.getElementById("digest-content");
    box.textContent = '';

    const digest = DataManager.get('digest');
    const meta = DataManager.getMeta();

    if (!digest) {
      const empty = document.createElement("div");
      empty.className = "no-selection";
      empty.textContent = "No digest data yet. The weekly cron will push updates every Monday.";
      box.appendChild(empty);
      return;
    }

    // Week header
    if (digest.weekOf) {
      const header = document.createElement("div");
      header.className = "section-label";
      header.textContent = "Week of " + digest.weekOf;
      box.appendChild(header);
    }

    // Cash flow overview
    const flowCard = document.createElement("div");
    flowCard.className = "digest-card";
    const flowTitle = document.createElement("h3");
    flowTitle.textContent = "Cash Flow";
    flowCard.appendChild(flowTitle);

    const flow = document.createElement("div");
    flow.className = "digest-flow";

    const addFlowItem = (cls, label, value, negative) => {
      const item = document.createElement("div");
      item.className = "flow-item " + cls;
      const val = document.createElement("div");
      val.className = "flow-value" + (negative ? " negative" : "");
      val.textContent = (negative ? "-" : "") + "$" + fmt(Math.abs(value));
      const lbl = document.createElement("div");
      lbl.className = "flow-label";
      lbl.textContent = label;
      item.appendChild(val);
      item.appendChild(lbl);
      flow.appendChild(item);
    };

    if (digest.income !== undefined) addFlowItem("flow-income", "Income", digest.income);
    if (digest.expenses !== undefined) addFlowItem("flow-expenses", "Expenses", digest.expenses);
    if (digest.weeklyNetCashFlow !== undefined) {
      addFlowItem("flow-net", "Net", Math.abs(digest.weeklyNetCashFlow), digest.weeklyNetCashFlow < 0);
    }
    flowCard.appendChild(flow);
    box.appendChild(flowCard);

    // Highlights
    if (digest.highlights && digest.highlights.length > 0) {
      const hlCard = document.createElement("div");
      hlCard.className = "digest-card";
      const hlTitle = document.createElement("h3");
      hlTitle.textContent = "Highlights";
      hlCard.appendChild(hlTitle);
      digest.highlights.forEach(h => {
        const item = document.createElement("div");
        item.className = "digest-item";
        item.textContent = h;
        hlCard.appendChild(item);
      });
      box.appendChild(hlCard);
    }

    // Alerts
    if (digest.alerts && digest.alerts.length > 0) {
      const alCard = document.createElement("div");
      alCard.className = "digest-card";
      const alTitle = document.createElement("h3");
      alTitle.textContent = "Alerts";
      alCard.appendChild(alTitle);
      digest.alerts.forEach(a => {
        const item = document.createElement("div");
        item.className = "digest-item";
        item.textContent = a;
        alCard.appendChild(item);
      });
      box.appendChild(alCard);
    }

    // Trends
    if (digest.trends) {
      const trCard = document.createElement("div");
      trCard.className = "digest-card";
      const trTitle = document.createElement("h3");
      trTitle.textContent = "Trends";
      trCard.appendChild(trTitle);
      if (digest.trends.groceryAvgWeekly) {
        const item = document.createElement("div");
        item.className = "digest-item";
        item.textContent = "Grocery avg: $" + digest.trends.groceryAvgWeekly + "/week";
        trCard.appendChild(item);
      }
      if (digest.trends.sweepsMonthlyAvg) {
        const item = document.createElement("div");
        item.className = "digest-item";
        item.textContent = "Sweeps avg: $" + digest.trends.sweepsMonthlyAvg.toLocaleString() + "/month";
        trCard.appendChild(item);
      }
      box.appendChild(trCard);
    }

    // Freshness
    const fresh = document.createElement("div");
    fresh.className = "freshness";
    if (meta && meta.generated) {
      fresh.textContent = "Generated: " + new Date(meta.generated).toLocaleDateString();
    }
    box.appendChild(fresh);
  }

  return { render };
})();
