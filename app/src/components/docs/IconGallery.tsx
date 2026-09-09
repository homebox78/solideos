import { useMemo, useState } from 'react'
import { ICON_PATHS, type IconName } from '@/components/ui/icons.generated'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** 이름으로 대략적인 쓰임을 묶습니다. 갤러리 탐색을 돕기 위한 분류입니다. */
const GROUPS: { label: string; match: (n: string) => boolean }[] = [
  { label: '내비게이션', match: (n) => /menu|close|chevron|expand|arrow|moreHoriz/.test(n) },
  { label: '상태 · 피드백', match: (n) => /info|check|warning|error|cancel|thumb|refresh|undo|schedule/.test(n) },
  { label: '입력 · 설정', match: (n) => /settings|textSize|contrast|restart|visibility|search|add|remove|dragHandle|mic|language/.test(n) },
  { label: '파일 · 자산', match: (n) => /download|upload|description|code|palette|dashboard|inventory|attachment|openInNew/.test(n) },
  { label: '정부 · 보안', match: (n) => /gov|verified|lock/.test(n) },
]

const groupOf = (n: string) => GROUPS.find((g) => g.match(n))?.label ?? '기타'

/**
 * 아이콘 갤러리
 *
 * 어떤 아이콘이 있는지 소스를 열지 않고 확인하고, 이름을 바로 복사합니다.
 * 아이콘이 늘어나면 이 목록도 자동으로 따라옵니다.
 */
export function IconGallery() {
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState('')

  const names = useMemo(() => Object.keys(ICON_PATHS) as IconName[], [])

  const grouped = useMemo(() => {
    const term = q.trim().toLowerCase()
    const hit = names.filter((n) => !term || n.toLowerCase().includes(term) || groupOf(n).includes(term))
    const map = new Map<string, IconName[]>()
    for (const n of hit) {
      const g = groupOf(n)
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(n)
    }
    return [...map.entries()]
  }, [names, q])

  const copy = (n: string) => {
    navigator.clipboard?.writeText(`<Icon name="${n}" />`)
    setCopied(n)
    setTimeout(() => setCopied(''), 1400)
  }

  const shown = grouped.reduce((s, [, v]) => s + v.length, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <label htmlFor="icon-q" className="sr-only">아이콘 검색</label>
          <Icon
            name="search"
            size="sm"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-icon-tertiary"
          />
          <Input
            id="icon-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="아이콘 이름 · 분류 검색"
            className="w-56 pl-9"
          />
        </div>
        <p className="text-sm text-text-secondary">
          {shown}개 표시 · 전체 <b className="text-text-primary">{names.length}</b>개
        </p>
      </div>

      {grouped.map(([group, list]) => (
        <div key={group}>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-text-tertiary">
            {group} <span className="font-mono font-normal">{list.length}</span>
          </p>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
            {list.map((n) => (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => copy(n)}
                  title={`<Icon name="${n}" /> 복사`}
                  className={cn(
                    'flex w-full flex-col items-center gap-2 rounded-md border border-border px-2 py-3 transition-colors',
                    copied === n ? 'border-border-accent bg-fill-accent-subtle' : 'hover:bg-bg-secondary'
                  )}
                >
                  <Icon name={n} size="lg" className={copied === n ? 'text-icon-accent' : ''} />
                  <span className="w-full truncate font-mono text-[0.625rem] text-text-secondary">
                    {copied === n ? '복사됨' : n}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {!shown && (
        <div className="rounded-md border border-border py-12 text-center">
          <p className="font-bold">찾는 아이콘이 없습니다</p>
          <p className="mt-2 text-sm text-text-secondary">
            필요한 아이콘은 <code className="font-mono">tools/build-icons.mjs</code> 의 ICONS 에
            한 줄 추가하고 <code className="font-mono">npm run build:icons</code> 를 실행하세요.
          </p>
          <Button variant="secondary" className="mt-5" onClick={() => setQ('')}>
            검색어 지우기
          </Button>
        </div>
      )}
    </div>
  )
}
