const STORAGE_KEY = 'bju-tracker-v1';
const MEALS = [
  ['breakfast', 'Завтрак'],
  ['lunch', 'Обед'],
  ['dinner', 'Ужин'],
  ['snack', 'Перекус']
];

const DEFAULT_PRODUCTS = [
  ['chicken', 'Куриная грудка, готовая', 31, 3.6, 0, 165],
  ['egg', 'Яйцо куриное', 12.6, 10.6, 1.1, 143],
  ['rice', 'Рис белый, варёный', 2.7, 0.3, 28.2, 130],
  ['buckwheat', 'Гречка, варёная', 3.6, 1.1, 20.0, 110],
  ['oats', 'Овсяные хлопья, сухие', 13.2, 6.5, 57.5, 352],
  ['cottage5', 'Творог 5%', 17.2, 5, 1.8, 121],
  ['greek-yogurt', 'Йогурт греческий 2%', 9.9, 2, 3.9, 73],
  ['banana', 'Банан', 1.1, 0.3, 22.8, 89],
  ['apple', 'Яблоко', 0.3, 0.2, 13.8, 52],
  ['salmon', 'Лосось, готовый', 25.4, 13.4, 0, 208],
  ['beef', 'Говядина постная, готовая', 26, 10, 0, 198],
  ['potato', 'Картофель, варёный', 1.9, 0.1, 20.1, 87],
  ['pasta', 'Макароны, варёные', 5.8, 0.9, 30.9, 158],
  ['bread', 'Хлеб цельнозерновой', 12.5, 4.2, 43.3, 247],
  ['milk25', 'Молоко 2,5%', 2.8, 2.5, 4.7, 52],
  ['cheese', 'Сыр твёрдый', 24, 30, 1, 370],
  ['olive-oil', 'Оливковое масло', 0, 100, 0, 900],
  ['almonds', 'Миндаль', 21.2, 49.9, 21.6, 579]
].map(([id, name, p, f, c, kcal]) => ({ id, name, p, f, c, kcal, builtIn: true }));

function localDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function defaultState() {
  return {
    goals: { kcal: 2200, p: 160, f: 75, c: 230 },
    products: DEFAULT_PRODUCTS,
    entries: [],
    selectedDate: localDateString()
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      ...defaultState(),
      ...parsed,
      goals: { ...defaultState().goals, ...(parsed.goals || {}) },
      products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : DEFAULT_PRODUCTS,
      entries: Array.isArray(parsed.entries) ? parsed.entries : []
    };
  } catch {
    return defaultState();
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function num(v) { return Number(v) || 0; }
function round1(v) { return Math.round((num(v) + Number.EPSILON) * 10) / 10; }
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function uid() { return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`); }

function macrosFor(entry) {
  const factor = num(entry.grams) / 100;
  return {
    p: num(entry.p) * factor,
    f: num(entry.f) * factor,
    c: num(entry.c) * factor,
    kcal: num(entry.kcal) * factor
  };
}

function totalsFor(date) {
  return state.entries.filter(e => e.date === date).reduce((acc, entry) => {
    const m = macrosFor(entry);
    acc.p += m.p; acc.f += m.f; acc.c += m.c; acc.kcal += m.kcal;
    return acc;
  }, { p: 0, f: 0, c: 0, kcal: 0 });
}

function humanDate(dateString) {
  const [y,m,d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = localDateString();
  const opts = { weekday: 'short', day: 'numeric', month: 'long' };
  let text = new Intl.DateTimeFormat('ru-RU', opts).format(date);
  text = text.charAt(0).toUpperCase() + text.slice(1);
  return dateString === today ? `Сегодня · ${text}` : text;
}

function offsetSelectedDate(days) {
  const [y,m,d] = state.selectedDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  state.selectedDate = localDateString(date);
  saveState();
  renderToday();
}

function setProgress(id, value, goal) {
  const pct = goal > 0 ? clamp((value / goal) * 100, 0, 100) : 0;
  document.getElementById(id).style.width = `${pct}%`;
}

function renderToday() {
  const t = totalsFor(state.selectedDate);
  document.getElementById('selected-date-label').textContent = humanDate(state.selectedDate);
  document.getElementById('kcal-total').textContent = Math.round(t.kcal);
  document.getElementById('kcal-goal').textContent = Math.round(state.goals.kcal);
  document.getElementById('kcal-left').textContent = Math.max(0, Math.round(state.goals.kcal - t.kcal));
  document.getElementById('protein-total').textContent = round1(t.p);
  document.getElementById('fat-total').textContent = round1(t.f);
  document.getElementById('carb-total').textContent = round1(t.c);
  document.getElementById('protein-goal').textContent = round1(state.goals.p);
  document.getElementById('fat-goal').textContent = round1(state.goals.f);
  document.getElementById('carb-goal').textContent = round1(state.goals.c);
  setProgress('protein-progress', t.p, state.goals.p);
  setProgress('fat-progress', t.f, state.goals.f);
  setProgress('carb-progress', t.c, state.goals.c);
  const kcalPct = state.goals.kcal > 0 ? clamp((t.kcal/state.goals.kcal)*100, 0, 100) : 0;
  document.getElementById('calorie-ring').style.setProperty('--p', `${kcalPct}%`);

  const mealsEl = document.getElementById('meals');
  mealsEl.innerHTML = '';
  for (const [mealId, mealName] of MEALS) {
    const entries = state.entries.filter(e => e.date === state.selectedDate && e.meal === mealId);
    const mealTotals = entries.reduce((acc, e) => {
      const m = macrosFor(e); acc.kcal += m.kcal; return acc;
    }, {kcal:0});
    const article = document.createElement('article');
    article.className = 'meal-card card';
    article.innerHTML = `<div class="meal-header"><h3>${mealName}</h3><span>${Math.round(mealTotals.kcal)} ккал</span></div>`;
    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-meal'; empty.textContent = 'Пока ничего не добавлено'; article.appendChild(empty);
    } else {
      for (const entry of entries) {
        const m = macrosFor(entry);
        const row = document.createElement('div');
        row.className = 'entry-row';
        const main = document.createElement('div');
        main.className = 'entry-main';
        const strong = document.createElement('strong'); strong.textContent = entry.name;
        const small = document.createElement('small'); small.textContent = `${round1(entry.grams)} г · ${Math.round(m.kcal)} ккал`;
        main.append(strong, small);
        const macros = document.createElement('div');
        macros.className = 'entry-macros'; macros.textContent = `Б ${round1(m.p)} · Ж ${round1(m.f)} · У ${round1(m.c)}`;
        const del = document.createElement('button');
        del.className = 'delete-entry'; del.type = 'button'; del.textContent = '×'; del.setAttribute('aria-label','Удалить');
        del.addEventListener('click', () => deleteEntry(entry.id));
        row.append(main, macros, del); article.appendChild(row);
      }
    }
    mealsEl.appendChild(article);
  }
}

function renderProducts() {
  const q = document.getElementById('product-search').value.trim().toLowerCase();
  const list = document.getElementById('products-list');
  list.innerHTML = '';
  const products = [...state.products].sort((a,b) => a.name.localeCompare(b.name, 'ru')).filter(p => p.name.toLowerCase().includes(q));
  for (const p of products) {
    const row = document.createElement('article'); row.className = 'product-row card';
    const copy = document.createElement('div');
    const strong = document.createElement('strong'); strong.textContent = p.name;
    const small = document.createElement('small'); small.textContent = `${Math.round(p.kcal)} ккал · Б ${round1(p.p)} · Ж ${round1(p.f)} · У ${round1(p.c)} / 100 г`;
    copy.append(strong, small);
    const actions = document.createElement('div'); actions.className = 'product-actions';
    const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = '✎'; edit.setAttribute('aria-label','Редактировать'); edit.addEventListener('click', () => openProductDialog(p));
    const del = document.createElement('button'); del.type = 'button'; del.textContent = '×'; del.setAttribute('aria-label','Удалить'); del.addEventListener('click', () => deleteProduct(p.id));
    actions.append(edit, del); row.append(copy, actions); list.appendChild(row);
  }
}

function renderSettings() {
  document.getElementById('goal-kcal').value = state.goals.kcal;
  document.getElementById('goal-protein').value = state.goals.p;
  document.getElementById('goal-fat').value = state.goals.f;
  document.getElementById('goal-carb').value = state.goals.c;
}

function populateEntryProducts() {
  const select = document.getElementById('entry-product');
  const previous = select.value;
  select.innerHTML = '';
  [...state.products].sort((a,b) => a.name.localeCompare(b.name,'ru')).forEach(p => {
    const opt = document.createElement('option'); opt.value = p.id; opt.textContent = p.name; select.appendChild(opt);
  });
  if ([...select.options].some(o => o.value === previous)) select.value = previous;
  updateEntryPreview();
}

function updateEntryPreview() {
  const p = state.products.find(x => x.id === document.getElementById('entry-product').value);
  const grams = num(document.getElementById('entry-grams').value);
  const preview = document.getElementById('entry-preview');
  if (!p) { preview.textContent = 'Добавьте продукт в базу.'; return; }
  const factor = grams / 100;
  preview.textContent = `${Math.round(p.kcal*factor)} ккал · Б ${round1(p.p*factor)} · Ж ${round1(p.f*factor)} · У ${round1(p.c*factor)}`;
}

function deleteEntry(id) {
  state.entries = state.entries.filter(e => e.id !== id);
  saveState(); renderToday(); toast('Запись удалена');
}

function deleteProduct(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Удалить «${p.name}» из базы? История питания сохранится.`)) return;
  state.products = state.products.filter(x => x.id !== id);
  saveState(); renderProducts(); populateEntryProducts(); toast('Продукт удалён');
}

function openProductDialog(product = null) {
  document.getElementById('product-edit-id').value = product?.id || '';
  document.getElementById('product-name').value = product?.name || '';
  document.getElementById('product-protein').value = product?.p ?? '';
  document.getElementById('product-fat').value = product?.f ?? '';
  document.getElementById('product-carb').value = product?.c ?? '';
  document.getElementById('product-kcal').value = product?.kcal ?? '';
  document.querySelector('#product-dialog h2').textContent = product ? 'Редактировать продукт' : 'Новый продукт';
  document.getElementById('product-dialog').showModal();
}

function toast(message) {
  const el = document.getElementById('toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 1800);
}

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === id));
  if (id === 'products-view') renderProducts();
  if (id === 'settings-view') renderSettings();
  window.scrollTo({top:0, behavior:'instant'});
}

document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
document.getElementById('prev-day').addEventListener('click', () => offsetSelectedDate(-1));
document.getElementById('next-day').addEventListener('click', () => offsetSelectedDate(1));
document.getElementById('today-button').addEventListener('click', () => { state.selectedDate = localDateString(); saveState(); renderToday(); });
document.getElementById('add-entry').addEventListener('click', () => { populateEntryProducts(); document.getElementById('entry-dialog').showModal(); });
document.getElementById('add-product').addEventListener('click', () => openProductDialog());
document.getElementById('product-search').addEventListener('input', renderProducts);
document.getElementById('entry-product').addEventListener('change', updateEntryPreview);
document.getElementById('entry-grams').addEventListener('input', updateEntryPreview);
document.getElementById('install-help').addEventListener('click', () => document.getElementById('help-dialog').showModal());
document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => document.getElementById(btn.dataset.close).close()));

document.getElementById('entry-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const p = state.products.find(x => x.id === document.getElementById('entry-product').value);
  const grams = num(document.getElementById('entry-grams').value);
  if (!p || grams <= 0) return;
  state.entries.push({ id: uid(), date: state.selectedDate, meal: document.getElementById('entry-meal').value, grams, name: p.name, p: p.p, f: p.f, c: p.c, kcal: p.kcal });
  saveState(); document.getElementById('entry-dialog').close(); renderToday(); toast('Добавлено');
});

document.getElementById('product-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('product-edit-id').value || uid();
  const p = num(document.getElementById('product-protein').value);
  const f = num(document.getElementById('product-fat').value);
  const c = num(document.getElementById('product-carb').value);
  const kcalRaw = document.getElementById('product-kcal').value.trim();
  const kcal = kcalRaw ? num(kcalRaw) : Math.round(p*4 + f*9 + c*4);
  const product = { id, name: document.getElementById('product-name').value.trim(), p, f, c, kcal, builtIn: false };
  const idx = state.products.findIndex(x => x.id === id);
  if (idx >= 0) state.products[idx] = product; else state.products.push(product);
  saveState(); document.getElementById('product-dialog').close(); renderProducts(); populateEntryProducts(); toast('Продукт сохранён');
});

document.getElementById('goals-form').addEventListener('submit', (e) => {
  e.preventDefault();
  state.goals = {
    kcal: num(document.getElementById('goal-kcal').value),
    p: num(document.getElementById('goal-protein').value),
    f: num(document.getElementById('goal-fat').value),
    c: num(document.getElementById('goal-carb').value)
  };
  saveState(); renderToday(); toast('Цели сохранены');
});

document.getElementById('export-data').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `bju-backup-${localDateString()}.json`; a.click(); URL.revokeObjectURL(a.href);
});

document.getElementById('import-data').addEventListener('change', async (e) => {
  const file = e.target.files?.[0]; if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || !Array.isArray(parsed.products) || !Array.isArray(parsed.entries) || !parsed.goals) throw new Error();
    state = { ...defaultState(), ...parsed, selectedDate: localDateString() };
    saveState(); renderToday(); renderProducts(); renderSettings(); populateEntryProducts(); toast('Данные импортированы');
  } catch { alert('Не удалось импортировать файл. Проверьте, что это резервная копия БЖУ.'); }
  e.target.value = '';
});

renderToday();
renderProducts();
renderSettings();
populateEntryProducts();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
