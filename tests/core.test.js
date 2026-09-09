const test = require('node:test');
const assert = require('node:assert/strict');
const Core = require('../core.js');

const defaults = [{ id: 'rice', name: 'Рис', p: 2.7, f: 0.3, c: 28, kcal: 130, builtIn: true }];

test('old state is migrated without losing diary entries', () => {
  const state = Core.normalizeState({
    selectedDate: '2026-09-09',
    goals: { kcal: 2100, p: 150, f: 70, c: 220 },
    profile: { weightKg: 80, strideCm: 75 },
    products: defaults,
    entries: [{ id: 'e1', date: '2026-09-09', meal: 'lunch', grams: 200, name: 'Рис', p: 2.7, f: 0.3, c: 28, kcal: 130 }]
  }, defaults);

  assert.equal(state.stateVersion, Core.STATE_VERSION);
  assert.equal(state.entries.length, 1);
  assert.equal(state.entries[0].grams, 200);
  assert.equal(state.selectedDate, '2026-09-09');
  assert.equal(state.goals.activityCredit, 0.5);
  assert.deepEqual(state.savedMeals, []);
  assert.deepEqual(state.wellness, {});
});

test('normalization rejects malformed records and clamps unsafe values', () => {
  const state = Core.normalizeState({
    products: [{ name: '' }],
    entries: [{ name: 'broken', date: 'not-a-date', grams: 10 }],
    wellness: { '2026-09-09': { sleepHours: 100, readiness: 99 } }
  }, defaults);

  assert.equal(state.products.length, 1);
  assert.equal(state.entries.length, 0);
  assert.equal(state.wellness['2026-09-09'].sleepHours, 24);
  assert.equal(state.wellness['2026-09-09'].readiness, 5);
});

test('macro, MET and target calculations remain deterministic', () => {
  assert.deepEqual(Core.macrosFor({ grams: 150, p: 10, f: 5, c: 20, kcal: 165 }), { p: 15, f: 7.5, c: 30, kcal: 247.5 });
  assert.equal(Core.runningMet(10), 11);
  assert.equal(Math.round(Core.kcalFromMet(6, 60, 80)), 504);
  assert.equal(Core.suggestedCalories({ weightKg: 80, heightCm: 180, age: 30, sex: 'male', activityLevel: 1.2 }, 'maintain'), 2136);
});

test('zero nutrition goals are preserved', () => {
  const state = Core.normalizeState({ goals: { kcal: 0, p: 0, f: 0, c: 0 } }, defaults);
  assert.deepEqual({ kcal: state.goals.kcal, p: state.goals.p, f: state.goals.f, c: state.goals.c }, { kcal: 0, p: 0, f: 0, c: 0 });
});
