import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * SOLIDEO Design System — 가로 스크롤 영역
 *
 * 넓은 표 · 코드 블록처럼 가로로 스크롤되는 영역은 **키보드만 쓰는 이용자도
 * 스크롤할 수 있어야** 합니다 (WCAG 2.1.1 키보드). 마우스 휠이나 드래그로만
 * 움직이는 영역은 접근성 위반입니다.
 *
 * 그렇다고 항상 tabindex="0" 을 붙이면 스크롤이 필요 없을 때도 탭 정지점이
 * 늘어나 오히려 방해가 됩니다. 그래서 **실제로 넘칠 때만** 포커스를 받게 하고,
 * 그때만 스크린리더에 영역으로 알립니다.
 *
 * 창 크기 변경 · 글자 크기 변경에도 다시 계산합니다.
 */
export function Scrollable({
  children,
  label,
  className,
  ...props
}: {
  children: ReactNode
  /** 스크롤이 생겼을 때 스크린리더가 읽을 영역 이름 */
  label: string
  className?: string
} & Omit<React.ComponentProps<'div'>, 'children' | 'className'>) {
  const ref = useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 1)
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('overflow-x-auto', className)}
      /* 넘칠 때만 탭 정지점이 됩니다 */
      tabIndex={overflows ? 0 : undefined}
      role={overflows ? 'region' : undefined}
      aria-label={overflows ? label : undefined}
      {...props}
    >
      {children}
    </div>
  )
}
