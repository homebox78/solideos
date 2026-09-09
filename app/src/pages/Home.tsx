import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/icon'
import { SECTIONS, SYSTEM } from '@/data/ia'
import { Card } from '@/components/ui/card'
import { Callout, Code, DocHeader, P, Section, Spec } from '@/components/docs'
import { TileVisual } from '@/components/docs/TileVisual'

const PRINCIPLES = [
  {
    no: '01',
    title: 'Solid — 믿을 수 있게',
    body: '공공 · 행정 서비스는 실수가 곧 비용입니다. 사용자가 지금 무엇을 하고 있고 어떤 결과가 생기는지 항상 알 수 있어야 합니다. 되돌릴 수 없는 동작에는 반드시 확인 단계를 둡니다.',
  },
  {
    no: '02',
    title: 'Clear — 한 번에 이해되게',
    body: '전문 용어보다 사용자의 말을 씁니다. 한 화면에는 하나의 핵심 과업만 둡니다. 설명이 길어진다면 화면 구조를 먼저 의심합니다.',
  },
  {
    no: '03',
    title: 'Flow — 끊기지 않게',
    body: '업무는 여러 화면에 걸쳐 이어집니다. 맥락과 입력값을 유지하고, 이전 단계로 손실 없이 돌아갈 수 있게 합니다. 페이지 이동보다 현재 맥락 안에서의 해결을 우선합니다.',
  },
  {
    no: '04',
    title: 'Open — 누구에게나',
    body: 'KWCAG 2.2 / WCAG 2.2 AA를 최소 기준으로 둡니다. 키보드만으로 모든 기능을 수행할 수 있어야 하며, 색만으로 정보를 전달하지 않습니다.',
  },
]

function Hero() {
  return (
    <section className="relative flex h-[520px] items-center justify-center overflow-hidden bg-background text-center">
      <svg
        viewBox="0 0 1600 520"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        className="absolute inset-0 size-full"
      >
        <defs>
          <linearGradient id="rb1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#16181B" stopOpacity="0" />
            <stop offset="30%" stopColor="#16181B" stopOpacity=".12" />
            <stop offset="70%" stopColor="#16181B" stopOpacity=".06" />
            <stop offset="100%" stopColor="#16181B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rb2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C12554" stopOpacity="0" />
            <stop offset="40%" stopColor="#C12554" stopOpacity=".15" />
            <stop offset="100%" stopColor="#1B303A" stopOpacity=".05" />
          </linearGradient>
          <linearGradient id="rb3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#16181B" stopOpacity=".05" />
            <stop offset="55%" stopColor="#16181B" stopOpacity=".15" />
            <stop offset="100%" stopColor="#16181B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill="url(#rb1)"
          d="M-60 190 C 340 30, 700 400, 1090 248 S 1480 52, 1660 140 L1660 192 C 1480 106, 1120 300, 1090 314 S 340 100, -60 248 Z"
        />
        <path
          fill="url(#rb3)"
          d="M-60 306 C 360 140, 740 520, 1120 356 S 1490 156, 1660 240 L1660 308 C 1490 224, 1150 420, 1120 430 S 360 210, -60 382 Z"
        />
        <path
          fill="url(#rb2)"
          d="M-60 420 C 380 248, 760 596, 1140 436 S 1500 244, 1660 324 L1660 360 C 1500 280, 1170 484, 1140 492 S 380 300, -60 452 Z"
        />
        <g fill="none" stroke="#16181B" strokeOpacity=".09">
          <path strokeWidth="1" d="M-60 168 C 340 12, 700 382, 1090 228 S 1480 32, 1660 118" />
          <path strokeWidth="1" d="M-60 228 C 340 68, 700 436, 1090 282 S 1480 88, 1660 172" />
          <path strokeWidth="1" d="M-60 366 C 360 200, 740 578, 1120 414 S 1490 214, 1660 296" />
          <path strokeWidth="1" d="M-60 472 C 380 300, 760 646, 1140 488 S 1500 296, 1660 376" />
        </g>
      </svg>

      <div className="relative z-10 px-4">
        <p className="text-xl font-medium text-text-secondary">{SYSTEM.tagline}</p>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight md:text-[3.5rem]">
          Solid <span className="text-text-accent">Flow</span> 1.0
        </h1>
      </div>
    </section>
  )
}

export default function Home() {
  const tiles = SECTIONS.filter((s) => !s.hideFromTiles)

  return (
    <>
      <Hero />

      <main id="main" className="mx-auto max-w-[904px] px-4 pb-24 md:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {tiles.map((s) => {
            const count = s.groups.reduce((n, g) => n + g.pages.length, 0)
            return (
              <Link key={s.id} to={s.path} className="group">
                <Card className="h-full gap-0 overflow-hidden rounded-none border-border p-0 shadow-none transition-colors group-hover:border-border-strong">
                  <TileVisual kind={s.id} />
                  <div className="p-6">
                    <p className="flex items-center gap-1.5 text-base font-bold">
                      {s.title}
                      <Icon name="arrowForward"                         className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden
                      />
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.desc}</p>
                    <p className="mt-3 font-mono text-xs text-text-tertiary">{count} pages</p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-24">
          <DocHeader eyebrow="Solid Flow" title="디자인 시스템 소개">
            솔리데오가 수행하는 모든 SI 프로젝트가 하나의 UI/UX 기준을 공유하도록 만든 시스템입니다.
            <br />
            공공 사업에서는 KRDS(대한민국 정부 디자인시스템) 분류와 접근성 기준을 따릅니다.
          </DocHeader>

          <Section id="principles" title="디자인 원칙" krds="디자인 원칙">
            <P>모든 판단이 갈릴 때 돌아오는 기준입니다. 위에서부터 우선순위가 높습니다.</P>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <Card key={p.no} className="gap-0 rounded-md p-5 shadow-none">
                  <p className="font-mono text-xs text-text-accent">{p.no}</p>
                  <p className="my-2 font-bold">{p.title}</p>
                  <p className="text-sm leading-relaxed text-text-secondary">{p.body}</p>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="inclusion" title="디지털 포용" krds="디지털 포용">
            <P>
              모든 국민이 같은 서비스를 경험할 수 있어야 합니다. 디자인 시스템은 이를 개별 담당자의
              선의가 아니라 <b>기본값</b>으로 보장합니다.
            </P>
            <Spec
              head={['대상', '시스템이 보장하는 것']}
              rows={[
                ['저시력 · 고령', <>글자 크기 3단계 조절과 선명한 화면 모드를 상단에서 항상 제공합니다.</>],
                ['시각장애', <>모든 컴포넌트에 레이블 · ARIA 속성을 포함한 마크업 계약을 정의했습니다.</>],
                ['지체장애', <>키보드만으로 전 과업을 수행할 수 있고, 터치 영역은 44 × 44px 이상입니다.</>],
                ['저사양 · 저속 회선', <>장식 애니메이션을 쓰지 않고, 토큰은 CSS 변수라 런타임 비용이 없습니다.</>],
                ['디지털 취약', <>전문 용어 대신 사용자의 말을 쓰고, 오류에는 해결 방법을 함께 제시합니다.</>],
              ]}
            />
            <Callout>
              <b>선명한 화면 모드</b>는 상단 <Code>글자·화면 설정</Code>에서 켤 수 있습니다.
              토큰 <Code>[data-contrast=&quot;high&quot;]</Code> 하나로 전체 서비스에 적용됩니다.
            </Callout>
          </Section>

          <Section id="naming" title="네이밍 원칙" krds="네이밍 원칙">
            <P>
              토큰 · 컴포넌트 · 클래스 이름은 <b>역할</b>을 말해야 합니다. 생김새를 이름에 넣으면
              값이 바뀌는 순간 이름이 거짓말이 됩니다.
            </P>
            <Spec
              head={['대상', '규칙', '권장', '지양']}
              rows={[
                ['디자인 토큰', '역할 기반 · 케밥케이스', <Code>--fill-accent</Code>, <Code>--pink-button</Code>],
                ['컴포넌트', '영문 파스칼케이스', <Code>TextField</Code>, <Code>Input2</Code>],
                ['CSS 클래스', <><Code>sds-</Code> 접두 · BEM 변형</>, <Code>sds-btn--primary</Code>, <Code>btnRed</Code>],
                ['문서 앵커', '영문 소문자 케밥', <Code>#text-field</Code>, <Code>#텍스트필드</Code>],
                ['상태', 'is- / has- 접두', <Code>is-active</Code>, <Code>active2</Code>],
              ]}
            />
          </Section>

          <Section id="about" title="About">
            <Spec
              head={['항목', '내용']}
              rows={[
                [
                  '브랜드 컬러',
                  <>
                    Crimson <Code>#C12554</Code> (솔리데오 CI) · Deep Ink <Code>#1B303A</Code> · Data Blue{' '}
                    <Code>#3C6AFF</Code>
                  </>,
                ],
                ['기본 서체', 'Pretendard (대체: Noto Sans KR)'],
                ['접근성 기준', 'KWCAG 2.2 / WCAG 2.2 AA · KRDS 디지털 포용 지침'],
                ['기술 기반', 'Tailwind CSS v4 + shadcn/ui (Radix UI) · 토큰은 스택 독립'],
                [
                  '지원 스택',
                  'React · Vue · Quasar · 순수 HTML/JSP · Thymeleaf · Spring Boot · Java · Sass · Less · Tailwind',
                ],
                [
                  '적용 방법',
                  <>
                    토큰 파일 1개 연결 —{' '}
                    <Link to="/resources#install" className="underline underline-offset-2">
                      Resources › 설치
                    </Link>
                  </>,
                ],
              ]}
            />
            <Callout>
              <b>기여</b> — 새 컴포넌트나 예외가 필요하면 사용 사례 2건 이상과 함께 제안해 주세요.
              기존 컴포넌트 조합으로 해결되는지 먼저 확인합니다.{' '}
              <Link to="/resources#governance" className="underline underline-offset-2">
                Resources › 기여와 운영
              </Link>
            </Callout>
          </Section>
        </div>
      </main>
    </>
  )
}
