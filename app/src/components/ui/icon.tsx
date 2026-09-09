import { ICON_PATHS, type IconName } from './icons.generated'
import { cn } from '@/lib/utils'

export type { IconName }

const SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: keyof typeof SIZES | number
  /**
   * 아이콘이 의미를 전달하면 label 을 반드시 넣습니다.
   * 옆에 텍스트가 함께 있는 장식용이면 생략하세요 — 자동으로 aria-hidden 처리됩니다.
   */
  label?: string
}

/**
 * Material Symbols 아이콘.
 *
 * path 데이터를 번들에 인라인으로 담고 있어 **런타임 네트워크 요청이 없습니다.**
 * 폐쇄망 · 망분리 환경에서 그대로 동작하며, 외부로 나가는 트래픽이 발생하지 않습니다.
 *
 *   <Icon name="search" />                     장식 (aria-hidden)
 *   <Icon name="close" label="닫기" />          의미 전달 (role="img")
 *
 * 아이콘 추가: tools/build-icons.mjs 의 ICONS 에 한 줄 넣고 재실행
 */
export function Icon({ name, size = 'md', label, className, ...props }: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size]
  const decorative = !label

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 -960 960 960"
      fill="currentColor"
      className={cn('inline-block shrink-0 align-middle', className)}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={label}
      focusable="false"
      {...props}
    >
      {label && <title>{label}</title>}
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}
