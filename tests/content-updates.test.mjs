import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

assert.match(html, /Мы не украшаем готовые проекты\./);
assert.match(html, /Никита Росляков/);
assert.match(html, /Анастасия Власова/);
assert.match(html, /assets\/team-nikita\.webp/);
assert.match(html, /assets\/team-anastasia\.webp/);
assert.match(css, /\.portrait img \{ display: block; width: 100%; height: auto; \}/);
assert.match(css, /\.people \{ display: grid; grid-template-columns: repeat\(2, minmax\(0, 1fr\)\); width: min\(100%, 500px\); margin: 0 auto;/);
assert.match(html, /Маленькая команда\.<br \/>Максимум внимания\./);
assert.match(html, /<em>её успешной\.<\/em>/);
assert.doesNotMatch(html, /Саша Миронов/);
assert.equal((html.match(/<article class="person reveal">/g) ?? []).length, 2);

console.log('Content update checks passed.');
