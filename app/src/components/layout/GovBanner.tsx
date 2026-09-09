import { useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/**
 * KRDS 필수 요소 — 전자정부 누리집 안내 배너
 *
 * 정부 · 공공기관 서비스는 접속한 누리집이 공식 사이트임을 최상단에서 알려야 합니다.
 * 솔리데오가 수행하는 플랫폼정부 사업 화면에는 이 배너를 그대로 옮겨 넣습니다.
 * 민간 사업 화면에서는 사용하지 않습니다.
 */
export function GovBanner() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border bg-muted text-xs">
      <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-1.5 md:px-8">
        <Icon name="gov" className="size-3.5 shrink-0 text-icon-tertiary" aria-hidden />
        <span className="text-text-secondary">이 누리집은 대한민국 공식 전자정부 누리집입니다.</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="ml-1 inline-flex items-center gap-0.5 rounded-xs font-bold text-text-secondary underline underline-offset-2 hover:text-text-primary"
        >
          확인하기
          <Icon name="expandMore" className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background">
          <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-6 md:grid-cols-2 md:px-8">
            <div className="flex gap-3">
              <Icon name="verified" className="mt-0.5 size-5 shrink-0 text-icon-accent" aria-hidden />
              <div>
                <p className="font-bold text-text-primary">
                  공식 누리집 주소 확인하기
                </p>
                <p className="mt-1 leading-relaxed text-text-secondary">
                  국민이 이용하는 공공기관 누리집 주소는{' '}
                  <b className="text-text-primary">go.kr</b> 또는{' '}
                  <b className="text-text-primary">or.kr</b> 로 끝납니다.
                  이 주소와 다르다면 사칭 사이트를 의심해 주세요.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="lock" className="mt-0.5 size-5 shrink-0 text-icon-accent" aria-hidden />
              <div>
                <p className="font-bold text-text-primary">HTTPS 확인하기</p>
                <p className="mt-1 leading-relaxed text-text-secondary">
                  주소창의 자물쇠 표시와 <b className="text-text-primary">https://</b> 를 확인하세요.
                  개인정보를 입력하기 전에는 반드시 확인이 필요합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
