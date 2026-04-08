// App — router, tab switching, initialization
const App = (() => {
  const TAB_MAP = {
    pick:      { render: () => Pick.render() },
    dashboard: { render: () => Dashboard.render() },
    caps:      { render: () => Caps.render() },
    bills:     { render: () => Bills.render() },
    board:     { render: () => GFBoard.render() },
    cards:     { render: () => Cards.render() },
    digest:    { render: () => Digest.render() },
  };

  let activeTab = 'dashboard';

  function switchTab(tabId) {
    if (!TAB_MAP[tabId]) return;
    activeTab = tabId;

    // Update pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + tabId);
    if (page) page.classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    const navBtn = document.querySelector('.nav button[data-page="' + tabId + '"]');
    if (navBtn) navBtn.classList.add('active');

    // Update overflow menu buttons
    document.querySelectorAll('.overflow-menu button').forEach(b => b.classList.remove('active'));
    const overBtn = document.querySelector('.overflow-menu button[data-page="' + tabId + '"]');
    if (overBtn) overBtn.classList.add('active');

    // Close overflow if open
    const menu = document.querySelector('.overflow-menu');
    if (menu) menu.classList.remove('open');

    // Render tab content
    TAB_MAP[tabId].render();
  }

  async function init() {
    // Load data
    await DataManager.load();

    // Bind nav buttons
    document.querySelectorAll('.nav > button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.page));
    });

    // Overflow toggle
    const overflowBtn = document.getElementById('overflow-toggle');
    const overflowMenu = document.getElementById('overflow-menu');
    if (overflowBtn && overflowMenu) {
      overflowBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        overflowMenu.classList.toggle('open');
      });
      document.addEventListener('click', () => overflowMenu.classList.remove('open'));
      overflowMenu.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.page));
      });
    }

    // Default to dashboard
    switchTab('dashboard');
  }

  return { init, switchTab };
})();

document.addEventListener('DOMContentLoaded', App.init);
