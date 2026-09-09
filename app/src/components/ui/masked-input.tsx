import { useId, useState, type ReactNode } from 'react'
import { Label } from './label'
import { Input } from './input'
import { Button } from './button'
import { Icon } from './icon'
import { cn } from '@/lib/utils'

/**
 * SOLIDEO Design System — 마스킹 입력
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 주민등록번호 뒷자리 · 계좌번호처럼 **어깨너머 노출을 막아야 하지만
 * 비밀번호는 아닌** 값에 씁니다.
 *
 * 왜 `type="password"` 를 쓰지 않는가
 *   - 비밀번호 관리자가 주민등록번호를 저장해 버립니다. 개인정보 유출 경로입니다.
 *   - 이를 막으려 `autocomplete="off"` 를 붙이면 WCAG 3.3.8(접근 가능한 인증)
 *     검사에서 "비밀번호 관리자를 차단한다"고 지적됩니다.
 *   - 애초에 인증 수단이 아니므로 password 시맨틱이 틀렸습니다.
 *
 * 그래서 일반 텍스트 입력으로 두고 화면 표시만 가립니다.
 * 이용자가 자기가 입력한 값을 확인할 수 있도록 **표시 토글**을 함께 둡니다.
 * 실제 값은 컴포넌트 상태에만 있고 DOM value 에는 마스킹된 문자열이 들어갑니다.
 * ────────────────────────────────────────────────────────────────────────────
 */
export function MaskedInput({
  label,
  hint,
  error,
  required,
  className,
  maxLength,
  placeholder,
  onValueChange,
}: {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  className?: string
  maxLength?: number
  placeholder?: string
  /** 마스킹되지 않은 실제 값 */
  onValueChange?: (value: string) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState(false)

  const handle = (next: string) => {
    /* 마스킹 상태에서는 뒤에 덧붙이거나 지우는 것만 허용합니다 */
    let real = next
    if (!visible) {
      if (next.length > value.length) real = value + next.slice(value.length)
      else real = value.slice(0, next.length)
    }
    real = real.replace(/\D/g, '').slice(0, maxLength)
    setValue(real)
    onValueChange?.(real)
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-text-critical" aria-hidden>
            *
          </span>
        )}
      </Label>
      <div className="flex items-center gap-1">
        <Input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={visible ? value : '•'.repeat(value.length)}
          onChange={(e) => handle(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error ? errorId : hint ? hintId : null].filter(Boolean).join(' ') || undefined}
          className={cn('flex-1', error && 'border-border-critical')}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-pressed={visible}
          aria-label={visible ? '입력한 값 가리기' : '입력한 값 표시'}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon name={visible ? 'visibilityOff' : 'visibility'} />
        </Button>
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-text-tertiary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-text-critical">
          {error}
        </p>
      )}
    </div>
  )
}
