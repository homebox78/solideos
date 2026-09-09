/**
 * SOLIDEO Design System — 토큰 검증
 *
 *   node tokens/verify.mjs
 *
 * 디자인 시스템이 스스로 지켜야 할 규칙을 CI에서 강제합니다.
 * 새 토큰을 추가하거나 값을 바꾼 뒤 반드시 통과해야 합니다.
 *
 *   1. 시맨틱 토큰은 primitive만 참조한다 (시맨틱→시맨틱 참조 금지)
 *   2. 텍스트 토큰은 흰 배경에서 4.5:1 이상 (KWCAG 2.2 AA)
 *   3. 큰 텍스트 · UI 요소는 3:1 이상
 *   4. 참조가 모두 해석된다
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const src = JSON.parse(readFileSync(join(HERE, 'tokens.json'), 'utf8'));

function flatten(node, path = [], out = []) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out.push({ path: [...path, k], value: v.$value, type: v.$type });
    else if (v && typeof v === 'object') flatten(v, [...path, k], out);
  }
  return out;
}

const tokens = flatten(src);
const byPath = new Map(tokens.map((t) => [t.path.join('.'), t]));
const ref = (v) => (typeof v === 'string' ? v.match(/^\{([^}]+)\}$/)?.[1] : null);

function resolve(v, seen = new Set()) {
  const r = ref(v);
  if (!r) return v;
  if (seen.has(r)) throw new Error(`순환 참조: ${r}`);
  const t = byPath.get(r);
  if (!t) throw new Error(`참조 없음: ${r}`);
  return resolve(t.value, new Set([...seen, r]));
}

/* ------------------------------------------------------------- 대비 계산 */
function parse(hexOrRgba) {
  const h = hexOrRgba.trim();
  if (h.startsWith('#')) {
    const s = h.length === 4
      ? h.slice(1).split('').map((c) => c + c).join('')
      : h.slice(1);
    return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
  }
  const m = h.match(/rgba?\(([^)]+)\)/);
  if (m) return m[1].split(',').slice(0, 3).map((n) => parseFloat(n));
  return null;
}

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const [l1, l2] = [luminance(parse(a)), luminance(parse(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

/* ------------------------------------------------------------------ 규칙 */
const errors = [];
const warns = [];
const ok = [];

/* 1 · 4 — 참조 해석 및 계층 규칙 */
for (const t of tokens) {
  const p = t.path.join('.');
  const r = ref(t.value);
  if (r) {
    try { resolve(t.value); } catch (e) { errors.push(`${p}: ${e.message}`); continue; }
    if (t.path[0] === 'semantic' && !r.startsWith('primitive.')) {
      errors.push(`${p}: 시맨틱 토큰은 primitive만 참조해야 합니다 (현재 ${r})`);
    }
    if (t.path[0] === 'primitive' && r.startsWith('semantic.')) {
      errors.push(`${p}: primitive는 시맨틱을 참조할 수 없습니다`);
    }
  }
}

/* 2 — 텍스트 대비 */
const WHITE = '#FFFFFF';
const GRAY_BG = resolve('{primitive.gray.50}');
const TEXT_MIN = 4.5;
const UI_MIN = 3.0;

const textTokens = tokens.filter((t) => t.path[0] === 'semantic' && t.path[1] === 'text');
for (const t of textTokens) {
  const name = t.path.slice(1).join('.');
  if (name === 'text.inverse') continue;                 /* 반전 배경 전용 */
  const hex = resolve(t.value);
  const cw = contrast(hex, WHITE);
  const cg = contrast(hex, GRAY_BG);
  if (name === 'text.disabled') {                        /* 비활성은 대비 예외 */
    ok.push(`${name.padEnd(22)} ${hex}  white ${cw.toFixed(2)}:1  (비활성 예외)`);
    continue;
  }
  const line = `${name.padEnd(22)} ${hex}  white ${cw.toFixed(2)}:1  gray.50 ${cg.toFixed(2)}:1`;
  if (cw < TEXT_MIN) errors.push(`${line}  ← 흰 배경 4.5:1 미달`);
  else if (cg < TEXT_MIN) warns.push(`${line}  ← 회색 배경에서 4.5:1 미달. 한 단계 높은 토큰을 쓰세요`);
  else ok.push(line);
}

/* 3 — UI 요소 대비 */
const UI_CHECKS = [
  ['fill.accent (버튼 배경 vs 흰 배경)', '{semantic.fill.accent}', WHITE, UI_MIN],
  ['fill.accent vs text.inverse (버튼 위 흰 글자)', '{semantic.fill.accent}', '#FFFFFF', TEXT_MIN],
  ['fill.critical vs text.inverse', '{semantic.fill.critical}', '#FFFFFF', TEXT_MIN],
  ['border.strong vs 흰 배경', '{semantic.border.strong}', WHITE, UI_MIN],
  ['border.focus vs 흰 배경', '{semantic.border.focus}', WHITE, UI_MIN],
  ['icon.tertiary vs 흰 배경', '{semantic.icon.tertiary}', WHITE, UI_MIN],
];
for (const [label, tok, bg, min] of UI_CHECKS) {
  const hex = resolve(tok);
  const c = contrast(hex, bg);
  const line = `${label.padEnd(46)} ${hex}  ${c.toFixed(2)}:1 (기준 ${min})`;
  if (c < min) errors.push(`${line}  ← 미달`);
  else ok.push(line);
}


/* ------------------------------------------------------- 다크 모드 대비 */
/*
 * 다크 모드는 Primitive 를 재사용하고 Semantic 매핑만 뒤집으므로,
 * 밝은 모드에서 통과했다고 어두운 모드도 통과하는 것이 아닙니다.
 * 매핑 표를 빌더와 같은 값으로 두고 여기서도 검사합니다.
 */
const DARK = {
  'text.primary': 'gray.25',
  'text.secondary': 'gray.200',
  'text.tertiary': 'gray.300',
  'text.accent': 'crimson.300',
  'text.critical': 'red.300',
  'text.positive': 'green.300',
  'text.caution': 'amber.300',
  'text.info': 'blue.300',
  'border.strong': 'gray.500',
  'border.focus': 'blue.300',
  'icon.tertiary': 'gray.400',
};
const DARK_BG = resolve('{primitive.gray.900}');

for (const [name, prim] of Object.entries(DARK)) {
  const hex = resolve(`{primitive.${prim}}`);
  const c = contrast(hex, DARK_BG);
  const min = name.startsWith('text.') ? TEXT_MIN : UI_MIN;
  const line = `${('dark ' + name).padEnd(24)} ${hex}  gray.900 ${c.toFixed(2)}:1 (기준 ${min})`;
  if (c < min) errors.push(`${line}  ← 미달`);
  else ok.push(line);
}

/* 5 — Accent와 Critical이 서로 충분히 구별되는가 */
const accentVsCritical = contrast(resolve('{semantic.fill.accent}'), resolve('{semantic.fill.critical}'));
if (accentVsCritical < 1.2) {
  warns.push(`fill.accent 와 fill.critical 이 너무 비슷합니다 (${accentVsCritical.toFixed(2)}:1). ` +
             `두 색을 같은 화면에 나란히 두지 마세요.`);
}

/* ------------------------------------------------------------------ 출력 */
console.log(`\nSOLIDEO Design System — 토큰 검증 (v${src.$version}, ${tokens.length}개)\n`);
for (const l of ok) console.log(`  PASS  ${l}`);
if (warns.length) {
  console.log('');
  for (const w of warns) console.log(`  WARN  ${w}`);
}
if (errors.length) {
  console.log('');
  for (const e of errors) console.log(`  FAIL  ${e}`);
  console.log(`\n실패 ${errors.length}건. 토큰을 수정한 뒤 다시 실행하세요.\n`);
  process.exit(1);
}
console.log(`\n통과 ${ok.length}건${warns.length ? ` · 경고 ${warns.length}건` : ''}. 문제 없습니다.\n`);
