import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Scrollable } from '@/components/ui/scrollable'

/** 코드 블록 + 복사 버튼 */
export function CodeBlock({ code, label = '코드' }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* 클립보드 권한이 없는 환경에서는 조용히 넘어갑니다 */
    }
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={copy}
        className="absolute right-2 top-2 z-10 gap-1.5 bg-gray-800 text-gray-100 hover:bg-gray-700"
      >
        <Icon name={copied ? 'check' : 'code'} size="sm" />
        {copied ? '복사됨' : '복사'}
        <span className="sr-only">{label}</span>
      </Button>
      <Scrollable label={label}>
        <pre className="bg-gray-900 p-5 pr-24 font-mono text-xs leading-relaxed text-gray-100">
          {code}
        </pre>
      </Scrollable>
    </div>
  )
}

/**
 * 코드 탭.
 *
 * 항목이 2개뿐이라 Radix Tabs 의 로빙 포커스가 필요하지 않습니다.
 * 단순 버튼 + aria 로 두어 탭 정지점을 줄이고, 각 탭이 스스로 초점을 받게 합니다.
 */
function CodeTabs({ react, html }: { react?: string; html?: string }) {
  const [tab, setTab] = useState<'react' | 'html'>(react ? 'react' : 'html')
  const items = [
    react && { id: 'react' as const, label: 'React', code: react, aria: 'React 코드' },
    html && { id: 'html' as const, label: 'HTML · JSP', code: html, aria: 'HTML 코드' },
  ].filter(Boolean) as { id: 'react' | 'html'; label: string; code: string; aria: string }[]

  const current = items.find((i) => i.id === tab) ?? items[0]

  return (
    <div className="border-t border-border">
      <div className="flex gap-1 bg-bg-secondary px-3 pt-1.5">
        {items.map((i) => (
          <button
            key={i.id}
            type="button"
            aria-pressed={tab === i.id}
            onClick={() => setTab(i.id)}
            className={
              'rounded-t-sm px-3 py-2 text-sm transition-colors ' +
              (tab === i.id
                ? 'bg-gray-900 font-bold text-gray-100'
                : 'text-text-secondary hover:text-text-primary')
            }
          >
            {i.label}
          </button>
        ))}
      </div>
      <CodeBlock code={current.code} label={current.aria} />
    </div>
  )
}

/**
 * React / HTML 두 가지 구현을 나란히 보여 줍니다.
 *
 * 같은 컴포넌트를 React 팀과 퍼블리싱 팀이 각자의 방식으로 만들면
 * 시간이 지나면서 반드시 갈라집니다. 두 코드를 한 문서에 두어
 * "이 둘은 같은 것"이라는 사실을 눈으로 확인하게 합니다.
 */
export function Markup({
  children,
  react,
  html,
  block = false,
}: {
  /** 실물 미리보기 */
  children: ReactNode
  react?: string
  html?: string
  /** 좌측 정렬이 필요한 예시(폼 · 표)면 true */
  block?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div
        className={
          block
            ? 'bg-muted p-8'
            : 'flex flex-wrap items-center justify-center gap-3 bg-muted p-10'
        }
      >
        {children}
      </div>

      {(react || html) && <CodeTabs react={react} html={html} />}
    </div>
  )
}
