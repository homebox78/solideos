import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/icon'
import { Scrollable } from '@/components/ui/scrollable'
import { KrdsGuide } from './KrdsGuide'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ 페이지 */

export function DocHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <header className="mb-16">
      <p className="text-sm font-medium text-text-secondary">{eyebrow}</p>
      <h1 className="mt-2 mb-5 text-[2.5rem] font-bold leading-[1.2] tracking-tight">{title}</h1>
      <div className="text-lg font-medium leading-[1.5] text-text-secondary">{children}</div>
    </header>
  )
}

/** 문서 섹션. id는 IA의 page.id와 일치해야 좌측 메뉴가 따라옵니다. */
export function Section({
  id,
  title,
  status,
  krds,
  children,
}: {
  id: string
  title: string
  status?: 'wip' | 'todo'
  krds?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10 first:border-t-0 first:pt-0 mt-20 first:mt-0">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="text-[1.75rem] font-bold leading-tight tracking-tight">{title}</h2>
        {status && (
          <Badge
            variant="secondary"
            className={cn(
              'rounded-xs',
              status === 'wip'
                ? 'bg-fill-accent-subtle text-text-accent'
                : 'bg-fill-secondary text-text-secondary'
            )}
          >
            {status === 'wip' ? '작성중' : '예정'}
          </Badge>
        )}
        {krds && (
          <Badge variant="outline" className="rounded-xs font-normal text-text-tertiary">
            KRDS · {krds}
          </Badge>
        )}
      </div>
      <div className="space-y-4 [&>p]:text-text-secondary">{children}</div>
      {/* 대응하는 KRDS 지침이 있으면 자동으로 붙습니다 */}
      <KrdsGuide id={id} />
    </section>
  )
}

export function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="pt-6">
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <div className="space-y-4 [&>p]:text-text-secondary">{children}</div>
    </div>
  )
}

/* -------------------------------------------------------------------- 요소 */

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed text-text-secondary">{children}</p>
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-xs bg-fill-secondary px-1.5 py-0.5 font-mono text-[0.875em]">
      {children}
    </code>
  )
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-5 list-disc space-y-2 text-text-secondary">
      {items.map((it, i) => (
        <li key={i} className="leading-relaxed">{it}</li>
      ))}
    </ul>
  )
}

/** 사양 표. 첫 행이 헤더입니다. */
export function Spec({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="rounded-md border border-border">
      <Table scrollLabel={`${head[0]} 표`}>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {head.map((h) => (
              <TableHead key={h} className="whitespace-nowrap font-bold text-text-secondary">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>
              {r.map((c, j) => (
                <TableCell key={j} className="align-top leading-relaxed">
                  {c}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/** 컴포넌트 실물 예시 + 코드 */
export function Example({ children, code }: { children: ReactNode; code?: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex flex-wrap items-center justify-center gap-3 bg-muted p-10">{children}</div>
      {code && (
        <Scrollable label="코드 예시">
          <pre className="bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">{code}</pre>
        </Scrollable>
      )}
    </div>
  )
}

/** 좌측 정렬이 필요한 예시(폼 · 표 등) */
export function ExampleBlock({ children, code }: { children: ReactNode; code?: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="bg-muted p-8">{children}</div>
      {code && (
        <Scrollable label="코드 예시">
          <pre className="bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">{code}</pre>
        </Scrollable>
      )}
    </div>
  )
}

export function DoDont({ do: doText, dont }: { do: ReactNode; dont: ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-md border border-border border-t-[3px] border-t-green-500 p-5">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-bold tracking-wide text-text-positive">
          <Icon name="check" className="size-4" aria-hidden /> DO
        </p>
        <p className="text-sm leading-relaxed text-text-secondary">{doText}</p>
      </div>
      <div className="rounded-md border border-border border-t-[3px] border-t-red-500 p-5">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-bold tracking-wide text-text-critical">
          <Icon name="close" className="size-4" aria-hidden /> DON&apos;T
        </p>
        <p className="text-sm leading-relaxed text-text-secondary">{dont}</p>
      </div>
    </div>
  )
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-md border-l-[3px] border-l-border-accent bg-fill-accent-subtle px-5 py-4 text-sm leading-relaxed">
      <Icon name="info" className="mt-0.5 size-4 shrink-0 text-icon-accent" aria-hidden />
      <div className="[&_b]:font-bold">{children}</div>
    </div>
  )
}

/* -------------------------------------------------------------------- 컬러 */

export function Ramp({ name, steps }: { name: string; steps: string[] }) {
  return (
    /*
      모바일에서는 20단계를 한 줄에 늘어놓으면 각 칸이 10px 남짓이 되어
      터치할 수 없습니다(WCAG 2.5.8 최소 24px). 그래서 좁은 화면에서는
      줄바꿈해 최소 크기를 확보합니다.
    */
    <div
      className="flex flex-wrap overflow-hidden rounded-md sm:flex-nowrap"
      role="group"
      aria-label={`${name} 색상 스케일`}
    >
      {steps.map((step) => {
        const light = Number(step) < 400
        return (
          <button
            key={step}
            type="button"
            title={`--${name}-${step}`}
            aria-label={`${name} ${step} 토큰 복사`}
            onClick={() => navigator.clipboard?.writeText(`var(--${name}-${step})`)}
            className={cn(
              'flex h-11 min-w-11 flex-1 basis-[12.5%] items-end justify-center pb-1.5 font-mono text-[0.625rem] transition-transform hover:scale-y-110 sm:h-[72px] sm:basis-auto',
              light ? 'text-text-secondary' : 'text-white'
            )}
            style={{ background: `var(--${name}-${step})` }}
          >
            {step}
          </button>
        )
      })}
    </div>
  )
}

export function Swatch({ token, label, hex }: { token: string; label: string; hex: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(`var(${token})`)}
      className="overflow-hidden rounded-md border border-border text-left transition-colors hover:border-border-strong"
    >
      <span className="block h-[72px]" style={{ background: `var(${token})` }} />
      <span className="block p-3">
        <span className="block text-sm font-bold">{label}</span>
        <span className="block font-mono text-xs text-text-tertiary">{hex}</span>
      </span>
    </button>
  )
}
