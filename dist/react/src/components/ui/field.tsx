import { useId, type ReactNode } from 'react'
import { Label } from './label'
import { Checkbox } from './checkbox'
import { RadioGroupItem } from './radio-group'
import { Switch } from './switch'
import { Input } from './input'
import { Textarea } from './textarea'
import { cn } from '@/lib/utils'

/**
 * SOLIDEO Design System — 폼 필드
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 왜 이 컴포넌트가 필요한가
 *
 * shadcn/ui 의 Checkbox · Radio · Switch · Select 는 Radix 기반이라
 * 실제 DOM 이 `<button role="checkbox">` 입니다. 이때 `<label for="…">` 만으로는
 * **접근 가능한 이름이 생기지 않습니다.** 스크린리더가 "체크박스" 라고만 읽고
 * 무엇에 대한 체크박스인지 말하지 못합니다.
 *
 * 공공 서비스에서는 이것이 곧 접근성 심사 탈락 사유입니다.
 * 그래서 담당자의 주의력에 기대지 않고 **컴포넌트가 구조적으로 보장**하도록 했습니다.
 * label 은 필수 prop 이며, id 연결과 aria-labelledby · aria-describedby 를
 * 자동으로 붙입니다.
 *
 * 제품 코드에서는 원시 Checkbox / Switch 대신 이 컴포넌트를 쓰세요.
 * ────────────────────────────────────────────────────────────────────────────
 */

interface BaseProps {
  /** 접근 가능한 이름. 필수입니다. */
  label: ReactNode
  /** 필드 아래 도움말 */
  hint?: ReactNode
  /** 오류 메시지. 있으면 aria-invalid 가 켜집니다. */
  error?: ReactNode
  required?: boolean
  className?: string
}

/* --------------------------------------------------------- 라벨 · 설명 공통 */

function Describe({
  hintId,
  errorId,
  hint,
  error,
}: {
  hintId: string
  errorId: string
  hint?: ReactNode
  error?: ReactNode
}) {
  return (
    <>
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
    </>
  )
}

const describedBy = (hintId: string, errorId: string, hint?: ReactNode, error?: ReactNode) =>
  [error ? errorId : hint ? hintId : null].filter(Boolean).join(' ') || undefined

/* ------------------------------------------------------------------ 텍스트 */

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: BaseProps & Omit<React.ComponentProps<typeof Input>, 'aria-invalid'>) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

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
      <Input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        className={cn(error && 'border-border-critical')}
        {...props}
      />
      <Describe hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  )
}

export function TextareaField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: BaseProps & Omit<React.ComponentProps<typeof Textarea>, 'aria-invalid'>) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

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
      <Textarea
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        {...props}
      />
      <Describe hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  )
}

/* --------------------------------------------------- 체크박스 · 라디오 · 스위치 */
/* 이 셋은 Radix 가 <button> 으로 렌더링하므로 aria-labelledby 를 직접 붙입니다. */

export function CheckboxField({
  label,
  hint,
  error,
  className,
  trailing,
  ...props
}: BaseProps & { trailing?: ReactNode } & React.ComponentProps<typeof Checkbox>) {
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <div className={cn('grid gap-1', className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          aria-labelledby={labelId}
          aria-describedby={describedBy(hintId, errorId, hint, error)}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        <Label id={labelId} htmlFor={id} className="font-normal">
          {label}
        </Label>
        {trailing}
      </div>
      <div className="pl-6">
        <Describe hintId={hintId} errorId={errorId} hint={hint} error={error} />
      </div>
    </div>
  )
}

export function RadioField({
  label,
  className,
  ...props
}: { label: ReactNode; className?: string } & React.ComponentProps<typeof RadioGroupItem>) {
  const id = useId()
  const labelId = `${id}-label`

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <RadioGroupItem id={id} aria-labelledby={labelId} {...props} />
      <Label id={labelId} htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  )
}

export function SwitchField({
  label,
  hint,
  className,
  ...props
}: { label: ReactNode; hint?: ReactNode; className?: string } & React.ComponentProps<
  typeof Switch
>) {
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Switch
        id={id}
        aria-labelledby={labelId}
        aria-describedby={hint ? hintId : undefined}
        {...props}
      />
      <div className="grid gap-0.5">
        <Label id={labelId} htmlFor={id} className="font-normal">
          {label}
        </Label>
        {hint && (
          <p id={hintId} className="text-xs text-text-tertiary">
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- Select 래퍼 */
/* SelectTrigger 도 <button> 이므로 같은 처리가 필요합니다. */

export function SelectField({
  label,
  hint,
  error,
  required,
  className,
  children,
}: BaseProps & { children: (props: { id: string; 'aria-labelledby': string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode }) {
  const id = useId()
  const labelId = `${id}-label`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <div className={cn('grid gap-2', className)}>
      <Label id={labelId} htmlFor={id}>
        {label}
        {required && (
          <span className="text-text-critical" aria-hidden>
            *
          </span>
        )}
      </Label>
      {/*
        aria-labelledby 에 라벨과 트리거를 함께 지정합니다.
        트리거만 지정하면 이름이 "선택하세요"(플레이스홀더)가 되고,
        라벨만 지정하면 화면에 보이는 글자와 읽히는 이름이 달라집니다(WCAG 2.5.3 위반).
      */}
      {children({
        id,
        'aria-labelledby': `${labelId} ${id}`,
        'aria-describedby': describedBy(hintId, errorId, hint, error),
        'aria-invalid': error ? true : undefined,
      })}
      <Describe hintId={hintId} errorId={errorId} hint={hint} error={error} />
    </div>
  )
}
