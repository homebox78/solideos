import {
  Callout,
  Code,
  DocHeader,
  DoDont,
  Example,
  List,
  P,
  Ramp,
  Section,
  Spec,
  Sub,
  Swatch,
} from '@/components/docs'
import { DocLayout } from '@/components/layout/DocLayout'
import { Icon } from '@/components/ui/icon'
import { IconGallery } from '@/components/docs/IconGallery'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const GRAY = ['25','50','75','100','150','200','250','300','350','400','450','500','550','600','650','700','750','800','850','900']
const NINE = ['100','150','200','300','400','500','600','700','800']

export default function Foundations() {
  return (
    <DocLayout>
      <DocHeader eyebrow="Foundations" title="Foundations">
        디자인 구성 요소의 시각적 일관성을 유지하기 위한 규칙입니다.
        <br />
        모든 값은 토큰으로 관리하며, 제품 코드는 Semantic 토큰만 참조합니다.
      </DocHeader>

      <Section id="overview" title="Overview" krds="디자인 스타일 소개">
        <P>
          Foundations는 솔리데오의 모든 제품이 공유하는 최소 단위입니다. 플랫폼정부 · 데이터
          플랫폼(JADOit, PINO) · 스마트 솔루션(NSPACE, Acropolis SG, ArchiBIM, ArchiVIEW NX)이 서로 다른
          팀에서 만들어져도 같은 색 · 같은 간격 · 같은 리듬을 갖게 하는 것이 목적입니다.
        </P>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Semantic만 참조', <>제품 코드에는 <Code>#C12554</Code>도 <Code>--crimson-500</Code>도 아닌 <Code>--fill-accent</Code>를 씁니다.</>],
            ['4px 그리드', <>모든 간격 · 높이 · 아이콘 크기는 4의 배수입니다.</>],
            ['접근성 우선', <>KWCAG 2.2 AA를 통과하지 못하는 값은 토큰으로 채택하지 않습니다.</>],
          ].map(([t, b], i) => (
            <Card key={i} className="gap-0 rounded-md p-5 shadow-none">
              <p className="font-mono text-xs text-text-accent">규칙</p>
              <p className="my-2 font-bold">{t}</p>
              <p className="text-sm leading-relaxed text-text-secondary">{b}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="design-token" title="Design Token" krds="디자인 토큰">
        <P>
          Primitive(색 그 자체) → Semantic(역할) 2계층입니다. 제품은 Semantic만 참조하므로, 브랜드
          리뉴얼이나 다크 모드 도입 시 Primitive 매핑만 교체하면 전 제품이 따라옵니다.
        </P>
        <Spec
          head={['계층', '예시', '누가 쓰나']}
          rows={[
            ['Primitive', <Code>--crimson-500: #C12554</Code>, '디자인 시스템 내부'],
            ['Semantic', <Code>--fill-accent: var(--crimson-500)</Code>, '제품 화면 코드'],
            ['Component', <Code>Button variant=&quot;default&quot;</Code>, '제품 화면 마크업'],
          ]}
        />
        <Example
          code={`/* 안됨 — 원시값 또는 Primitive 직접 참조 */
.submit { background: #C12554; }
.submit { background: var(--crimson-500); }

/* 됨 — Semantic 참조 */
.submit { background: var(--fill-accent); }`}
        >
          <p className="text-sm text-text-secondary">
            단일 원본은 <Code>tokens/tokens.json</Code> 하나입니다.
          </p>
        </Example>
      </Section>

      <Section id="color" title="Color" krds="색상">
        <P>
          브랜드 아이덴티티를 유지하기 위한 컬러 사용 기준입니다. 핵심 정보를 강조하고 현재 상태를
          명확하게 전달합니다.
        </P>

        <Tabs defaultValue="usage" className="pt-2">
          <TabsList>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-6 pt-6">
            <Sub title="1. Gray Scale">
              <P>
                정보 전달과 시각적 위계의 기반이 되며, 명도 대비로 WCAG AA 접근성을 준수합니다.
                20단계로 나누어 배경 · 보더 · 아이콘 · 텍스트가 각자의 대비 구간을 갖도록 했습니다.
              </P>
              <Ramp name="gray" steps={GRAY} />
            </Sub>

            <Sub title="2. Color 적용 권장 가이드">
              <p className="font-bold">400단계 이하는 UI 구조 요소에 사용</p>
              <P>400 이하는 문자 정보 전달이 아닌 보더라인, 배경 등 UI 구조 요소에 활용합니다.</P>
              <p className="font-bold">Text는 최소 500단계 이상 사용</p>
              <P>텍스트와 배경 간 명도 대비가 최소 4.5:1을 충족하도록 구성합니다.</P>
              <Spec
                head={['BG Color', 'Text Color (기본 권장)', '접근성']}
                rows={[
                  [<>White <Code>#FFFFFF</Code></>, '최소 Gray 500 +', '본문 기준 4.5:1 이상'],
                  [<>Gray <Code>#F2F4F6</Code></>, '최소 Gray 550 +', '텍스트:배경 대비 강화 (+50)'],
                  [<>Ink <Code>#1B303A</Code></>, 'White 또는 Gray 100', '반전 텍스트 4.5:1 이상'],
                ]}
              />
            </Sub>

            <Sub title="3. 배경색 변경 시 명도 대비 조정 규칙">
              <P>어두운 배경 적용 시, 요소별 명도 대비 확보를 위해 한 단계 높은 토큰을 적용합니다.</P>
              <Spec
                head={['Semantic Token', 'White BG', 'Gray BG']}
                rows={[
                  [<Code>text-tertiary</Code>, 'Gray 500', 'Gray 550 (+50)'],
                  [<Code>border-primary</Code>, 'Gray 150', 'Gray 200 (+50)'],
                  [<Code>fill-secondary</Code>, 'Gray 100', 'Gray 150 (+50)'],
                  [<Code>icon-tertiary</Code>, 'Gray 400', 'Gray 450 (+50)'],
                ]}
              />
            </Sub>

            <Sub title="4. Accent Color">
              <P>
                Accent Primary는 브랜드나 서비스를 강조할 때, Accent Secondary는 보조 컬러로
                사용합니다. Accent Primary는 솔리데오 CI 크림슨입니다.
              </P>
              <p className="text-sm font-bold">Accent Primary — Crimson</p>
              <Ramp name="crimson" steps={NINE} />
              <p className="text-sm font-bold">Accent Secondary — Ink</p>
              <Ramp name="ink" steps={NINE} />
              <Callout>
                Accent Primary는 화면당 <b>한 곳</b>에만 씁니다. 두 개 이상의 크림슨이 한 화면에 있으면
                사용자는 무엇이 주된 행동인지 판단하지 못합니다.
              </Callout>
            </Sub>

            <Sub title="5. Color Ratio">
              <P>
                Gray Scale과 Accent를 <b>8:2 비율</b>로 사용할 것을 권장합니다. 공공 · 행정 서비스의
                신뢰감은 절제에서 나옵니다.
              </P>
              <div className="flex h-14 overflow-hidden rounded-md text-sm font-bold">
                <span className="flex flex-[8] items-center justify-center bg-fill-secondary text-text-secondary">
                  Gray Scale 80%
                </span>
                <span className="flex flex-[2] items-center justify-center bg-fill-accent text-white">
                  Accent 20%
                </span>
              </div>
            </Sub>

            <Sub title="6. Feedback Color">
              <P>
                성공, 안내, 긴급 등 시스템 상태를 직관적으로 전달합니다. 색만으로 전달하지 않고 항상
                텍스트 · 아이콘을 함께 둡니다.
              </P>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Swatch token="--green-500" label="Positive" hex="#12805C" />
                <Swatch token="--blue-500" label="Informative" hex="#3C6AFF" />
                <Swatch token="--amber-500" label="Caution" hex="#B95E04" />
                <Swatch token="--red-500" label="Critical" hex="#D93025" />
              </div>
              <Callout>
                Critical Red(#D93025)는 Accent Crimson(#C12554)과 계열이 겹칩니다. <b>주요 행동(크림슨)과
                파괴적 행동(레드)을 같은 화면에 나란히 두지 않도록</b> 설계하고, 불가피하면 레드 버튼에
                아이콘과 확인 단계를 추가합니다.
              </Callout>
            </Sub>

            <Sub title="7. Transparent">
              <P>
                투명도와 음영으로 정보의 집중도를 조절합니다. 배경 음영은 <b>65%</b>를 표준으로 씁니다.
              </P>
              <Spec
                head={['토큰', '용도']}
                rows={[
                  [<Code>--opacity-black-65</Code>, '모달 · 바텀시트 뒤 배경 음영'],
                  [<Code>--opacity-black-40</Code>, '이미지 위 텍스트 가독성 확보'],
                  [<Code>--opacity-black-10</Code>, '구분선 대체 · 그림자'],
                ]}
              />
            </Sub>

            <Sub title="8. Brand Color">
              <P>제품 성격에 따라 Accent Primary를 대체할 수 있습니다.</P>
              <Spec
                head={['적용 대상', 'Accent Primary', '비고']}
                rows={[
                  ['전사 · 플랫폼정부', 'Crimson #C12554', '기본값'],
                  ['데이터 플랫폼 (JADOit · PINO)', 'Blue #3C6AFF', '데이터 시각화 비중이 높은 화면'],
                  ['스마트 솔루션 (NSPACE 등)', 'Ink #1B303A', '도면 · 3D 뷰어 위 UI'],
                ]}
              />
            </Sub>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6 pt-6">
            <Sub title="Primitive Token">
              <P>색 그 자체를 정의합니다. 의미가 없으므로 제품 코드에서 직접 참조하지 않습니다.</P>
              <Spec
                head={['토큰', '단계', '역할']}
                rows={[
                  [<Code>--static-black / white</Code>, '2', '반전 배경 · 기본 배경'],
                  [<Code>--gray-25 ~ 900</Code>, '20', '위계의 기반'],
                  [<Code>--crimson-100 ~ 800</Code>, '9', 'Accent Primary'],
                  [<Code>--ink-100 ~ 800</Code>, '9', 'Accent Secondary'],
                  [<Code>--green / blue / amber / red</Code>, '각 9', 'Feedback'],
                  [<Code>--opacity-black / white-*</Code>, '11', '음영 · 오버레이'],
                ]}
              />
            </Sub>
            <Sub title="Semantic Token">
              <P>역할을 정의합니다. 제품 코드는 이 계층만 참조합니다.</P>
              <Spec
                head={['토큰', '참조', '용도']}
                rows={[
                  [<Code>--text-primary</Code>, 'gray.900', '본문 · 제목'],
                  [<Code>--text-secondary</Code>, 'gray.600', '보조 설명'],
                  [<Code>--text-tertiary</Code>, 'gray.500', '도움말 (텍스트 최소 단계)'],
                  [<Code>--fill-accent</Code>, 'crimson.500', 'Primary 버튼'],
                  [<Code>--fill-accent-hover</Code>, 'crimson.600', 'Primary 호버'],
                  [<Code>--border-primary</Code>, 'gray.150', '기본 구분선'],
                  [<Code>--border-strong</Code>, 'gray.400', '입력 필드 테두리 (3:1 확보)'],
                  [<Code>--border-focus</Code>, 'blue.500', '포커스 링'],
                ]}
              />
              <Callout>
                shadcn/ui 표준 변수(<Code>--primary</Code>, <Code>--border</Code>, <Code>--ring</Code> …)는
                이 Semantic 토큰에 연결되어 있습니다. 컴포넌트 코드를 고치지 않고 브랜드만 바뀝니다.
              </Callout>
            </Sub>
          </TabsContent>
        </Tabs>
      </Section>

      <Section id="typography" title="Typography" krds="타이포그래피">
        <P>
          Pretendard를 기본 서체로 씁니다. 국문 가독성과 숫자 정렬(tabular)을 함께 만족하는 선택입니다.
          한 화면에서 동시에 쓰는 크기는 4단계 이내로 제한합니다.
        </P>
        <Spec
          head={['스타일', '크기 / 행간', '굵기', '용도']}
          rows={[
            [<span className="text-[2rem] font-extrabold">Display</span>, '56 / 64', '800', '커버 히어로'],
            [<span className="text-[1.75rem] font-bold">Heading 1</span>, '40 / 48', '700', '페이지 제목'],
            [<span className="text-[1.375rem] font-bold">Heading 2</span>, '28 / 38', '700', '주요 섹션'],
            [<span className="text-lg font-bold">Heading 3</span>, '20 / 28', '700', '하위 섹션'],
            [<span className="text-lg">Body Large</span>, '18 / 27', '500', '인트로 문장'],
            ['Body', '16 / 24', '400', '본문 기본'],
            [<span className="text-sm">Small</span>, '14 / 20', '400', '표 · 폼 · 버튼'],
            [<span className="text-xs">Caption</span>, '12 / 18', '400', '도움말 · 주석'],
          ]}
        />
        <Callout>
          <b>글자 크기 토큰은 모두 rem 입니다.</b> 이용자가 상단에서 글자 크기를 키우면 루트
          크기가 바뀌고 모든 단계가 함께 커집니다. <Code>text-[16px]</Code> 처럼 px 로 고정하면
          그 부분만 커지지 않아 KRDS 글자 크기 조절이 깨집니다. 감사 규칙{' '}
          <Code>A11Y-01</Code> 이 이를 차단합니다.
        </Callout>
        <DoDont
          do="행정 문서형 화면의 본문은 1rem(16px)을 기본으로 합니다. 최소 크기는 0.875rem(14px)입니다."
          dont="글자 크기를 px 로 고정하지 않습니다. 정보 위계를 색이나 굵기로만 만들지 않습니다."
        />
      </Section>

      <Section id="shape" title="Shape" krds="형태">
        <Spec
          head={['토큰', '값', '적용']}
          rows={[
            [<Code>--radius-xs</Code>, '2px', '체크박스, 인라인 코드'],
            [<Code>--radius-sm</Code>, '4px', '버튼, 입력 필드 (기본값)'],
            [<Code>--radius-md</Code>, '8px', '카드, 알림, 표 컨테이너'],
            [<Code>--radius-lg</Code>, '12px', '모달'],
            [<Code>--radius-full</Code>, '999px', '태그, 칩, 아바타'],
          ]}
        />
      </Section>

      <Section id="layout" title="Layout" krds="레이아웃">
        <P>데스크톱 12칼럼, 태블릿 8칼럼, 모바일 4칼럼. 본문 최대 폭은 1280px입니다.</P>
        <Spec
          head={['브레이크포인트', '폭', '칼럼 / 거터 / 여백', '주 대상']}
          rows={[
            ['Mobile', '~ 599', '4 / 16 / 16', '현장 조사 · 민원 조회'],
            ['Tablet', '600 ~ 899', '8 / 20 / 24', 'BIM · 도면 뷰어'],
            ['Desktop', '900 ~ 1279', '12 / 24 / 32', '행정 업무 기본'],
            ['Wide', '1280 ~', '12 / 24 / 중앙 정렬', '데이터 대시보드'],
          ]}
        />
        <P>
          간격은 4px 배수만 씁니다. Tailwind에서는 <Code>p-4</Code>가{' '}
          <Code>var(--space-4)</Code>(16px)로 연결됩니다.
        </P>
      </Section>

      <Section id="iconography" title="Iconography" krds="아이콘">
        <P>
          Google <b>Material Symbols</b>(Outlined, weight 400)를 기본 아이콘 세트로 씁니다.
          국내 공공 서비스에서 가장 널리 통용되는 형태라 학습 비용이 낮고, Apache 2.0 라이선스로
          납품 산출물에 포함해도 문제가 없습니다.
        </P>

        <Callout>
          <b>CDN을 쓰지 않습니다.</b> <Code>fonts.googleapis.com</Code> 호출은 폐쇄망에서 동작하지 않고,
          이용자 IP가 외부로 나가는 문제도 있습니다. 그래서 실제로 쓰는 아이콘만 골라 <b>path 데이터를
          번들에 인라인</b>으로 굽습니다. 런타임 네트워크 요청이 0건입니다.
        </Callout>

        <Sub title="사용법">
          <Example
            code={`import { Icon } from '@/components/ui/icon'
import { IconGallery } from '@/components/docs/IconGallery'

// 옆에 텍스트가 있는 장식용 - 자동으로 aria-hidden
<Icon name="search" />

// 의미를 전달하는 아이콘 - label 필수 (role="img" + <title>)
<Icon name="close" label="닫기" />

// 크기: sm(16) md(20) lg(24) xl(32) 또는 숫자
<Icon name="download" size="lg" />`}
          >
            <span className="flex items-center gap-6 text-text-secondary">
              <Icon name="search" size="lg" />
              <Icon name="download" size="lg" />
              <Icon name="verified" size="lg" />
              <Icon name="warning" size="lg" />
              <Icon name="gov" size="lg" />
            </span>
          </Example>
        </Sub>

        <Sub title="아이콘 목록">
          <P>
            이름을 클릭하면 <Code>&lt;Icon name=&quot;...&quot; /&gt;</Code> 가 복사됩니다.
          </P>
          <IconGallery />
        </Sub>

        <Sub title="크기">
          <Spec
            head={['이름', '값', '용도']}
            rows={[
              ['sm', '16 × 16', '인라인 텍스트, 표 내부'],
              ['md', '20 × 20', '버튼, 입력 필드 (기본값)'],
              ['lg', '24 × 24', '내비게이션, 목록 항목'],
              ['xl', '32 × 32', '빈 화면, 상태 표시'],
            ]}
          />
        </Sub>

        <Sub title="아이콘 추가">
          <P>
            <Code>tools/build-icons.mjs</Code>의 ICONS 목록에 한 줄 넣고 다시 실행합니다.
            의미 기반 키를 쓰고, Material Symbols 원본 파일명을 값으로 둡니다.
          </P>
          <Example
            code={`// tools/build-icons.mjs
const ICONS = {
  ...
  print: 'print',        // 키: 우리가 부르는 이름, 값: Material Symbols 파일명
}

$ node tools/build-icons.mjs
  ✓ app/src/components/ui/icons.generated.ts  40개
  외부 요청 0건. 폐쇄망에서 그대로 동작합니다.`}
          >
            <p className="text-sm text-text-secondary">
              생성물은 텍스트라 보안 검수 때 사람이 눈으로 확인할 수 있습니다.
            </p>
          </Example>
        </Sub>

        <DoDont
          do="의미를 전달하는 아이콘에는 label을 넣습니다. 아이콘만 있는 버튼은 label이 없으면 스크린리더에서 침묵합니다."
          dont="아이콘만으로 기능을 설명하지 않습니다. 공간이 허락하면 텍스트 레이블을 함께 둡니다."
        />
      </Section>

      <Section id="elevation" title="Elevation" krds="엘리베이션">
        <P>그림자는 떠 있는 정도가 아니라 상호작용 계층을 뜻합니다. 4단계를 넘기지 않습니다.</P>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="gap-0 rounded-md p-5" style={{ boxShadow: `var(--shadow-${n})` }}>
              <p className="font-bold">Level {n}</p>
              <p className="mt-1 text-sm text-text-secondary">
                {['카드 · 입력 그룹', '드롭다운 · 툴팁', '팝오버', '모달 · 바텀시트'][n - 1]}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="motion" title="Motion">
        <P>움직임은 인과관계를 설명할 때만 씁니다. 장식적 애니메이션은 쓰지 않습니다.</P>
        <Spec
          head={['토큰', '값', '용도']}
          rows={[
            [<Code>--duration-fast</Code>, '120ms', '호버 · 포커스 등 즉각 반응'],
            [<Code>--duration-base</Code>, '200ms', '드롭다운 · 아코디언'],
            [<Code>--duration-slow</Code>, '320ms', '모달 · 페이지 전환'],
            [<Code>--easing-standard</Code>, 'cubic-bezier(.2,0,.2,1)', '대부분의 전환'],
          ]}
        />
        <Callout>
          <Code>prefers-reduced-motion: reduce</Code>를 존중해 모든 전환을 0.01ms로 줄입니다.
          전정기관 장애가 있는 이용자에게 필수입니다.
        </Callout>
      </Section>

      <Section id="contrast-mode" title="선명한 화면 모드" krds="선명한 화면 모드">
        <P>
          저시력 · 고령 이용자를 위해 명도 대비를 최대로 올리는 모드입니다. 상단{' '}
          <Code>글자·화면 설정</Code>에서 켜고 끌 수 있으며, 설정은 브라우저에 저장됩니다.
        </P>
        <Spec
          head={['토큰', '기본', '선명한 화면 모드']}
          rows={[
            [<Code>--text-primary</Code>, '#16181B', '#000000'],
            [<Code>--text-secondary</Code>, 'gray.600', '#1A1D21'],
            [<Code>--border-primary</Code>, 'gray.150', 'gray.500'],
            [<Code>--border-strong</Code>, 'gray.400', 'gray.700'],
            [<Code>--fill-accent</Code>, 'crimson.500', 'crimson.700'],
          ]}
        />
        <Example
          code={`/* 서비스에 적용하려면 루트에 속성 하나만 붙이면 됩니다 */
document.documentElement.setAttribute('data-contrast', 'high')

/* 토큰이 자동으로 교체됩니다 — 컴포넌트 코드 수정 없음 */`}
        >
          <p className="text-sm text-text-secondary">
            지금 상단 설정에서 켜 보세요. 이 페이지 전체가 즉시 바뀝니다.
          </p>
        </Example>
      </Section>

      <Section id="accessibility" title="Accessibility" krds="디지털 포용">
        <P>
          솔리데오 제품 다수가 공공 서비스이므로, 웹 접근성은 선택이 아니라 납품 조건입니다.
          <b> KWCAG 2.2 / WCAG 2.2 AA</b>를 최소 기준으로 둡니다.
        </P>
        <Spec
          head={['항목', '기준', '확인 방법']}
          rows={[
            ['명도 대비', '본문 4.5:1, 큰 텍스트 · UI 요소 3:1', <Code>node tokens/verify.mjs</Code>],
            ['키보드', 'Tab만으로 모든 기능 수행, 포커스 순서 = 시각 순서', '마우스 없이 전 과정 수행'],
            ['포커스 표시', '2px 이상 가시적 아웃라인', <><Code>outline:none</Code> 단독 사용 금지</>],
            ['레이블 연결', <>모든 입력에 <Code>label htmlFor</Code> 또는 <Code>aria-label</Code></>, '스크린리더 낭독 확인'],
            ['대체 텍스트', <>의미 있는 이미지에 alt, 장식은 <Code>alt=&quot;&quot;</Code></>, '이미지 차단 후 확인'],
            ['색 의존 금지', '상태를 색 + 텍스트/아이콘으로 이중 전달', '흑백 출력 확인'],
            ['터치 영역', <>클릭 대상 최소 24 × 24px (WCAG 2.5.8 AA) · 모바일 주요 행동은 44 × 44px</>, <>시각 크기가 작아도 히트 영역을 <Code>--component-control-target-min</Code> 으로 넓힙니다</>],
            ['확대', '200% 확대 시 가로 스크롤 없음', '브라우저 확대'],
            ['글자 크기 조절', '서비스가 자체 제공 (3단계)', '상단 글자·화면 설정'],
            ['제목 구조', 'h1 → h2 → h3 건너뛰기 없음', '제목 목록 확인'],
          ]}
        />
        <List
          items={[
            <>shadcn/ui는 Radix UI 기반이라 포커스 트랩 · 키보드 조작 · ARIA 속성이 <b>기본으로</b> 구현되어 있습니다.</>,
            <>직접 만든 컴포넌트라도 <Code>Resources › 구현 계약</Code>의 마크업 규칙을 지키면 같은 수준을 확보합니다.</>,
          ]}
        />
      </Section>
    </DocLayout>
  )
}
