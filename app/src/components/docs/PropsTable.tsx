import { Scrollable } from '@/components/ui/scrollable'
import { Badge } from '@/components/ui/badge'

export interface PropRow {
  name: string
  type: string
  /** 기본값. 없으면 '—' */
  def?: string
  required?: boolean
  desc: string
}

/**
 * 컴포넌트 Props 표
 *
 * 개발자가 소스를 열지 않고도 무엇을 넘길 수 있는지 알아야 합니다.
 * 타입 정의를 그대로 옮기지 말고, **쓰는 사람이 궁금한 것**을 적으세요 —
 * 어떤 값이 있고, 기본이 무엇이고, 언제 쓰는지.
 */
export function PropsTable({ rows, name }: { rows: PropRow[]; name: string }) {
  return (
    <Scrollable label={`${name} Props 표`} className="rounded-md border border-border">
      <table className="w-full text-sm">
        <caption className="sr-only">{name} 컴포넌트가 받는 속성</caption>
        <thead>
          <tr className="bg-muted">
            <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">Prop</th>
            <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">타입</th>
            <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">기본값</th>
            <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">설명</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-border align-top">
              <td className="whitespace-nowrap px-4 py-2.5">
                <code className="rounded-xs bg-fill-secondary px-1.5 py-0.5 font-mono text-xs">
                  {r.name}
                </code>
                {r.required && (
                  <Badge className="ml-1.5 rounded-xs bg-fill-critical-subtle text-[0.625rem] text-text-critical">
                    필수
                  </Badge>
                )}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">{r.type}</td>
              <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-text-tertiary">
                {r.def ?? '—'}
              </td>
              <td className="px-4 py-2.5 leading-relaxed text-text-secondary">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scrollable>
  )
}
