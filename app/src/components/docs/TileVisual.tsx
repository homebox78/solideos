import { Icon } from '@/components/ui/icon'

/**
 * 커버 타일 미리보기.
 * 이미지 자산 없이 실제 컴포넌트와 토큰으로 그려서, 값이 바뀌면 미리보기도 함께 바뀝니다.
 */
export function TileVisual({ kind }: { kind: string }) {
  const wrap = 'relative flex h-[224px] items-center justify-center overflow-hidden bg-muted'

  if (kind === 'foundations')
    return (
      <div className={wrap}>
        <div className="text-center">
          <p className="text-[2.75rem] font-extrabold leading-none tracking-tight">가나다</p>
          <div className="mx-auto mt-4 flex h-7 w-56 overflow-hidden rounded-sm">
            {['--gray-100', '--gray-300', '--gray-900', '--ink-700', '--blue-500', '--crimson-500'].map((c) => (
              <span key={c} className="flex-1" style={{ background: `var(${c})` }} />
            ))}
          </div>
        </div>
      </div>
    )

  if (kind === 'components')
    return (
      <div className={wrap}>
        <div className="w-56 space-y-3">
          <div className="flex h-11 items-center justify-between rounded-sm border border-border-strong bg-background px-4 text-sm text-text-secondary">
            Label
            <Icon name="expandMore" className="size-4 text-icon-tertiary" aria-hidden />
          </div>
          <div className="flex items-center gap-3">
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-fill-accent">
              <span className="absolute right-0.5 size-5 rounded-full bg-white" />
            </span>
            <span className="flex h-11 flex-1 items-center justify-center rounded-sm bg-fill-accent text-sm font-bold text-white">
              버튼
            </span>
          </div>
        </div>
      </div>
    )

  if (kind === 'patterns')
    return (
      <div className={wrap}>
        <div className="w-56 space-y-3">
          <div className="h-24 rounded-sm bg-gray-200" />
          <div className="flex gap-3">
            <div className="size-10 shrink-0 rounded-sm bg-gray-200" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-2.5 w-full rounded-xs bg-gray-100" />
              <div className="h-2.5 w-3/4 rounded-xs bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    )

  if (kind === 'visual')
    return (
      <div className={wrap}>
        <div
          className="flex h-40 w-64 items-center justify-center rounded-sm"
          style={{
            background:
              'linear-gradient(135deg, var(--ink-700) 0%, #2C1420 55%, var(--crimson-700) 100%)',
          }}
        >
          <span className="text-lg font-extrabold tracking-[0.24em] text-white">SOLIDEO</span>
        </div>
      </div>
    )

  if (kind === 'writing')
    return (
      <div className={`${wrap} justify-start px-8`} aria-hidden>
        <div>
          <p className="text-2xl font-extrabold leading-snug tracking-tight">
            명확하고 일관된
            <br />
            메시지 전달
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-gray-400">언어 원칙과 표현</p>
        </div>
      </div>
    )

  if (kind === 'ai')
    return (
      <div className={wrap}>
        <div className="flex w-72 items-center gap-2 rounded-full border border-border bg-background py-3 pl-5 pr-2">
          <span className="flex-1 text-sm text-text-tertiary">원하는 업무를 입력하세요</span>
          <Icon name="mic" className="size-4 text-icon-tertiary" aria-hidden />
          <span className="flex size-8 items-center justify-center rounded-full bg-fill-accent">
            <Icon name="arrowUpward" className="size-4 text-white" aria-hidden />
          </span>
        </div>
      </div>
    )

  return <div className={wrap} />
}
