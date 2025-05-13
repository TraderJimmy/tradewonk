// Hämta data från webbläsarens localStorage
let journals = JSON.parse(localStorage.getItem('journals') || '{}');
let currentJournal = localStorage.getItem('currentJournal') || '';

// Fyll rullistan med tillgängliga journaler
function populateJournals() {
  const select = document.getElementById('journalSelect');
  select.innerHTML = '';
  Object.keys(journals).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if (name === currentJournal) opt.selected = true;
    select.appendChild(opt);
  });
}

// Skapa en ny journal
function createJournal() {
  const name = document.getElementById('newJournalName').value.trim();
  if (name && !journals[name]) {
    journals[name] = { trades: [], ratings: {} };
    currentJournal = name;
    localStorage.setItem('journals', JSON.stringify(journals));
    localStorage.setItem('currentJournal', name);
    populateJournals();
    alert(`Journalen "${name}" skapad.`);
    // Här kan renderDashboard() anropas när den finns
  } else {
    alert("Välj ett unikt journalnamn.");
  }
}

// Byt aktuell journal när användaren väljer en annan
document.getElementById('journalSelect').addEventListener('change', e => {
  currentJournal = e.target.value;
  localStorage.setItem('currentJournal', currentJournal);
  // Här kan renderDashboard() anropas när den finns
});

// Initiera sidan vid start
populateJournals();

// RenderDeshboard funktionen
function renderDashboard() {
  const container = document.querySelector('.calendar-container');
  const statsPanel = document.querySelector('.stats-panel');
  container.innerHTML = '';
  statsPanel.innerHTML = '';

  if (!currentJournal || !journals[currentJournal]) return;

  const trades = journals[currentJournal].trades || [];

  // Skapa en karta med trades per dag
  const tradesByDay = {};
  trades.forEach(trade => {
    const date = new Date(trade.date).toISOString().split('T')[0];
    if (!tradesByDay[date]) tradesByDay[date] = [];
    tradesByDay[date].push(trade);
  });

  // Hämta dagens månad och år
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Bygg kalenderns rutor
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendar = document.createElement('div');
  calendar.className = 'calendar';

  // Rubrikrad (mån–sön)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  days.forEach(d => {
    const label = document.createElement('div');
    label.className = 'day-label';
    label.textContent = d;
    calendar.appendChild(label);
  });

  // Tomma rutor före månadens start
  for (let i = 0; i < (startDay + 6) % 7; i++) {
    const empty = document.createElement('div');
    empty.className = 'day';
    calendar.appendChild(empty);
  }

  // Dag för dag
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const dayBox = document.createElement('div');
    dayBox.className = 'day';

    if (tradesByDay[dateStr]) {
      const trades = tradesByDay[dateStr];
      const pnl = trades.reduce((sum, t) => sum + t.profit, 0).toFixed(2);
      const pnlColor = pnl >= 0 ? 'positive' : 'negative';

      dayBox.innerHTML = `
        <div class="${pnlCol

// Hjälpfunktionen
function calculateStats(trades) {
  if (!trades.length) return {
    avgProfit: 0, maxWin: 0, maxLoss: 0, totalFees: 0, winrate: 0,
    winDays: 0, lossDays: 0
  };

  const profitDays = {};
  let maxWin = -Infinity, maxLoss = Infinity, sum = 0, wins = 0;

  trades.forEach(t => {
    const date = new Date(t.date).toISOString().split('T')[0];
    if (!profitDays[date]) profitDays[date] = 0;
    profitDays[date] += t.profit;

    if (t.profit > 0) wins++;
    if (t.profit > maxWin) maxWin = t.profit;
    if (t.profit < maxLoss) maxLoss = t.profit;
    sum += t.profit;
  });

  const winDays = Object.values(profitDays).filter(v => v > 0).length;
  const lossDays = Object.values(profitDays).filter(v => v < 0).length;

  return {
    avgProfit: (sum / Object.keys(profitDays).length).toFixed(2),
    maxWin: maxWin.toFixed(2),
    maxLoss: maxLoss.toFixed(2),
    totalFees: 0, // placeholder
    winrate: ((wins / trades.length) * 100).toFixed(1),
    winDays, lossDays
  };
}
