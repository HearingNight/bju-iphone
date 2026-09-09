const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('every getElementById target exists in the page', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const htmlIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const requestedIds = new Set([...app.matchAll(/getElementById\('([^']+)'\)/g)].map(match => match[1]));
  const missing = [...requestedIds].filter(id => !htmlIds.has(id));
  assert.deepEqual(missing, []);
});

test('manifest is valid and offline shell lists every local script', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const worker = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8')));
  for (const match of html.matchAll(/<script src="([^"]+)"/g)) assert.ok(worker.includes(`'./${match[1]}'`));
});
