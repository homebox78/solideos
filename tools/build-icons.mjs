/**
 * SOLIDEO Design System — 아이콘 생성
 *
 *   node tools/build-icons.mjs
 *
 * Google Material Symbols(Outlined 400)에서 **실제로 쓰는 아이콘만** 골라
 * path 데이터를 인라인 React 컴포넌트로 굽습니다.
 *
 * 왜 이렇게 하는가
 *  - 폐쇄망 · 보안 요구: CDN(fonts.googleapis.com)을 절대 호출하지 않습니다.
 *  - 아이콘 폰트 전체(수 MB)를 싣지 않고 쓰는 것만 담아 번들이 가볍습니다.
 *  - 런타임 네트워크 요청이 0건이라 외부로 나가는 트래픽 자체가 없습니다.
 *  - 생성물이 텍스트라 보안 검수 때 사람이 눈으로 확인할 수 있습니다.
 *
 * 아이콘을 추가하려면 아래 ICONS 에 `키: 'material-symbols 파일명'` 한 줄만 넣고
 * 다시 실행하세요. 파일명은 node_modules/@material-symbols/svg-400/outlined/ 기준입니다.
 *
 * 출처: Material Symbols · Apache License 2.0
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const SRC = join(ROOT, 'app/node_modules/@material-symbols/svg-400/outlined')
const OUT = join(ROOT, 'app/src/components/ui/icons.generated.ts')

/** 시스템에서 쓰는 아이콘. 키는 의미 기반으로 짓습니다. */
const ICONS = {
  /* 내비게이션 */
  menu: 'menu',
  close: 'close',
  search: 'search',
  expandMore: 'keyboard_arrow_down',
  expandLess: 'keyboard_arrow_up',
  chevronRight: 'chevron_right',
  chevronLeft: 'chevron_left',
  arrowUpward: 'arrow_upward',
  arrowForward: 'arrow_forward',
  moreHoriz: 'more_horiz',
  check: 'check',
  add: 'add',
  remove: 'remove',
  dragHandle: 'drag_handle',
  circle: 'circle',

  /* 접근성 · 설정 */
  settings: 'display_settings',
  textSize: 'format_size',
  contrast: 'contrast',
  restart: 'restart_alt',

  /* 상태 · 피드백 */
  info: 'info',
  checkCircle: 'check_circle',
  warning: 'warning',
  error: 'error',
  cancel: 'cancel',
  thumbUp: 'thumb_up',
  thumbDown: 'thumb_down',
  refresh: 'refresh',
  undo: 'undo',
  openInNew: 'open_in_new',
  language: 'language',

  /* 정부 · 보안 */
  gov: 'account_balance',
  verified: 'verified_user',
  lock: 'lock',
  visibility: 'visibility',
  visibilityOff: 'visibility_off',
  schedule: 'schedule',

  /* 자산 · 파일 */
  download: 'download',
  upload: 'upload',
  description: 'description',
  code: 'code',
  palette: 'palette',
  dashboard: 'dashboard',
  inventory: 'inventory_2',
  attachment: 'attach_file',
  mic: 'mic',
}

/* -------------------------------------------------------------------------- */

mkdirSync(dirname(OUT), { recursive: true })

const entries = []
const missing = []

for (const [key, file] of Object.entries(ICONS)) {
  let raw
  try {
    raw = readFileSync(join(SRC, `${file}.svg`), 'utf8')
  } catch {
    missing.push(`${key} → ${file}.svg`)
    continue
  }

  /* path 의 d 속성만 추출합니다. Material Symbols 는 항상 단일 path 입니다. */
  const paths = [...raw.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1])
  if (!paths.length) {
    missing.push(`${key} → path 없음`)
    continue
  }
  entries.push([key, paths.join(' ')])
}

if (missing.length) {
  console.error('\n찾지 못한 아이콘:')
  for (const m of missing) console.error(`  - ${m}`)
  process.exit(1)
}

const body = entries.map(([k, d]) => `  ${k}: '${d}',`).join('\n')

const out = `/**
 * 자동 생성 파일입니다. 직접 수정하지 마세요.
 * 원본: Google Material Symbols (Outlined 400) · Apache License 2.0
 * 생성: node tools/build-icons.mjs
 *
 * viewBox 는 Material Symbols 규격인 "0 -960 960 960" 입니다.
 * 아이콘 ${entries.length}개 · CDN 호출 없음 · 런타임 네트워크 요청 없음
 */

export const ICON_PATHS = {
${body}
} as const

export type IconName = keyof typeof ICON_PATHS
`

writeFileSync(OUT, out, 'utf8')

const bytes = Buffer.byteLength(out, 'utf8')
console.log(`  ✓ app/src/components/ui/icons.generated.ts  ${entries.length}개 · ${bytes} bytes`)
console.log('\n외부 요청 0건. 폐쇄망에서 그대로 동작합니다.')
