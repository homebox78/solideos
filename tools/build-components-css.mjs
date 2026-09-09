/**
 * SOLIDEO Design System — CSS 컴포넌트 빌드 · 검증
 *
 *   node tools/build-components-css.mjs
 *
 * ────────────────────────────────────────────────────────────────────────────
 * `css/solideo-components.css` 를 검사한 뒤 배포 위치로 복사합니다.
 *
 * 왜 검사가 필요한가
 *   이 파일은 퍼블리셔가 React 없이 쓰는 유일한 컴포넌트 소스입니다.
 *   여기에 색이 하드코딩되면 브랜드가 갈라지고, 없는 토큰을 참조하면
 *   값이 조용히 비어 화면이 깨집니다. 둘 다 눈으로는 잘 안 잡힙니다.
 *
 * 검사 항목
 *   1. 정의되지 않은 토큰을 참조하지 않는가
 *   2. 색을 하드코딩하지 않았는가 (#hex · rgb() · hsl())
 *   3. px 글자 크기를 고정하지 않았는가 (글자 크기 설정이 깨짐)
 *   4. outline:none 을 대체 표시 없이 쓰지 않았는가
 * ────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const SRC = join(ROOT, 'css/solideo-components.css')

const css = readFileSync(SRC, 'utf8')
const tokensCss = readFileSync(join(ROOT, 'dist/solideo-tokens.css'), 'utf8')

/* 정의된 토큰 목록 */
const defined = new Set([...tokensCss.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1]))

/* 주석을 걷어낸 본문만 검사합니다 */
const body = css.replace(/\/\*[\s\S]*?\*\//g, '')

const errors = []

/* 1 — 정의되지 않은 토큰 참조 */
for (const m of body.matchAll(/var\((--[\w-]+)/g)) {
  if (!defined.has(m[1])) {
    const line = body.slice(0, m.index).split('\n').length
    errors.push(`TOKEN  ${m[1]} 은(는) 정의되지 않은 토큰입니다 (line ${line})`)
  }
}

/* 2 — 색 하드코딩 */
for (const m of body.matchAll(/(#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\))/g)) {
  const line = body.slice(0, m.index).split('\n').length
  errors.push(`COLOR  색을 직접 썼습니다: ${m[1]} (line ${line}) — 토큰을 쓰세요`)
}

/* 3 — px 글자 크기 */
for (const m of body.matchAll(/font-size:\s*\d+px/g)) {
  const line = body.slice(0, m.index).split('\n').length
  errors.push(`FONT   글자 크기를 px 로 고정했습니다 (line ${line}) — 토큰 또는 rem 을 쓰세요`)
}

/* 4 — 포커스 표시 제거 */
for (const m of body.matchAll(/outline:\s*(none|0)\b/g)) {
  const line = body.slice(0, m.index).split('\n').length
  errors.push(`FOCUS  outline 을 제거했습니다 (line ${line}) — 대체 표시가 없으면 KWCAG 위반입니다`)
}

/* 클래스 목록 — 문서와 대조할 때 씁니다 */
const classes = [...new Set([...body.matchAll(/\.(sds-[\w-]+)/g)].map((m) => m[1]))].sort()

console.log('\nSOLIDEO Design System — CSS 컴포넌트 검증\n')

if (errors.length) {
  for (const e of errors) console.log(`  FAIL  ${e}`)
  console.log(`\n실패 ${errors.length}건.\n`)
  process.exit(1)
}

console.log('  PASS  정의되지 않은 토큰 참조 없음')
console.log('  PASS  색 하드코딩 없음')
console.log('  PASS  px 고정 글자 크기 없음')
console.log('  PASS  포커스 표시 제거 없음')

const OUT = [
  'dist/solideo-components.css',
  'app/public/dist/solideo-components.css',
  /* 스타터 킷은 그 자체로 열려야 합니다. 압축해 건네면 바로 동작합니다. */
  'starters/html/css/solideo-components.css',
]
for (const rel of OUT) {
  const p = join(ROOT, rel)
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, css, 'utf8')
  console.log(`  ✓ ${rel.padEnd(38)} ${String(css.length).padStart(6)} bytes`)
}

/* 문서에서 클래스 목록을 쓸 수 있도록 내보냅니다 */
const listPath = join(ROOT, 'app/src/data/css-classes.ts')
writeFileSync(
  listPath,
  `/**\n` +
    ` * CSS 컴포넌트 클래스 목록\n *\n` +
    ` * 자동 생성 파일입니다. 직접 수정하지 마세요.\n` +
    ` * 원본: css/solideo-components.css · 생성: node tools/build-components-css.mjs\n */\n\n` +
    `export const CSS_CLASSES = [\n${classes.map((c) => `  '${c}',`).join('\n')}\n] as const\n`,
  'utf8'
)
console.log(`  ✓ app/src/data/css-classes.ts           클래스 ${classes.length}개`)

/* 스타터 킷에 토큰 · 다크 모드도 함께 넣습니다 */
for (const f of ['solideo-tokens.css', 'solideo-dark.css']) {
  const from = join(ROOT, 'dist', f)
  const to = join(ROOT, 'starters/html/css', f)
  mkdirSync(dirname(to), { recursive: true })
  writeFileSync(to, readFileSync(from, 'utf8'), 'utf8')
  console.log(`  ✓ starters/html/css/${f}`)
}
/* 문서 사이트에서 예제를 바로 열 수 있도록 스타터를 정적 자산으로 복사합니다 */
for (const f of ['index.html', 'starter.css', 'starter.js']) {
  const to = join(ROOT, 'app/public/starters/html', f)
  mkdirSync(dirname(to), { recursive: true })
  writeFileSync(to, readFileSync(join(ROOT, 'starters/html', f), 'utf8'), 'utf8')
}
for (const f of ['solideo-tokens.css', 'solideo-components.css', 'solideo-dark.css']) {
  const to = join(ROOT, 'app/public/starters/html/css', f)
  mkdirSync(dirname(to), { recursive: true })
  writeFileSync(to, readFileSync(join(ROOT, 'starters/html/css', f), 'utf8'), 'utf8')
}
console.log('  ✓ app/public/starters/html/            문서에서 예제 열기 가능')

console.log('\n퍼블리셔가 React 없이 쓸 수 있습니다.\n')
