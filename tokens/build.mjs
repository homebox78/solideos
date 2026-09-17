/**
 * SOLIDEO Design System — 토큰 빌드
 *
 *   node tokens/build.mjs
 *
 * tokens/tokens.json(단일 원본) 하나를 읽어 각 스택이 소비할 산출물을 만듭니다.
 * 의존성 없음 — Node 18+ 만 있으면 어떤 CI에서도 돕니다.
 *
 * 산출물
 *   dist/solideo-tokens.css         순수 HTML · JSP · Thymeleaf · 모든 프레임워크
 *   dist/solideo-tokens.scss        Sass 프로젝트
 *   dist/solideo-tokens.less        Less 프로젝트 (레거시 SI)
 *   dist/solideo-tokens.js          React · Vue · Angular (ESM)
 *   dist/solideo-tokens.cjs         Node · 빌드 스크립트 (CommonJS)
 *   dist/solideo-tokens.d.ts        TypeScript 타입
 *   dist/solideo-tokens.properties  Spring · eGovFrame (서버 렌더링 · 메일 템플릿)
 *   dist/solideo-tokens.flat.json   Figma Tokens · Style Dictionary · 외부 도구
 *   dist/tailwind.preset.cjs        Tailwind 사용 프로젝트
 *   app/src/styles/*.css            문서 사이트가 쓰는 사본
 *   app/public/dist/*               문서 사이트에서 내려받는 사본
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const DIST = join(ROOT, 'dist');

const src = JSON.parse(readFileSync(join(HERE, 'tokens.json'), 'utf8'));

/* ------------------------------------------------------------------ 평탄화 */
/** {"semantic":{"text":{"primary":{...}}}} → [{ path:["semantic","text","primary"], ... }] */
function flatten(node, path = [], out = []) {
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && '$value' in value) {
      out.push({ path: [...path, key], value: value.$value, type: value.$type, desc: value.$description });
    } else if (value && typeof value === 'object') {
      flatten(value, [...path, key], out);
    }
  }
  return out;
}

const tokens = flatten(src);

/**
 * CSS 변수명 규칙: 첫 세그먼트가 primitive/semantic이면 떼어냅니다.
 *   primitive.gray.900   → --gray-900
 *   semantic.text.primary → --text-primary
 *   space.4               → --space-4
 *   font.size.body        → --font-size-body
 */
function varName(path) {
  const p = path[0] === 'primitive' || path[0] === 'semantic' ? path.slice(1) : path;
  return p.join('-');
}

const byPath = new Map(tokens.map((t) => [t.path.join('.'), t]));

/** {primitive.gray.900} 참조를 해석합니다. */
function resolve(value, seen = new Set()) {
  if (typeof value !== 'string') return value;
  const m = value.match(/^\{([^}]+)\}$/);
  if (!m) return value;
  if (seen.has(m[1])) throw new Error(`토큰 순환 참조: ${m[1]}`);
  const target = byPath.get(m[1]);
  if (!target) throw new Error(`토큰 참조를 찾을 수 없습니다: ${m[1]}`);
  return resolve(target.value, new Set([...seen, m[1]]));
}

/** CSS에서는 참조를 var()로 남겨 런타임 테마 교체가 가능하게 합니다. */
function cssValue(value) {
  if (typeof value !== 'string') return String(value);
  const m = value.match(/^\{([^}]+)\}$/);
  return m ? `var(--${varName(m[1].split('.'))})` : value;
}

const resolved = tokens.map((t) => ({ ...t, name: varName(t.path), flat: resolve(t.value) }));

/* --------------------------------------------------------- 이전 명칭 alias */
/* 기존 SI 프로젝트가 v0 이름으로 붙어 있을 수 있어 한 버전 더 유지합니다. */
const ALIASES = [
  ['color-brand', 'fill-accent'],
  ['color-brand-hover', 'fill-accent-hover'],
  ['color-brand-pressed', 'fill-accent-pressed'],
  ['color-brand-subtle', 'fill-accent-subtle'],
  ['color-brand-border', 'crimson-200'],
  ['color-bg', 'bg-primary'],
  ['color-bg-page', 'bg-primary'],
  ['color-bg-subtle', 'bg-secondary'],
  ['color-bg-muted', 'fill-secondary'],
  ['color-bg-inverse', 'bg-inverse'],
  ['color-text', 'text-primary'],
  ['color-text-secondary', 'text-secondary'],
  ['color-text-tertiary', 'text-tertiary'],
  ['color-text-inverse', 'text-inverse'],
  ['color-text-brand', 'text-accent'],
  ['color-border', 'border-primary'],
  ['color-border-strong', 'border-strong'],
  ['color-focus', 'border-focus'],
  ['color-gray-ghost', 'gray-200'],
  ['color-success', 'text-positive'],
  ['color-warning', 'text-caution'],
  ['color-danger', 'fill-critical'],
  ['color-info', 'blue-500'],
  ['sds-ink', 'ink-700'],
  ['sds-gray-100', 'gray-100'],
  ['sds-gray-200', 'gray-200'],
  ['sds-gray-300', 'gray-300'],
  ['sds-gray-900', 'gray-900'],
  ['sds-red-300', 'crimson-300'],
  ['sds-red-500', 'crimson-500'],
  ['sds-red-700', 'crimson-700'],
  ['sds-blue-500', 'blue-500'],
];

const HEAD = (what) =>
  `/* SOLIDEO Design System — ${what}\n` +
  `   자동 생성 파일입니다. 직접 수정하지 마세요.\n` +
  `   원본: tokens/tokens.json · 생성: node tokens/build.mjs\n` +
  `   version ${src.$version} */\n\n`;

/* --------------------------------------------------------------------- CSS */
function buildCss() {
  const lines = [HEAD('CSS Custom Properties') + ':root {'];
  let group = '';
  for (const t of resolved) {
    const g = (t.path.slice(0, -1).join('.') || t.path[0]).replace(/^(primitive|semantic)\./, '');
    if (g !== group) { group = g; lines.push(`\n  /* ${g} */`); }
    lines.push(`  --${t.name}: ${cssValue(t.value)};${t.desc ? ` /* ${t.desc} */` : ''}`);
  }
  lines.push('\n  /* alias — 이전 명칭. 신규 코드에서는 사용하지 마세요. */');
  for (const [from, to] of ALIASES) lines.push(`  --${from}: var(--${to});`);
  lines.push('}\n');
  /* KRDS 글자 크기 설정 — 글자 크기 토큰이 전부 rem 이라 루트 크기만 바꾸면 전체가 비례합니다.
     토큰 CSS 에 실어야 React 가 아닌 프로젝트(HTML · JSP)에서도 설정이 동작합니다. */
  lines.push('/* KRDS 글자 크기 설정 · <html data-font-scale="base | lg | xl"> */');
  lines.push('html[data-font-scale="lg"] { font-size: 112.5%; }');
  lines.push('html[data-font-scale="xl"] { font-size: 125%; }\n');
  return lines.join('\n');
}

/* -------------------------------------------------------------------- SCSS */
function buildScss() {
  const lines = [HEAD('Sass variables').replace(/\/\*|\*\//g, '//').replace(/^\/\/ /gm, '// ')];
  for (const t of resolved) lines.push(`$${t.name}: ${t.flat};`);
  lines.push('\n$solideo-tokens: (');
  lines.push(resolved.map((t) => `  "${t.name}": ${t.flat}`).join(',\n'));
  lines.push(');\n');
  return lines.join('\n');
}

/* -------------------------------------------------------------------- LESS */
function buildLess() {
  return HEAD('Less variables') + resolved.map((t) => `@${t.name}: ${t.flat};`).join('\n') + '\n';
}

/* ------------------------------------------------------------------ JS / TS */
function jsObject() {
  const obj = {};
  for (const t of resolved) obj[camel(t.name)] = t.flat;
  return obj;
}
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

function buildJs() {
  const o = jsObject();
  const body = Object.entries(o).map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`).join('\n');
  return HEAD('ESM') + `export const tokens = {\n${body}\n};\n\nexport default tokens;\n`;
}
function buildCjs() {
  const o = jsObject();
  const body = Object.entries(o).map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`).join('\n');
  return HEAD('CommonJS') + `const tokens = {\n${body}\n};\n\nmodule.exports = tokens;\nmodule.exports.tokens = tokens;\n`;
}
function buildDts() {
  const o = jsObject();
  const body = Object.keys(o).map((k) => `  readonly ${k}: string;`).join('\n');
  return HEAD('TypeScript declarations') +
    `export interface SolideoTokens {\n${body}\n}\n\nexport declare const tokens: SolideoTokens;\nexport default tokens;\n`;
}

/* -------------------------------------------- Java / Spring / eGovFrame용 */
function buildProperties() {
  const head = `# SOLIDEO Design System — ${src.$version}\n` +
    `# 자동 생성 파일입니다. 직접 수정하지 마세요. (원본: tokens/tokens.json)\n` +
    `# Spring: @PropertySource("classpath:solideo-tokens.properties")\n` +
    `# JSP:    <spring:eval expression="@environment.getProperty('solideo.fill.accent')" />\n\n`;
  return head + resolved.map((t) => `solideo.${t.path.filter((p) => p !== 'primitive' && p !== 'semantic').join('.')}=${t.flat}`).join('\n') + '\n';
}

/* ---------------------------------------------------- 외부 도구용 flat JSON */
function buildFlatJson() {
  const o = {};
  for (const t of resolved) o[t.name] = { value: t.flat, type: t.type, ...(t.desc ? { description: t.desc } : {}) };
  return JSON.stringify({ version: src.$version, tokens: o }, null, 2) + '\n';
}

/* ------------------------------------------------------------- Tailwind용 */
function buildTailwind() {
  const pick = (prefix) => Object.fromEntries(
    resolved.filter((t) => t.name.startsWith(prefix + '-'))
      .map((t) => [t.name.slice(prefix.length + 1), `var(--${t.name})`]));
  const preset = {
    theme: {
      extend: {
        colors: {
          text: pick('text'), bg: pick('bg'), fill: pick('fill'),
          border: pick('border'), icon: pick('icon'),
          gray: pick('gray'), crimson: pick('crimson'), ink: pick('ink'),
        },
        spacing: pick('space'),
        borderRadius: pick('radius'),
        boxShadow: pick('shadow'),
        fontFamily: { sans: 'var(--font-family-sans)', mono: 'var(--font-family-mono)' },
      },
    },
  };
  return `// SOLIDEO Design System — Tailwind preset (${src.$version})\n` +
    `// 자동 생성 파일입니다. solideo-tokens.css 를 함께 불러와야 var() 가 해석됩니다.\n` +
    `module.exports = ${JSON.stringify(preset, null, 2)};\n`;
}

/* ------------------------------------------------ Quasar (Vue) SASS 변수 */
/* Quasar는 $primary/$negative 같은 고정된 브랜드 변수명을 씁니다. */
function buildQuasar() {
  const v = (p) => resolve(`{${p}}`);
  const map = [
    ['primary',   'semantic.fill.accent',      '주요 행동 · 브랜드'],
    ['secondary', 'semantic.accent.secondary', '보조 강조'],
    ['accent',    'primitive.crimson.400',     '포인트'],
    ['dark',      'primitive.gray.900',        '다크 표면'],
    ['dark-page', 'primitive.gray.850',        '다크 배경'],
    ['positive',  'semantic.text.positive',    '성공'],
    ['negative',  'semantic.fill.critical',    '오류 · 삭제'],
    ['info',      'primitive.blue.500',        '안내'],
    ['warning',   'semantic.text.caution',     '주의'],
  ];
  let s = `// SOLIDEO Design System — Quasar SASS variables (${src.$version})\n` +
          `// 자동 생성 파일입니다. src/quasar-variables.sass 로 복사해 사용하세요.\n` +
          `// quasar.config.js → framework: { config: { brand: { ... } } } 대신 이 파일을 씁니다.\n\n`;
  for (const [name, path, desc] of map) s += `$${name.padEnd(10)}: ${v(path)}   // ${desc}\n`;
  s += `\n// 솔리데오 전체 팔레트 (필요할 때 직접 참조)\n`;
  for (const t of resolved) s += `$sds-${t.name}: ${t.flat}\n`;
  s += `\n// 타이포 · 간격\n$typography-font-family: ${resolve('{font.family.sans}')}\n`;
  s += `$button-border-radius: ${resolve('{radius.sm}')}\n`;
  s += `$generic-border-radius: ${resolve('{radius.md}')}\n`;
  return s;
}

/* ------------------------------------------------- Java / Spring Boot 상수 */
function buildJava() {
  const constName = (t) => t.path
    .filter((p) => p !== 'primitive' && p !== 'semantic')
    .join('_').replace(/-/g, '_').toUpperCase();
  const body = resolved
    .map((t) => `    /** ${t.path.join('.')}${t.desc ? ' — ' + t.desc : ''} */\n` +
                `    public static final String ${constName(t)} = "${t.flat}";`)
    .join('\n');
  return `package com.solideo.designsystem;\n\n` +
    `/**\n * SOLIDEO Design System — Design Tokens (v${src.$version})\n *\n` +
    ` * 자동 생성 파일입니다. 직접 수정하지 마세요. (원본: tokens/tokens.json)\n` +
    ` * 서버에서 색 값이 필요한 경우(메일 템플릿 · PDF · 리포트)에 사용합니다.\n` +
    ` * 화면 CSS에는 solideo-tokens.css 를 쓰고 이 클래스를 쓰지 마세요.\n` +
    ` *\n * <pre>\n * model.addAttribute("brand", SolideoTokens.FILL_ACCENT);\n * </pre>\n */\n` +
    `public final class SolideoTokens {\n\n    private SolideoTokens() {}\n\n${body}\n}\n`;
}

/* ------------------------------------ shadcn/ui + Tailwind v4 테마 레이어 */
/* shadcn 컴포넌트가 참조하는 표준 변수명을 솔리데오 토큰에 연결합니다. */
const SHADCN_MAP = [
  ['background',            '--bg-primary'],
  ['foreground',            '--text-primary'],
  ['card',                  '--bg-primary'],
  ['card-foreground',       '--text-primary'],
  ['popover',               '--bg-primary'],
  ['popover-foreground',    '--text-primary'],
  ['primary',               '--fill-accent'],
  ['primary-foreground',    '--text-inverse'],
  ['secondary',             '--fill-secondary'],
  ['secondary-foreground',  '--text-primary'],
  ['muted',                 '--bg-tertiary'],
  ['muted-foreground',      '--text-secondary'],
  ['accent',                '--fill-accent-subtle'],
  ['accent-foreground',     '--text-accent'],
  ['destructive',           '--fill-critical'],
  ['destructive-foreground','--text-inverse'],
  ['border',                '--border-primary'],
  ['input',                 '--border-strong'],
  ['ring',                  '--border-focus'],
  ['sidebar',               '--bg-primary'],
  ['sidebar-foreground',    '--text-primary'],
  ['sidebar-primary',       '--fill-accent'],
  ['sidebar-primary-foreground', '--text-inverse'],
  ['sidebar-accent',        '--fill-secondary'],
  ['sidebar-accent-foreground', '--text-primary'],
  ['sidebar-border',        '--border-primary'],
  ['sidebar-ring',          '--border-focus'],
  ['chart-1',               '--crimson-500'],
  ['chart-2',               '--ink-700'],
  ['chart-3',               '--blue-500'],
  ['chart-4',               '--green-500'],
  ['chart-5',               '--amber-500'],
];

function buildShadcnTheme() {
  const scales = ['gray', 'crimson', 'ink', 'green', 'blue', 'amber', 'red'];
  const scaleVars = resolved
    .filter((t) => scales.includes(t.path[1]) && t.path[0] === 'primitive')
    .map((t) => `  --color-${t.name}: var(--${t.name});`).join('\n');
  const semanticVars = resolved
    .filter((t) => t.path[0] === 'semantic')
    .map((t) => `  --color-${t.name}: var(--${t.name});`).join('\n');
  const spaceVars = resolved
    .filter((t) => t.path[0] === 'space')
    .map((t) => `  --spacing-${t.path[1]}: var(--space-${t.path[1]});`).join('\n');

  return `/* SOLIDEO Design System — shadcn/ui + Tailwind v4 테마 레이어 (${src.$version})
   자동 생성 파일입니다. 직접 수정하지 마세요. (원본: tokens/tokens.json)

   shadcn/ui 컴포넌트가 참조하는 표준 변수(--primary, --border, --ring …)를
   솔리데오 시맨틱 토큰에 연결합니다. 컴포넌트 코드는 손대지 않고 브랜드만 바뀝니다. */

:root {
${SHADCN_MAP.map(([k, v]) => `  --${k}: var(${v});`).join('\n')}
  --radius: var(--radius-sm);
}

/* KRDS 선명한 화면 모드 — 명도 대비를 최대로 올립니다 */
[data-contrast="high"] {
  --text-primary: #000000;
  --text-secondary: #1A1D21;
  --text-tertiary: #1A1D21;
  --border-primary: var(--gray-500);
  --border-strong: var(--gray-700);
  --fill-accent: var(--crimson-700);
  --fill-accent-hover: var(--crimson-800);
  --text-accent: var(--crimson-700);
  --fill-critical: var(--red-700);
}

@theme inline {
  /* shadcn 표준 색 */
${SHADCN_MAP.map(([k]) => `  --color-${k}: var(--${k});`).join('\n')}

  /* 솔리데오 시맨틱 토큰 */
${semanticVars}

  /* 솔리데오 팔레트 */
${scaleVars}

  /* 간격 · 반경 · 서체 */
${spaceVars}
  --radius-xs: var(--radius-xs);
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
  --font-sans: var(--font-family-sans);
  --font-mono: var(--font-family-mono);
  --shadow-1: var(--shadow-1);
  --shadow-2: var(--shadow-2);
  --shadow-3: var(--shadow-3);
  --shadow-4: var(--shadow-4);
}
`;
}


/* ------------------------------------------------ Figma Variables · Tokens */
/*
 * 디자이너가 피그마에 그대로 불러오는 형식입니다.
 *  - Tokens Studio(구 Figma Tokens) 플러그인: 이 파일을 그대로 import
 *  - Figma Variables: 같은 구조를 컬렉션 2개(Primitive / Semantic)로 읽습니다
 *
 * 값이 아니라 **참조**를 유지하는 것이 핵심입니다. semantic 이 primitive 를
 * 가리키고 있어야 브랜드 색을 바꿀 때 피그마에서도 한 번만 고치면 됩니다.
 */
function buildFigma() {
  const set = (pred) => {
    const o = {};
    for (const t of tokens.filter(pred)) {
      const path = t.path[0] === 'primitive' || t.path[0] === 'semantic' ? t.path.slice(1) : t.path;
      let node = o;
      for (const seg of path.slice(0, -1)) node = node[seg] ??= {};
      const type =
        t.type === 'color' ? 'color'
        : t.type === 'dimension' ? 'sizing'
        : t.type === 'fontWeight' ? 'fontWeights'
        : t.type === 'fontFamily' ? 'fontFamilies'
        : t.type === 'duration' ? 'other'
        : t.type === 'shadow' ? 'boxShadow'
        : 'other';
      /* 참조는 Tokens Studio 문법 {gray.900} 으로 바꿉니다 */
      const value = typeof t.value === 'string'
        ? t.value.replace(/^\{(primitive|semantic)\.(.+)\}$/, '{$2}')
        : t.value;
      node[path[path.length - 1]] = { value, type, ...(t.desc ? { description: t.desc } : {}) };
    }
    return o;
  };

  return JSON.stringify({
    Primitive: set((t) => t.path[0] === 'primitive'),
    Semantic: set((t) => t.path[0] === 'semantic'),
    Scale: set((t) => !['primitive', 'semantic'].includes(t.path[0])),
    $themes: [],
    $metadata: { tokenSetOrder: ['Primitive', 'Semantic', 'Scale'] },
  }, null, 2) + String.fromCharCode(10);
}

/* --------------------------------------------------------------- 다크 모드 */
/*
 * 다크 모드는 Primitive 를 새로 만들지 않고 Semantic 매핑만 뒤집습니다.
 * 그래서 이 표만 유지하면 되고, 컴포넌트는 손대지 않습니다.
 */
const DARK = [
  ['text-primary', 'gray-25'],
  ['text-secondary', 'gray-200'],
  ['text-tertiary', 'gray-300'],
  ['text-disabled', 'gray-500'],
  ['text-inverse', 'gray-900'],
  ['text-accent', 'crimson-300'],
  ['text-critical', 'red-300'],
  ['text-positive', 'green-300'],
  ['text-caution', 'amber-300'],
  ['text-info', 'blue-300'],
  ['bg-primary', 'gray-900'],
  ['bg-secondary', 'gray-850'],
  ['bg-tertiary', 'gray-800'],
  ['bg-inverse', 'gray-25'],
  ['fill-primary', 'gray-25'],
  ['fill-secondary', 'gray-750'],
  ['fill-tertiary', 'gray-800'],
  ['fill-accent', 'crimson-400'],
  ['fill-accent-hover', 'crimson-300'],
  ['fill-accent-pressed', 'crimson-200'],
  ['fill-accent-subtle', 'crimson-800'],
  ['fill-disabled', 'gray-750'],
  ['fill-critical', 'red-400'],
  ['fill-critical-subtle', 'red-800'],
  ['fill-positive-subtle', 'green-800'],
  ['fill-caution-subtle', 'amber-800'],
  ['fill-info-subtle', 'blue-800'],
  ['border-primary', 'gray-700'],
  ['border-secondary', 'gray-750'],
  ['border-strong', 'gray-500'],
  ['border-accent', 'crimson-400'],
  ['border-critical', 'red-400'],
  ['border-focus', 'blue-300'],
  ['icon-primary', 'gray-25'],
  ['icon-secondary', 'gray-200'],
  ['icon-tertiary', 'gray-400'],
  ['icon-accent', 'crimson-300'],
  ['icon-inverse', 'gray-900'],
  ['accent-primary', 'crimson-400'],
  ['accent-secondary', 'ink-200'],
];

function buildDark() {
  return `/* SOLIDEO Design System — 다크 모드 (${src.$version})
   자동 생성 파일입니다. 직접 수정하지 마세요. (원본: tokens/build.mjs 의 DARK)

   Primitive 는 그대로 두고 Semantic 매핑만 뒤집습니다.
   컴포넌트 코드는 손댈 필요가 없습니다.

   사용
     <html data-theme="dark">   또는  <html class="dark">
   시스템 설정을 따르려면 prefers-color-scheme 블록도 함께 씁니다. */

[data-theme='dark'],
.dark {
${DARK.map(([k, v]) => `  --${k}: var(--${v});`).join(String.fromCharCode(10))}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${DARK.map(([k, v]) => `    --${k}: var(--${v});`).join(String.fromCharCode(10))}
  }
}
`;
}

/* -------------------------------------------------------------------- 실행 */
mkdirSync(DIST, { recursive: true });
const out = {
  'dist/solideo-tokens.css': buildCss(),
  'dist/solideo-tokens.scss': buildScss(),
  'dist/solideo-tokens.less': buildLess(),
  'dist/solideo-tokens.js': buildJs(),
  'dist/solideo-tokens.cjs': buildCjs(),
  'dist/solideo-tokens.d.ts': buildDts(),
  'dist/solideo-tokens.properties': buildProperties(),
  'dist/solideo-tokens.flat.json': buildFlatJson(),
  'dist/tailwind.preset.cjs': buildTailwind(),
  'dist/quasar.variables.sass': buildQuasar(),
  'dist/SolideoTokens.java': buildJava(),
  'dist/solideo-shadcn.css': buildShadcnTheme(),
  'dist/solideo-figma.tokens.json': buildFigma(),
  'dist/solideo-dark.css': buildDark(),
  'app/src/styles/solideo-tokens.css': buildCss(),
  'app/src/styles/solideo-shadcn.css': buildShadcnTheme(),

  /* 문서 사이트에서 내려받을 수 있도록 정적 자산으로도 복사 */
  'app/public/dist/solideo-tokens.css': buildCss(),
  'app/public/dist/solideo-tokens.scss': buildScss(),
  'app/public/dist/solideo-tokens.less': buildLess(),
  'app/public/dist/solideo-tokens.js': buildJs(),
  'app/public/dist/solideo-tokens.cjs': buildCjs(),
  'app/public/dist/solideo-tokens.d.ts': buildDts(),
  'app/public/dist/solideo-tokens.properties': buildProperties(),
  'app/public/dist/solideo-tokens.flat.json': buildFlatJson(),
  'app/public/dist/tailwind.preset.cjs': buildTailwind(),
  'app/public/dist/quasar.variables.sass': buildQuasar(),
  'app/public/dist/SolideoTokens.java': buildJava(),
  'app/public/dist/solideo-shadcn.css': buildShadcnTheme(),
  'app/public/dist/solideo-figma.tokens.json': buildFigma(),
  'app/public/dist/solideo-dark.css': buildDark(),
  'app/public/tokens/tokens.json': JSON.stringify(src, null, 2),
};
for (const [rel, content] of Object.entries(out)) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, 'utf8');
  console.log(`  ✓ ${rel.padEnd(32)} ${String(content.length).padStart(7)} bytes`);
}
console.log(`\n토큰 ${resolved.length}개 · alias ${ALIASES.length}개 · v${src.$version}`);
