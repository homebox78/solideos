import { DocLayout } from '@/components/layout/DocLayout'
import { Icon } from '@/components/ui/icon'
import { Callout, DocHeader, DoDont, ExampleBlock, List, P, Section, Spec } from '@/components/docs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

const PRINCIPLES = [
  ['근거를 함께 준다', '모든 답변에 출처 문서 · 데이터 기준 시점을 붙입니다. 근거를 댈 수 없으면 답하지 않습니다.'],
  ['확신을 가장하지 않는다', '불확실하면 불확실하다고 씁니다. 추정치는 추정치라고 표시합니다.'],
  ['사람이 결정한다', 'AI는 초안까지입니다. 제출 · 승인 · 반려는 반드시 사람의 명시적 행동을 거칩니다.'],
  ['언제든 빠져나갈 수 있다', 'AI 없이도 같은 업무를 끝낼 수 있는 경로를 항상 남겨 둡니다.'],
]

export default function AiInteraction() {
  return (
    <DocLayout>
      <DocHeader eyebrow="AI Interaction" title="AI Interaction">
        AI 도구와 사용자의 상호작용을 위한 원칙과 가이드라인입니다.
        <br />
        행정 · 공공 데이터를 다루는 제품에서 AI는 검증 가능해야 하며, 최종 판단은 언제나 사람이 합니다.
      </DocHeader>

      <Section id="principles" title="Principles">
        <P>
          솔리데오는 행정 · 부동산 · 시설 데이터를 다룹니다. 이 영역에서 AI의 그럴듯한 오답은 사용자의
          시간이 아니라 <b>행정 판단</b>을 망칩니다. 그래서 AI 기능의 첫 번째 원칙은 성능이 아니라
          검증 가능성입니다.
        </P>
        <div className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map(([t, b], i) => (
            <Card key={t} className="gap-0 rounded-md p-5 shadow-none">
              <p className="font-mono text-xs text-text-accent">{String(i + 1).padStart(2, '0')}</p>
              <p className="my-2 font-bold">{t}</p>
              <p className="text-sm leading-relaxed text-text-secondary">{b}</p>
            </Card>
          ))}
        </div>
        <Callout>
          AI가 생성한 내용에는 예외 없이 표식을 답니다. 사용자가 사람이 쓴 것과 구분할 수 없는 상태로
          두지 않습니다.
        </Callout>
      </Section>

      <Section id="prompt-input" title="Prompt Input">
        <ExampleBlock>
          <div className="max-w-xl">
            <div className="rounded-lg border border-border-strong bg-background p-4">
              <Textarea
                rows={2}
                placeholder="이 신청서에서 보완이 필요한 항목을 찾아 주세요"
                aria-label="AI 질문 입력"
                className="resize-none border-0 p-0 shadow-none focus-visible:ring-0"
              />
              <div className="mt-3 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Icon name="attachment" className="size-3.5" aria-hidden /> 파일
                </Button>
                <span className="ml-auto text-xs text-text-tertiary">0 / 2,000자</span>
                <Button size="sm" className="gap-1.5">
                  보내기 <Icon name="arrowUpward" className="size-3.5" aria-hidden />
                </Button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['누락 항목 확인', '유사 사업 비교', '요약'].map((t) => (
                <Button key={t} variant="outline" size="sm" className="rounded-full">
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </ExampleBlock>
        <List
          items={[
            <>빈 입력창을 그냥 두지 않고 <b>추천 프롬프트 3개</b>를 제공합니다. 사용자는 무엇을 물어야 할지 모릅니다.</>,
            'Enter는 전송, Shift+Enter는 줄바꿈입니다. 이 규칙을 입력창 근처에 명시합니다.',
            '전송 후에도 입력 내용은 남겨 두어 수정 후 재전송할 수 있게 합니다.',
          ]}
        />
      </Section>

      <Section id="prompt-output" title="Prompt Output">
        <ExampleBlock>
          <Card className="max-w-xl gap-0 rounded-lg p-5 shadow-none">
            <Badge className="mb-3 w-fit bg-fill-accent-subtle text-text-accent">AI 생성</Badge>
            <p className="text-sm leading-relaxed">
              신청서에서 보완이 필요한 항목은 2건입니다. 첨부된 사업계획서에 예산 산출 근거가 없고,
              담당자 연락처가 비어 있습니다.
            </p>
            <p className="mt-3 text-xs text-text-tertiary">
              근거: 신청서 2026-0142 (2026.09.01 제출) · 사업계획서.pdf 4쪽
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">근거 문서 열기</Button>
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Icon name="refresh" className="size-3.5" aria-hidden /> 다시 생성
              </Button>
              <Button variant="ghost" size="icon" aria-label="도움이 되었어요"><Icon name="thumbUp" /></Button>
              <Button variant="ghost" size="icon" aria-label="도움이 되지 않았어요"><Icon name="thumbDown" /></Button>
            </div>
          </Card>
        </ExampleBlock>
        <Spec
          head={['요소', '필수 여부', '설명']}
          rows={[
            ['AI 생성 표식', '필수', '사람이 쓴 내용과 구분'],
            ['근거 · 기준 시점', '필수', '출처 문서와 데이터 기준일'],
            ['원문 열기', '필수', '사용자가 직접 검증할 경로'],
            ['다시 생성', '권장', '—'],
            ['피드백', '권장', '품질 개선용. 익명 수집'],
          ]}
        />
        <DoDont
          do="답을 모를 때는 “확인할 수 없습니다”라고 쓰고 사람 담당자 경로를 안내합니다."
          dont="근거 없이 숫자를 제시하지 않습니다. 행정 문서에서 출처 없는 숫자는 쓸 수 없습니다."
        />
      </Section>

      <Section id="process" title="Process Indicator">
        <ExampleBlock>
          <div className="max-w-sm space-y-2">
            <p className="text-sm text-text-secondary">신청서 4건을 분석하고 있습니다 · 2/4</p>
            <Progress value={50} aria-label="분석 진행률" />
            <Button variant="secondary" size="sm" className="mt-2">중단</Button>
          </div>
        </ExampleBlock>
        <List
          items={[
            <>무엇을 처리 중인지 <b>구체적으로</b> 씁니다 — “처리 중” 대신 “신청서 4건을 분석하고 있습니다”.</>,
            '3초를 넘길 가능성이 있으면 중단 수단을 제공합니다.',
            '스트리밍 출력 중에도 중단할 수 있어야 합니다.',
          ]}
        />
      </Section>

      <Section id="context-panel" title="Context Panel" status="todo">
        <P>
          AI가 현재 참조 중인 문서 · 데이터 범위를 사용자에게 보여 주고 조정하게 하는 패널입니다.
          아직 정의되지 않았습니다.
        </P>
      </Section>

      <Section id="qa" title="대화형 질의응답">
        <Spec
          head={['단계', '규칙']}
          rows={[
            ['시작', 'AI가 무엇을 할 수 있고 무엇을 못 하는지 먼저 밝힙니다'],
            ['진행', '이전 질문 맥락을 유지하되, 맥락 초기화 수단을 제공합니다'],
            ['답변', '결론 → 근거 → 다음 행동 순서로 씁니다'],
            ['실패', '모르면 모른다고 하고 사람 담당자 경로를 제시합니다'],
            ['종료', '대화 내용을 내려받거나 업무 기록에 첨부할 수 있게 합니다'],
          ]}
        />
      </Section>

      <Section id="file" title="파일 분석">
        <P>
          사업계획서 · 도면 · 증빙 문서를 올려 분석하는 흐름입니다. 솔리데오 제품에서 가장 활용도가 높은
          AI 패턴입니다.
        </P>
        <List
          items={[
            <>업로드 전에 지원 형식 · 용량 · <b>보관 기간과 학습 사용 여부</b>를 명시합니다.</>,
            '분석 결과는 원문의 해당 위치(쪽 · 좌표)로 이동할 수 있게 연결합니다.',
            '개인정보가 포함될 수 있는 문서는 업로드 시 경고하고, 마스킹 옵션을 제공합니다.',
            '분석 실패 시 어느 부분에서 실패했는지 알려 줍니다 — “12쪽 표를 인식하지 못했습니다”.',
          ]}
        />
      </Section>

      <Section id="ai-search" title="검색" status="wip">
        <P>
          자연어 검색 결과에는 AI 요약과 원본 목록을 함께 보여 줍니다. 요약은 접을 수 있게 하고, 기본
          정렬은 항상 원본 관련도 순입니다 — 사용자가 AI 요약을 거치지 않고도 원본에 닿을 수 있어야 합니다.
        </P>
      </Section>

      <Section id="voice" title="음성 입력" status="todo">
        <P>
          현장 조사 · 시설 점검 상황을 위한 음성 입력 패턴입니다. 아직 정의되지 않았습니다.
        </P>
        <ExampleBlock>
          <Button variant="outline" size="icon" aria-label="음성으로 입력">
            <Icon name="mic" />
          </Button>
        </ExampleBlock>
      </Section>
    </DocLayout>
  )
}
