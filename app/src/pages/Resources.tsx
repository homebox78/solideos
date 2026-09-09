import { DocLayout } from '@/components/layout/DocLayout'
import { Callout, Code, DocHeader, Example, List, P, Section, Spec, Sub } from '@/components/docs'
import { AssetLibrary } from '@/components/docs/AssetLibrary'
import { KrdsCoverage } from '@/components/docs/KrdsCoverage'
import { CSS_CLASSES } from '@/data/css-classes'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const SNIPPETS: Record<string, { label: string; code: string }> = {
  html: {
    label: 'HTML · JSP · Thymeleaf',
    code: `<!-- 파일 2개만 연결하면 컴포넌트를 그대로 씁니다 -->
<link rel="stylesheet" href="/css/solideo-tokens.css">
<link rel="stylesheet" href="/css/solideo-components.css">

<button type="button" class="sds-btn sds-btn--primary">신청서 제출</button>

<div class="sds-field">
  <label class="sds-label" for="biz">사업자등록번호<span class="sds-required" aria-hidden="true">*</span></label>
  <input class="sds-input" id="biz" required aria-describedby="biz-hint">
  <p class="sds-hint" id="biz-hint">하이픈 없이 숫자만 입력해도 됩니다.</p>
</div>

<!-- JSP · Thymeleaf 는 경로만 바꾸면 됩니다 -->
<link rel="stylesheet" href="\${pageContext.request.contextPath}/css/solideo-tokens.css">`,
  },
  react: {
    label: 'React (shadcn/ui)',
    code: `// main.tsx — 전역에서 한 번만
import '@solideo/design-system/css'        // 토큰
import '@solideo/design-system/shadcn'     // shadcn 변수 연결 + Tailwind @theme

// 이후 shadcn 컴포넌트가 자동으로 솔리데오 브랜드를 씁니다
import { Button } from '@/components/ui/button'
<Button>신청서 제출</Button>

// 색을 코드로 다뤄야 할 때 (차트 · 캔버스)
import tokens from '@solideo/design-system'
chart.setOption({ color: [tokens.crimson500, tokens.ink700, tokens.blue500] })`,
  },
  vue: {
    label: 'Vue 3',
    code: `// main.ts
import '@solideo/design-system/css'

// SFC — 토큰을 그대로 참조합니다
<template>
  <button class="submit">신청서 제출</button>
</template>

<style scoped>
.submit {
  background: var(--fill-accent);
  color: var(--text-inverse);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-6);
  height: 44px;
}
</style>`,
  },
  quasar: {
    label: 'Quasar',
    code: `// quasar.config.js
module.exports = {
  css: ['app.scss'],
  framework: { config: {} },
}

// src/css/quasar.variables.sass
// dist/quasar.variables.sass 를 그대로 복사합니다
@import 'solideo/quasar.variables'
// $primary  : #C12554  ← 솔리데오 CI
// $negative : #D93025
// $positive : #0D6449

// 이후 Quasar 컴포넌트가 브랜드 색을 씁니다
<q-btn color="primary" label="신청서 제출" />`,
  },
  spring: {
    label: 'Spring Boot · Java',
    code: `# application.properties
spring.config.import=classpath:solideo-tokens.properties

// Java — 메일 · PDF 등 서버 렌더링
import com.solideo.designsystem.SolideoTokens;

model.addAttribute("brand", SolideoTokens.FILL_ACCENT);   // #C12554
model.addAttribute("text",  SolideoTokens.TEXT_PRIMARY);  // #16181B

<!-- Thymeleaf -->
<td th:style="'background:' + \${brand}">…</td>

<!-- JSP -->
<spring:eval expression="@environment.getProperty('solideo.fill.accent')" var="brand" />
<td style="background:\${brand}">…</td>`,
  },
  sass: {
    label: 'Sass · Less · Tailwind v3',
    code: `// SCSS
@use 'solideo-tokens' as *;
.submit { background: $fill-accent; padding: $space-4; }

// Less
@import 'solideo-tokens.less';
.submit { background: @fill-accent; }

// Tailwind v3
// tailwind.config.js
module.exports = { presets: [require('@solideo/design-system/tailwind')] }
// → bg-fill-accent, text-text-secondary, p-space-4`,
  },
}

export default function Resources() {
  return (
    <DocLayout>
      <DocHeader eyebrow="Resources" title="Resources">
        솔리데오가 진행한 프로젝트의 목업 · 코드 자산을 내려받고, 새 SI 프로젝트에 디자인 시스템을 붙이는
        방법을 확인합니다.
        <br />
        개발 언어와 무관하게 같은 화면 · 같은 접근성이 나오도록 토큰과 구현 계약을 제공합니다.
      </DocHeader>

      <Section id="library" title="자산 라이브러리" krds="리소스 다운로드">
        <P>
          디자이너는 새 프로젝트를 백지에서 시작하지 않고, 개발자는 같은 마크업을 다시 짜지 않습니다.
        </P>
        <AssetLibrary />
        <Callout>
          자산을 추가하려면 <Code>src/data/library.ts</Code> 배열에 항목 하나만 넣으면 됩니다. 사내망 전용
          파일은 <Code>status: &apos;internal&apos;</Code>로 두고 사내 저장소 주소를 넣습니다.
        </Callout>
      </Section>

      <Section id="krds-coverage" title="KRDS 대응표" krds="컴포넌트 소개">
        <P>
          공공 · 행정 SI 사업의 산출물 검수는 KRDS 분류를 기준으로 이루어집니다. 이 표를 그대로
          제출하면 <b>무엇이 대응되고 무엇이 남았는지</b>가 한 번에 확인됩니다.
          컴포넌트 55종과 기본 패턴 12종을 함께 담았습니다.
        </P>
        <KrdsCoverage />
        <Callout>
          각 컴포넌트 · 패턴 문서 하단에는 해당 KRDS 항목의{' '}
          <b>사용성 · 접근성 · 상호작용 · 개발 주의사항</b> 지침이 원문 그대로 붙어 있습니다.
          데이터는 <Code>src/data/krds.ts</Code> · <Code>krds-patterns.ts</Code> 에 있고,{' '}
          <Code>npm run build:krds</Code> 로 갱신합니다. 수집 결과를{' '}
          <Code>tools/krds-cache/</Code> 에 두어 <b>폐쇄망에서도 재생성</b>됩니다.
        </Callout>
      </Section>

      <Section id="install" title="설치">
        <P>
          스택과 무관하게 <b>토큰 파일 하나</b>만 연결하면 시작됩니다. 컴포넌트는 선택 사항이며, 이미 자체
          UI 라이브러리가 있는 프로젝트는 토큰만 가져가도 됩니다.
        </P>
        <Spec
          head={['단계', '할 일', '대상']}
          rows={[
            ['1', '토큰 파일을 복사하거나 npm 의존성으로 추가', <Code>dist/</Code>],
            ['2', '전역 스타일에서 한 번 불러오기', <Code>solideo-tokens.css</Code>],
            ['3', '색 · 간격 하드코딩을 토큰 참조로 교체', <Code>var(--fill-accent)</Code>],
            ['4', 'React가 아니면 CSS 컴포넌트 추가', <Code>solideo-components.css</Code>],
            ['4', 'React라면 shadcn 테마 레이어 추가', <Code>solideo-shadcn.css</Code>],
            ['5', '릴리스 전 체크리스트 통과', '아래 Check List'],
          ]}
        />
        <Example
          code={`# npm 사용 시
npm i @solideo/design-system

# 파일 복사 방식 (사내망 · 폐쇄망 프로젝트)
cp dist/solideo-tokens.css  <프로젝트>/src/css/
cp dist/solideo-shadcn.css  <프로젝트>/src/css/   # React + Tailwind일 때만`}
        >
          <p className="text-sm text-text-secondary">
            폐쇄망 SI 사업이 많아 <b>파일 복사만으로도 완결</b>되도록 설계했습니다. 빌드 도구 의존성이 없습니다.
          </p>
        </Example>
      </Section>

      <Section id="stack" title="스택별 적용">
        <P>
          토큰의 기준 형식은 <b>CSS 변수</b>입니다. 어떤 스택이든 이 파일 하나를 불러오면 나머지는
          따라옵니다.
        </P>
        <Tabs defaultValue="html">
          <TabsList className="flex-wrap">
            {Object.entries(SNIPPETS).map(([k, v]) => (
              <TabsTrigger key={k} value={k}>
                {v.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(SNIPPETS).map(([k, v]) => (
            <TabsContent key={k} value={k} className="pt-4">
              <pre className="overflow-x-auto rounded-md bg-gray-900 p-5 font-mono text-xs leading-relaxed text-gray-100">
                {v.code}
              </pre>
            </TabsContent>
          ))}
        </Tabs>
        <Spec
          head={['스택', '쓰는 산출물', '비고']}
          rows={[
            [
              '순수 HTML · JSP · Thymeleaf',
              <><Code>solideo-tokens.css</Code> + <Code>solideo-components.css</Code></>,
              <>빌드 도구 없음. <Code>.sds-*</Code> 클래스 70개</>,
            ],
            ['React + shadcn/ui', <><Code>solideo-shadcn.css</Code> + <Code>.js</Code></>, '이 사이트가 그 구현'],
            ['Vue 3', <><Code>solideo-tokens.css</Code> + <Code>.js</Code></>, 'SFC에서 var() 직접 참조'],
            ['Quasar', <Code>quasar.variables.sass</Code>, '$primary 등 브랜드 변수 연결'],
            ['Spring Boot · Java', <><Code>.properties</Code> · <Code>SolideoTokens.java</Code></>, '메일 · PDF 등 서버 렌더링'],
            ['Sass · Less', <><Code>.scss</Code> · <Code>.less</Code></>, '레거시 프로젝트'],
            ['Tailwind v3', <Code>tailwind.preset.cjs</Code>, 'v4는 shadcn 레이어 사용'],
          ]}
        />
      </Section>

      <Section id="css-components" title="CSS 컴포넌트 (퍼블리셔)">
        <P>
          React 없이 쓰는 컴포넌트 라이브러리입니다. JSP · Thymeleaf · 퍼블리싱 산출물 ·
          레거시 화면이 대상이며, <b>빌드 도구가 필요 없습니다.</b>
        </P>
        <Example
          code={`<link rel="stylesheet" href="solideo-tokens.css">
<link rel="stylesheet" href="solideo-components.css">

<button type="button" class="sds-btn sds-btn--primary">신청서 제출</button>`}
        >
          <p className="text-sm text-text-secondary">
            클래스 <b>{CSS_CLASSES.length}</b>개. React 판과 같은 마크업 계약 · 같은 시각 결과를 냅니다.
          </p>
        </Example>

        <Sub title="클래스 목록">
          <P>
            각 컴포넌트 문서의 <b>HTML · JSP 탭</b>에 실제 마크업이 있습니다. 복사해서 쓰세요.
          </P>
          <div className="flex flex-wrap gap-1.5">
            {CSS_CLASSES.map((c) => (
              <code
                key={c}
                className="rounded-xs bg-fill-secondary px-1.5 py-0.5 font-mono text-xs text-text-secondary"
              >
                .{c}
              </code>
            ))}
          </div>
        </Sub>

        <Sub title="동작 예제">
          <P>
            신청 관리 화면 한 벌이 <Code>starters/html/</Code> 에 들어 있습니다. GNB · 검색 ·
            표 · 다단계 폼 · 약관 동의 · 모달 · 푸터가 모두 있고, <b>접근성 검사 위반 0건</b>입니다.
            폴더를 그대로 복사해 시작하세요.
          </P>
          <p>
            <Button asChild variant="outline">
              <a href="./starters/html/index.html" target="_blank" rel="noopener noreferrer">
                예제 화면 열기 <span className="text-xs text-text-tertiary">(새 창)</span>
              </a>
            </Button>
          </p>
        </Sub>

        <Callout>
          이 CSS 는 <b>토큰만 참조</b>합니다. <Code>node tools/build-components-css.mjs</Code> 가
          색 하드코딩 · 정의되지 않은 토큰 · px 고정 글자 크기 · 포커스 표시 제거를 검사하고,
          하나라도 걸리면 빌드를 실패시킵니다.
        </Callout>
      </Section>

      <Section id="dark-mode" title="다크 모드">
        <P>
          Primitive 는 그대로 두고 <b>Semantic 매핑만 뒤집습니다.</b> 컴포넌트 코드는 손대지 않습니다.
        </P>
        <Example
          code={`<link rel="stylesheet" href="solideo-tokens.css">
<link rel="stylesheet" href="solideo-dark.css">

<!-- 명시적 전환 -->
<html data-theme="dark">

<!-- 시스템 설정을 따르려면 아무것도 하지 않아도 됩니다 -->
<!-- prefers-color-scheme 블록이 파일에 포함되어 있습니다 -->`}
        >
          <p className="text-sm text-text-secondary">
            다크 모드 색 대비도 <Code>tokens/verify.mjs</Code> 가 검사합니다. 밝은 모드에서
            통과했다고 어두운 모드가 통과하는 것이 아니기 때문입니다.
          </p>
        </Example>
      </Section>

      <Section id="contract" title="구현 계약">
        <P>
          언어가 달라도 <b>같은 마크업 구조와 ARIA 속성</b>을 지키면 같은 화면 · 같은 접근성이 나옵니다.
          React를 쓰지 않는 프로젝트가 컴포넌트를 직접 구현할 때의 최소 계약입니다.
        </P>
        <Spec
          head={['컴포넌트', '필수 마크업', '필수 동작 · 속성']}
          rows={[
            ['Button', <Code>&lt;button type&gt;</Code>, <>비활성은 <Code>disabled</Code>. 아이콘 전용이면 <Code>aria-label</Code></>],
            ['Text Field', <Code>&lt;label for&gt; + &lt;input id&gt;</Code>, <>도움말 · 오류는 <Code>aria-describedby</Code>, 오류 시 <Code>aria-invalid</Code></>],
            ['Tabs', <Code>role=&quot;tablist / tab / tabpanel&quot;</Code>, <><Code>aria-controls</Code> · <Code>aria-selected</Code> · 좌우 화살표 이동</>],
            ['Table', <Code>&lt;table&gt; + &lt;caption&gt;</Code>, <>열 제목 <Code>scope=&quot;col&quot;</Code>, 정렬은 <Code>aria-sort</Code></>],
            ['Alert', <Code>&lt;div role=&quot;alert&quot;&gt;</Code>, '색 외에 텍스트로도 상태 전달'],
            ['Modal', <Code>role=&quot;dialog&quot; aria-modal</Code>, 'Esc 닫기 · 포커스 트랩 · 닫을 때 포커스 복귀'],
            ['Switch', <Code>&lt;input type=&quot;checkbox&quot; role=&quot;switch&quot;&gt;</Code>, '즉시 적용되는 설정에만 사용'],
            ['Pagination', <Code>&lt;nav aria-label&gt;</Code>, <>현재 페이지에 <Code>aria-current=&quot;page&quot;</Code></>],
            ['Skip Link', <Code>&lt;a href=&quot;#main&quot;&gt;</Code>, '페이지의 첫 번째 포커스 대상'],
            [
              '넓은 표 · 코드 블록',
              <Code>&lt;div tabindex=&quot;0&quot; role=&quot;region&quot; aria-label&gt;</Code>,
              <>가로 스크롤이 생길 때만 탭 정지점이 되도록 (WCAG 2.1.1)</>,
            ],
            [
              '커스텀 체크박스 · 스위치',
              <Code>role + aria-checked + aria-labelledby</Code>,
              <><Code>&lt;div&gt;</Code>·<Code>&lt;button&gt;</Code> 으로 만든 컨트롤은 <Code>label for</Code> 만으로 이름이 붙지 않습니다</>,
            ],
            [
              '개인정보 입력',
              <Code>type=&quot;text&quot; + 표시 토글</Code>,
              <><Code>type=&quot;password&quot;</Code> 는 비밀번호 관리자가 값을 저장합니다. 인증 수단이 아닌 값에는 쓰지 마세요</>,
            ],
          ]}
        />
        <Callout>
          React 프로젝트라면 이 계약을 직접 지킬 필요가 없습니다. shadcn/ui는 Radix UI 기반이라
          위 항목이 <b>이미 구현되어</b> 있습니다. 계약표는 JSP · Quasar 등 다른 스택에서 동등한 품질을
          맞추기 위한 기준입니다.
        </Callout>
      </Section>

      <Section id="tokens-build" title="토큰 배포 체계">
        <P>
          토큰의 단일 원본은 <Code>tokens/tokens.json</Code> 하나입니다. 여기만 고치고 빌드하면 모든
          포맷이 동시에 갱신되므로, 포맷 간 값이 어긋날 일이 없습니다.
        </P>
        <Example
          code={`node tokens/build.mjs     # 15종 산출물 생성
node tokens/verify.mjs    # 접근성 · 계층 규칙 검증 (CI 게이트)`}
        >
          <p className="text-sm text-text-secondary">의존성 없는 순수 Node 스크립트라 어떤 CI에서도 돕니다.</p>
        </Example>
        <Sub title="검증이 CI 게이트입니다">
          <List
            items={[
              <>시맨틱 토큰이 primitive만 참조하는지 (계층 역전 차단)</>,
              <>텍스트 토큰이 흰 배경 · 회색 배경에서 4.5:1을 넘는지</>,
              <>버튼 · 테두리 · 포커스링 등 UI 요소가 3:1을 넘는지</>,
              <>Accent와 Critical이 서로 충분히 구별되는지</>,
            ]}
          />
          <Callout>
            실제로 이 검증이 <b>입력 필드 테두리가 2.23:1로 미달</b>인 것을 잡아냈고, gray.300 → gray.400으로
            올려 3.36:1을 확보했습니다. 사람 눈으로는 놓쳤을 결함입니다.
          </Callout>
        </Sub>
      </Section>

      <Section id="security" title="폐쇄망 · 보안">
        <P>
          공공 SI 사업은 대부분 망분리 · 폐쇄망에서 운영됩니다. 외부로 나가는 요청은 그 자체가 보안
          사고가 되므로, 이 디자인 시스템은 <b>런타임 외부 요청이 0건</b>이 되도록 설계했습니다.
        </P>

        <Spec
          head={['항목', '일반적인 방식', '솔리데오 디자인 시스템']}
          rows={[
            ['웹폰트', 'Google Fonts CDN 링크', <>Pretendard woff2 4종을 프로젝트에 포함 (<Code>public/fonts/</Code>)</>],
            ['아이콘', 'Material Symbols 폰트 CDN', <>쓰는 아이콘만 path 데이터로 번들에 인라인</>],
            ['CSS · JS', 'unpkg · jsdelivr 등 CDN', '전부 로컬 번들. 외부 스크립트 태그 없음'],
            ['분석 · 추적', 'GA · Hotjar 등 삽입', '넣지 않음. 이용자 행동이 외부로 나가지 않음'],
            ['상태 저장', '서버 · 외부 스토리지', <>글자·화면 설정만 <Code>localStorage</Code>. 브라우저 밖으로 나가지 않음</>],
          ]}
        />

        <Sub title="감사 스크립트">
          <P>
            반입 전에 실행합니다. 소스와 빌드 산출물을 훑어 외부 참조 · 원격 리소스 · 개인정보 저장을
            검사하고, 하나라도 걸리면 종료 코드 1을 반환합니다.
          </P>
          <Example
            code={`$ node tools/audit-offline.mjs

  PASS  CDN-01     외부 호스트 참조
  PASS  CDN-02     원격 CSS @import
  PASS  CDN-03     원격 스크립트 · 스타일 태그
  PASS  NET-01     외부 전송 호출
  PASS  A11Y-01    고정 px 글자 크기
  PASS  DEPLOY-01  BrowserRouter
  PASS  PII-01     개인정보로 보이는 저장소 키

외부 요청 0건. 폐쇄망에 그대로 반입할 수 있습니다.`}
          >
            <p className="text-sm text-text-secondary">
              CI에 이 스크립트를 걸어 두면 누군가 CDN 링크를 추가하는 순간 빌드가 실패합니다.
            </p>
          </Example>
        </Sub>

        <Sub title="개인정보 취급 원칙">
          <List
            items={[
              <><b>수집 최소화</b> — 업무에 반드시 필요한 항목만 받습니다. 생년월일로 충분하면 주민등록번호를 받지 않습니다.</>,
              <><b>브라우저 저장 금지</b> — 주민번호 · 연락처 · 토큰을 <Code>localStorage</Code> · <Code>sessionStorage</Code> · 쿠키에 남기지 않습니다. 감사 규칙 <Code>PII-01</Code>이 차단합니다.</>,
              <><b>URL 노출 금지</b> — 개인 식별 정보를 쿼리스트링에 담지 않습니다. 서버 로그 · 리퍼러 · 브라우저 기록에 남습니다.</>,
              <><b>화면 마스킹</b> — 조회 화면의 기본 상태는 마스킹이며, 필요할 때만 사용자가 해제합니다. 해제 이력을 남깁니다.</>,
              <><b>첨부파일</b> — 업로드 전 개인정보 포함 여부를 경고하고, 보관 기간과 AI 학습 사용 여부를 명시합니다.</>,
              <><b>오류 메시지</b> — 입력값을 그대로 되비추지 않습니다. “hong@ 는 올바르지 않습니다”가 아니라 “이메일 형식이 올바르지 않습니다”.</>,
            ]}
          />
        </Sub>

        <Sub title="반입 절차">
          <Spec
            head={['단계', '할 일']}
            rows={[
              ['1', <><Code>node tokens/build.mjs</Code> — 산출물 생성</>],
              ['2', <><Code>node tokens/verify.mjs</Code> — 접근성 검증</>],
              ['3', <><Code>node tools/audit-offline.mjs</Code> — 외부 참조 · 개인정보 감사</>],
              ['4', <><Code>npm run build</Code> — 정적 산출물 생성 (app/dist)</>],
              ['5', '산출물과 소스를 매체에 담아 반입. 반입 후 추가 다운로드가 필요 없습니다'],
            ]}
          />
          <Callout>
            npm 설치가 불가능한 폐쇄망이라면 토큰 CSS 파일 하나만 복사해도 됩니다. 빌드 도구 의존성이
            없는 형태를 항상 함께 제공하는 이유입니다.
          </Callout>
        </Sub>
      </Section>

      <Section id="known-findings" title="알려진 오탐">
        <P>
          자동 접근성 검사에서 반복적으로 보고되지만 <b>실제 동작을 확인한 결과 문제가 아닌</b>
          항목입니다. 검수 때 같은 지적이 나오면 아래 근거를 제시하세요.
          목록에 없는 지적은 실제 결함으로 간주하고 고칩니다.
        </P>
        <Spec
          head={['검사 항목', '보고 내용', '실제 동작 · 확인 방법']}
          rows={[
            [
              <Code>keyboard-accessible/focus-visible</Code>,
              <>RadioGroup · TabsList 컨테이너에 <Code>outline:none</Code> 이 있어 포커스 표시가 없다</>,
              <>
                Radix 의 로빙 포커스 프록시입니다. 컨테이너가 초점을 받는 즉시 내부 항목으로
                넘기므로 컨테이너에 초점이 머무는 순간이 없습니다. 실제 초점을 받는 라디오 ·
                탭에는 링 표시가 있습니다.
                <br />
                <Code>el.focus(); document.activeElement</Code> 로 확인 — 결과는 항상 내부 버튼입니다.
              </>,
            ],
            [
              <Code>navigable/skip-link</Code>,
              <>좌측 메뉴 링크 <Code>#/components#table</Code> 의 대상이 없다</>,
              <>
                해시 라우팅이라 프래그먼트가 두 겹입니다. 검사 도구는 앞부분까지 id 로 찾으려 해
                실패하지만, 라우터가 경로와 앵커를 분리해 처리합니다. 스크롤과 <b>초점 이동</b>까지
                직접 구현했습니다.
                <br />
                링크 클릭 후 <Code>document.activeElement</Code> 가 대상 섹션인지로 확인합니다.
              </>,
            ],
          ]}
        />
        <Callout>
          오탐을 <b>도구 설정으로 끄지 않았습니다.</b> 규칙을 끄면 같은 규칙의 진짜 위반도 함께
          가려집니다. 대신 이 표에 근거를 남기고, 검사 결과와 대조하도록 했습니다.
        </Callout>
      </Section>

      <Section id="checklist" title="Check List">
        <P>릴리스 전 확인합니다. 하나라도 통과하지 못하면 배포하지 않습니다.</P>
        <Sub title="디자인">
          <List
            items={[
              '하드코딩된 색 · 간격 값이 없는가 (모두 Semantic 토큰 참조)',
              '한 화면의 Primary 버튼이 1개인가',
              'Gray : Accent 비율이 8:2를 넘지 않는가',
              '빈 화면 · 오류 화면 · 로딩 상태가 모두 정의되었는가',
              '320px 폭에서 가로 스크롤 없이 동작하는가',
            ]}
          />
        </Sub>
        <Sub title="라이팅">
          <List
            items={[
              '버튼 레이블이 동사인가',
              '오류 메시지에 해결 방법이 있는가',
              '용어 사전과 어긋나는 표현이 없는가',
              '내부 시스템 용어가 화면에 노출되지 않는가',
            ]}
          />
        </Sub>
        <Sub title="접근성 (KWCAG 2.2 · KRDS)">
          <List
            items={[
              '마우스 없이 전 과정을 수행할 수 있는가',
              '포커스 표시가 모든 요소에서 보이는가',
              '모든 입력에 레이블이 연결되었는가',
              '상태를 색만으로 전달하는 곳이 없는가',
              '본문 바로가기가 첫 번째 포커스 대상인가',
              '글자 크기 조절 · 선명한 화면 모드가 제공되는가',
              '공공 사업이라면 전자정부 누리집 안내 배너가 있는가',
              '터치 영역이 44 × 44px 이상인가 (최소 24 × 24px)',
              '320px 폭에서 가로 스크롤이 생기지 않는가',
              '글자 크기를 "아주 크게"로 두어도 레이아웃이 깨지지 않는가',
              '넓은 표를 키보드만으로 가로 스크롤할 수 있는가',
              '커스텀 컨트롤에 접근 가능한 이름이 있는가 (자동 검사로 확인)',
            ]}
          />
        </Sub>
        <Sub title="구현">
          <List
            items={[
              <><Code>node tokens/verify.mjs</Code>가 통과하는가</>,
              '구현 계약의 마크업 · ARIA 속성을 지켰는가',
              '토큰 버전을 프로젝트 README에 기록했는가',
            ]}
          />
        </Sub>
      </Section>

      <Section id="governance" title="기여와 운영">
        <Spec
          head={['상황', '절차', '승인']}
          rows={[
            ['새 컴포넌트 제안', '기존 조합으로 안 되는지 확인 → 사용 사례 2건 이상과 함께 제안', '디자인시스템 담당'],
            ['토큰 값 변경', 'tokens.json 수정 → build + verify 통과 → 영향 제품 목록 공유', '디자인시스템 담당'],
            ['예외 사용', '어떤 원칙을 왜 벗어나는지 명시. 승인된 예외는 문서에 기록', '프로젝트 PL + 디자인시스템'],
            ['자산 등록', 'library.ts에 항목 추가 + 파일 업로드', '프로젝트 담당자'],
          ]}
        />
        <Sub title="버전 규칙">
          <Spec
            head={['구분', '내용', '영향']}
            rows={[
              ['Major', '토큰 삭제 · 이름 변경 등 깨지는 변경', '전 프로젝트 마이그레이션 안내 필수'],
              ['Minor', '토큰 · 컴포넌트 추가', '기존 프로젝트 영향 없음'],
              ['Patch', '값 보정 · 문서 수정', '자동 반영'],
            ]}
          />
          <Callout>
            이전 명칭(<Code>--color-brand</Code> 등)은 alias로 한 버전 더 유지합니다. 기존 SI 프로젝트가
            즉시 깨지지 않도록 하되, 신규 코드에서는 사용하지 마세요.
          </Callout>
        </Sub>
      </Section>

      <Section id="release" title="Release Note">
        <Spec
          head={['버전', '날짜', '내용']}
          rows={[
            [
              'v1.3.1',
              '2026.09.09',
              '재점검 후 수정. React 판과 CSS 판의 버튼 · 입력 필드가 실제로 어긋나 있던 것(36px/8px 대 40px/4px)을 발견해 component 토큰을 신설하고 두 구현이 같은 값을 읽도록 정렬. 감사 규칙 PARITY-01 로 재발 차단. 체크박스 · 라디오의 클릭 대상을 24px 로 확장(WCAG 2.5.8). 상태 매트릭스의 비활성 예시를 실제 disabled 요소로 교체. 코드 탭에서 불필요한 로빙 포커스 제거(접근성 검사 19건 → 6건).',
            ],
            [
              'v1.3.0',
              '2026.09.09',
              '실사용 점검 후 보강. CSS 전용 컴포넌트 라이브러리 신설(클래스 70개) — 퍼블리셔가 React 없이 쓰는 경로 복원. 컴포넌트 문서에 React / HTML·JSP 탭과 코드 복사 버튼 추가. 아이콘 갤러리(45개) · Props 표 · 상태 매트릭스 추가. 다크 모드 토큰과 Figma Tokens Studio 형식 산출물 추가, 다크 모드 대비 검증(26건)까지 CI 게이트에 포함. HTML·JSP 스타터 킷(접근성 위반 0건) 배포.',
            ],
            [
              'v1.2.0',
              '2026.09.09',
              'KRDS 기본 패턴 12종 반영. 대응표에 패턴을 합쳐 67종 기준으로 재구성(64/67 · 96%). 패턴 문서에도 KRDS 지침 자동 표시(사용성 83 · 접근성 42 · 상호작용 17문장). 신규 패턴 문서 — 도움 · 사용자 피드백 · 모바일 알림.',
            ],
            [
              'v1.1.0',
              '2026.09.09',
              'KRDS 컴포넌트 55종 전면 반영. 대응표 신설(45/55 · 82%)과 컴포넌트별 KRDS 지침 자동 표시(사용성 266 · 접근성 202 · 상호작용 90 · 개발 주의 23문장). 신규 컴포넌트 — 긴급 공지 · 단계 표시기 · 구조화 목록 · 스피너 · 스낵바 · 숨긴 콘텐츠 · 콘텐츠 내 탐색. 신규 문서 — 공식 배너 · 운영기관 식별자 · 푸터 · 디스클로저 · 텍스트 목록 · 이미지 · 파비콘 · 바텀시트 · 탭바. 해시 라우팅에서 끊긴 페이지 내 초점 이동 구현. 알려진 오탐 문서화.',
            ],
            [
              'v1.0.1',
              '2026.09.08',
              '전체 점검 · 보강. 접근성 자동검사에서 발견된 결함 수정 — Radix 기반 Checkbox·Radio·Switch·Select가 <button>으로 렌더링되어 label만으로는 이름이 붙지 않던 문제를 Field 컴포넌트로 구조적 해결(35건), 표·코드 블록의 가로 스크롤 키보드 접근(Scrollable), 주민등록번호 입력을 MaskedInput으로 교체(비밀번호 관리자 저장 차단), 글자 크기 토큰을 rem으로 전환해 KRDS 글자 크기 조절이 전 요소에 적용, 320px 가로 오버플로와 터치 영역 미달 해소. HashRouter 전환으로 정적 반입 시 새로고침 404 해결. 라우트 코드 분할로 첫 번들 637KB → 331KB. 감사 규칙 A11Y-01·DEPLOY-01 추가.',
            ],
            [
              'v1.0.0',
              '2026.09.08',
              'Tailwind CSS v4 + shadcn/ui 기반으로 전면 재구축. 토큰 단일 원본(tokens.json) · 15종 산출물 자동 생성(CSS · SCSS · Less · JS · TS · Java · Spring properties · Quasar · Tailwind · shadcn) · 접근성 검증 스크립트 · 자산 라이브러리 · KRDS 준수 요소(전자정부 배너 · 글자 크기 · 선명한 화면 모드 · 본문 바로가기) 추가. 입력 필드 테두리 대비 미달 수정.',
            ],
            ['v0.2', '2026.09.08', '정보구조를 6개 대영역으로 재편 · 상단 GNB + 좌측 LNB 셸 · AI Interaction 신규 작성.'],
            ['v0.1', '2026.09.08', '초안. Solid Flow 원칙 · 기본 토큰 · 기본 컴포넌트 정의.'],
          ]}
        />
        <Callout>
          다음 예정 — 아이콘 세트 확정, 다크 모드 토큰, 스타터 킷 3종(React · Quasar · Spring Boot) 배포,
          실제 프로젝트 목업 자산 등록, Date Picker · Help Panel 컴포넌트.
        </Callout>
      </Section>
    </DocLayout>
  )
}
