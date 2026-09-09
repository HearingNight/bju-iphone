(function initBjuCore(global) {
  'use strict';

  const STATE_VERSION = 4;

  function num(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function round1(value) { return Math.round((num(value) + Number.EPSILON) * 10) / 10; }
  function round2(value) { return Math.round((num(value) + Number.EPSILON) * 100) / 100; }
  function clamp(value, min, max) { return Math.min(Math.max(num(value), min), max); }

  function localDateString(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function isDateString(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
  }

  function text(value, max = 120) { return String(value || '').trim().slice(0, max); }
  function uid(prefix = 'item') {
    return global.crypto?.randomUUID ? global.crypto.randomUUID() : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalizedProductName(value) {
    return text(value, 160)
      .toLocaleLowerCase('ru-RU')
      .replace(/ё/g, 'е')
      .replace(/[.,;:()\[\]{}"'«»]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  function normalizeProduct(product, index = 0) {
    const name = text(product?.name, 80);
    if (!name) return null;
    return {
      id: text(product?.id, 100) || `product-${index}-${normalizedProductName(name).replace(/\s/g, '-')}`,
      name,
      p: clamp(product?.p, 0, 1000),
      f: clamp(product?.f, 0, 1000),
      c: clamp(product?.c, 0, 1000),
      kcal: clamp(product?.kcal, 0, 10000),
      builtIn: Boolean(product?.builtIn),
      favorite: Boolean(product?.favorite),
      servingName: text(product?.servingName, 30) || 'порция',
      servingGrams: clamp(product?.servingGrams || 100, 0.1, 10000)
    };
  }

  function mergeDefaultProducts(products, defaultProducts) {
    const byName = new Map();
    const ids = new Set();
    [...(Array.isArray(products) ? products : [])].slice(0, 10000).forEach((item, index) => {
      const product = normalizeProduct(item, index);
      if (!product) return;
      const key = normalizedProductName(product.name);
      const previous = byName.get(key);
      if (!previous || (previous.builtIn && !product.builtIn)) byName.set(key, product);
    });
    for (const product of byName.values()) ids.add(product.id);
    (Array.isArray(defaultProducts) ? defaultProducts : []).forEach((item, index) => {
      const product = normalizeProduct(item, index);
      if (!product) return;
      const key = normalizedProductName(product.name);
      if (!ids.has(product.id) && !byName.has(key)) byName.set(key, product);
    });
    return [...byName.values()];
  }

  function normalizeEntry(entry, index = 0) {
    const name = text(entry?.name, 80);
    if (!name || !isDateString(entry?.date)) return null;
    const meal = ['breakfast', 'lunch', 'dinner', 'snack'].includes(entry.meal) ? entry.meal : 'snack';
    return {
      id: text(entry.id, 100) || `entry-${index}-${entry.date}`,
      date: entry.date,
      meal,
      grams: clamp(entry.grams, 0.1, 100000),
      name,
      productId: text(entry.productId, 100),
      p: clamp(entry.p, 0, 1000), f: clamp(entry.f, 0, 1000), c: clamp(entry.c, 0, 1000), kcal: clamp(entry.kcal, 0, 10000)
    };
  }

  function normalizeSet(set, index = 0) {
    return {
      id: KensafeId(set?.id, `set-${index}`),
      reps: clamp(set?.reps, 0, 1000),
      weight: clamp(set?.weight, 0, 2000),
      done: set?.done !== false
    };
  }

  function KensafeId(value, fallback) { return text(value, 100) || fallback; }

  function normalizeActivity(activity, index = 0) {
    if (!isDateString(activity?.date) || !text(activity?.name, 80)) return null;
    const type = activity.type === 'cardio' ? 'cardio' : 'strength';
    const sets = Array.isArray(activity.setDetails)
      ? activity.setDetails.slice(0, 100).map(normalizeSet)
      : [];
    return {
      ...activity,
      id: KensafeId(activity.id, `activity-${index}-${activity.date}`),
      date: activity.date,
      exerciseId: text(activity.exerciseId, 100),
      name: text(activity.name, 80),
      type,
      calories: clamp(activity.calories, 0, 100000),
      details: text(activity.details, 240),
      sets: clamp(activity.sets, 0, 100), reps: clamp(activity.reps, 0, 1000),
      liftedWeight: clamp(activity.liftedWeight, 0, 2000), restSeconds: clamp(activity.restSeconds, 0, 3600),
      duration: clamp(activity.duration, 0, 1440), distance: clamp(activity.distance, 0, 10000), speed: clamp(activity.speed, 0, 300),
      intensity: ['light', 'moderate', 'hard'].includes(activity.intensity) ? activity.intensity : 'moderate',
      setDetails: sets,
      intervals: Array.isArray(activity.intervals) ? activity.intervals.slice(0, 100).map(interval => ({ minutes: clamp(interval?.minutes, 0, 1440), speed: clamp(interval?.speed, 0, 100) })) : []
    };
  }

  function normalizeSavedMeal(meal, index = 0) {
    const name = text(meal?.name, 80);
    if (!name || !Array.isArray(meal.entries)) return null;
    const entries = meal.entries.slice(0, 100).map((entry, entryIndex) => {
      const normalized = normalizeEntry({ ...entry, date: '2000-01-01', meal: 'snack' }, entryIndex);
      if (normalized) { delete normalized.date; delete normalized.meal; delete normalized.id; }
      return normalized;
    }).filter(Boolean);
    if (!entries.length) return null;
    return {
      id: KensafeId(meal.id, `saved-meal-${index}`),
      name,
      meal: ['breakfast', 'lunch', 'dinner', 'snack'].includes(meal.meal) ? meal.meal : 'snack',
      entries
    };
  }

  function normalizeTemplate(template, index = 0) {
    const name = text(template?.name, 80);
    if (!name || !Array.isArray(template.activities)) return null;
    return {
      id: KensafeId(template.id, `template-${index}`),
      name,
      activities: template.activities.slice(0, 50).map((activity, activityIndex) => normalizeActivity({ ...activity, date: '2000-01-01' }, activityIndex)).filter(Boolean)
    };
  }

  function normalizeKeyedObject(source, mapper) {
    const output = {};
    if (!source || typeof source !== 'object' || Array.isArray(source)) return output;
    Object.entries(source).slice(0, 5000).forEach(([date, value]) => {
      if (isDateString(date)) output[date] = mapper(value || {});
    });
    return output;
  }

  function normalizeState(input, defaultProducts = []) {
    const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    const selectedDate = isDateString(source.selectedDate) ? source.selectedDate : localDateString();
    const products = mergeDefaultProducts(source.products, defaultProducts);
    return {
      stateVersion: STATE_VERSION,
      productCatalogVersion: 4,
      goals: {
        kcal: clamp(source.goals?.kcal ?? 2200, 0, 20000), p: clamp(source.goals?.p ?? 160, 0, 2000),
        f: clamp(source.goals?.f ?? 75, 0, 2000), c: clamp(source.goals?.c ?? 230, 0, 3000),
        activityCredit: clamp(source.goals?.activityCredit ?? 0.5, 0, 1),
        mode: ['lose', 'maintain', 'gain'].includes(source.goals?.mode) ? source.goals.mode : 'maintain'
      },
      profile: {
        weightKg: clamp(source.profile?.weightKg ?? 75, 25, 350), strideCm: clamp(source.profile?.strideCm ?? 72, 30, 150),
        heightCm: clamp(source.profile?.heightCm ?? 175, 100, 250), age: clamp(source.profile?.age ?? 30, 14, 100),
        sex: source.profile?.sex === 'female' ? 'female' : 'male',
        activityLevel: clamp(source.profile?.activityLevel ?? 1.375, 1.2, 1.9)
      },
      products,
      entries: (Array.isArray(source.entries) ? source.entries : []).slice(0, 100000).map(normalizeEntry).filter(Boolean),
      activities: (Array.isArray(source.activities) ? source.activities : []).slice(0, 50000).map(normalizeActivity).filter(Boolean),
      dailyMovement: normalizeKeyedObject(source.dailyMovement, value => ({ steps: clamp(value.steps, 0, 500000), distanceKm: value.distanceKm === '' ? '' : clamp(value.distanceKm, 0, 500) })),
      wellness: normalizeKeyedObject(source.wellness, value => ({
        sleepHours: clamp(value.sleepHours, 0, 24), sleepQuality: clamp(value.sleepQuality, 0, 5),
        fatigue: clamp(value.fatigue, 0, 5), readiness: clamp(value.readiness, 0, 5), weightKg: value.weightKg === '' || value.weightKg == null ? '' : clamp(value.weightKg, 25, 350)
      })),
      savedMeals: (Array.isArray(source.savedMeals) ? source.savedMeals : []).slice(0, 500).map(normalizeSavedMeal).filter(Boolean),
      workoutTemplates: (Array.isArray(source.workoutTemplates) ? source.workoutTemplates : []).slice(0, 200).map(normalizeTemplate).filter(Boolean),
      recentProductIds: (Array.isArray(source.recentProductIds) ? source.recentProductIds : []).map(value => text(value, 100)).filter(Boolean).slice(0, 20),
      selectedDate,
      lastBackupAt: /^\d{4}-\d{2}-\d{2}T/.test(String(source.lastBackupAt || '')) ? String(source.lastBackupAt) : ''
    };
  }

  function macrosFor(entry) {
    const factor = num(entry?.grams) / 100;
    return { p: num(entry?.p) * factor, f: num(entry?.f) * factor, c: num(entry?.c) * factor, kcal: num(entry?.kcal) * factor };
  }

  function kcalFromMet(met, minutes, weightKg) { return num(met) * 3.5 * num(weightKg) / 200 * Math.max(0, num(minutes)); }
  function runningMet(speed) {
    const value = num(speed);
    if (value < 6.4) return 6; if (value < 8) return 8.3; if (value < 9.7) return 9.8;
    if (value < 11.3) return 11; if (value < 12.9) return 11.8; if (value < 14.5) return 12.8; return 14.5;
  }

  function suggestedCalories(profile, mode = 'maintain') {
    const base = 10 * num(profile.weightKg) + 6.25 * num(profile.heightCm) - 5 * num(profile.age) + (profile.sex === 'female' ? -161 : 5);
    const maintenance = base * clamp(profile.activityLevel, 1.2, 1.9);
    return Math.max(1200, Math.round(maintenance + ({ lose: -350, maintain: 0, gain: 250 }[mode] || 0)));
  }

  const api = { STATE_VERSION, num, round1, round2, clamp, localDateString, isDateString, text, uid, normalizedProductName, normalizeState, macrosFor, kcalFromMet, runningMet, suggestedCalories };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.BJUCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
