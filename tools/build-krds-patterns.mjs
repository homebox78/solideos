/**
 * SOLIDEO Design System — KRDS 기본 패턴 대응표 생성
 *
 *   node tools/build-krds-patterns.mjs           캐시로 생성 (폐쇄망 · 기본)
 *   node tools/build-krds-patterns.mjs --fetch   krds.go.kr 에서 다시 수집 후 생성
 *
 * ────────────────────────────────────────────────────────────────────────────
 * KRDS 기본 패턴 12종의 지침을 `app/src/data/krds-patterns.ts` 로 굽습니다.
 *
 * 컴포넌트(build-krds.mjs)가 "무엇을 쓰는가"라면, 기본 패턴은 "어떻게 엮는가"입니다.
 * 개인 식별 정보 입력 · 동의 · 오류 · 확인처럼 공공 서비스에서 법적 · 접근성
 * 요구사항이 가장 촘촘한 흐름들이라, 컴포넌트보다 오히려 검수 지적이 잦습니다.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const CACHE = join(HERE, 'krds-cache')
const OUT = join(ROOT, 'app/src/data/krds-patterns.ts')
const BASE = 'https://www.krds.go.kr/html/site/global/'

/** KRDS 기본 패턴 → 우리 문서의 앵커 id. 빈 문자열이면 미대응. */
const MAP = {
  '개인 식별 정보 입력': 'identity',
  도움: 'help',
  동의: 'consent',
  '목록 탐색': 'list',
  '사용자 피드백': 'feedback',
  '상세 정보 확인': 'detail',
  오류: 'error',
  입력폼: 'form',
  '첨부 파일': 'attachment',
  '필터링·정렬': 'filter',
  확인: 'confirm',
  모바일: 'mobile-notification',
}

const WANT = [
  '사용성 가이드라인',
  '접근성 가이드라인',
  '상호작용 가이드라인',
  '개발 시 접근성 관련 주의 사항',
]

const strip = (h) => {
  let t = h.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
  t = t.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|h\d|td|tr|dd|dt)>/gi, '\n')
  t = t.replace(/<[^>]+>/g, ' ')
  t = t
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&middot;/g, '·').replace(/&#39;/g, "'")
  return t.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter((l) => l.length >= 10)
}

function sections(h) {
  const marks = [...h.matchAll(/<h([2-5])[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    pos: m.index,
    lvl: +m[1],
    title: m[2].replace(/<[^>]+>/g, '').replace(/&middot;/g, '·').trim(),
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

/** 규칙 문장만 추립니다. */
const rules = (lines = []) => {
  const out = [], seen = new Set()
  for (const l of lines) {
    if (/^(KWCAG|WCAG|참고|예시|그림)\b/.test(l)) continue
    if (l.length < 12 || l.length > 120) continue
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
  const summary = await get('global_summary.html')
  const seen = new Set()
  const index = []
  for (const m of summary.matchAll(/href="\.\/?(global_\w+\.html)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const [, file, inner] = m
    if (seen.has(file) || file.includes('summary')) continue
    const txt = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (txt.length < 10) continue
    seen.add(file)
    index.push({ file, blurb: txt })
  }
  const detail = []
  for (const it of index) {
    const h = await get(it.file)
    /* 앞부분이 이름, 나머지가 설명 */
    const name = Object.keys(MAP).find((k) => it.blurb.startsWith(k)) ?? it.blurb.split(' ')[0]
    const sec = sections(h)
    detail.push({
      file: it.file,
      ko: name,
      desc: it.blurb.slice(name.length).trim(),
      kwcag: [...new Set([...h.matchAll(/KWCAG 2\.2 ([가-힣 ·]{2,20})/g)].map((x) => x[1].trim()))].sort(),
      usage: sec['사용성 가이드라인'] ?? [],
      a11y: sec['접근성 가이드라인'] ?? [],
      interaction: sec['상호작용 가이드라인'] ?? [],
      dev: sec['개발 시 접근성 관련 주의 사항'] ?? [],
    })
    process.stdout.write('.')
  }
  writeFileSync(join(CACHE, 'krds-patterns.json'), JSON.stringify(detail, null, 1), 'utf8')
  console.log(`\n캐시 갱신: ${detail.length}개`)
  return detail
}

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const arr = (xs, ind) =>
  xs.length ? `[\n${xs.map((x) => `${' '.repeat(ind + 2)}'${esc(x)}',`).join('\n')}\n${' '.repeat(ind)}]` : '[]'

const detail = process.argv.includes('--fetch')
  ? await refetch()
  : (() => {
      const p = join(CACHE, 'krds-patterns.json')
      if (!existsSync(p)) throw new Error('캐시가 없습니다. 인터넷이 되는 환경에서 --fetch 로 먼저 수집하세요.')
      return JSON.parse(readFileSync(p, 'utf8'))
    })()

const entries = detail.map((r) => ({
  ...r,
  id: MAP[r.ko] ?? '',
  usage: rules(r.usage).slice(0, 8),
  a11y: rules(r.a11y).slice(0, 8),
  interaction: rules(r.interaction).slice(0, 5),
  dev: rules(r.dev).slice(0, 5),
}))

const unknown = entries.filter((e) => MAP[e.ko] === undefined).map((e) => e.ko)
if (unknown.length) {
  console.error('\nMAP 에 없는 패턴 (원문이 갱신되었습니다):')
  for (const u of unknown) console.error(`  - ${u}`)
  process.exit(1)
}

const covered = entries.filter((e) => e.id).length
const ts = `/**
 * KRDS(대한민국 정부 디자인시스템) 기본 패턴 대응표
 *
 * 자동 생성 파일입니다. 직접 수정하지 마세요.
 * 원본: ${BASE}global_summary.html
 * 생성: node tools/build-krds-patterns.mjs
 *
 * 컴포넌트가 "무엇을 쓰는가"라면 기본 패턴은 "어떻게 엮는가"입니다.
 * 전체 ${entries.length}개 중 ${covered}개 대응.
 */

export interface KrdsPattern {
  ko: string
  /** 우리 문서의 대응 앵커 id. 빈 문자열이면 미대응 */
  id: string
  desc: string
  kwcag: string[]
  usage: string[]
  a11y: string[]
  interaction: string[]
  dev: string[]
}

export const KRDS_PATTERNS: KrdsPattern[] = [
${entries.map((e) => `  {
    ko: '${esc(e.ko)}',
    id: '${e.id}',
    desc: '${esc(e.desc.slice(0, 200))}',
    kwcag: ${arr(e.kwcag, 4)},
    usage: ${arr(e.usage, 4)},
    a11y: ${arr(e.a11y, 4)},
    interaction: ${arr(e.interaction, 4)},
    dev: ${arr(e.dev, 4)},
  },`).join('\n')}
]

/** 패턴 앵커 id 로 KRDS 지침을 찾습니다. */
export const krdsPatternFor = (id: string) => KRDS_PATTERNS.filter((p) => p.id === id)

export const KRDS_PATTERN_STATS = {
  total: KRDS_PATTERNS.length,
  covered: KRDS_PATTERNS.filter((p) => p.id).length,
}
`

writeFileSync(OUT, ts, 'utf8')
const n = (k) => entries.reduce((s, e) => s + e[k].length, 0)
console.log(`  ✓ app/src/data/krds-patterns.ts   ${entries.length}개 · 대응 ${covered} · 미대응 ${entries.length - covered}`)
console.log(`    지침 usage=${n('usage')} a11y=${n('a11y')} interaction=${n('interaction')} dev=${n('dev')}`)
const gap = entries.filter((e) => !e.id).map((e) => e.ko)
if (gap.length) console.log(`\n미대응: ${gap.join(', ')}`)
