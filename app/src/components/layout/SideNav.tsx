import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { Section } from '@/data/ia'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_LABEL = { wip: '작성중', todo: '예정' } as const

/** 현재 섹션의 하위 페이지만 노출합니다 (2차 내비게이션). */
export function SideNavContent({ section }: { section: Section }) {
  const { hash } = useLocation()
  const [active, setActive] = useState('')

  useEffect(() => {
    if (hash) setActive(hash.slice(1))
  }, [hash])

  useEffect(() => {
    const ids = section.groups.flatMap((g) => g.pages.map((p) => p.id))
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!targets.length) return

    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-96px 0px -70% 0px' }
    )
    targets.forEach((t) => spy.observe(t))
    return () => spy.disconnect()
  }, [section])

  return (
    <>
      {section.groups.map((group) => (
        <div key={group.title} className="mb-5">
          {section.groups.length > 1 && (
            <p className="mb-1 px-3 text-xs font-bold uppercase tracking-wider text-text-tertiary">
              {group.title}
            </p>
          )}
          {group.pages.map((page) => (
            <Link
              key={page.id}
              to={`${section.path}#${page.id}`}
              aria-current={active === page.id ? 'true' : undefined}
              className={cn(
                'flex items-center justify-between gap-2 rounded-sm px-3 py-1.5 text-sm transition-colors',
                active === page.id
                  ? 'bg-muted font-bold text-text-primary'
                  : 'text-text-secondary hover:bg-muted hover:text-text-primary'
              )}
            >
              <span>{page.name}</span>
              {page.status !== 'ready' && (
                <Badge
                  variant="secondary"
                  className={cn(
                    'shrink-0 rounded-xs px-1.5 py-0 text-[0.625rem] font-bold',
                    page.status === 'wip'
                      ? 'bg-fill-accent-subtle text-text-accent'
                      : 'bg-fill-secondary text-text-secondary'
                  )}
                >
                  {STATUS_LABEL[page.status]}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      ))}
    </>
  )
}

export function SideNav({ section }: { section: Section }) {
  return (
    <nav
      aria-label={`${section.title} 하위 메뉴`}
      className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[240px] shrink-0 overflow-y-auto border-r border-border px-3 py-6 lg:block"
    >
      <p className="mb-3 px-3 font-bold">{section.title}</p>
      <SideNavContent section={section} />
    </nav>
  )
}
