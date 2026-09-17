import { krdsFor } from '@/data/krds'
import { krdsPatternFor } from '@/data/krds-patterns'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/**
 * KRDS 지침 블록
 *
 * 컴포넌트 문서 하단에 대응하는 KRDS(대한민국 정부 디자인시스템) 지침을 붙입니다.
 * 공공 · 행정 SI 사업의 검수는 KRDS 분류를 기준으로 이루어지므로,
 * "우리 컴포넌트가 KRDS의 무엇에 해당하고 어떤 지침을 따르는지"를
 * 문서 안에서 바로 확인할 수 있어야 합니다.
 *
 * 데이터는 KRDS 원문에서 추출해 `src/data/krds.ts` 로 생성한 것입니다.
 */
export function KrdsGuide({ id }: { id: string }) {
  /* 컴포넌트와 기본 패턴 양쪽에서 찾습니다. 같은 앵커에 둘 다 걸릴 수 있습니다. */
  const items = [
    ...krdsFor(id).map((c) => ({ ...c, kind: '컴포넌트', label: `${c.cat} › ${c.ko}` })),
    ...krdsPatternFor(id).map((p) => ({ ...p, kind: '기본 패턴', label: `기본 패턴 › ${p.ko}` })),
  ]
  if (!items.length) return null

  return (
    <div className="mt-8 rounded-md border border-border bg-bg-secondary">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
        <Icon name="gov" size="sm" className="text-icon-tertiary" />
        <span className="text-sm font-bold">KRDS 지침</span>
        {items.map((c) => (
          <Badge key={c.label} variant="outline" className="rounded-xs font-normal">
            {c.label}
          </Badge>
        ))}
        {[...new Set(items.flatMap((c) => c.kwcag))].map((k) => (
          <Badge key={k} variant="accent" className="rounded-xs">
            KWCAG {k}
          </Badge>
        ))}
      </div>

      <Accordion type="multiple" className="px-5">
        {items.map((c) => {
          const groups: [string, string[]][] = [
            ['접근성', c.a11y],
            ['사용성', c.usage],
            ['상호작용', c.interaction],
            ['개발 주의사항', c.dev],
          ]
          return groups
            .filter(([, list]) => list.length > 0)
            .map(([label, list]) => (
              <AccordionItem key={`${c.label}-${label}`} value={`${c.label}-${label}`}>
                <AccordionTrigger className="text-sm">
                  {label}
                  <span className="ml-2 font-mono text-xs font-normal text-text-tertiary">
                    {list.length}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="ml-4 list-disc space-y-1.5 text-sm leading-relaxed text-text-secondary">
                    {list.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))
        })}
      </Accordion>

      <p className="border-t border-border px-5 py-3 text-xs text-text-tertiary">
        출처: 대한민국 정부 디자인시스템(KRDS) · 2026.09 기준 · 원문은 krds.go.kr 참고
      </p>
    </div>
  )
}
