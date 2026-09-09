const STORAGE_KEY = 'bju-tracker-v1';
const PRODUCT_CATALOG_VERSION = 2;
const MEALS = [
  ['breakfast', 'Завтрак'],
  ['lunch', 'Обед'],
  ['dinner', 'Ужин'],
  ['snack', 'Перекус']
];

const DEFAULT_PRODUCTS = [
  ['chicken', 'Куриная грудка, готовая', 31, 3.6, 0, 165],
  ['chicken-thigh', 'Куриное бедро без кожи, готовое', 26, 10.9, 0, 209],
  ['turkey', 'Филе индейки, готовое', 29, 1.8, 0, 135],
  ['beef', 'Говядина постная, готовая', 26, 10, 0, 198],
  ['pork', 'Свинина постная, готовая', 27, 9, 0, 195],
  ['egg', 'Яйцо куриное', 12.6, 10.6, 1.1, 143],
  ['egg-white', 'Белок яичный', 10.9, 0.2, 0.7, 52],
  ['salmon', 'Лосось, готовый', 25.4, 13.4, 0, 208],
  ['tuna', 'Тунец в собственном соку', 25.5, 1, 0, 116],
  ['cod', 'Треска, готовая', 23, 0.9, 0, 105],
  ['shrimp', 'Креветки, готовые', 24, 0.3, 0.2, 99],
  ['cottage0', 'Творог 0–2%', 18, 1.8, 3.3, 101],
  ['cottage5', 'Творог 5%', 17.2, 5, 1.8, 121],
  ['greek-yogurt', 'Йогурт греческий 2%', 9.9, 2, 3.9, 73],
  ['yogurt-natural', 'Йогурт натуральный 3,2%', 5, 3.2, 4.5, 66],
  ['milk15', 'Молоко 1,5%', 3, 1.5, 4.8, 44],
  ['milk25', 'Молоко 2,5%', 2.8, 2.5, 4.7, 52],
  ['kefir1', 'Кефир 1%', 3, 1, 4, 40],
  ['cheese', 'Сыр твёрдый', 24, 30, 1, 370],
  ['mozzarella', 'Моцарелла', 22, 22, 2, 300],
  ['whey', 'Протеин сывороточный, порошок', 75, 7, 10, 400],
  ['rice', 'Рис белый, варёный', 2.7, 0.3, 28.2, 130],
  ['brown-rice', 'Рис бурый, варёный', 2.6, 0.9, 23, 112],
  ['buckwheat', 'Гречка, варёная', 3.6, 1.1, 20, 110],
  ['oats', 'Овсяные хлопья, сухие', 13.2, 6.5, 57.5, 352],
  ['pasta', 'Макароны, варёные', 5.8, 0.9, 30.9, 158],
  ['quinoa', 'Киноа, варёная', 4.4, 1.9, 21.3, 120],
  ['bulgur', 'Булгур, варёный', 3.1, 0.2, 18.6, 83],
  ['couscous', 'Кускус, варёный', 3.8, 0.2, 23.2, 112],
  ['lentils', 'Чечевица, варёная', 9, 0.4, 20, 116],
  ['chickpeas', 'Нут, варёный', 8.9, 2.6, 27.4, 164],
  ['beans', 'Фасоль красная, варёная', 8.7, 0.5, 22.8, 127],
  ['bread', 'Хлеб цельнозерновой', 12.5, 4.2, 43.3, 247],
  ['rye-bread', 'Хлеб ржаной', 6.6, 1.2, 33.4, 174],
  ['lavash', 'Лаваш тонкий', 8.1, 0.7, 57.1, 277],
  ['potato', 'Картофель, варёный', 1.9, 0.1, 20.1, 87],
  ['sweet-potato', 'Батат, готовый', 1.6, 0.1, 20.7, 90],
  ['broccoli', 'Брокколи', 2.8, 0.4, 6.6, 34],
  ['cauliflower', 'Цветная капуста', 1.9, 0.3, 5, 25],
  ['cucumber', 'Огурец', 0.7, 0.1, 3.6, 15],
  ['tomato', 'Помидор', 0.9, 0.2, 3.9, 18],
  ['cabbage', 'Капуста белокочанная', 1.3, 0.1, 5.8, 25],
  ['carrot', 'Морковь', 0.9, 0.2, 9.6, 41],
  ['pepper', 'Перец сладкий', 1, 0.3, 6, 31],
  ['avocado', 'Авокадо', 2, 14.7, 8.5, 160],
  ['banana', 'Банан', 1.1, 0.3, 22.8, 89],
  ['apple', 'Яблоко', 0.3, 0.2, 13.8, 52],
  ['orange', 'Апельсин', 0.9, 0.1, 11.8, 47],
  ['pear', 'Груша', 0.4, 0.1, 15.2, 57],
  ['berries', 'Ягоды, смесь', 1, 0.5, 10, 50],
  ['grapes', 'Виноград', 0.7, 0.2, 18.1, 69],
  ['almonds', 'Миндаль', 21.2, 49.9, 21.6, 579],
  ['walnuts', 'Грецкие орехи', 15.2, 65.2, 13.7, 654],
  ['peanut-butter', 'Арахисовая паста', 25, 50, 20, 588],
  ['olive-oil', 'Оливковое масло', 0, 100, 0, 900],
  ['sunflower-oil', 'Подсолнечное масло', 0, 100, 0, 900],
  ['butter', 'Масло сливочное 82%', 0.5, 82, 0.8, 748],
  ['dark-chocolate', 'Шоколад тёмный 70%', 7.8, 42.6, 45.9, 598],
  ['honey', 'Мёд', 0.3, 0, 82.4, 304],
  ['sugar', 'Сахар', 0, 0, 100, 400]
].map(([id, name, p, f, c, kcal]) => ({ id, name, p, f, c, kcal, builtIn: true }));

const EXERCISES = [
  { id: 'dumbbell-curl', name: 'Подъём гантелей на бицепс', type: 'strength', met: 5.5, secondsPerRep: 4, loadFactor: 1.2 },
  { id: 'barbell-curl', name: 'Подъём штанги на бицепс', type: 'strength', met: 5.7, secondsPerRep: 4, loadFactor: 1.1 },
  { id: 'incline-dumbbell-curl', name: 'Сгибание рук с гантелями на наклонной скамье', type: 'strength', met: 5.5, secondsPerRep: 4.5, loadFactor: 1.25 },
  { id: 'hyperextension', name: 'Гиперэкстензия', type: 'strength', met: 5.2, secondsPerRep: 4, loadFactor: 0.8 },
  { id: 'pec-deck', name: 'Бабочка — сведение рук', type: 'strength', met: 5.3, secondsPerRep: 4, loadFactor: 0.9 },
  { id: 'reverse-pec-deck', name: 'Обратная бабочка — разведение рук', type: 'strength', met: 5.3, secondsPerRep: 4, loadFactor: 0.9 },
  { id: 'bent-over-row', name: 'Тяга штанги в наклоне', type: 'strength', met: 6.1, secondsPerRep: 4, loadFactor: 0.85 },
  { id: 'bench-press', name: 'Жим штанги лёжа', type: 'strength', met: 6, secondsPerRep: 4, loadFactor: 0.8 },
  { id: 'incline-bench-press', name: 'Жим на наклонной скамье', type: 'strength', met: 6, secondsPerRep: 4, loadFactor: 0.85 },
  { id: 'dumbbell-bench-press', name: 'Жим гантелей лёжа', type: 'strength', met: 5.8, secondsPerRep: 4, loadFactor: 1 },
  { id: 'shoulder-press', name: 'Жим гантелей над головой', type: 'strength', met: 5.8, secondsPerRep: 4, loadFactor: 1 },
  { id: 'lateral-raise', name: 'Разведение гантелей в стороны', type: 'strength', met: 5.2, secondsPerRep: 4, loadFactor: 1.3 },
  { id: 'lat-pulldown', name: 'Тяга верхнего блока', type: 'strength', met: 5.8, secondsPerRep: 4, loadFactor: 0.85 },
  { id: 'seated-row', name: 'Тяга горизонтального блока', type: 'strength', met: 5.8, secondsPerRep: 4, loadFactor: 0.85 },
  { id: 'deadlift', name: 'Становая тяга', type: 'strength', met: 6.5, secondsPerRep: 5, loadFactor: 0.65 },
  { id: 'squat', name: 'Приседания со штангой', type: 'strength', met: 6.5, secondsPerRep: 5, loadFactor: 0.7 },
  { id: 'leg-press', name: 'Жим ногами', type: 'strength', met: 6.2, secondsPerRep: 4.5, loadFactor: 0.45 },
  { id: 'leg-extension', name: 'Разгибание ног в тренажёре', type: 'strength', met: 5.4, secondsPerRep: 4, loadFactor: 0.75 },
  { id: 'leg-curl', name: 'Сгибание ног в тренажёре', type: 'strength', met: 5.4, secondsPerRep: 4, loadFactor: 0.75 },
  { id: 'calf-raise', name: 'Подъём на носки', type: 'strength', met: 5.2, secondsPerRep: 3, loadFactor: 0.65 },
  { id: 'triceps-pushdown', name: 'Разгибание рук на верхнем блоке', type: 'strength', met: 5.3, secondsPerRep: 4, loadFactor: 0.9 },
  { id: 'french-press', name: 'Французский жим', type: 'strength', met: 5.4, secondsPerRep: 4, loadFactor: 1 },
  { id: 'push-up', name: 'Отжимания', type: 'strength', met: 6, secondsPerRep: 3, loadFactor: 0 },
  { id: 'pull-up', name: 'Подтягивания', type: 'strength', met: 7, secondsPerRep: 4, loadFactor: 0 },
  { id: 'custom-strength', name: 'Другое силовое упражнение', type: 'strength', met: 5.5, secondsPerRep: 4, loadFactor: 0.8 },
  { id: 'running', name: 'Бег', type: 'cardio', met: 9.8, supportsIntervals: true },
  { id: 'elliptical', name: 'Эллиптический тренажёр (орбитрек)', type: 'cardio', met: 7 },
  { id: 'cycling', name: 'Велосипед / велотренажёр', type: 'cardio', met: 7.5 },
  { id: 'rowing-machine', name: 'Гребной тренажёр', type: 'cardio', met: 7 },
  { id: 'stair-stepper', name: 'Степпер / лестница', type: 'cardio', met: 8.8 },
  { id: 'jump-rope', name: 'Прыжки на скакалке', type: 'cardio', met: 11.8 },
  { id: 'swimming', name: 'Плавание', type: 'cardio', met: 7 },
  { id: 'brisk-walk', name: 'Быстрая ходьба / дорожка', type: 'cardio', met: 4.8 },
  { id: 'hiking', name: 'Поход / ходьба по пересечённой местности', type: 'cardio', met: 6 },
  { id: 'football', name: 'Футбол', type: 'cardio', met: 8 },
  { id: 'boxing', name: 'Бокс / работа с мешком', type: 'cardio', met: 8.5 },
  { id: 'plank', name: 'Планка / статические упражнения', type: 'cardio', met: 3.8 },
  { id: 'custom-cardio', name: 'Другая кардиотренировка', type: 'cardio', met: 6 }
];

function localDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function mergeDefaultProducts(products) {
  const existing = Array.isArray(products) ? products : [];
  const ids = new Set(existing.map(product => product.id));
  return [...existing, ...DEFAULT_PRODUCTS.filter(product => !ids.has(product.id))];
}

function defaultState() {
  return {
    goals: { kcal: 2200, p: 160, f: 75, c: 230 },
    profile: { weightKg: 75, strideCm: 72 },
    productCatalogVersion: PRODUCT_CATALOG_VERSION,
    products: DEFAULT_PRODUCTS,
    entries: [],
    activities: [],
    dailyMovement: {},
    selectedDate: localDateString()
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const defaults = defaultState();
    return {
      ...defaults,
      ...parsed,
      goals: { ...defaults.goals, ...(parsed.goals || {}) },
      profile: { ...defaults.profile, ...(parsed.profile || {}) },
      productCatalogVersion: PRODUCT_CATALOG_VERSION,
      products: num(parsed.productCatalogVersion) < PRODUCT_CATALOG_VERSION
        ? mergeDefaultProducts(parsed.products)
        : (Array.isArray(parsed.products) ? parsed.products : DEFAULT_PRODUCTS),
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      dailyMovement: parsed.dailyMovement && typeof parsed.dailyMovement === 'object' ? parsed.dailyMovement : {}
    };
  } catch {
    return defaultState();
  }
}

let state = loadState();
let runningIntervals = [];

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function num(v) { return Number(v) || 0; }
function round1(v) { return Math.round((num(v) + Number.EPSILON) * 10) / 10; }
function round2(v) { return Math.round((num(v) + Number.EPSILON) * 100) / 100; }
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
function uid() { return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`; }

function macrosFor(entry) {
  const factor = num(entry.grams) / 100;
  return { p: num(entry.p) * factor, f: num(entry.f) * factor, c: num(entry.c) * factor, kcal: num(entry.kcal) * factor };
}

function totalsFor(date) {
  return state.entries.filter(entry => entry.date === date).reduce((acc, entry) => {
    const macros = macrosFor(entry);
    acc.p += macros.p; acc.f += macros.f; acc.c += macros.c; acc.kcal += macros.kcal;
    return acc;
  }, { p: 0, f: 0, c: 0, kcal: 0 });
}

function walkingFor(date) {
  const saved = state.dailyMovement[date] || {};
  const steps = Math.max(0, num(saved.steps));
  const calculatedDistance = steps * num(state.profile.strideCm) / 100000;
  const distanceKm = Math.max(0, saved.distanceKm === '' || saved.distanceKm == null ? calculatedDistance : num(saved.distanceKm));
  const calories = num(state.profile.weightKg) * distanceKm * 0.5;
  return { steps, distanceKm, calories };
}

function activityTotalsFor(date) {
  const workoutCalories = state.activities
    .filter(activity => activity.date === date)
    .reduce((sum, activity) => sum + num(activity.calories), 0);
  const walking = walkingFor(date);
  return { workoutCalories, walking, calories: workoutCalories + walking.calories };
}

function kcalFromMet(met, minutes) {
  return num(met) * 3.5 * num(state.profile.weightKg) / 200 * Math.max(0, num(minutes));
}

function runningMet(speed) {
  const value = num(speed);
  if (value < 6.4) return 6;
  if (value < 8) return 8.3;
  if (value < 9.7) return 9.8;
  if (value < 11.3) return 11;
  if (value < 12.9) return 11.8;
  if (value < 14.5) return 12.8;
  return 14.5;
}

function strengthEstimate(exercise, sets, reps, liftedWeight, restSeconds) {
  const totalReps = Math.max(0, num(sets) * num(reps));
  const activeMinutes = totalReps * num(exercise.secondsPerRep || 4) / 60;
  const restMinutes = Math.max(0, num(sets) - 1) * Math.max(0, num(restSeconds)) / 60;
  const bodyWeight = Math.max(1, num(state.profile.weightKg));
  const loadBoost = clamp(num(liftedWeight) / bodyWeight * num(exercise.loadFactor), 0, 2.5);
  const calories = kcalFromMet(num(exercise.met) + loadBoost, activeMinutes) + kcalFromMet(2, restMinutes);
  return { calories, totalReps, minutes: activeMinutes + restMinutes, perRep: totalReps ? calories / totalReps : 0 };
}

function cardioEstimate(exercise, duration, distance, speed, intensity, intervals = []) {
  if (exercise.id === 'running' && intervals.length) {
    const result = intervals.reduce((acc, interval) => {
      const minutes = Math.max(0, num(interval.minutes));
      const intervalSpeed = Math.max(0, num(interval.speed));
      acc.minutes += minutes;
      acc.distance += intervalSpeed * minutes / 60;
      acc.calories += kcalFromMet(runningMet(intervalSpeed), minutes);
      return acc;
    }, { minutes: 0, distance: 0, calories: 0 });
    return result;
  }

  let minutes = Math.max(0, num(duration));
  let km = Math.max(0, num(distance));
  let kmh = Math.max(0, num(speed));
  if (!minutes && km && kmh) minutes = km / kmh * 60;
  if (!kmh && km && minutes) kmh = km / (minutes / 60);
  if (!km && kmh && minutes) km = kmh * minutes / 60;

  let met = num(exercise.met);
  if (exercise.id === 'running' && kmh) met = runningMet(kmh);
  else met *= ({ light: 0.78, moderate: 1, hard: 1.25 }[intensity] || 1);
  return { minutes, distance: km, calories: kcalFromMet(met, minutes), speed: kmh };
}

function humanDate(dateString) {
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const opts = { weekday: 'short', day: 'numeric', month: 'long' };
  let text = new Intl.DateTimeFormat('ru-RU', opts).format(date);
  text = text.charAt(0).toUpperCase() + text.slice(1);
  return dateString === localDateString() ? `Сегодня · ${text}` : text;
}

function offsetSelectedDate(days) {
  const [y, m, d] = state.selectedDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  state.selectedDate = localDateString(date);
  saveState();
  renderToday();
}

function setProgress(id, value, goal) {
  const pct = goal > 0 ? clamp(value / goal * 100, 0, 100) : 0;
  document.getElementById(id).style.width = `${pct}%`;
}

function renderToday() {
  const food = totalsFor(state.selectedDate);
  const activity = activityTotalsFor(state.selectedDate);
  const net = food.kcal - activity.calories;
  const remaining = state.goals.kcal - net;
  const calorieBudget = state.goals.kcal + activity.calories;

  document.getElementById('selected-date-label').textContent = humanDate(state.selectedDate);
  document.getElementById('kcal-total').textContent = Math.round(food.kcal);
  document.getElementById('kcal-goal').textContent = Math.round(state.goals.kcal);
  document.getElementById('kcal-burned').textContent = Math.round(activity.calories);
  document.getElementById('kcal-net').textContent = Math.round(net);
  document.getElementById('kcal-left').textContent = Math.round(remaining);
  document.getElementById('protein-total').textContent = round1(food.p);
  document.getElementById('fat-total').textContent = round1(food.f);
  document.getElementById('carb-total').textContent = round1(food.c);
  document.getElementById('protein-goal').textContent = round1(state.goals.p);
  document.getElementById('fat-goal').textContent = round1(state.goals.f);
  document.getElementById('carb-goal').textContent = round1(state.goals.c);
  setProgress('protein-progress', food.p, state.goals.p);
  setProgress('fat-progress', food.f, state.goals.f);
  setProgress('carb-progress', food.c, state.goals.c);
  const kcalPct = calorieBudget > 0 ? clamp(food.kcal / calorieBudget * 100, 0, 100) : 0;
  document.getElementById('calorie-ring').style.setProperty('--p', `${kcalPct}%`);

  renderActivity(activity);
  renderMeals();
}

function renderActivity(activity = activityTotalsFor(state.selectedDate)) {
  document.getElementById('activity-kcal-total').textContent = Math.round(activity.calories);
  document.getElementById('walking-steps-total').textContent = Math.round(activity.walking.steps).toLocaleString('ru-RU');
  document.getElementById('walking-distance-total').textContent = round2(activity.walking.distanceKm);
  document.getElementById('walking-kcal-total').textContent = Math.round(activity.walking.calories);

  const list = document.getElementById('activity-list');
  list.innerHTML = '';
  const activities = state.activities.filter(item => item.date === state.selectedDate);
  if (!activities.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-activity';
    empty.textContent = 'Тренировок пока нет';
    list.appendChild(empty);
    return;
  }
  for (const activityItem of activities) {
    const row = document.createElement('div');
    row.className = 'activity-row';
    const copy = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = activityItem.name;
    const details = document.createElement('small');
    details.textContent = `${activityItem.details} · ≈ ${Math.round(activityItem.calories)} ккал`;
    copy.append(title, details);
    const del = document.createElement('button');
    del.className = 'delete-entry';
    del.type = 'button';
    del.textContent = '×';
    del.setAttribute('aria-label', 'Удалить тренировку');
    del.addEventListener('click', () => deleteActivity(activityItem.id));
    row.append(copy, del);
    list.appendChild(row);
  }
}

function renderMeals() {
  const mealsEl = document.getElementById('meals');
  mealsEl.innerHTML = '';
  for (const [mealId, mealName] of MEALS) {
    const entries = state.entries.filter(entry => entry.date === state.selectedDate && entry.meal === mealId);
    const mealKcal = entries.reduce((sum, entry) => sum + macrosFor(entry).kcal, 0);
    const article = document.createElement('article');
    article.className = 'meal-card card';
    const header = document.createElement('div');
    header.className = 'meal-header';
    const heading = document.createElement('h3');
    heading.textContent = mealName;
    const kcal = document.createElement('span');
    kcal.textContent = `${Math.round(mealKcal)} ккал`;
    header.append(heading, kcal);
    article.appendChild(header);
    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-meal';
      empty.textContent = 'Пока ничего не добавлено';
      article.appendChild(empty);
    } else {
      for (const entry of entries) {
        const macrosValue = macrosFor(entry);
        const row = document.createElement('div');
        row.className = 'entry-row';
        const main = document.createElement('div');
        main.className = 'entry-main';
        const strong = document.createElement('strong');
        strong.textContent = entry.name;
        const small = document.createElement('small');
        small.textContent = `${round1(entry.grams)} г · ${Math.round(macrosValue.kcal)} ккал`;
        main.append(strong, small);
        const macros = document.createElement('div');
        macros.className = 'entry-macros';
        macros.textContent = `Б ${round1(macrosValue.p)} · Ж ${round1(macrosValue.f)} · У ${round1(macrosValue.c)}`;
        const del = document.createElement('button');
        del.className = 'delete-entry';
        del.type = 'button';
        del.textContent = '×';
        del.setAttribute('aria-label', 'Удалить');
        del.addEventListener('click', () => deleteEntry(entry.id));
        row.append(main, macros, del);
        article.appendChild(row);
      }
    }
    mealsEl.appendChild(article);
  }
}

function renderProducts() {
  const q = document.getElementById('product-search').value.trim().toLowerCase();
  const list = document.getElementById('products-list');
  list.innerHTML = '';
  const products = [...state.products]
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    .filter(product => product.name.toLowerCase().includes(q));
  for (const product of products) {
    const row = document.createElement('article'); row.className = 'product-row card';
    const copy = document.createElement('div');
    const strong = document.createElement('strong'); strong.textContent = product.name;
    const small = document.createElement('small');
    small.textContent = `${Math.round(product.kcal)} ккал · Б ${round1(product.p)} · Ж ${round1(product.f)} · У ${round1(product.c)} / 100 г`;
    copy.append(strong, small);
    const actions = document.createElement('div'); actions.className = 'product-actions';
    const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = '✎'; edit.setAttribute('aria-label', 'Редактировать'); edit.addEventListener('click', () => openProductDialog(product));
    const del = document.createElement('button'); del.type = 'button'; del.textContent = '×'; del.setAttribute('aria-label', 'Удалить'); del.addEventListener('click', () => deleteProduct(product.id));
    actions.append(edit, del); row.append(copy, actions); list.appendChild(row);
  }
}

function renderSettings() {
  document.getElementById('goal-kcal').value = state.goals.kcal;
  document.getElementById('goal-protein').value = state.goals.p;
  document.getElementById('goal-fat').value = state.goals.f;
  document.getElementById('goal-carb').value = state.goals.c;
  document.getElementById('profile-weight').value = state.profile.weightKg;
  document.getElementById('profile-stride').value = state.profile.strideCm;
}

function populateEntryProducts() {
  const select = document.getElementById('entry-product');
  const previous = select.value;
  select.innerHTML = '';
  [...state.products].sort((a, b) => a.name.localeCompare(b.name, 'ru')).forEach(product => {
    const option = document.createElement('option');
    option.value = product.id; option.textContent = product.name; select.appendChild(option);
  });
  if ([...select.options].some(option => option.value === previous)) select.value = previous;
  updateEntryPreview();
}

function populateExercises() {
  const select = document.getElementById('workout-exercise');
  select.innerHTML = '';
  for (const [type, label] of [['strength', 'Силовые'], ['cardio', 'Кардио и активность']]) {
    const group = document.createElement('optgroup');
    group.label = label;
    EXERCISES.filter(exercise => exercise.type === type).forEach(exercise => {
      const option = document.createElement('option');
      option.value = exercise.id; option.textContent = exercise.name; group.appendChild(option);
    });
    select.appendChild(group);
  }
}

function updateEntryPreview() {
  const product = state.products.find(item => item.id === document.getElementById('entry-product').value);
  const grams = num(document.getElementById('entry-grams').value);
  const preview = document.getElementById('entry-preview');
  if (!product) { preview.textContent = 'Добавьте продукт в базу.'; return; }
  const factor = grams / 100;
  preview.textContent = `${Math.round(product.kcal * factor)} ккал · Б ${round1(product.p * factor)} · Ж ${round1(product.f * factor)} · У ${round1(product.c * factor)}`;
}

function selectedExercise() {
  return EXERCISES.find(exercise => exercise.id === document.getElementById('workout-exercise').value) || EXERCISES[0];
}

function updateWorkoutFields() {
  const exercise = selectedExercise();
  const strength = exercise.type === 'strength';
  document.getElementById('strength-fields').classList.toggle('hidden', !strength);
  document.getElementById('cardio-fields').classList.toggle('hidden', strength);
  document.getElementById('running-interval-section').classList.toggle('hidden', !exercise.supportsIntervals);
  document.getElementById('speed-label').classList.toggle('hidden', exercise.id !== 'running' && exercise.id !== 'cycling' && exercise.id !== 'brisk-walk');
  updateWorkoutPreview();
}

function renderRunningIntervals() {
  const container = document.getElementById('running-intervals');
  container.innerHTML = '';
  runningIntervals.forEach((interval, index) => {
    const row = document.createElement('div');
    row.className = 'interval-row';
    const minutes = document.createElement('input');
    minutes.type = 'number'; minutes.min = '0.5'; minutes.step = '0.5'; minutes.inputMode = 'decimal'; minutes.value = interval.minutes; minutes.setAttribute('aria-label', 'Минуты');
    minutes.addEventListener('input', () => { runningIntervals[index].minutes = num(minutes.value); updateWorkoutPreview(); });
    const speed = document.createElement('input');
    speed.type = 'number'; speed.min = '1'; speed.max = '40'; speed.step = '0.1'; speed.inputMode = 'decimal'; speed.value = interval.speed; speed.setAttribute('aria-label', 'Скорость');
    speed.addEventListener('input', () => { runningIntervals[index].speed = num(speed.value); updateWorkoutPreview(); });
    const minutesUnit = document.createElement('span'); minutesUnit.textContent = 'мин';
    const speedUnit = document.createElement('span'); speedUnit.textContent = 'км/ч';
    const del = document.createElement('button'); del.type = 'button'; del.textContent = '×'; del.setAttribute('aria-label', 'Удалить отрезок');
    del.addEventListener('click', () => { runningIntervals.splice(index, 1); renderRunningIntervals(); updateWorkoutPreview(); });
    row.append(minutes, minutesUnit, speed, speedUnit, del);
    container.appendChild(row);
  });
}

function workoutEstimate() {
  const exercise = selectedExercise();
  if (exercise.type === 'strength') {
    return {
      exercise,
      ...strengthEstimate(
        exercise,
        document.getElementById('workout-sets').value,
        document.getElementById('workout-reps').value,
        document.getElementById('workout-weight').value,
        document.getElementById('workout-rest').value
      )
    };
  }
  return {
    exercise,
    ...cardioEstimate(
      exercise,
      document.getElementById('workout-duration').value,
      document.getElementById('workout-distance').value,
      document.getElementById('workout-speed').value,
      document.getElementById('workout-intensity').value,
      runningIntervals
    )
  };
}

function updateWorkoutPreview() {
  const estimate = workoutEstimate();
  const preview = document.getElementById('workout-preview');
  if (estimate.exercise.type === 'strength') {
    preview.textContent = `≈ ${Math.round(estimate.calories)} ккал за тренировку · ${estimate.totalReps} повторений · ≈ ${round2(estimate.perRep)} ккал за повторение`;
  } else {
    preview.textContent = `≈ ${Math.round(estimate.calories)} ккал · ${round1(estimate.minutes)} мин · ${round2(estimate.distance)} км`;
  }
}

function updateWalkingPreview() {
  const steps = Math.max(0, num(document.getElementById('walking-steps').value));
  const distanceRaw = document.getElementById('walking-distance').value.trim();
  const distance = distanceRaw ? Math.max(0, num(distanceRaw)) : steps * num(state.profile.strideCm) / 100000;
  const calories = num(state.profile.weightKg) * distance * 0.5;
  document.getElementById('walking-preview').textContent = `≈ ${round2(distance)} км · ≈ ${Math.round(calories)} ккал`;
}

function openWorkoutDialog() {
  runningIntervals = [];
  renderRunningIntervals();
  updateWorkoutFields();
  document.getElementById('workout-dialog').showModal();
}

function openWalkingDialog() {
  const saved = state.dailyMovement[state.selectedDate] || {};
  document.getElementById('walking-steps').value = num(saved.steps);
  document.getElementById('walking-distance').value = saved.distanceKm ?? '';
  updateWalkingPreview();
  document.getElementById('walking-dialog').showModal();
}

function deleteEntry(id) {
  state.entries = state.entries.filter(entry => entry.id !== id);
  saveState(); renderToday(); toast('Запись удалена');
}

function deleteActivity(id) {
  state.activities = state.activities.filter(activity => activity.id !== id);
  saveState(); renderToday(); toast('Тренировка удалена');
}

function deleteProduct(id) {
  const product = state.products.find(item => item.id === id);
  if (!product || !confirm(`Удалить «${product.name}» из базы? История питания сохранится.`)) return;
  state.products = state.products.filter(item => item.id !== id);
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
  const element = document.getElementById('toast');
  element.textContent = message; element.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => element.classList.remove('show'), 1800);
}

function showView(id) {
  document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === id));
  document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === id));
  if (id === 'products-view') renderProducts();
  if (id === 'settings-view') renderSettings();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
document.getElementById('prev-day').addEventListener('click', () => offsetSelectedDate(-1));
document.getElementById('next-day').addEventListener('click', () => offsetSelectedDate(1));
document.getElementById('today-button').addEventListener('click', () => { state.selectedDate = localDateString(); saveState(); renderToday(); });
document.getElementById('add-entry').addEventListener('click', () => { populateEntryProducts(); document.getElementById('entry-dialog').showModal(); });
document.getElementById('add-workout').addEventListener('click', openWorkoutDialog);
document.getElementById('edit-walking').addEventListener('click', openWalkingDialog);
document.getElementById('add-product').addEventListener('click', () => openProductDialog());
document.getElementById('product-search').addEventListener('input', renderProducts);
document.getElementById('entry-product').addEventListener('change', updateEntryPreview);
document.getElementById('entry-grams').addEventListener('input', updateEntryPreview);
document.getElementById('workout-exercise').addEventListener('change', updateWorkoutFields);
['workout-sets', 'workout-reps', 'workout-weight', 'workout-rest', 'workout-duration', 'workout-distance', 'workout-speed', 'workout-intensity']
  .forEach(id => document.getElementById(id).addEventListener('input', updateWorkoutPreview));
['walking-steps', 'walking-distance'].forEach(id => document.getElementById(id).addEventListener('input', updateWalkingPreview));
document.getElementById('add-running-interval').addEventListener('click', () => {
  runningIntervals.push({ minutes: 5, speed: runningIntervals.length ? runningIntervals[runningIntervals.length - 1].speed : 8 });
  renderRunningIntervals(); updateWorkoutPreview();
});
document.getElementById('install-help').addEventListener('click', () => document.getElementById('help-dialog').showModal());
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));

document.getElementById('entry-form').addEventListener('submit', event => {
  event.preventDefault();
  const product = state.products.find(item => item.id === document.getElementById('entry-product').value);
  const grams = num(document.getElementById('entry-grams').value);
  if (!product || grams <= 0) return;
  state.entries.push({ id: uid(), date: state.selectedDate, meal: document.getElementById('entry-meal').value, grams, name: product.name, p: product.p, f: product.f, c: product.c, kcal: product.kcal });
  saveState(); document.getElementById('entry-dialog').close(); renderToday(); toast('Добавлено');
});

document.getElementById('workout-form').addEventListener('submit', event => {
  event.preventDefault();
  const estimate = workoutEstimate();
  if (estimate.calories <= 0) { alert('Укажите объём тренировки: подходы и повторения либо время/интервалы.'); return; }
  let details;
  const activity = { id: uid(), date: state.selectedDate, exerciseId: estimate.exercise.id, name: estimate.exercise.name, type: estimate.exercise.type, calories: round2(estimate.calories) };
  if (estimate.exercise.type === 'strength') {
    const sets = num(document.getElementById('workout-sets').value);
    const reps = num(document.getElementById('workout-reps').value);
    const liftedWeight = num(document.getElementById('workout-weight').value);
    const restSeconds = num(document.getElementById('workout-rest').value);
    details = `${sets} × ${reps} · ${round1(liftedWeight)} кг`;
    Object.assign(activity, { sets, reps, liftedWeight, restSeconds, totalReps: estimate.totalReps });
  } else {
    details = `${round1(estimate.minutes)} мин${estimate.distance ? ` · ${round2(estimate.distance)} км` : ''}`;
    Object.assign(activity, {
      duration: estimate.minutes,
      distance: estimate.distance,
      speed: estimate.speed || 0,
      intensity: document.getElementById('workout-intensity').value,
      intervals: estimate.exercise.id === 'running' ? runningIntervals.map(interval => ({ ...interval })) : []
    });
  }
  activity.details = details;
  state.activities.push(activity);
  saveState(); document.getElementById('workout-dialog').close(); renderToday(); toast('Тренировка добавлена');
});

document.getElementById('walking-form').addEventListener('submit', event => {
  event.preventDefault();
  const steps = Math.max(0, Math.round(num(document.getElementById('walking-steps').value)));
  const distanceRaw = document.getElementById('walking-distance').value.trim();
  state.dailyMovement[state.selectedDate] = { steps, distanceKm: distanceRaw ? Math.max(0, num(distanceRaw)) : '' };
  saveState(); document.getElementById('walking-dialog').close(); renderToday(); toast('Ходьба сохранена');
});

document.getElementById('product-form').addEventListener('submit', event => {
  event.preventDefault();
  const id = document.getElementById('product-edit-id').value || uid();
  const p = num(document.getElementById('product-protein').value);
  const f = num(document.getElementById('product-fat').value);
  const c = num(document.getElementById('product-carb').value);
  const kcalRaw = document.getElementById('product-kcal').value.trim();
  const kcal = kcalRaw ? num(kcalRaw) : Math.round(p * 4 + f * 9 + c * 4);
  const product = { id, name: document.getElementById('product-name').value.trim(), p, f, c, kcal, builtIn: false };
  const index = state.products.findIndex(item => item.id === id);
  if (index >= 0) state.products[index] = product; else state.products.push(product);
  saveState(); document.getElementById('product-dialog').close(); renderProducts(); populateEntryProducts(); toast('Продукт сохранён');
});

document.getElementById('goals-form').addEventListener('submit', event => {
  event.preventDefault();
  state.goals = {
    kcal: num(document.getElementById('goal-kcal').value),
    p: num(document.getElementById('goal-protein').value),
    f: num(document.getElementById('goal-fat').value),
    c: num(document.getElementById('goal-carb').value)
  };
  saveState(); renderToday(); toast('Цели сохранены');
});

document.getElementById('profile-form').addEventListener('submit', event => {
  event.preventDefault();
  state.profile = {
    weightKg: clamp(num(document.getElementById('profile-weight').value), 25, 350),
    strideCm: clamp(num(document.getElementById('profile-stride').value), 30, 150)
  };
  saveState(); renderToday(); toast('Параметры сохранены');
});

document.getElementById('export-data').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob); anchor.download = `bju-backup-${localDateString()}.json`; anchor.click(); URL.revokeObjectURL(anchor.href);
});

document.getElementById('import-data').addEventListener('change', async event => {
  const file = event.target.files?.[0]; if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || !Array.isArray(parsed.products) || !Array.isArray(parsed.entries) || !parsed.goals) throw new Error();
    const defaults = defaultState();
    state = {
      ...defaults,
      ...parsed,
      goals: { ...defaults.goals, ...(parsed.goals || {}) },
      profile: { ...defaults.profile, ...(parsed.profile || {}) },
      productCatalogVersion: PRODUCT_CATALOG_VERSION,
      products: num(parsed.productCatalogVersion) < PRODUCT_CATALOG_VERSION
        ? mergeDefaultProducts(parsed.products)
        : parsed.products,
      entries: parsed.entries,
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      dailyMovement: parsed.dailyMovement && typeof parsed.dailyMovement === 'object' ? parsed.dailyMovement : {},
      selectedDate: localDateString()
    };
    saveState(); renderToday(); renderProducts(); renderSettings(); populateEntryProducts(); toast('Данные импортированы');
  } catch { alert('Не удалось импортировать файл. Проверьте, что это резервная копия БЖУ.'); }
  event.target.value = '';
});

populateExercises();
renderRunningIntervals();
renderToday();
renderProducts();
renderSettings();
populateEntryProducts();
updateWorkoutFields();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
