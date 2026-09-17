/**
 * SOLIDEO Design System — React 컴포넌트 키트 배포
 *
 *   node tools/build-react-kit.mjs
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 문서 사이트(app/)가 쓰는 React 컴포넌트를 **다른 프로젝트가 복사해 쓸 수 있는
 * 형태**로 dist/react/ 에 내보냅니다.
 *
 * 왜 필요한가
 *   컴포넌트 문서는 `import { Button } from '@/components/ui/button'` 이라고 안내하는데,
 *   그 파일이 문서 사이트 안에만 있어 React SI 프로젝트가 가져갈 경로가 없었습니다.
 *   shadcn/ui 방식 그대로 "소스를 프로젝트에 복사"해 쓰도록 합니다.
 *   (npm 패키지로 감추지 않는 이유: SI 프로젝트마다 고쳐 써야 하고, 폐쇄망 반입이 쉽습니다.)
 *
 * 산출물
 *   dist/react/src/components/ui/*   컴포넌트 소스
 *   dist/react/src/lib/utils.ts      cn 헬퍼
 *   dist/react/src/styles/*          토큰 · shadcn 테마 · 서체 선언
 *   dist/react/src/solideo.css       CSS 진입점 (index.css 에서 import 한 줄)
 *   dist/react/public/fonts/*        Pretendard (CDN 없음)
 *   dist/react/README.md             설치 · 의존성 · 설정
 *
 * 검사
 *   컴포넌트가 import 하는 외부 패키지를 모아 README 의존성 목록과 대조합니다.
 *   목록에 없는 패키지를 새로 쓰면 빌드가 실패합니다 — README 가 거짓말하지 않게.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const APP = join(ROOT, 'app')
const OUT = join(ROOT, 'dist/react')

/* 컴포넌트가 실제로 쓰는 외부 패키지와 문서 사이트에서의 버전.
 * 여기에 없는 패키지를 컴포넌트가 import 하면 아래 검사가 실패합니다. */
const appPkg = JSON.parse(readFileSync(join(APP, 'package.json'), 'utf8'))
const allDeps = { ...appPkg.dependencies, ...appPkg.devDependencies }
const RUNTIME = ['react', 'react-dom', 'radix-ui', 'class-variance-authority', 'cn', 'clsx', 'tailwind-merge', 'sonner', 'next-themes']
const BUILD = ['tailwindcss', '@tailwindcss/vite', 'tw-animate-css']

rmSync(OUT, { recursive: true, force: true })

const put = (rel, content) => {
  const p = join(OUT, rel)
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, content, 'utf8')
}

/* 1 — 컴포넌트 소스 */
const UI = join(APP, 'src/components/ui')
const files = readdirSync(UI).filter((f) => /\.(tsx?|ts)$/.test(f))
const used = new Set()
for (const f of files) {
  let src = readFileSync(join(UI, f), 'utf8')
  /* 상대 경로로 lib 를 부르던 곳을 별칭으로 통일합니다 (복사 위치가 달라져도 동작) */
  src = src.replace(/from (["'])\.\/\.\.\/\.\.\/lib\/utils\1/g, "from '@/lib/utils'")
  for (const m of src.matchAll(/from\s+["']([^"'.@][^"']*|@[^/"']+\/[^"']+)["']/g)) {
    const name = m[1].startsWith('@') ? m[1].split('/').slice(0, 2).join('/') : m[1].split('/')[0]
    if (!m[1].startsWith('@/')) used.add(name)
  }
  put(`src/components/ui/${f}`, src)
}
put('src/lib/utils.ts', readFileSync(join(APP, 'src/lib/utils.ts'), 'utf8'))

const unknown = [...used].filter((d) => !RUNTIME.includes(d))
if (unknown.length) {
  console.error(`\n  FAIL  README 의존성 목록에 없는 패키지를 컴포넌트가 씁니다: ${unknown.join(', ')}`)
  console.error('        tools/build-react-kit.mjs 의 RUNTIME 에 추가하세요.\n')
  process.exit(1)
}

/* 2 — 스타일 */
for (const f of ['solideo-tokens.css', 'solideo-shadcn.css']) {
  put(`src/styles/${f}`, readFileSync(join(ROOT, 'dist', f), 'utf8'))
}
put('src/styles/fonts.css', readFileSync(join(APP, 'src/styles/fonts.css'), 'utf8'))

/* 문서 사이트의 index.css 에서 앱 전용 부분을 빼고 진입점으로 씁니다.
 * 글자 크기 설정 규칙은 토큰 CSS 에 이미 들어 있으므로 중복하지 않습니다. */
const appCss = readFileSync(join(APP, 'src/index.css'), 'utf8')
  .replace(/\s*\/\* KRDS 글자 크기 설정[\s\S]*?html\[data-font-scale="xl"\][^\n]*\n/, '\n')
put(
  'src/solideo.css',
  `/* SOLIDEO Design System — React 프로젝트 CSS 진입점
 *
 * 프로젝트의 index.css 를 이 파일로 바꾸거나, 맨 위에서 import 하세요.
 * Tailwind v4 가 필요합니다. 경로는 이 파일 기준입니다.
 */
` + appCss
)

/* 3 — 서체 */
for (const f of readdirSync(join(APP, 'public/fonts'))) {
  const to = join(OUT, 'public/fonts', f)
  mkdirSync(dirname(to), { recursive: true })
  copyFileSync(join(APP, 'public/fonts', f), to)
}

/* 4 — README */
const ver = (d) => `"${d}": "${allDeps[d] ?? 'latest'}"`
put(
  'README.md',
  `# SOLIDEO Design System — React 컴포넌트 키트

문서 사이트가 쓰는 컴포넌트 그대로입니다. shadcn/ui 방식이라 **소스를 프로젝트에 복사**해 씁니다.
npm 저장소에 접근할 수 없는 폐쇄망에서도 이 폴더만 반입하면 됩니다.

## 1. 복사

\`\`\`
dist/react/src/components/ui/  →  <프로젝트>/src/components/ui/
dist/react/src/lib/utils.ts    →  <프로젝트>/src/lib/utils.ts
dist/react/src/styles/         →  <프로젝트>/src/styles/
dist/react/src/solideo.css     →  <프로젝트>/src/solideo.css
dist/react/public/fonts/       →  <프로젝트>/public/fonts/
\`\`\`

쓰지 않는 컴포넌트 파일은 지워도 됩니다. 단 \`icon.tsx\` · \`icons.generated.ts\` 는
여러 컴포넌트가 함께 쓰므로 남겨 두세요.

## 2. 의존성

\`\`\`json
"dependencies": {
  ${RUNTIME.map(ver).join(',\n  ')}
},
"devDependencies": {
  ${BUILD.map(ver).join(',\n  ')}
}
\`\`\`

## 3. 설정

\`vite.config.ts\`

\`\`\`ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
})
\`\`\`

\`tsconfig.json\` — \`"paths": { "@/*": ["./src/*"] }\`

\`src/main.tsx\` — \`import './solideo.css'\`

## 4. 사용

\`\`\`tsx
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/field'

<TextField label="사업자등록번호" required hint="하이픈 없이 숫자만 입력해도 됩니다." />
<Button>신청서 제출</Button>
\`\`\`

## 글자 크기 설정 (KRDS)

\`<html data-font-scale="lg">\` 또는 \`"xl"\` 을 붙이면 전체 글자가 비례해 커집니다.
규칙은 \`styles/solideo-tokens.css\` 에 들어 있습니다.

## 주의

- 체크박스 · 라디오 · 스위치 · 셀렉트는 Radix 가 \`<button>\` 으로 그립니다.
  \`<label>\` 만으로는 접근 가능한 이름이 붙지 않으니 **\`CheckboxField\` 같은 \`field.tsx\` 조합**을 쓰세요.
- 치수는 \`component.*\` 토큰을 읽습니다. \`h-9\` · \`rounded-md\` 처럼 값을 직접 쓰면
  CSS 판(\`solideo-components.css\`)과 어긋납니다.

version ${JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version}
`
)

console.log(`  ✓ dist/react/src/components/ui/          컴포넌트 ${files.length}개`)
console.log(`  ✓ dist/react/                            외부 패키지 ${[...used].sort().join(' · ')}`)
console.log('\nReact 프로젝트가 복사해 쓸 수 있습니다.\n')
