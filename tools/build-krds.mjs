/**
 * SOLIDEO Design System — KRDS 대응표 생성
 *
 *   node tools/build-krds.mjs           캐시로 생성 (폐쇄망 · 기본)
 *   node tools/build-krds.mjs --fetch   krds.go.kr 에서 다시 수집 후 생성
 *
 * ────────────────────────────────────────────────────────────────────────────
 * KRDS(대한민국 정부 디자인시스템)의 컴포넌트 55종과 각 지침을
 * `app/src/data/krds.ts` 로 굽습니다.
 *
 * 왜 캐시를 커밋하는가
 *   폐쇄망에서는 krds.go.kr 에 접속할 수 없습니다. 수집 결과를
 *   `tools/krds-cache/` 에 JSON 으로 두어 네트워크 없이도 재생성됩니다.
 *   원문이 갱신되면 인터넷이 되는 환경에서 --fetch 로 캐시를 새로 뜹니다.
 *
 * 대응 매핑(MAP)만 사람이 관리합니다. 나머지는 전부 자동입니다.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const CACHE = join(HERE, 'krds-cache')
const OUT = join(ROOT, 'app/src/data/krds.ts')
const BASE = 'https://www.krds.go.kr/html/site/component/'

/** KRDS 컴포넌트 → 우리 시스템 앵커 id. 빈 문자열이면 미대응. */
const MAP = {
  '공식 배너': 'gov-banner', '운영기관 식별자': 'identifier', 헤더: 'top-navigation', 푸터: 'footer',
  '건너뛰기 링크': 'skip-link', '메인 메뉴': 'top-navigation', 브레드크럼: 'breadcrumb',
  '사이드 메뉴': 'side-navigation', '콘텐츠 내 탐색': 'in-page-nav', 페이지네이션: 'pagination',
  '구조화 목록': 'structured-list', '긴급 공지': 'critical-alert', 달력: 'date-picker',
  디스클로저: 'disclosure', 모달: 'modal', 배지: 'badge', 아코디언: 'accordion',
  이미지: 'image', 캐러셀: '', 탭: 'tab', 표: 'table', '텍스트 목록': 'text-list',
  파비콘: 'favicon', 링크: 'link', 버튼: 'button', '플로팅 버튼': 'fab',
  '라디오 버튼': 'radio', 체크박스: 'checkbox', 셀렉트: 'select', 태그: 'tag',
  '토글 스위치': 'switch', '단계 표시기': 'step-indicator', 스피너: 'spinner',
  '도움 패널': 'help-panel', '날짜 입력 필드': 'date-picker', '텍스트 영역 (Textarea)': 'textarea',
  '텍스트 입력 필드': 'text-field', '파일 업로드': 'file-upload',
  '따라하기 패널': '', '맥락적 도움말': 'help-panel', 코치마크: '', 툴팁: 'tooltip', 음성지원: '',
  '언어 변경': '', '화면 크기 조정': 'contrast-mode',
  '접근 가능한 미디어': '', '숨긴 콘텐츠': 'visually-hidden',
  범위슬라이드: '', '뒤로가기 버튼': '', 바텀시트: 'bottom-sheet', '수량 토글': '',
  토스트: 'toast', 스낵바: 'snackbar', 탭바: 'tab-bar', '스플래시 스크린': '',
}

const CATEGORIES = ['아이덴티티','탐색','레이아웃 및 표현','액션','선택','피드백','도움','입력','설정','콘텐츠','모바일']

/* ------------------------------------------------------------------ 수집 */

const strip = (h) => {
  let t = h.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
  t = t.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|h\d|td|tr|dd|dt)>/gi, '\n')
  t = t.replace(/<[^>]+>/g, ' ')
  t = t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&middot;/g, '·').replace(/&#39;/g, "'")
  return t.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter((l) => l.length >= 10)
}

const WANT = ['사용성 가이드라인', '접근성 가이드라인', '상호작용 가이드라인', '개발 시 접근성 관련 주의 사항']

function sections(h) {
  const marks = [...h.matchAll(/<h([2-5])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    pos: m.index, lvl: +m[1], title: m[2].replace(/<[^>]+>/g, '').replace(/&middot;/g, '·').trim(),
  }))
  const res = {}
  marks.forEach((mk, i) => {
    if (!WANT.includes(mk.title)) return
    let end = h.length
    for (const n of marks.slice(i + 1)) if (n.lvl <= mk.lvl) { end = n.pos; break }
    const body = strip(h.slice(mk.pos, end))
    res[mk.title] = body[0] === mk.title ? body.slice(1) : body
  })
  return res
}

/** 규칙 문장만 추립니다 — 짧고 지시형으로 끝나는 문장. */
const rules = (lines = []) => {
  const out = [], seen = new Set()
  for (const l of lines) {
    if (/^(KWCAG|WCAG|참고|예시|그림)\b/.test(l)) continue
    if (l.length < 12 || l.length > 110) continue
    if (!/(한다|않는다|된다|이다|권장한다|안 된다)\.?$/.test(l)) continue
    const k = l.slice(0, 24)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(l)
  }
  return out
}

async function refetch() {
  mkdirSync(CACHE, { recursive: true })
  const get = async (f) => {
    const r = await fetch(BASE + f, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!r.ok) throw new Error(`${f}: HTTP ${r.status}`)
    return r.text()
  }
  const summary = await get('component_summary.html')
  const seen = new Set()
  const index = []
  for (const m of summary.matchAll(/href="\.\/?(component_\d+_\d+\.html)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const [, file, inner] = m
    if (seen.has(file)) continue
    const txt = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (txt.length < 10) continue
    seen.add(file)
    index.push({ file, blurb: txt })
  }
  const detail = []
  for (const it of index) {
    const h = await get(it.file)
    let b = it.blurb, cat = ''
    for (const c of [...CATEGORIES].sort((a, z) => z.length - a.length)) {
      if (b.endsWith(' ' + c)) { cat = c; b = b.slice(0, -(c.length + 1)).trim(); break }
    }
    const m = b.match(/^(.+?)\s+([A-Z][A-Za-z /-]*?)\s+(.+)$/)
    const sec = sections(h)
    detail.push({
      file: it.file,
      ko: m ? m[1].trim() : b, en: m ? m[2].trim() : '', cat, desc: m ? m[3].trim() : '',
      kwcag: [...new Set([...h.matchAll(/KWCAG 2\.2 ([가-힣 ·]{2,20})/g)].map((x) => x[1].trim()))].sort(),
      usage: sec['사용성 가이드라인'] ?? [],
      a11y: sec['접근성 가이드라인'] ?? [],
      interaction: sec['상호작용 가이드라인'] ?? [],
      dev: sec['개발 시 접근성 관련 주의 사항'] ?? [],
    })
    process.stdout.write('.')
  }
  writeFileSync(join(CACHE, 'krds-detail.json'), JSON.stringify(detail, null, 1), 'utf8')
  console.log(`\n캐시 갱신: ${detail.length}개`)
  return detail
}

/* ------------------------------------------------------------------ 생성 */

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const arr = (xs, ind) =>
  xs.length ? `[\n${xs.map((x) => `${' '.repeat(ind + 2)}'${esc(x)}',`).join('\n')}\n${' '.repeat(ind)}]` : '[]'

const detail = process.argv.includes('--fetch')
  ? await refetch()
  : (() => {
      const p = join(CACHE, 'krds-detail.json')
      if (!existsSync(p)) throw new Error('캐시가 없습니다. 인터넷이 되는 환경에서 --fetch 로 먼저 수집하세요.')
      return JSON.parse(readFileSync(p, 'utf8'))
    })()

const entries = detail.map((r) => ({
  ...r,
  id: MAP[r.ko] ?? '',
  usage: rules(r.usage).slice(0, 5),
  a11y: rules(r.a11y).slice(0, 6),
  interaction: rules(r.interaction).slice(0, 4),
  dev: rules(r.dev).slice(0, 4),
}))

const unknown = entries.filter((e) => MAP[e.ko] === undefined).map((e) => e.ko)
if (unknown.length) {
  console.error('\nMAP 에 없는 컴포넌트 (원문이 갱신되었습니다):')
  for (const u of unknown) console.error(`  - ${u}`)
  console.error('tools/build-krds.mjs 의 MAP 에 추가하세요.\n')
  process.exit(1)
}

const covered = entries.filter((e) => e.id).length
const ts = `/**
 * KRDS(대한민국 정부 디자인시스템) 컴포넌트 대응표
 *
 * 자동 생성 파일입니다. 직접 수정하지 마세요.
 * 원본: ${BASE}component_summary.html
 * 생성: node tools/build-krds.mjs
 *
 * 공공 · 행정 SI 사업의 산출물 검수는 KRDS 분류를 기준으로 이루어집니다.
 * 전체 ${entries.length}개 중 ${covered}개 대응.
 */

export interface KrdsComponent {
  ko: string
  en: string
  cat: string
  /** 우리 시스템의 대응 컴포넌트 앵커 id. 빈 문자열이면 미대응 */
  id: string
  kwcag: string[]
  usage: string[]
  a11y: string[]
  interaction: string[]
  dev: string[]
}

export const KRDS_CATEGORIES = [
${CATEGORIES.map((c) => `  '${c}',`).join('\n')}
] as const

export const KRDS_COMPONENTS: KrdsComponent[] = [
${entries.map((e) => `  {
    ko: '${esc(e.ko)}',
    en: '${esc(e.en)}',
    cat: '${esc(e.cat)}',
    id: '${e.id}',
    kwcag: ${arr(e.kwcag, 4)},
    usage: ${arr(e.usage, 4)},
    a11y: ${arr(e.a11y, 4)},
    interaction: ${arr(e.interaction, 4)},
    dev: ${arr(e.dev, 4)},
  },`).join('\n')}
]

/** 컴포넌트 앵커 id 로 KRDS 지침을 찾습니다. */
export const krdsFor = (id: string) => KRDS_COMPONENTS.filter((c) => c.id === id)

export const KRDS_STATS = {
  total: KRDS_COMPONENTS.length,
  covered: KRDS_COMPONENTS.filter((c) => c.id).length,
}
`

writeFileSync(OUT, ts, 'utf8')
const n = (k) => entries.reduce((s, e) => s + e[k].length, 0)
console.log(`  ✓ app/src/data/krds.ts   ${entries.length}개 · 대응 ${covered} · 미대응 ${entries.length - covered}`)
console.log(`    지침 usage=${n('usage')} a11y=${n('a11y')} interaction=${n('interaction')} dev=${n('dev')}`)
console.log(`\n미대응: ${entries.filter((e) => !e.id).map((e) => e.ko).join(', ')}`)
