import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './icon'
import { Button } from './button'
import { cn } from '@/lib/utils'

/* ==========================================================================
   KRDS 대응 컴포넌트
   KRDS(대한민국 정부 디자인시스템)에 정의되어 있으나 shadcn/ui 에는 없는
   공공 서비스 전용 컴포넌트입니다. KRDS 접근성 지침을 구현에 반영했습니다.
   ========================================================================== */

/* ------------------------------------------------------- 숨긴 콘텐츠 (KRDS) */
/**
 * 화면에는 보이지 않지만 스크린리더에는 읽히는 텍스트.
 *
 * KRDS 지침: `display:none` · `visibility:hidden` 은 스크린리더도 읽지 못하므로
 * 쓰지 않습니다. 클리핑 방식으로 숨겨야 보조기기가 읽습니다.
 * 포커스를 받아야 하는 요소(건너뛰기 링크 등)에는 focusable 을 켜세요.
 */
export function VisuallyHidden({
  children,
  focusable = false,
  as: Tag = 'span',
}: {
  children: ReactNode
  focusable?: boolean
  as?: 'span' | 'div' | 'p'
}) {
  return (
    <Tag
      className={cn(
        'absolute size-px overflow-hidden whitespace-nowrap border-0 p-0',
        '[clip:rect(0,0,0,0)] [clip-path:inset(50%)]',
        focusable &&
          'focus-within:static focus-within:size-auto focus-within:overflow-visible focus-within:whitespace-normal focus-within:[clip:auto] focus-within:[clip-path:none]'
      )}
    >
      {children}
    </Tag>
  )
}

/* --------------------------------------------------------- 긴급 공지 (KRDS) */
type CriticalTone = 'critical' | 'caution' | 'info'

const CRITICAL_STYLE: Record<CriticalTone, { bar: string; icon: IconName; tone: string; label: string }> = {
  critical: { bar: 'border-l-red-500', icon: 'error', tone: 'text-text-critical', label: '긴급' },
  caution: { bar: 'border-l-amber-500', icon: 'warning', tone: 'text-text-caution', label: '주의' },
  info: { bar: 'border-l-blue-500', icon: 'info', tone: 'text-text-info', label: '안내' },
}

/**
 * 긴급 공지 — 본문 최상단에 고정되는 중요 정보 배너.
 *
 * KRDS 지침
 *  - 화면당 1개만 제공합니다. 여러 개를 쌓으면 어느 것도 읽히지 않습니다.
 *  - 색만으로 긴급도를 전달하지 않고 아이콘과 텍스트를 함께 둡니다.
 *  - 닫기를 제공하더라도 다시 열 수 있는 경로를 남깁니다.
 *  - 자동으로 사라지지 않습니다(토스트와의 차이).
 */
export function CriticalAlert({
  tone = 'critical',
  title,
  children,
  onClose,
}: {
  tone?: CriticalTone
  title: string
  children?: ReactNode
  onClose?: () => void
}) {
  const s = CRITICAL_STYLE[tone]
  return (
    <div
      role={tone === 'critical' ? 'alert' : 'status'}
      className={cn('flex gap-3 border-l-4 bg-bg-secondary px-5 py-4', s.bar)}
    >
      <Icon name={s.icon} className={cn('mt-0.5 shrink-0', s.tone)} />
      <div className="flex-1">
        <p className={cn('text-sm font-bold', s.tone)}>
          <VisuallyHidden>{s.label} 공지. </VisuallyHidden>
          {title}
        </p>
        {children && <div className="mt-1 text-sm leading-relaxed text-text-secondary">{children}</div>}
      </div>
      {onClose && (
        <Button variant="ghost" size="icon" aria-label="공지 닫기" onClick={onClose}>
          <Icon name="close" size="sm" />
        </Button>
      )}
    </div>
  )
}

/* ------------------------------------------------------- 단계 표시기 (KRDS) */
/**
 * 단계 표시기 — 여러 단계를 거치는 과업의 진행 상태.
 *
 * KRDS 지침
 *  - 현재 단계를 `aria-current="step"` 으로 알립니다.
 *  - 색·굵기만으로 현재 단계를 구분하지 않고 텍스트로도 알립니다.
 *  - 전체 단계 수와 현재 위치를 문장으로도 제공합니다.
 */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <nav aria-label="진행 단계">
      <p className="mb-3 text-sm text-text-secondary">
        전체 {steps.length}단계 중 {current + 1}단계 · {steps[current]}
      </p>
      <ol className="flex flex-wrap gap-2">
        {steps.map((label, i) => {
          const done = i < current
          const now = i === current
          return (
            <li key={label} className="flex flex-1 basis-32 flex-col gap-1.5">
              <span
                className={cn(
                  'h-1.5 rounded-full',
                  done && 'bg-fill-accent',
                  now && 'bg-fill-accent',
                  !done && !now && 'bg-fill-secondary'
                )}
              />
              <span
                aria-current={now ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-1 text-xs',
                  now ? 'font-bold text-text-accent' : 'text-text-secondary'
                )}
              >
                {done && <Icon name="check" size="sm" className="text-text-positive" />}
                {label}
                {done && <VisuallyHidden>(완료)</VisuallyHidden>}
                {now && <VisuallyHidden>(현재 단계)</VisuallyHidden>}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ------------------------------------------------------- 구조화 목록 (KRDS) */
export interface StructuredItem {
  title: string
  desc?: string
  meta?: string[]
  status?: { label: string; tone: 'positive' | 'caution' | 'critical' | 'neutral' }
  href?: string
}

const STATUS_TONE = {
  positive: 'bg-fill-positive-subtle text-text-positive',
  caution: 'bg-fill-caution-subtle text-text-caution',
  critical: 'bg-fill-critical-subtle text-text-critical',
  neutral: 'bg-fill-secondary text-text-secondary',
}

/**
 * 구조화 목록 — 표보다 유연하고 카드보다 정보 밀도가 높은 목록.
 *
 * KRDS 지침
 *  - 레이아웃 목적으로 표를 쓰지 말고 이 컴포넌트를 씁니다.
 *  - 항목 전체가 링크라면 내부에 또 다른 링크·버튼을 두지 않습니다.
 *  - 목록임을 알 수 있도록 `<ul>`/`<li>` 로 마크업합니다.
 */
export function StructuredList({ items, label }: { items: StructuredItem[]; label: string }) {
  return (
    <ul aria-label={label} className="divide-y divide-border rounded-md border border-border">
      {items.map((it) => {
        const inner = (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{it.title}</span>
              {it.status && (
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-bold',
                    STATUS_TONE[it.status.tone]
                  )}
                >
                  {it.status.label}
                </span>
              )}
            </div>
            {it.desc && <p className="mt-1 text-sm text-text-secondary">{it.desc}</p>}
            {it.meta && (
              <p className="mt-2 flex flex-wrap gap-x-2 text-xs text-text-tertiary">
                {it.meta.map((m, i) => (
                  <span key={m}>
                    {i > 0 && <span aria-hidden className="mr-2">·</span>}
                    {m}
                  </span>
                ))}
              </p>
            )}
          </>
        )
        return (
          <li key={it.title}>
            {it.href ? (
              <a
                href={it.href}
                className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-bg-secondary"
              >
                <span className="flex-1">{inner}</span>
                <Icon name="chevronRight" className="mt-0.5 shrink-0 text-icon-tertiary" />
              </a>
            ) : (
              <div className="px-5 py-4">{inner}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/* ----------------------------------------------------------- 스피너 (KRDS) */
/**
 * 스피너 — 처리 중임을 알립니다.
 *
 * KRDS 지침
 *  - 무엇을 처리 중인지 텍스트로 함께 알립니다.
 *  - `role="status"` 로 스크린리더가 변화를 인지하게 합니다.
 *  - 애니메이션은 `prefers-reduced-motion` 을 존중합니다.
 */
export function Spinner({ label = '불러오는 중입니다' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center gap-3">
      <span
        aria-hidden
        className="size-5 animate-spin rounded-full border-2 border-border-primary border-t-fill-accent motion-reduce:animate-none"
      />
      <span className="text-sm text-text-secondary">{label}</span>
    </div>
  )
}

/* ----------------------------------------------------------- 스낵바 (KRDS) */
/**
 * 스낵바 — 처리 결과를 알리고 되돌릴 기회를 줍니다.
 *
 * KRDS 지침 · 토스트와의 차이
 *  - 토스트: 알림만. 행동 없음. 자동 소멸.
 *  - 스낵바: 되돌리기 등 행동을 포함. 행동이 있으면 자동 소멸 시간을 늘립니다.
 *  - 화면당 1개만 표시하고 쌓지 않습니다.
 */
export function Snackbar({
  message,
  actionLabel,
  onAction,
  onClose,
}: {
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void
}) {
  return (
    <div
      role="status"
      className="flex w-full max-w-md items-center gap-3 rounded-md bg-bg-inverse px-5 py-3 text-sm text-text-inverse shadow-3"
    >
      <span className="flex-1">{message}</span>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 font-bold text-crimson-300 underline underline-offset-2"
        >
          {actionLabel}
        </button>
      )}
      {onClose && (
        <button type="button" onClick={onClose} aria-label="알림 닫기" className="shrink-0 opacity-70 hover:opacity-100">
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  )
}

/* --------------------------------------------------- 콘텐츠 내 탐색 (KRDS) */
/**
 * 콘텐츠 내 탐색 — 본문의 목차. 스크롤에 따라 현재 위치를 표시합니다.
 *
 * KRDS 지침
 *  - `<nav>` 로 감싸고 이름을 붙입니다.
 *  - 현재 항목을 `aria-current="true"` 로 알립니다.
 *  - 목차 링크로 이동해도 브라우저 뒤로가기가 동작해야 합니다.
 */
export function InPageNav({
  items,
  label = '이 페이지에서',
}: {
  items: { id: string; text: string }[]
  label?: string
}) {
  const [active, setActive] = useState('')
  const ref = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    if (!targets.length) return
    ref.current = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-96px 0px -70% 0px' }
    )
    targets.forEach((t) => ref.current!.observe(t))
    return () => ref.current?.disconnect()
  }, [items])

  return (
    <nav aria-label={label}>
      <p className="mb-2 text-xs font-bold text-text-tertiary">{label}</p>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? 'true' : undefined}
              className={cn(
                'block border-l-2 py-1 pl-3 text-xs transition-colors',
                active === i.id
                  ? 'border-l-border-accent font-bold text-text-accent'
                  : 'border-l-transparent text-text-tertiary hover:text-text-primary'
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
