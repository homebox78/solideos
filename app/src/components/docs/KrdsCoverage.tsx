import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { KRDS_CATEGORIES, KRDS_COMPONENTS, KRDS_STATS } from '@/data/krds'
import { KRDS_PATTERNS, KRDS_PATTERN_STATS } from '@/data/krds-patterns'
import { SECTIONS } from '@/data/ia'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Scrollable } from '@/components/ui/scrollable'
import { cn } from '@/lib/utils'

/** 앵커 id → 그 id 를 가진 문서 섹션의 경로를 찾습니다. */
const pathFor = (id: string) => {
  for (const s of SECTIONS)
    for (const g of s.groups) if (g.pages.some((p) => p.id === id)) return `${s.path}#${id}`
  return ''
}

/**
 * KRDS 컴포넌트 대응표
 *
 * 공공 · 행정 SI 사업의 산출물 검수는 KRDS 분류를 기준으로 이루어집니다.
 * 이 표를 그대로 검수 담당자에게 보여 주면 "무엇이 대응되고 무엇이 남았는지"가
 * 한 번에 확인됩니다.
 */
export function KrdsCoverage() {
  const [cat, setCat] = useState('전체')
  const [q, setQ] = useState('')
  const [onlyGap, setOnlyGap] = useState(false)

  /* 컴포넌트 55종 + 기본 패턴 12종을 한 표에서 봅니다. */
  const ALL = useMemo(
    () => [
      ...KRDS_COMPONENTS.map((c) => ({ ...c, group: '컴포넌트' as const })),
      ...KRDS_PATTERNS.map((p) => ({
        ko: p.ko, en: '', cat: '기본 패턴', id: p.id, kwcag: p.kwcag, group: '기본 패턴' as const,
      })),
    ],
    []
  )

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return ALL.filter((c) => {
      if (cat !== '전체' && c.cat !== cat) return false
      if (onlyGap && c.id) return false
      if (!term) return true
      return [c.ko, c.en, c.cat, ...c.kwcag].join(' ').toLowerCase().includes(term)
    })
  }, [ALL, cat, q, onlyGap])

  const total = KRDS_STATS.total + KRDS_PATTERN_STATS.total
  const covered = KRDS_STATS.covered + KRDS_PATTERN_STATS.covered
  const pct = Math.round((covered / total) * 100)

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-border p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-text-secondary">
            KRDS 컴포넌트 {KRDS_STATS.covered}/{KRDS_STATS.total} · 기본 패턴{' '}
            {KRDS_PATTERN_STATS.covered}/{KRDS_PATTERN_STATS.total} —{' '}
            <b className="text-text-primary">{total}</b>개 중{' '}
            <b className="text-text-accent">{covered}</b>개 대응
          </p>
          <p className="font-mono text-sm text-text-secondary">{pct}%</p>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-fill-secondary"
          role="img"
          aria-label={`KRDS 대응률 ${pct}퍼센트`}
        >
          <div className="h-full rounded-full bg-fill-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {['전체', '기본 패턴', ...KRDS_CATEGORIES].map((c) => (
          <Button
            key={c}
            variant={cat === c ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
          >
            {c}
          </Button>
        ))}
        <Button
          variant={onlyGap ? 'default' : 'outline'}
          size="sm"
          className="rounded-full"
          aria-pressed={onlyGap}
          onClick={() => setOnlyGap((v) => !v)}
        >
          미대응만
        </Button>
        <div className="relative ml-auto">
          <label htmlFor="krds-q" className="sr-only">
            KRDS 컴포넌트 검색
          </label>
          <Icon
            name="search"
            size="sm"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-icon-tertiary"
          />
          <Input
            id="krds-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="컴포넌트 · KWCAG 검색"
            className="w-52 pl-9"
          />
        </div>
      </div>

      <p className="text-sm text-text-secondary">{list.length}건 표시</p>

      <Scrollable label="KRDS 대응표" className="rounded-md border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">KRDS 컴포넌트와 솔리데오 디자인 시스템 대응 현황</caption>
          <thead>
            <tr className="bg-muted">
              <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">분류</th>
              <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">KRDS 항목</th>
              <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">대응</th>
              <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">KWCAG 항목</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const path = c.id ? pathFor(c.id) : ''
              return (
                <tr key={c.ko} className="border-t border-border">
                  <td className="whitespace-nowrap px-4 py-2.5 text-text-tertiary">{c.cat}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-medium">{c.ko}</span>
                    <span className="ml-1.5 text-xs text-text-tertiary">{c.en}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {path ? (
                      <Link
                        to={path}
                        className="inline-flex items-center gap-1 font-medium text-text-accent underline underline-offset-2"
                      >
                        <Icon name="check" size="sm" />
                        {c.id}
                      </Link>
                    ) : (
                      <span className="text-text-tertiary">미대응</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex flex-wrap gap-1">
                      {c.kwcag.length ? (
                        c.kwcag.map((k) => (
                          <Badge key={k} variant="secondary" className="rounded-xs text-[0.625rem] font-normal">
                            {k}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Scrollable>

      <p className={cn('text-xs text-text-tertiary')}>
        출처: 대한민국 정부 디자인시스템(KRDS) 컴포넌트 {KRDS_STATS.total}종 · 기본 패턴{' '}
        {KRDS_PATTERN_STATS.total}종 · 2026.09 기준
      </p>
    </div>
  )
}
