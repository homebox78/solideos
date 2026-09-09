import { DocLayout } from '@/components/layout/DocLayout'
import { Code, DocHeader, DoDont, ExampleBlock, List, P, Section, Spec } from '@/components/docs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function VisualCommunication() {
  return (
    <DocLayout>
      <DocHeader eyebrow="Visual Communication" title="Visual Communication">
        솔리데오의 모든 경험을 하나로 잇는 시각 언어 가이드라인입니다.
        <br />
        컴포넌트 바깥에서 설득하고 설명하는 화면의 톤을 정의합니다.
      </DocHeader>

      <Section id="overview" title="Overview">
        <P>
          Foundations가 “어떤 값을 쓰는가”라면, 여기는 “그 값으로 어떤 인상을 만드는가”입니다.
          홍보 페이지 · 사업 소개 · 데이터 리포트 · 공지 배너가 대상입니다.
        </P>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['절제', '강조색은 한 화면에 한 번. 시선을 여러 곳으로 나누지 않습니다.'],
            ['구조', '정보는 항상 위계가 있습니다. 크기 · 여백 · 순서로 위계를 만듭니다.'],
            ['근거', '숫자에는 출처와 기준 시점을 답니다. 데이터 기업의 기본입니다.'],
          ].map(([t, b], i) => (
            <Card key={t} className="gap-0 rounded-md p-5 shadow-none">
              <p className="font-mono text-xs text-text-accent">{String(i + 1).padStart(2, '0')}</p>
              <p className="my-2 font-bold">{t}</p>
              <p className="text-sm leading-relaxed text-text-secondary">{b}</p>
            </Card>
          ))}
        </div>
        <Spec
          head={['요소', '기준']}
          rows={[
            ['배경', <>흰색 또는 <Code>--bg-secondary</Code>. Ink는 히어로 · 푸터 등 구획 전환에만</>],
            ['그라데이션', 'Ink → Crimson 방향 1종만. 본문 영역에는 쓰지 않음'],
            ['사진', '인물보다 공간 · 데이터 · 구조물. 과채도 보정 금지'],
            ['여백', '섹션 간 최소 96px. 밀도를 낮추는 것이 신뢰감을 만듭니다'],
          ]}
        />
      </Section>

      <Section id="message" title="Message">
        <P>모든 시각 커뮤니케이션은 한 문장으로 요약될 수 있어야 합니다. 그 문장이 헤드라인이 됩니다.</P>
        <Spec
          head={['층위', '길이', '역할', '예시']}
          rows={[
            ['헤드라인', '20자 이내', '한 문장 요약', '데이터로 그리는 혁신적인 미래'],
            ['서브', '40자 이내', '구체적 근거', '대한민국 디지털정부와 함께한 25년'],
            ['본문', '2~3문장', '맥락 설명', '—'],
            ['행동', '동사 1개', '다음 단계', '사업 문의'],
          ]}
        />
        <DoDont
          do={<>헤드라인은 회사가 아니라 <b>고객이 얻는 것</b>을 말합니다.</>}
          dont="“최고의”, “혁신적인”처럼 검증 불가능한 형용사를 헤드라인에 쓰지 않습니다."
        />
      </Section>

      <Section id="infographic" title="Infographic" status="wip">
        <List
          items={[
            '핵심 숫자는 Display(56px) 이상으로 키우고 단위는 작게 붙입니다.',
            <>모든 숫자에 <b>기준 시점</b>을 명시합니다 — “2026.09 기준”.</>,
            '비교 그래프는 0에서 시작합니다. 축을 잘라 차이를 과장하지 않습니다.',
            '색으로만 계열을 구분하지 않고 직접 레이블을 답니다.',
            <>차트 색은 <Code>--chart-1</Code> ~ <Code>--chart-5</Code> 토큰을 순서대로 씁니다.</>,
          ]}
        />
      </Section>

      <Section id="detail-page" title="Detail Page" status="wip">
        <P>사업 · 솔루션 소개 페이지의 표준 구성입니다.</P>
        <Spec
          head={['순서', '블록', '담을 내용']}
          rows={[
            ['1', 'Hero', '솔루션명 + 한 줄 정의 + 대표 이미지'],
            ['2', '문제 정의', '어떤 업무가 왜 어려운가'],
            ['3', '핵심 기능', '3~5개. 기능명 + 사용자 이득'],
            ['4', '도입 효과', '숫자 + 기준 시점'],
            ['5', '적용 사례', '기관명은 승인 범위 내에서만'],
            ['6', '문의', '단일 CTA'],
          ]}
        />
      </Section>

      <Section id="hero-banner" title="Hero Banner">
        <P>페이지의 첫인상입니다. 텍스트는 최소한으로 두고 여백이 일하게 합니다.</P>
        <ExampleBlock>
          <div
            className="rounded-md px-10 py-14 text-white"
            style={{
              background: 'linear-gradient(120deg, var(--ink-700) 0%, #2C1420 60%, var(--crimson-700) 100%)',
            }}
          >
            <p className="text-xs font-bold tracking-[0.12em] text-crimson-300">PLATFORM GOVERNMENT</p>
            <p className="my-3 text-4xl font-extrabold leading-tight tracking-tight">
              데이터로 그리는
              <br />
              혁신적인 미래
            </p>
            <p className="mb-6 max-w-md text-sm text-white/75">
              대한민국 디지털정부와 함께한 25년의 경험을 플랫폼으로 옮깁니다.
            </p>
            <Button>사업 문의</Button>
          </div>
        </ExampleBlock>
        <Spec
          head={['항목', '기준']}
          rows={[
            ['높이', '데스크톱 480~640px, 모바일 360px 이상'],
            ['텍스트', '아이브로 + 헤드라인 + 서브 + CTA 1개. 그 이상 넣지 않음'],
            ['배경 이미지', <>텍스트 영역에 <Code>opacity.black.40</Code> 이상 오버레이로 4.5:1 확보</>],
            ['자동 슬라이드', '사용하지 않음. 필요 시 수동 이동 + 일시정지 제공'],
          ]}
        />
      </Section>

      <Section id="contents-banner" title="Contents Banner" status="wip">
        <P>
          본문 흐름 중간에 삽입되는 배너입니다. 히어로보다 낮은 밀도를 유지하고 본문을 가리지 않습니다.
          페이지당 최대 1개이며, 닫기 수단을 제공합니다.
        </P>
      </Section>
    </DocLayout>
  )
}
