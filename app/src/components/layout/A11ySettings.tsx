import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type Scale = 'base' | 'lg' | 'xl'

const SCALES: { value: Scale; label: string; note: string }[] = [
  { value: 'base', label: '보통', note: '16px' },
  { value: 'lg', label: '크게', note: '18px' },
  { value: 'xl', label: '아주 크게', note: '20px' },
]

const KEY_SCALE = 'sds:font-scale'
const KEY_CONTRAST = 'sds:contrast'

function read(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

/**
 * KRDS 필수 요소 — 글자 · 화면 설정
 *
 * 저시력 · 고령 이용자를 위해 글자 크기와 명도 대비를 사용자가 직접 조절합니다.
 * 브라우저 확대와 별개로, 서비스가 스스로 제공해야 하는 기능입니다.
 * 설정은 이 브라우저에만 저장됩니다.
 */
export function A11ySettings() {
  const [scale, setScale] = useState<Scale>(() => read(KEY_SCALE, 'base') as Scale)
  const [highContrast, setHighContrast] = useState(() => read(KEY_CONTRAST, 'off') === 'on')

  useEffect(() => {
    const root = document.documentElement
    if (scale === 'base') root.removeAttribute('data-font-scale')
    else root.setAttribute('data-font-scale', scale)
    try {
      localStorage.setItem(KEY_SCALE, scale)
    } catch {
      /* 사생활 보호 모드에서는 저장하지 않습니다 */
    }
  }, [scale])

  useEffect(() => {
    const root = document.documentElement
    if (highContrast) root.setAttribute('data-contrast', 'high')
    else root.removeAttribute('data-contrast')
    try {
      localStorage.setItem(KEY_CONTRAST, highContrast ? 'on' : 'off')
    } catch {
      /* noop */
    }
  }, [highContrast])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="글자·화면 설정"
          className="gap-1.5 px-2 text-text-secondary"
        >
          <Icon name="settings" className="size-4" aria-hidden />
          <span className="hidden lg:inline">글자·화면 설정</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72 p-4">
        <DropdownMenuLabel className="flex items-center gap-2 px-0 pb-3 text-sm">
          <Icon name="textSize" className="size-4 text-icon-tertiary" aria-hidden />
          글자 크기
        </DropdownMenuLabel>
        <div role="radiogroup" aria-label="글자 크기" className="grid grid-cols-3 gap-2">
          {SCALES.map((s) => (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={scale === s.value}
              onClick={() => setScale(s.value)}
              className={cn(
                'rounded-sm border px-2 py-2 text-center transition-colors',
                scale === s.value
                  ? 'border-border-accent bg-fill-accent-subtle font-bold text-text-accent'
                  : 'border-border text-text-secondary hover:bg-muted'
              )}
            >
              <span className="block text-sm">{s.label}</span>
              <span className="block font-mono text-[0.625rem] text-text-tertiary">{s.note}</span>
            </button>
          ))}
        </div>

        <DropdownMenuSeparator className="my-4" />

        <div className="flex items-start justify-between gap-3">
          <Label htmlFor="contrast-mode" className="flex flex-1 cursor-pointer flex-col items-start gap-1">
            <span className="flex items-center gap-2 text-sm font-bold">
              <Icon name="contrast" className="size-4 text-icon-tertiary" aria-hidden />
              선명한 화면 모드
            </span>
            <span className="text-xs font-normal leading-relaxed text-text-secondary">
              글자와 테두리의 명도 대비를 최대로 높입니다.
            </span>
          </Label>
          <Switch id="contrast-mode" checked={highContrast} onCheckedChange={setHighContrast} />
        </div>

        {(scale !== 'base' || highContrast) && (
          <>
            <DropdownMenuSeparator className="my-4" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-text-secondary"
              onClick={() => {
                setScale('base')
                setHighContrast(false)
              }}
            >
              <Icon name="restart" className="size-3.5" aria-hidden />
              기본값으로 되돌리기
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
