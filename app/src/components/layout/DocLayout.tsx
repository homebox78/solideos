import { useEffect, useState, type ReactNode } from 'react'
import { Icon } from '@/components/ui/icon'
import { useLocation } from 'react-router-dom'
import { findSection } from '@/data/ia'
import { Button } from '@/components/ui/button'
import { SideNav } from './SideNav'

/** 우측 "이 페이지에서" 목차 — h2[id]를 자동 수집합니다. */
function PageToc() {
  const { pathname } = useLocation()
  const [items, setItems] = useState<{ id: string; text: string }[]>([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const hs = Array.from(document.querySelectorAll<HTMLElement>('main section[id] > div > h2'))
    setItems(
      hs.map((h) => ({
        id: (h.closest('section') as HTMLElement).id,
        text: h.textContent?.trim() ?? '',
      }))
    )
  }, [pathname])

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    if (!targets.length) return
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-96px 0px -70% 0px' }
    )
    targets.forEach((t) => spy.observe(t))
    return () => spy.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <aside className="sticky top-[104px] hidden h-fit w-[180px] shrink-0 xl:block">
      <p className="mb-2 text-xs font-bold text-text-tertiary">이 페이지에서</p>
      <nav aria-label="페이지 내 목차">
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            className={
              'block border-l-2 py-1 pl-3 text-xs transition-colors ' +
              (active === i.id
                ? 'border-l-border-accent font-bold text-text-accent'
                : 'border-l-transparent text-text-tertiary hover:text-text-primary')
            }
          >
            {i.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}

function PageFeedback() {
  const [sent, setSent] = useState(false)
  return (
    <div className="mt-24 border-t border-border pt-8">
      {sent ? (
        <p className="text-sm text-text-secondary">의견 감사합니다.</p>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-text-secondary">이 페이지가 도움이 되었나요?</span>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSent(true)}>
            <Icon name="thumbUp" className="size-3.5" aria-hidden /> 도움이 되었어요
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSent(true)}>
            <Icon name="thumbDown" className="size-3.5" aria-hidden /> 아쉬워요
          </Button>
        </div>
      )}
    </div>
  )
}

/** 문서 페이지 셸 — 좌측 LNB + 본문 848px + 우측 목차 */
export function DocLayout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()
  const section = findSection(pathname)

  /*
   * 페이지 내 이동 시 초점까지 옮깁니다.
   *
   * 해시 라우팅에서는 브라우저의 기본 프래그먼트 동작(스크롤 + 초점 이동)이
   * 일어나지 않습니다. 스크롤만 하면 화면은 움직이지만 스크린리더 · 키보드
   * 이용자의 초점은 그대로 남아, 이어서 Tab 을 눌렀을 때 엉뚱한 곳으로 갑니다.
   * KRDS '콘텐츠 내 탐색' 지침의 초점 이동 요구사항이기도 합니다.
   */
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const el = document.getElementById(hash.slice(1))
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: 'start' })
      /* 섹션은 원래 초점을 받지 않으므로 일시적으로 받게 하고, 초점을 잃으면 되돌립니다 */
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1')
        el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true })
      }
      el.focus({ preventScroll: true })
    })
  }, [pathname, hash])

  return (
    <div className="mx-auto flex max-w-[1440px] gap-16 px-4 md:px-8">
      {section && !section.hideLnb && <SideNav section={section} />}
      <main id="main" className="min-w-0 flex-1 py-16">
        <div className="mx-auto max-w-[848px]">
          {children}
          <PageFeedback />
        </div>
      </main>
      <PageToc />
    </div>
  )
}
