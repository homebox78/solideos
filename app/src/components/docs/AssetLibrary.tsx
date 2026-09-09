import { useMemo, useState } from 'react'
import { Icon, type IconName } from '@/components/ui/icon'
import { ASSETS, type Asset, type Role } from '@/data/library'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const STATUS = {
  ready: { label: '내려받기 가능', className: 'text-text-positive', icon: 'download' },
  internal: { label: '사내망 전용', className: 'text-text-caution', icon: 'lock' },
  pending: { label: '등록 대기', className: 'text-text-tertiary', icon: 'schedule' },
} as const

/** 자산 유형별 미리보기 — 이미지 파일 없이 토큰으로 그립니다. */
function Preview({ asset }: { asset: Asset }) {
  const base = 'relative flex h-32 items-center justify-center overflow-hidden bg-muted'

  if (asset.preview === 'palette')
    return (
      <div className={base}>
        <div className="w-4/5 space-y-2">
          <div className="flex h-7 overflow-hidden rounded-sm">
            {['--gray-100', '--gray-400', '--gray-900', '--ink-700', '--crimson-500'].map((c) => (
              <span key={c} className="flex-1" style={{ background: `var(${c})` }} />
            ))}
          </div>
          <div className="flex h-5 overflow-hidden rounded-sm">
            {['--green-500', '--blue-500', '--amber-500', '--red-500'].map((c) => (
              <span key={c} className="flex-1" style={{ background: `var(${c})` }} />
            ))}
          </div>
        </div>
      </div>
    )

  if (asset.preview === 'code')
    return (
      <div className={cn(base, 'items-start p-5')}>
        <div className="w-full space-y-2">
          <div className="h-2 w-2/5 rounded-xs bg-crimson-300" />
          <div className="ml-4 h-2 w-3/5 rounded-xs bg-gray-200" />
          <div className="ml-4 h-2 w-1/2 rounded-xs bg-gray-200" />
          <div className="h-2 w-1/3 rounded-xs bg-gray-300" />
        </div>
      </div>
    )

  if (asset.preview === 'screens')
    return (
      <div className={cn(base, 'gap-3')}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 w-14 overflow-hidden rounded-sm bg-background shadow-1">
            <div className="h-3 bg-gray-300" />
            <div className="space-y-1 p-1.5">
              <div className="h-1.5 w-full rounded-xs bg-gray-150" />
              <div className="h-1.5 w-2/3 rounded-xs bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    )

  if (asset.preview === 'grid')
    return (
      <div className={cn(base, 'p-5')}>
        <div className="w-full space-y-2">
          <div className="h-10 rounded-sm bg-gray-200" />
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-xs bg-gray-150" />
            <div className="h-2 w-4/5 rounded-xs bg-gray-100" />
            <div className="h-2 w-11/12 rounded-xs bg-gray-100" />
          </div>
        </div>
      </div>
    )

  if (asset.preview === 'kit')
    return (
      <div className={cn(base, 'p-5')}>
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <div className="h-8 flex-1 rounded-sm bg-ink-700" />
            <div className="h-8 flex-1 rounded-sm bg-gray-200" />
            <div className="h-8 flex-1 rounded-sm bg-crimson-500" />
          </div>
          <div className="h-8 rounded-sm bg-gray-100" />
        </div>
      </div>
    )

  if (asset.preview === 'brand')
    return (
      <div className={base}>
        <span className="text-lg font-extrabold tracking-tight">
          solideo<span className="text-text-accent">.</span>
        </span>
      </div>
    )

  return (
    <div className={base}>
      <div className="h-24 w-20 rounded-sm border border-border bg-background p-2.5">
        <div className="space-y-1.5">
          <div className="h-2 w-3/5 rounded-xs bg-gray-300" />
          <div className="h-1.5 w-full rounded-xs bg-gray-150" />
          <div className="h-1.5 w-4/5 rounded-xs bg-gray-150" />
          <div className="h-1.5 w-full rounded-xs bg-gray-150" />
          <div className="h-1.5 w-2/5 rounded-xs bg-crimson-300" />
        </div>
      </div>
    </div>
  )
}

const KIND_ICON: Record<string, IconName> = {
  토큰: 'palette',
  목업: 'dashboard',
  화면기획: 'dashboard',
  문서: 'description',
  스타터킷: 'inventory',
  퍼블리싱: 'code',
  원본: 'code',
  'UI 키트': 'inventory',
  브랜드: 'gov',
}

export function AssetLibrary() {
  const [role, setRole] = useState<Role>('designer')
  const [kind, setKind] = useState('전체')
  const [q, setQ] = useState('')

  const kinds = useMemo(
    () => ['전체', ...new Set(ASSETS.filter((a) => a.role === role).map((a) => a.kind))],
    [role]
  )

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return ASSETS.filter((a) => {
      if (a.role !== role) return false
      if (kind !== '전체' && a.kind !== kind) return false
      if (!term) return true
      return [a.title, a.desc, a.kind, a.project, a.format, ...(a.stack ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [role, kind, q])

  const total = ASSETS.filter((a) => a.role === role).length
  const ready = ASSETS.filter((a) => a.role === role && a.status === 'ready').length

  return (
    <div className="space-y-5">
      <Tabs
        value={role}
        onValueChange={(v) => {
          setRole(v as Role)
          setKind('전체')
        }}
      >
        <TabsList>
          <TabsTrigger value="designer">디자이너</TabsTrigger>
          <TabsTrigger value="developer">개발자</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <Button
              key={k}
              variant={kind === k ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
            >
              {k}
            </Button>
          ))}
        </div>
        <div className="relative ml-auto">
          <label htmlFor="asset-q" className="sr-only">자산 검색</label>
          <Icon name="search"             className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-icon-tertiary"
            aria-hidden
          />
          <Input
            id="asset-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="자산 · 스택 검색"
            className="w-56 pl-9"
          />
        </div>
      </div>

      <p className="text-sm text-text-secondary">
        {list.length}건 표시 · {role === 'designer' ? '디자이너' : '개발자'} 자산 {total}건 중{' '}
        <b className="text-text-primary">{ready}건</b> 즉시 내려받기 가능
      </p>

      {list.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => {
            const st = STATUS[a.status]
            const kindIcon = KIND_ICON[a.kind] ?? 'description'
            return (
              <Card key={a.title} className="gap-0 overflow-hidden rounded-md p-0 shadow-none">
                <Preview asset={a} />
                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-2 flex items-center gap-2 text-xs text-text-tertiary">
                    <Icon name={kindIcon} size="sm" />
                    <span>{a.kind}</span>
                    <span aria-hidden>·</span>
                    <span>{a.project}</span>
                    <span aria-hidden>·</span>
                    <span>{a.year}</span>
                  </p>
                  <p className="mb-2 font-bold leading-snug">{a.title}</p>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary">{a.desc}</p>

                  {a.stack && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {a.stack.map((s) => (
                        <Badge key={s} variant="secondary" className="rounded-xs text-[0.625rem] font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className={cn('mb-1 flex items-center gap-1.5 text-xs font-bold', st.className)}>
                    <Icon name={st.icon} size="sm" />
                    {st.label}
                  </p>
                  <p className="mb-4 text-xs text-text-tertiary">
                    {a.owner} · {a.format}
                    {a.size !== '—' && ` · ${a.size}`}
                  </p>

                  {a.status === 'ready' ? (
                    <Button asChild variant="outline" className="w-full gap-2">
                      <a href={`./${a.href}`} download>
                        <Icon name="download" className="size-4" aria-hidden />
                        내려받기
                      </a>
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      {st.label}
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="rounded-md border border-border py-16 text-center">
          <p className="font-bold">조건에 맞는 자산이 없습니다</p>
          <p className="mt-2 text-sm text-text-secondary">필터를 넓히거나 검색어를 지워 보세요.</p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => {
              setKind('전체')
              setQ('')
            }}
          >
            필터 초기화
          </Button>
        </div>
      )}
    </div>
  )
}
