import type { ReactNode } from 'react'
import { Scrollable } from '@/components/ui/scrollable'

export interface StateRow {
  state: string
  /** 실제로 그 상태를 강제로 렌더링한 미리보기 */
  preview: ReactNode
  token: string
  when: string
}

/**
 * 상태 매트릭스
 *
 * 디자이너가 hover · focus · disabled · error 를 한 화면에서 비교할 수 있어야
 * 시안과 구현이 어긋나지 않습니다. 마우스를 올려야만 보이는 상태는
 * 문서에서 확인할 방법이 없으므로 **강제로 렌더링해** 나란히 놓습니다.
 */
export function StateMatrix({ rows, name }: { rows: StateRow[]; name: string }) {
  return (
    <Scrollable label={`${name} 상태 표`} className="rounded-md border border-border">
      <table className="w-full text-sm">
        <caption className="sr-only">{name} 컴포넌트의 상태별 표현</caption>
        <thead>
          <tr className="bg-muted">
            <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">상태</th>
            <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">표현</th>
            <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">토큰</th>
            <th scope="col" className="px-4 py-2.5 text-left font-bold text-text-secondary">언제</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.state} className="border-t border-border align-middle">
              <td className="whitespace-nowrap px-4 py-3 font-medium">{r.state}</td>
              <td className="px-4 py-3">{r.preview}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <code className="rounded-xs bg-fill-secondary px-1.5 py-0.5 font-mono text-xs">
                  {r.token}
                </code>
              </td>
              <td className="px-4 py-3 leading-relaxed text-text-secondary">{r.when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scrollable>
  )
}
