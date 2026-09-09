import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SECTIONS, SYSTEM, allPages, findSection } from '@/data/ia'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { A11ySettings } from './A11ySettings'
import { SideNavContent } from './SideNav'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const current = findSection(pathname)

  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const hits = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    return allPages
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.section.title.toLowerCase().includes(term) ||
          (p.krds ?? '').toLowerCase().includes(term)
      )
      .slice(0, 8)
  }, [q])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-4 md:px-8">
        {/* 모바일 메뉴 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="메뉴 열기">
              <Icon name="menu" className="size-5" aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle>전체 메뉴</SheetTitle>
            </SheetHeader>
            <nav className="px-3 py-4">
              {SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  to={s.path}
                  className={cn(
                    'block rounded-sm px-3 py-2.5 text-sm',
                    s === current ? 'bg-muted font-bold text-text-primary' : 'text-text-secondary'
                  )}
                >
                  {s.title}
                </Link>
              ))}
              {current && !current.hideLnb && (
                <div className="mt-4 border-t border-border pt-4">
                  <SideNavContent section={current} />
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex min-w-0 shrink items-baseline gap-2 xl:shrink-0">
          <span className="truncate text-[1.0625rem] font-extrabold tracking-tight">
            SOLIDEO{' '}
            <span className="hidden font-medium text-text-secondary sm:inline">Design System</span>
          </span>
        </Link>

        <Badge variant="outline" className="hidden shrink-0 font-mono text-[0.6875rem] font-normal md:inline-flex">
          {SYSTEM.version}
        </Badge>

        <nav aria-label="주요 메뉴" className="mx-auto hidden min-w-0 items-center gap-5 overflow-x-auto [scrollbar-width:none] lg:flex xl:gap-7 [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={s.path}
              aria-current={s === current ? 'page' : undefined}
              className={cn(
                'flex h-[72px] shrink-0 items-center whitespace-nowrap border-b-2 border-transparent text-sm font-medium text-text-secondary transition-colors hover:text-text-primary',
                s === current && 'border-b-border-accent font-bold text-text-primary'
              )}
            >
              {s.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 border-l border-border pl-2 sm:pl-3 lg:ml-0">
          <A11ySettings />

          <div ref={boxRef} className="relative">
            <label htmlFor="site-search" className="sr-only">
              페이지 검색
            </label>
            <Icon name="search"
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-icon-tertiary"
              aria-hidden
            />
            <Input
              id="site-search"
              type="search"
              value={q}
              placeholder="검색"
              autoComplete="off"
              onChange={(e) => {
                setQ(e.target.value)
                setOpen(true)
              }}
              onFocus={() => q && setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setQ('')
                  setOpen(false)
                }
                if (e.key === 'Enter' && hits[0]) {
                  navigate(`${hits[0].section.path}#${hits[0].id}`)
                  setOpen(false)
                }
              }}
              className="h-9 w-[92px] rounded-full bg-muted pl-8 transition-[width] focus-visible:w-[200px] sm:w-[132px] md:w-[168px]"
            />

            {open && q && (
              <div className="absolute right-0 top-11 z-50 w-[min(320px,calc(100vw-2rem))] rounded-md border border-border bg-popover p-1.5 shadow-3">
                {hits.length ? (
                  hits.map((p) => (
                    <Link
                      key={`${p.section.id}-${p.id}`}
                      to={`${p.section.path}#${p.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted"
                    >
                      <span>{p.name}</span>
                      <span className="ml-auto shrink-0 text-xs text-text-tertiary">{p.section.title}</span>
                    </Link>
                  ))
                ) : (
                  <p className="px-3 py-2.5 text-sm text-text-tertiary">검색 결과가 없습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
