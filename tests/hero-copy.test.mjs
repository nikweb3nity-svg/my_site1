import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const expectedCopy = [
  'АВТОРСКАЯ ВЕБ-СТУДИЯ · РОССИЯ / МИР',
  'Создаем сайты под ключ: от структуры и визуальной концепции до разработки, адаптации и запуска.',
  'ОБСУДИТЬ ПРОЕКТ'
];

for (const phrase of expectedCopy) {
  if (!html.includes(phrase)) throw new Error(`Hero copy is missing: ${phrase}`);
}

console.log('Hero copy test passed.');
