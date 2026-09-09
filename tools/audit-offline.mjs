/**
 * SOLIDEO Design System — 폐쇄망 · 보안 감사
 *
 *   node tools/audit-offline.mjs
 *
 * 공공 SI 사업은 대부분 망분리 · 폐쇄망 환경에서 운영되며, 외부로 나가는 요청은
 * 그 자체가 보안 사고가 됩니다. 이 스크립트는 다음을 CI에서 강제합니다.
 *
 *   1. 소스와 빌드 산출물에 외부 호스트 참조가 없을 것 (CDN · 폰트 · 분석 도구)
 *   2. 원격 리소스를 부르는 태그/함수가 없을 것 (@import url, <script src="http…">)
 *   3. 개인정보를 브라우저 저장소에 남기지 않을 것
 *   4. 외부로 데이터를 보내는 호출이 없을 것 (fetch/XHR/beacon/WebSocket to http)
 *
 * 실패하면 종료 코드 1을 반환합니다.
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')

/* 검사 대상 — 실제 배포되는 것만 봅니다. node_modules 는 번들된 결과로 판단합니다. */
const TARGETS = ['app/src', 'app/index.html', 'app/dist', 'dist', 'tokens']
const SKIP_DIRS = new Set(['node_modules', '.git', 'public'])
const TEXT_EXT = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.css', '.scss', '.less', '.sass', '.html', '.json',
  '.properties', '.java', '.md',
])

/* 이 파일들은 "설명을 위해" URL 을 본문에 담습니다. 실행 코드가 아니므로 예외입니다. */
const DOC_ALLOW = [
  /app\/src\/pages\/.*\.tsx$/,      /* 문서 페이지 본문 (krds.go.kr 등 안내 링크) */
  /README\.md$/,
  /tools\/audit-offline\.mjs$/,
  /tools\/build-icons\.mjs$/,
  /tools\/build-krds\.mjs$/,
  /tools\/build-krds-patterns\.mjs$/,
  /app\/src\/data\/krds(-patterns)?\.ts$/,   /* 생성 파일 헤더의 출처 표기 (주석) */
]

/* 허용 호스트 — 문서 안내용 링크에만 등장할 수 있습니다. */
const DOC_HOSTS = ['krds.go.kr', 'solideos.com', 'ui.shadcn.com', 'uxdesign.kt.com']

/*
 * 요청을 일으키지 않는 문자열 - 라이브러리가 콘솔 경고에 찍는 문서 링크입니다.
 * 예: React Router 가 "자세한 내용은 reactrouter.com 참고" 라고 출력하는 안내문.
 * 번들에 텍스트로만 존재하며 네트워크 호출이 아닙니다.
 * 새 항목을 추가할 때는 해당 코드가 요청을 만들지 않는지 반드시 직접 확인하세요.
 */
const MESSAGE_ONLY_HOSTS = ['tailwindcss.com', 'react.dev', 'reactrouter.com', 'vitejs.dev', 'rolldown.rs']

const RULES = [
  {
    id: 'CDN-01',
    label: '외부 호스트 참조',
    re: /https?:\/\/(?!localhost|127\.0\.0\.1)[a-z0-9.-]+/gi,
    docExempt: true,
  },
  {
    id: 'CDN-02',
    label: '원격 CSS @import',
    re: /@import\s+url\(\s*['"]?https?:/gi,
  },
  {
    id: 'CDN-03',
    label: '원격 스크립트 · 스타일 태그',
    re: /<(?:script|link)[^>]+(?:src|href)=["']https?:/gi,
  },
  {
    id: 'NET-01',
    label: '외부 전송 호출',
    re: /(?:fetch|XMLHttpRequest|sendBeacon|new WebSocket)\s*\(\s*['"`]https?:/gi,
  },
  {
    id: 'A11Y-01',
    label: '고정 px 글자 크기 (글자 크기 설정이 적용되지 않음)',
    /* KRDS 글자 크기 조절은 루트 font-size 를 바꿔 동작합니다.
       px 로 고정한 글자 크기는 그 설정을 무시하므로 rem 을 써야 합니다. */
    re: /text-\[\s*\d+(?:\.\d+)?px\s*\]/g,
    srcOnly: true,
  },
  {
    id: 'DEPLOY-01',
    label: 'BrowserRouter (정적 반입 시 새로고침 404)',
    /* 서버 rewrite 를 추가할 수 없는 폐쇄망 현장을 위해 HashRouter 를 씁니다. */
    re: /BrowserRouter/g,
    srcOnly: true,
  },
  {
    id: 'PARITY-01',
    label: '컴포넌트 치수 하드코딩 (React 판과 CSS 판이 갈라짐)',
    /*
     * React(shadcn) 와 CSS 판은 같은 화면을 만들어야 합니다.
     * 한쪽에서 h-9 · rounded-md 같은 유틸리티로 치수를 직접 정하면
     * 다른 쪽과 조용히 갈라집니다. 실제로 버튼이 36px/8px 대 40px/4px 로
     * 어긋나 있던 것을 이 규칙으로 잡았습니다.
     * 치수는 component 토큰을 참조하세요.
     */
    re: /(?:h|size)-(?:8|9|10|11)|rounded-(?:md|lg)/g,
    files: /app\/src\/components\/ui\/(button|input|textarea|select|badge)\.tsx$/,
  },
  {
    id: 'PII-01',
    label: '개인정보로 보이는 저장소 키',
    re: /(?:localStorage|sessionStorage)\.setItem\(\s*['"`][^'"`]*(?:rrn|jumin|주민|phone|tel|email|passwd|password|token|jwt|ssn)/gi,
  },
]

/* -------------------------------------------------------------------------- */

function walk(p, out = []) {
  if (!existsSync(p)) return out
  const st = statSync(p)
  if (st.isFile()) {
    if (TEXT_EXT.has(extname(p))) out.push(p)
    return out
  }
  for (const name of readdirSync(p)) {
    if (SKIP_DIRS.has(name)) continue
    walk(join(p, name), out)
  }
  return out
}

const files = TARGETS.flatMap((t) => walk(join(ROOT, t)))
const findings = []
let scanned = 0

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  const text = readFileSync(file, 'utf8')
  scanned++
  const isDoc = DOC_ALLOW.some((r) => r.test(rel))

  for (const rule of RULES) {
    /* 소스 전용 규칙은 빌드 산출물(난독화된 번들)에서 검사하지 않습니다 */
    if (rule.srcOnly && !rel.startsWith('app/src/')) continue
    /* 특정 파일만 보는 규칙 */
    if (rule.files && !rule.files.test(rel)) continue
    rule.re.lastIndex = 0
    let m
    while ((m = rule.re.exec(text))) {
      const hit = m[0]
      /* 문서 페이지의 안내용 링크는 예외 */
      if (rule.docExempt && isDoc && DOC_HOSTS.some((h) => hit.includes(h))) continue
      /* 라이선스 · 표준 네임스페이스 URL 은 요청을 일으키지 않습니다 */
      if (/w3\.org|apache\.org|opensource\.org|schema\.org/.test(hit)) continue
      if (MESSAGE_ONLY_HOSTS.some((h) => hit.includes(h))) continue

      const line = text.slice(0, m.index).split('\n').length
      findings.push({ rule, rel, line, hit: hit.slice(0, 80) })
    }
  }
}

/* -------------------------------------------------------------------------- */

console.log(`\nSOLIDEO Design System — 폐쇄망 · 보안 감사`)
console.log(`검사 파일 ${scanned}개 · 규칙 ${RULES.length}개\n`)

if (!findings.length) {
  for (const r of RULES) console.log(`  PASS  ${r.id}  ${r.label}`)
  console.log(`\n외부 요청 0건. 폐쇄망에 그대로 반입할 수 있습니다.\n`)
  process.exit(0)
}

const byRule = new Map()
for (const f of findings) {
  if (!byRule.has(f.rule.id)) byRule.set(f.rule.id, [])
  byRule.get(f.rule.id).push(f)
}

for (const r of RULES) {
  const hits = byRule.get(r.id)
  if (!hits) {
    console.log(`  PASS  ${r.id}  ${r.label}`)
    continue
  }
  console.log(`  FAIL  ${r.id}  ${r.label} — ${hits.length}건`)
  for (const h of hits.slice(0, 10)) console.log(`          ${h.rel}:${h.line}  ${h.hit}`)
  if (hits.length > 10) console.log(`          … 외 ${hits.length - 10}건`)
}

console.log(`\n실패 ${findings.length}건. 외부 참조를 제거하거나 자산을 프로젝트에 포함시키세요.\n`)
process.exit(1)
