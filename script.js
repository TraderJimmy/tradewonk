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
