import { useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { Markup } from '@/components/docs/Markup'
import { PropsTable } from '@/components/docs/PropsTable'
import { StateMatrix } from '@/components/docs/StateMatrix'
import { toast } from 'sonner'
import { DocLayout } from '@/components/layout/DocLayout'
import {
  Callout, Code, DocHeader, DoDont, Example, ExampleBlock, List, P, Section, Spec, Sub,
} from '@/components/docs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckboxField, RadioField, SwitchField, SelectField, TextField, TextareaField } from '@/components/ui/field'
import { MaskedInput } from '@/components/ui/masked-input'
import {
  CriticalAlert,
  StepIndicator,
  StructuredList,
  Spinner,
  Snackbar,
  VisuallyHidden,
} from '@/components/ui/krds-components'
import { RadioGroup } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination'

export default function ComponentsPage() {
  const [page, setPage] = useState(1)

  return (
    <DocLayout>
      <DocHeader eyebrow="Components" title="Components">
        사용자 인터페이스를 구성하는 재사용 가능한 요소입니다.
        <br />
        shadcn/ui(Radix UI) 위에 솔리데오 토큰을 입혀 접근성과 브랜드를 함께 확보합니다.
      </DocHeader>

      <Callout>
        모든 컴포넌트는 <Code>src/components/ui/</Code> 에 소스로 존재합니다. 라이브러리 의존성이 아니라
        <b> 프로젝트가 소유하는 코드</b>이므로, SI 사업별 요구사항에 맞춰 수정하고 그 수정을 그대로
        납품할 수 있습니다.
      </Callout>

      <Callout>
        <b>폼은 원시 컴포넌트 대신 Field 를 쓰세요.</b> shadcn 의 Checkbox · Radio · Switch ·
        Select 는 Radix 기반이라 실제 DOM 이 <Code>&lt;button role=&quot;checkbox&quot;&gt;</Code> 입니다.
        이때 <Code>&lt;label for&gt;</Code> 만으로는 <b>접근 가능한 이름이 생기지 않아</b> 스크린리더가
        무엇에 대한 체크박스인지 말하지 못합니다. 실제로 이 사이트에서도 자동 검사로 35건이 발견되어,
        id 연결과 <Code>aria-labelledby</Code> 를 자동으로 붙이는{' '}
        <Code>CheckboxField</Code> · <Code>RadioField</Code> · <Code>SwitchField</Code> ·{' '}
        <Code>SelectField</Code> · <Code>TextField</Code> 로 대체했습니다.
      </Callout>

      {/* =================================================== 아이덴티티 */}
      <Section id="gov-banner" title="Government Banner" krds="아이덴티티 > 공식 배너">
        <P>
          접속한 누리집이 대한민국 정부 조직이 운영하는 공식 서비스임을 알립니다.
          <b> 공공 사업 화면에는 필수</b>이며, 민간 사업 화면에서는 사용하지 않습니다.
          이 사이트 최상단이 그 구현입니다.
        </P>
        <List
          items={[
            '모든 화면의 최상단에 제공합니다.',
            <>건너뛰기 링크를 <b>공식 배너보다 먼저</b> 제공합니다. 배너가 첫 탭 정지점이 되면 키보드 이용자가 매 화면에서 배너를 거쳐야 합니다.</>,
            '펼침 영역에는 go.kr · or.kr 주소 확인과 HTTPS 확인 안내를 담습니다.',
            <>펼침 상태를 <Code>aria-expanded</Code> 로 알립니다.</>,
          ]}
        />
      </Section>

      <Section id="identifier" title="Identifier" krds="아이덴티티 > 운영기관 식별자">
        <P>
          서비스 운영 주체의 상위 기관을 안내합니다. 공식 배너 · 푸터와 함께 서비스의 신뢰성을
          확인시키는 요소입니다.
        </P>
        <ExampleBlock>
          <div className="flex items-center gap-3 text-sm">
            <Icon name="gov" className="text-icon-tertiary" />
            <span className="text-text-secondary">
              이 누리집은 <b className="text-text-primary">행정안전부</b> 산하 기관이 운영합니다.
            </span>
          </div>
        </ExampleBlock>
        <List
          items={[
            '식별자 영역은 구조적으로 푸터 내부에 포함되도록 제공합니다.',
            '식별자가 지나치게 주의를 끌지 않도록 표현합니다. 본문보다 낮은 위계로 둡니다.',
            '기관 로고를 쓴다면 기관명을 대체 텍스트로 제공합니다.',
          ]}
        />
      </Section>

      <Section id="footer" title="Footer" krds="아이덴티티 > 푸터">
        <P>
          헤더와 본문에서 원하는 정보를 찾지 못한 이용자가 마지막으로 마주하는 영역입니다.
          탐색 수단과 문제 해결에 참고할 링크를 제공해야 합니다.
        </P>
        <List
          items={[
            <><Code>&lt;footer&gt;</Code> 로 마크업하고 내부 링크 묶음에 <Code>&lt;nav aria-label&gt;</Code> 을 둡니다.</>,
            '운영기관 식별자 · 연락처 · 저작권 · 개인정보처리방침 링크를 포함합니다.',
            '개인정보처리방침 링크는 다른 링크보다 강조해 구분합니다.',
            '푸터 링크는 모든 화면에서 동일한 순서로 제공합니다.',
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------ 액션 */}
      <Section id="button" title="Button" krds="액션 > 버튼">
        <P>한 화면의 Primary는 하나입니다. 나머지 행동은 Secondary 이하로 낮춥니다.</P>
        <Markup
          react={`<Button>신청서 제출</Button>
<Button variant="outline">임시저장</Button>
<Button variant="secondary">취소</Button>
<Button variant="ghost">더보기</Button>
<Button variant="destructive">삭제</Button>
<Button disabled>비활성</Button>`}
          html={`<button type="button" class="sds-btn sds-btn--primary">신청서 제출</button>
<button type="button" class="sds-btn sds-btn--outline">임시저장</button>
<button type="button" class="sds-btn sds-btn--secondary">취소</button>
<button type="button" class="sds-btn sds-btn--ghost">더보기</button>
<button type="button" class="sds-btn sds-btn--destructive">삭제</button>
<button type="button" class="sds-btn sds-btn--primary" disabled>비활성</button>`}
        >
          <Button>신청서 제출</Button>
          <Button variant="outline">임시저장</Button>
          <Button variant="secondary">취소</Button>
          <Button variant="ghost">더보기</Button>
          <Button variant="destructive">삭제</Button>
          <Button disabled>비활성</Button>
        </Markup>
        <Example code={`<Button size="sm" /> <Button /> <Button size="lg" /> <Button size="icon" />`}>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="새 신청서 작성">
            <Icon name="add" />
          </Button>
        </Example>
        <Spec
          head={['variant', '언제 쓰나', '한 화면 최대']}
          rows={[
            ['default', '화면의 목표를 완료시키는 단 하나의 행동', '1개'],
            ['outline', '대안이 되는 주요 행동(임시저장, 미리보기)', '2개'],
            ['secondary', '취소 · 닫기 등 되돌아가는 행동', '제한 없음'],
            ['ghost', '목록 내 보조 행동, 아이콘 버튼', '제한 없음'],
            ['destructive', '삭제 · 반려. 반드시 확인 단계 동반', '1개'],
          ]}
        />
        <PropsTable
          name="Button"
          rows={[
            { name: 'variant', type: "'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'", def: "'default'", desc: '강조 수준. 한 화면의 default 는 1개입니다.' },
            { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", def: "'default'", desc: '높이 40 / 32 / 48 / 정사각 40px.' },
            { name: 'asChild', type: 'boolean', def: 'false', desc: '자식 요소를 버튼으로 씁니다. 링크를 버튼처럼 보이게 할 때.' },
            { name: 'disabled', type: 'boolean', def: 'false', desc: '비활성. 이유를 툴팁이나 도움말로 알려 주세요.' },
            { name: 'aria-label', type: 'string', desc: '아이콘만 있는 버튼에 필수. 없으면 스크린리더가 침묵합니다.' },
          ]}
        />
        <Sub title="상태">
          <P>
            상태는 컴포넌트가 스스로 책임집니다. 화면 코드에서 색을 덮어쓰지 마세요.
            아래는 각 상태를 <b>강제로 렌더링</b>한 것이라 마우스를 올리지 않아도 비교할 수 있습니다.
          </P>
          <StateMatrix
            name="Button"
            rows={[
              {
                state: '기본',
                preview: <span className="inline-flex h-10 items-center rounded-sm bg-fill-accent px-4 text-sm font-bold text-text-inverse">신청서 제출</span>,
                token: 'fill-accent',
                when: '평상시',
              },
              {
                state: '호버',
                preview: <span className="inline-flex h-10 items-center rounded-sm bg-fill-accent-hover px-4 text-sm font-bold text-text-inverse">신청서 제출</span>,
                token: 'fill-accent-hover',
                when: '마우스를 올렸을 때. 터치 기기에는 없는 상태입니다.',
              },
              {
                state: '누름',
                preview: <span className="inline-flex h-10 items-center rounded-sm bg-fill-accent-pressed px-4 text-sm font-bold text-text-inverse">신청서 제출</span>,
                token: 'fill-accent-pressed',
                when: '누르고 있는 동안',
              },
              {
                state: '포커스',
                preview: <span className="inline-flex h-10 items-center rounded-sm bg-fill-accent px-4 text-sm font-bold text-text-inverse outline-2 outline-offset-2 outline-border-focus">신청서 제출</span>,
                token: 'border-focus',
                when: '키보드로 이동했을 때. 마우스 클릭에는 나타나지 않습니다(:focus-visible).',
              },
              {
                state: '비활성',
                /* 실제 disabled 버튼으로 둡니다. 비활성 컨트롤은 WCAG 1.4.3 대비 예외이며,
                   span 으로 흉내 내면 검사 도구가 예외를 인식하지 못합니다. */
                preview: <Button disabled>신청서 제출</Button>,
                token: 'fill-disabled · text-disabled',
                when: '조건이 갖춰지지 않았을 때. 왜 못 누르는지 반드시 함께 알려 줍니다.',
              },
            ]}
          />
        </Sub>
        <DoDont
          do={<>레이블은 동사로 씁니다. 버튼만 읽고도 무엇이 일어나는지 알 수 있어야 합니다 — “신청서 제출”.</>}
          dont={<>“확인”, “예/아니오”처럼 결과를 알 수 없는 레이블을 쓰지 않습니다.</>}
        />
      </Section>

      <Section id="link" title="Link" krds="액션 > 링크">
        <P>
          새 창으로 열리는 링크는 반드시 그 사실을 알립니다. 공공 서비스에서는 예고 없는 새 창이
          접근성 위반입니다.
        </P>
        <Example
          code={`<a href="…" target="_blank" rel="noopener noreferrer">
  법령 원문 <span className="sr-only">(새 창 열림)</span>
</a>`}
        >
          <a className="text-text-accent underline underline-offset-2" href="#link">
            같은 창에서 열기
          </a>
          <a className="text-text-accent underline underline-offset-2" href="#link">
            법령 원문 <span className="text-xs text-text-tertiary">(새 창 열림)</span>
          </a>
        </Example>
      </Section>

      {/* ------------------------------------------------------------ 입력 */}
      <Section id="text-field" title="Text Field" krds="입력 > 텍스트 입력 필드">
        <P>라벨은 항상 필드 위에 둡니다. 플레이스홀더로 라벨을 대신하지 않습니다.</P>
        <Markup
          block
          react={`<TextField label="사업자등록번호" required hint="하이픈 없이 숫자만 입력해도 됩니다." />
<TextField label="담당자 이메일" error="이메일 형식이 올바르지 않습니다. 예: hong@solideos.com" />`}
          html={`<div class="sds-field">
  <label class="sds-label" for="biz">
    사업자등록번호<span class="sds-required" aria-hidden="true">*</span>
  </label>
  <input class="sds-input" id="biz" required aria-describedby="biz-hint" placeholder="000-00-00000">
  <p class="sds-hint" id="biz-hint">하이픈 없이 숫자만 입력해도 됩니다.</p>
</div>

<div class="sds-field">
  <label class="sds-label" for="mail">담당자 이메일</label>
  <input class="sds-input" id="mail" value="hong@" aria-invalid="true" aria-describedby="mail-err">
  <p class="sds-error" id="mail-err">이메일 형식이 올바르지 않습니다. 예: hong@solideos.com</p>
</div>`}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label="사업자등록번호"
              required
              placeholder="000-00-00000"
              hint="하이픈 없이 숫자만 입력해도 됩니다."
            />
            <TextField
              label="담당자 이메일"
              defaultValue="hong@"
              error="이메일 형식이 올바르지 않습니다. 예: hong@solideos.com"
            />
          </div>
        </Markup>
      </Section>

        <PropsTable
          name="TextField"
          rows={[
            { name: 'label', type: 'ReactNode', required: true, desc: '접근 가능한 이름. id 연결을 컴포넌트가 처리합니다.' },
            { name: 'hint', type: 'ReactNode', desc: '도움말. aria-describedby 로 연결됩니다.' },
            { name: 'error', type: 'ReactNode', desc: '오류 메시지. 지정하면 aria-invalid 가 켜지고 테두리가 바뀝니다.' },
            { name: 'required', type: 'boolean', def: 'false', desc: '필수 표시(*) 와 required 속성을 함께 붙입니다.' },
            { name: '…rest', type: 'InputHTMLAttributes', desc: 'placeholder · maxLength · inputMode 등 input 속성을 그대로 전달합니다.' },
          ]}
        />
        <Sub title="상태">
          <StateMatrix
            name="Text Field"
            rows={[
              {
                state: '기본',
                preview: <span className="inline-flex h-10 w-48 items-center rounded-sm border border-border-strong bg-bg-primary px-3 text-sm text-text-tertiary">000-00-00000</span>,
                token: 'border-strong',
                when: '평상시. 테두리는 흰 배경 대비 3:1 을 만족합니다.',
              },
              {
                state: '포커스',
                preview: <span className="inline-flex h-10 w-48 items-center rounded-sm border border-border-strong bg-bg-primary px-3 text-sm outline-2 outline-offset-2 outline-border-focus">123-45-67890</span>,
                token: 'border-focus',
                when: '입력 중',
              },
              {
                state: '오류',
                preview: <span className="inline-flex h-10 w-48 items-center rounded-sm border border-border-critical bg-bg-primary px-3 text-sm">hong@</span>,
                token: 'border-critical',
                when: 'aria-invalid="true" 일 때. 메시지를 아래에 함께 둡니다.',
              },
              {
                state: '비활성',
                preview: <Input disabled defaultValue="ORG-0142" className="w-48" aria-label="기관 코드 (수정 불가)" />,
                token: 'fill-secondary · text-disabled',
                when: '수정할 수 없는 값. 읽기 전용이면 테두리를 없애는 것도 고려합니다.',
              },
            ]}
          />
        </Sub>
      <Section id="textarea" title="Textarea" krds="입력 > 텍스트 영역">
        <ExampleBlock>
          <TextareaField
            label="신청 사유"
            rows={4}
            placeholder="500자 이내로 작성해 주세요"
            hint="0 / 500자"
            className="max-w-md"
          />
        </ExampleBlock>
        <P>글자 수 제한이 있으면 현재 입력량을 항상 보여 줍니다. 제한 도달 후 잘라내지 않습니다.</P>
      </Section>

      <Section id="select" title="Select" krds="입력 > 셀렉트">
        <ExampleBlock>
          <SelectField label="사업 분야" className="max-w-xs">
            {(a11y) => (
              <Select>
                <SelectTrigger {...a11y}>
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gov">플랫폼정부</SelectItem>
                  <SelectItem value="data">데이터 플랫폼</SelectItem>
                  <SelectItem value="smart">스마트 솔루션</SelectItem>
                </SelectContent>
              </Select>
            )}
          </SelectField>
        </ExampleBlock>
        <P>
          선택지가 5개를 넘으면 Select, 2~4개면 Radio, 다중 선택이면 Checkbox를 씁니다. 20개를 넘으면
          검색 가능한 Combobox로 전환합니다.
        </P>
      </Section>

      <Section id="date-picker" title="Date Picker" status="todo" krds="입력 > 날짜 입력">
        <P>
          아직 정의되지 않았습니다. 확정 전까지는 <Code>&lt;Input type=&quot;date&quot; /&gt;</Code>를 쓰고,
          기간은 시작일 · 종료일 두 필드로 분리해 주세요.
        </P>
      </Section>

      <Section id="icon" title="Icon">
        <P>
          Material Symbols 를 인라인으로 렌더링합니다. 전체 목록은{' '}
          <Code>Foundations › Iconography</Code> 갤러리에서 볼 수 있습니다.
        </P>
        <Markup
          react={`<Icon name="search" />                  // 장식 (aria-hidden 자동)
<Icon name="close" label="닫기" />       // 의미 전달 (role="img")
<Icon name="download" size="lg" />`}
        >
          <Icon name="search" size="lg" />
          <Icon name="download" size="lg" />
          <Icon name="verified" size="lg" />
        </Markup>
        <PropsTable
          name="Icon"
          rows={[
            { name: 'name', type: 'IconName', required: true, desc: '아이콘 이름. Foundations › Iconography 갤러리에서 고릅니다.' },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | number", def: "'md'", desc: '16 / 20 / 24 / 32px 또는 직접 지정.' },
            { name: 'label', type: 'string', desc: '지정하면 role="img" 와 <title>이 붙습니다. 생략하면 aria-hidden 처리됩니다.' },
          ]}
        />
      </Section>

      <Section id="masked-input" title="Masked Input" krds="입력 > 개인정보 입력">
        <P>
          주민등록번호 뒷자리 · 계좌번호처럼 <b>어깨너머 노출은 막아야 하지만 비밀번호는 아닌</b> 값에
          씁니다.
        </P>
        <ExampleBlock>
          <MaskedInput
            label="주민등록번호 뒤 7자리"
            className="max-w-xs"
            placeholder="0000000"
            maxLength={7}
            hint="입력한 값은 표시 버튼으로 확인할 수 있습니다."
          />
        </ExampleBlock>
        <P>
          <Code>type=&quot;password&quot;</Code> 를 쓰지 않는 이유는 두 가지입니다. 비밀번호 관리자가
          주민등록번호를 저장해 버리고, 이를 막으려 <Code>autocomplete=&quot;off&quot;</Code> 를 붙이면
          WCAG 3.3.8 검사에서 지적됩니다. 애초에 인증 수단이 아니므로 password 시맨틱이 틀렸습니다.
        </P>
        <List
          items={[
            '실제 값은 컴포넌트 상태에만 있고 DOM value 에는 마스킹된 문자열이 들어갑니다.',
            '이용자가 자기가 입력한 값을 확인할 수 있도록 표시 토글을 함께 둡니다.',
            <>토글 버튼에 <Code>aria-pressed</Code> 와 상태별 <Code>aria-label</Code> 을 지정합니다.</>,
          ]}
        />
      </Section>

      <Section id="file-upload" title="File Upload" status="wip" krds="입력 > 파일 업로드">
        <ExampleBlock>
          <div className="grid max-w-md gap-2">
            <Label htmlFor="file">사업계획서</Label>
            <div className="flex items-center gap-2">
              <Input id="file" type="file" className="cursor-pointer" aria-describedby="file-help" />
              <Button variant="outline" size="icon" aria-label="파일 선택">
                <Icon name="upload" />
              </Button>
            </div>
            <p id="file-help" className="text-xs text-text-tertiary">
              PDF · HWP · DOCX · 최대 20MB. 개인정보가 포함된 문서는 마스킹 후 첨부해 주세요.
            </p>
          </div>
        </ExampleBlock>
        <P>업로드 전에 형식 · 용량 · 보관 기간을 명시합니다. 실패 시 어느 파일이 왜 실패했는지 알립니다.</P>
      </Section>

      {/* ------------------------------------------------------------ 선택 */}
      <Section id="checkbox" title="Checkbox" krds="선택 > 체크박스">
        <Markup
          block
          html={`<div class="sds-choice">
  <input class="sds-checkbox" type="checkbox" id="agree1" checked>
  <label for="agree1">개인정보 수집 · 이용에 동의합니다</label>
  <span class="sds-badge sds-badge--critical">필수</span>
</div>
<div class="sds-choice">
  <input class="sds-checkbox" type="checkbox" id="agree2">
  <label for="agree2">마케팅 정보 수신에 동의합니다</label>
  <span class="sds-badge">선택</span>
</div>`}
        >
          <div className="space-y-3">
            <CheckboxField
              label="개인정보 수집 · 이용에 동의합니다"
              defaultChecked
              trailing={<Badge className="bg-fill-critical-subtle text-text-critical">필수</Badge>}
            />
            <CheckboxField
              label="마케팅 정보 수신에 동의합니다"
              trailing={<Badge variant="secondary">선택</Badge>}
            />
          </div>
        </Markup>
        <Callout>
          체크박스의 <b>시각 크기는 16px 이지만 클릭 대상은 24px</b> 입니다(WCAG 2.5.8 AA).
          보이지 않는 영역을 <Code>::before</Code> 로 넓혔고, 레이블에 <Code>htmlFor</Code> 가
          걸려 있어 실제 대상은 더 넓습니다. 시각 크기를 키우면 촘촘한 목록에서 답답해지므로
          이렇게 분리했습니다.
        </Callout>
        <DoDont
          do="필수와 선택을 시각적으로 구분하고, 각각 개별 체크할 수 있게 합니다."
          dont="선택 항목을 기본 체크 상태로 두지 않습니다."
        />
      </Section>

      <Section id="radio" title="Radio Button" krds="선택 > 라디오 버튼">
        <ExampleBlock>
          <RadioGroup defaultValue="org" className="flex gap-6">
            {[['org', '기관'], ['person', '개인'], ['corp', '법인']].map(([v, l]) => (
              <RadioField key={v} value={v} label={l} />
            ))}
          </RadioGroup>
        </ExampleBlock>
        <P>
          기본 선택값을 두는 것을 원칙으로 하되, 선택 자체가 중요한 판단(동의 여부 등)이라면 비워 둡니다.
        </P>
      </Section>

      <Section id="switch" title="Switch" krds="설정 > 스위치">
        <Markup
          html={`<label class="sds-switch">
  <input type="checkbox" role="switch" checked>
  <span class="sds-switch__track"></span>
  알림 받기
</label>`}
        >
          <SwitchField label="알림 받기" defaultChecked />
          <SwitchField label="자동 임시저장" />
        </Markup>
        <P>
          Switch는 <b>즉시 적용</b>되는 설정에만 씁니다. 저장 버튼을 눌러야 반영되는 값에는 Checkbox를 씁니다.
        </P>
      </Section>

      <Section id="chip" title="Chip" krds="선택 > 칩">
        <Example>
          {['승인', '검토중', '반려'].map((t, i) => (
            <Button key={t} variant={i === 0 ? 'default' : 'outline'} size="sm" className="rounded-full">
              {t}
            </Button>
          ))}
        </Example>
        <P>Chip은 필터 등 누를 수 있는 요소입니다. 단순 상태 표시는 Badge를 씁니다.</P>
      </Section>

      {/* ------------------------------------------------------------ 탐색 */}
      <Section id="top-navigation" title="Top Navigation" krds="탐색 > 메인 메뉴">
        <P>
          서비스 대분류를 항상 노출하고 현재 위치를 강조합니다. 1depth는 4~6개로 제한하며, 그 이상이
          필요하면 정보구조를 다시 봐야 합니다. 이 사이트 상단이 그 구현입니다.
        </P>
      </Section>

      <Section id="side-navigation" title="Side Navigation" krds="탐색 > 사이드 메뉴">
        <P>
          현재 대분류의 하위 페이지만 노출합니다. 현재 항목은 배경으로 강조하고, 스크롤에 따라 자동으로
          따라갑니다. 이 페이지 좌측이 그 구현입니다.
        </P>
      </Section>

      <Section id="breadcrumb" title="Breadcrumb" krds="탐색 > 브레드크럼">
        <Markup
          react={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">홈</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>신청 상세</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
          html={`<nav class="sds-breadcrumb" aria-label="현재 위치">
  <a href="/">홈</a>
  <span class="sds-breadcrumb__sep" aria-hidden="true">›</span>
  <a href="/apply">사업 신청</a>
  <span class="sds-breadcrumb__sep" aria-hidden="true">›</span>
  <span aria-current="page">신청 상세</span>
</nav>`}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#breadcrumb">홈</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#breadcrumb">사업 신청</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>신청 상세</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Markup>
        <P>3depth 이상 진입 시 필수입니다. 마지막 항목은 링크로 만들지 않습니다.</P>
      </Section>

      <Section id="tab" title="Tab" krds="탐색 > 탭">
        <ExampleBlock>
          <Tabs defaultValue="gov">
            <TabsList>
              <TabsTrigger value="gov">플랫폼정부</TabsTrigger>
              <TabsTrigger value="data">데이터 플랫폼</TabsTrigger>
              <TabsTrigger value="smart">스마트 솔루션</TabsTrigger>
            </TabsList>
            <TabsContent value="gov" className="pt-4 text-sm text-text-secondary">
              행정정보시스템 구축 · 운영
            </TabsContent>
            <TabsContent value="data" className="pt-4 text-sm text-text-secondary">JADOit · PINO</TabsContent>
            <TabsContent value="smart" className="pt-4 text-sm text-text-secondary">
              NSPACE · Acropolis SG · ArchiBIM · ArchiVIEW NX
            </TabsContent>
          </Tabs>
        </ExampleBlock>
        <P>
          Radix 구현이라 좌우 화살표 이동 · 포커스 관리가 기본 제공됩니다. 탭 전환은 URL에 반영해
          새로고침과 뒤로가기에서도 유지하는 것을 권장합니다.
        </P>
      </Section>

      <Section id="pagination" title="Pagination" krds="탐색 > 페이지네이션">
        <Markup
          block
          html={`<nav aria-label="페이지 이동">
  <ul class="sds-pagination">
    <li><a href="?page=1" aria-label="이전 페이지">‹</a></li>
    <li><a href="?page=1" aria-current="page">1</a></li>
    <li><a href="?page=2">2</a></li>
    <li><a href="?page=3">3</a></li>
    <li><a href="?page=2" aria-label="다음 페이지">›</a></li>
  </ul>
</nav>`}
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#pagination" onClick={() => setPage((p) => Math.max(1, p - 1))} />
              </PaginationItem>
              {[1, 2, 3, 4].map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink href="#pagination" isActive={page === n} onClick={() => setPage(n)}>
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#pagination" onClick={() => setPage((p) => Math.min(4, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Markup>
        <P>기본 20건입니다. 상세 화면에서 목록으로 돌아올 때 페이지 번호를 유지합니다.</P>
      </Section>

      <Section id="skip-link" title="Skip Link" krds="탐색 > 건너뛰기 링크">
        <P>
          키보드 이용자가 반복되는 내비게이션을 건너뛰고 본문으로 바로 이동합니다. 모든 페이지의
          <b> 첫 번째 포커스 대상</b>이어야 합니다. 지금 이 사이트에서 Tab 키를 눌러 보세요.
        </P>
        <Example code={`<a href="#main" className="sr-only focus:not-sr-only …">본문 바로가기</a>`}>
          <span className="rounded-sm bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
            본문 바로가기
          </span>
        </Example>
      </Section>

      {/* -------------------------------------------------------- 피드백 */}
      <Section id="alert" title="Alert" krds="피드백 > 알림">
        <Markup
          block
          html={`<div class="sds-alert">
  <div>
    <p class="sds-alert__title">제출 마감 안내</p>
    <p class="sds-alert__body">제출 마감은 2026년 10월 31일(금) 18:00입니다.</p>
  </div>
</div>

<div class="sds-alert sds-alert--critical" role="alert">
  <div>
    <p class="sds-alert__title">입력 확인 필요</p>
    <p class="sds-alert__body">필수 항목 3개가 입력되지 않았습니다.</p>
  </div>
</div>`}
        >
          <div className="space-y-3">
            <Alert className="border-l-4 border-l-blue-500 bg-fill-info-subtle">
              <Icon name="info" className="size-4" />
              <AlertTitle>제출 마감 안내</AlertTitle>
              <AlertDescription>제출 마감은 2026년 10월 31일(금) 18:00입니다.</AlertDescription>
            </Alert>
            <Alert className="border-l-4 border-l-green-500 bg-fill-positive-subtle">
              <AlertTitle>접수 완료</AlertTitle>
              <AlertDescription>신청서가 정상 접수되었습니다. 접수번호 2026-0142</AlertDescription>
            </Alert>
            <Alert role="alert" className="border-l-4 border-l-red-500 bg-fill-critical-subtle">
              <AlertTitle className="text-text-critical">입력 확인 필요</AlertTitle>
              <AlertDescription>필수 항목 3개가 입력되지 않았습니다.</AlertDescription>
            </Alert>
          </div>
        </Markup>
        <Callout>
          오류 알림에는 <Code>role=&quot;alert&quot;</Code>를 붙여 보조기기가 즉시 낭독하도록 합니다.
        </Callout>
      </Section>

      <Section id="toast" title="Toast" krds="피드백 > 토스트">
        <Example code={`toast.success('임시저장되었습니다', { description: '2026.09.08 14:32' })`}>
          <Button variant="outline" onClick={() => toast.success('임시저장되었습니다', { description: '2026.09.08 14:32' })}>
            성공 토스트
          </Button>
          <Button variant="outline" onClick={() => toast.error('첨부파일 용량을 초과했습니다', { description: '최대 20MB · 현재 24MB' })}>
            오류 토스트
          </Button>
        </Example>
        <P>
          토스트는 4초 후 사라집니다. <b>놓치면 안 되는 정보는 토스트로 전달하지 않습니다</b> — 오류와
          확인은 Alert 또는 Modal을 씁니다.
        </P>
      </Section>

      <Section id="modal" title="Modal" krds="피드백 > 모달">
        <Markup
          html={`<!-- <dialog> 를 쓰면 브라우저가 포커스 트랩 · Esc 닫기 · 배경 비활성화를 처리합니다 -->
<button type="button" class="sds-btn sds-btn--destructive" onclick="dlg.showModal()">
  신청서 삭제
</button>

<dialog id="dlg" class="sds-modal" aria-labelledby="dlg-title">
  <h2 class="sds-modal__title" id="dlg-title">신청서를 삭제할까요?</h2>
  <p class="sds-modal__body">삭제한 신청서는 복구할 수 없습니다. 접수번호 2026-0142</p>
  <div class="sds-modal__actions">
    <button type="button" class="sds-btn sds-btn--secondary" onclick="dlg.close()">취소</button>
    <button type="button" class="sds-btn sds-btn--destructive" onclick="dlg.close()">삭제</button>
  </div>
</dialog>`}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">신청서 삭제</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>신청서를 삭제할까요?</DialogTitle>
                <DialogDescription>
                  삭제한 신청서는 복구할 수 없습니다. 접수번호 2026-0142
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="secondary">취소</Button></DialogClose>
                <DialogClose asChild><Button variant="destructive">삭제</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Markup>
        <DoDont
          do="Esc로 닫히고, 포커스를 모달 안에 가두며, 닫을 때 원래 위치로 포커스를 되돌립니다. Radix가 기본 처리합니다."
          dont="모달 위에 또 다른 모달을 띄우지 않습니다. 버튼 레이블에 '예/아니오'를 쓰지 않습니다."
        />
      </Section>

      <Section id="progress" title="Progress" krds="피드백 > 진행 표시">
        <ExampleBlock>
          <div className="max-w-sm space-y-2">
            <Progress value={62} aria-label="신청서 작성 진행률" />
            <p className="text-xs text-text-tertiary">3단계 중 2단계 · 62% 완료</p>
          </div>
        </ExampleBlock>
        <P>진행률은 숫자와 함께 제공합니다. 남은 단계를 알 수 없을 때는 Skeleton을 씁니다.</P>
      </Section>

      <Section id="skeleton" title="Skeleton" krds="피드백 > 스켈레톤">
        <ExampleBlock>
          <div className="max-w-sm space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </ExampleBlock>
        <Spec
          head={['대기 시간', '처리']}
          rows={[
            ['~ 300ms', '아무것도 표시하지 않음 (깜빡임 방지)'],
            ['300ms ~ 2s', '스켈레톤'],
            ['2s ~ 10s', '스켈레톤 + “불러오는 중입니다” 텍스트'],
            ['10s 초과', '진행률 + 예상 시간 + 취소 수단'],
          ]}
        />
      </Section>

      {/* ------------------------------------------------ 레이아웃 및 표현 */}
      <Section id="card" title="Card" krds="레이아웃 및 표현 > 카드">
        <Example>
          <Card className="w-72 gap-0 rounded-md p-5 shadow-none">
            <p className="font-mono text-xs text-text-tertiary">2026-0142</p>
            <p className="my-2 font-bold">행정정보 통합 플랫폼 구축</p>
            <p className="text-sm text-text-secondary">제출일 2026.09.01 · 정보서비스본부</p>
            <p className="mt-3">
              <Badge className="bg-fill-positive-subtle text-text-positive">승인</Badge>
            </p>
          </Card>
        </Example>
        <P>카드 전체를 링크로 만들 때는 카드 안에 또 다른 링크나 버튼을 두지 않습니다.</P>
      </Section>

      <Section id="table" title="Table" krds="콘텐츠 > 표">
        <P>행정 · 데이터 업무의 핵심 컴포넌트입니다. 숫자는 우측 정렬 + 고정폭 숫자를 씁니다.</P>
        <Markup
          block
          html={`<div class="sds-table-wrap" tabindex="0" role="region" aria-label="신청 목록">
  <table class="sds-table">
    <caption class="sds-sr-only">신청 목록</caption>
    <thead>
      <tr>
        <th scope="col">신청번호</th>
        <th scope="col">사업명</th>
        <th scope="col">상태</th>
        <th scope="col" class="sds-num">금액(원)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2026-0142</td>
        <td>행정정보 통합 플랫폼</td>
        <td><span class="sds-badge sds-badge--positive">승인</span></td>
        <td class="sds-num">1,240,000</td>
      </tr>
    </tbody>
  </table>
</div>`}
        >
          <div className="rounded-md border border-border bg-background">
            <Table scrollLabel="신청 목록">
              <TableCaption className="sr-only">신청 목록</TableCaption>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead scope="col">신청번호</TableHead>
                  <TableHead scope="col">사업명</TableHead>
                  <TableHead scope="col">상태</TableHead>
                  <TableHead scope="col" className="text-right">금액(원)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ['2026-0142', '행정정보 통합 플랫폼', '승인', '1,240,000', 'positive'],
                  ['2026-0143', '부동산 빅데이터 분석', '검토중', '860,000', 'caution'],
                  ['2026-0144', '전자증명서 유통', '반려', '0', 'critical'],
                ].map(([no, name, st, amt, tone]) => (
                  <TableRow key={no}>
                    <TableCell className="font-mono text-xs">{no}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      <Badge className={`bg-fill-${tone}-subtle text-text-${tone}`}>{st}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{amt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Markup>
        <Callout>
          넓은 표는 <b>키보드만 쓰는 이용자도 가로 스크롤할 수 있어야</b> 합니다(WCAG 2.1.1).
          Table 이 내부적으로 <Code>Scrollable</Code> 을 써서 <b>실제로 넘칠 때만</b> 탭 정지점을
          만듭니다. 항상 <Code>tabindex=&quot;0&quot;</Code> 을 붙이면 스크롤이 필요 없을 때도 탭
          정지점이 늘어 오히려 방해가 되기 때문입니다. <Code>scrollLabel</Code> 로 영역 이름을
          지정하세요.
        </Callout>
        <DoDont
          do={<>열 제목에 <Code>scope=&quot;col&quot;</Code>을, 표 전체에 <Code>caption</Code>을 둡니다.</>}
          dont="레이아웃 목적으로 표를 쓰지 않습니다."
        />
      </Section>

      <Section id="accordion" title="Accordion" krds="레이아웃 및 표현 > 아코디언">
        <ExampleBlock>
          <Accordion type="single" collapsible className="max-w-xl">
            <AccordionItem value="a">
              <AccordionTrigger>제출 후에도 수정할 수 있나요?</AccordionTrigger>
              <AccordionContent>
                제출한 신청서는 수정할 수 없습니다. 수정이 필요하면 담당자에게 반려를 요청해 주세요.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>첨부파일 형식과 용량은 어떻게 되나요?</AccordionTrigger>
              <AccordionContent>PDF · HWP · DOCX 형식으로 최대 20MB까지 첨부할 수 있습니다.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </ExampleBlock>
        <P>기본은 모두 접힌 상태입니다. 아코디언 안에 필수 입력 항목을 숨기지 않습니다.</P>
      </Section>

      <Section id="badge" title="Badge" krds="콘텐츠 > 뱃지">
        <Markup
          html={`<span class="sds-badge sds-badge--accent">신규</span>
<span class="sds-badge sds-badge--positive">승인</span>
<span class="sds-badge sds-badge--caution">검토중</span>
<span class="sds-badge sds-badge--critical">반려</span>
<span class="sds-badge">마감</span>`}
        >
          <Badge>신규</Badge>
          <Badge className="bg-fill-positive-subtle text-text-positive">승인</Badge>
          <Badge className="bg-fill-caution-subtle text-text-caution">검토중</Badge>
          <Badge className="bg-fill-critical-subtle text-text-critical">반려</Badge>
          <Badge variant="secondary">마감</Badge>
          <Badge variant="outline">선택</Badge>
        </Markup>
        <P>색만으로 상태를 전달하지 않도록 반드시 텍스트를 함께 넣습니다.</P>
      </Section>

      <Section id="separator" title="Separator" krds="레이아웃 및 표현 > 구분선">
        <ExampleBlock>
          <div className="max-w-sm">
            <p className="text-sm text-text-secondary">신청 정보</p>
            <Separator className="my-4" />
            <p className="text-sm text-text-secondary">담당자 정보</p>
          </div>
        </ExampleBlock>
        <P>여백만으로 구분이 충분하다면 구분선을 쓰지 않습니다. 선은 여백보다 강한 신호입니다.</P>
      </Section>


      {/* ===================================================== KRDS 전용 */}
      <Section id="critical-alert" title="Critical Alert" krds="레이아웃 및 표현 > 긴급 공지">
        <P>
          본문 최상단에 고정되어 긴급하거나 중요한 정보를 전달합니다. 모든 공공 서비스가 같은
          컴포넌트를 쓰면 이용자는 긴급 정보를 일관되고 예측 가능한 방식으로 찾을 수 있습니다.
        </P>
        <ExampleBlock>
          <div className="space-y-3">
            <CriticalAlert tone="critical" title="시스템 점검 안내">
              9월 10일(목) 02:00 ~ 04:00 신청 서비스를 이용할 수 없습니다.
            </CriticalAlert>
            <CriticalAlert tone="caution" title="제출 마감 임박">
              신청 마감까지 2일 남았습니다.
            </CriticalAlert>
          </div>
        </ExampleBlock>
        <List
          items={[
            '화면당 1개만 제공합니다. 여러 개를 쌓으면 어느 것도 읽히지 않습니다.',
            <>색만으로 긴급도를 전달하지 않고 아이콘과 텍스트를 함께 둡니다. 스크린리더에는 <Code>긴급 공지.</Code> 처럼 접두사를 읽어 줍니다.</>,
            '토스트와 달리 자동으로 사라지지 않습니다. 닫기를 제공하더라도 다시 열 경로를 남깁니다.',
          ]}
        />
      </Section>

      <Section id="step-indicator" title="Step Indicator" krds="피드백 > 단계 표시기">
        <P>여러 단계를 거치는 과업에서 지금 어디까지 왔는지 알려 줍니다.</P>
        <ExampleBlock>
          <StepIndicator steps={['자격 확인', '동의', '정보 입력', '첨부', '확인']} current={2} />
        </ExampleBlock>
        <List
          items={[
            <>현재 단계를 <Code>aria-current=&quot;step&quot;</Code> 으로 알립니다.</>,
            '색·굵기만으로 현재 단계를 구분하지 않고 텍스트로도 알립니다.',
            '전체 단계 수와 현재 위치를 문장으로 함께 제공합니다 — "전체 5단계 중 3단계".',
            '완료·현재 상태를 숨김 텍스트로 보조기기에 전달합니다.',
          ]}
        />
      </Section>

      <Section id="structured-list" title="Structured List" krds="레이아웃 및 표현 > 구조화 목록">
        <P>
          표보다 유연하고 카드보다 정보 밀도가 높은 목록입니다. 목록 항목에서 상세로 이동하는
          행정 화면의 기본형입니다.
        </P>
        <ExampleBlock>
          <StructuredList
            label="신청 목록"
            items={[
              {
                title: '행정정보 통합 플랫폼 구축',
                desc: '정보서비스본부 · 2026년 정보화사업',
                meta: ['2026-0142', '제출 2026.09.01', '1,240,000원'],
                status: { label: '승인', tone: 'positive' },
                href: '#structured-list',
              },
              {
                title: '부동산 빅데이터 분석 고도화',
                desc: '데이터사업팀 · 2026년 정보화사업',
                meta: ['2026-0143', '제출 2026.09.03', '860,000원'],
                status: { label: '검토중', tone: 'caution' },
                href: '#structured-list',
              },
            ]}
          />
        </ExampleBlock>
        <DoDont
          do={<>목록임이 전달되도록 <Code>&lt;ul&gt;</Code> · <Code>&lt;li&gt;</Code> 로 마크업하고 목록에 이름을 붙입니다.</>}
          dont="레이아웃 목적으로 표를 쓰지 않습니다. 항목 전체가 링크라면 내부에 또 다른 링크·버튼을 두지 않습니다."
        />
      </Section>

      <Section id="spinner" title="Spinner" krds="피드백 > 스피너">
        <ExampleBlock>
          <Spinner label="신청 내역을 불러오는 중입니다" />
        </ExampleBlock>
        <List
          items={[
            '무엇을 처리 중인지 텍스트로 함께 알립니다. 회전 아이콘만으로는 아무 정보도 전달되지 않습니다.',
            <><Code>role=&quot;status&quot;</Code> 로 스크린리더가 변화를 인지하게 합니다.</>,
            <><Code>prefers-reduced-motion</Code> 을 존중해 회전을 멈춥니다.</>,
          ]}
        />
      </Section>

      <Section id="snackbar" title="Snackbar" krds="모바일 > 스낵바">
        <P>처리 결과를 알리면서 <b>되돌릴 기회</b>를 줍니다. 토스트와의 차이가 여기에 있습니다.</P>
        <ExampleBlock>
          <Snackbar
            message="신청서를 임시저장했습니다."
            actionLabel="되돌리기"
            onAction={() => toast('되돌렸습니다')}
          />
        </ExampleBlock>
        <Spec
          head={['구분', '토스트', '스낵바']}
          rows={[
            ['목적', '알림만', '알림 + 행동'],
            ['행동', '없음', '되돌리기 등 1개'],
            ['지속', '4초 자동 소멸', '행동이 있으면 더 길게'],
            ['중첩', '금지', '금지 (화면당 1개)'],
          ]}
        />
      </Section>

      <Section id="visually-hidden" title="Visually Hidden" krds="콘텐츠 > 숨긴 콘텐츠">
        <P>
          화면에는 보이지 않지만 스크린리더에는 읽히는 텍스트입니다. 아이콘만 있는 버튼의 이름,
          표의 캡션, 상태 접두사 등에 씁니다.
        </P>
        <Example
          code={`<VisuallyHidden>(새 창 열림)</VisuallyHidden>

/* 포커스를 받아야 하는 경우 - 건너뛰기 링크 */
<VisuallyHidden focusable>
  <a href="#main">본문 바로가기</a>
</VisuallyHidden>`}
        >
          <p className="text-sm text-text-secondary">
            이 문장 뒤에 숨은 텍스트가 있습니다
            <VisuallyHidden> — 스크린리더에는 이 부분도 읽힙니다.</VisuallyHidden>
          </p>
        </Example>
        <DoDont
          do={<>클리핑 방식으로 숨깁니다. 크기를 1px 로 두고 <Code>clip-path</Code> 로 잘라냅니다.</>}
          dont={<><Code>display:none</Code> · <Code>visibility:hidden</Code> 은 스크린리더도 읽지 못합니다. 숨김 목적으로 쓰지 않습니다.</>}
        />
      </Section>

      <Section id="in-page-nav" title="In-page Navigation" krds="탐색 > 콘텐츠 내 탐색">
        <P>
          본문의 목차입니다. 스크롤에 따라 현재 위치를 표시하고, 항목을 누르면 해당 섹션으로
          이동합니다. 이 페이지 우측이 그 구현입니다.
        </P>
        <List
          items={[
            <><Code>&lt;nav&gt;</Code> 로 감싸고 이름을 붙입니다.</>,
            <>현재 항목을 <Code>aria-current=&quot;true&quot;</Code> 로 알립니다.</>,
            '목차로 이동해도 브라우저 뒤로가기가 동작해야 합니다.',
            '항목이 2개 이하면 목차를 제공하지 않습니다.',
          ]}
        />
      </Section>

      <Section id="disclosure" title="Disclosure" krds="레이아웃 및 표현 > 디스클로저">
        <P>
          부가 정보를 접었다 펴는 가장 단순한 형태입니다. 아코디언과 달리 <b>항목이 하나</b>이며
          서로 배타적이지 않습니다.
        </P>
        <ExampleBlock>
          <details className="rounded-md border border-border px-5 py-4">
            <summary className="cursor-pointer text-sm font-bold">
              첨부파일 형식과 용량은 어떻게 되나요?
            </summary>
            <p className="mt-3 text-sm text-text-secondary">
              PDF · HWP · DOCX 형식으로 최대 20MB까지 첨부할 수 있습니다.
            </p>
          </details>
        </ExampleBlock>
        <List
          items={[
            <>기본은 접힌 상태입니다. <Code>&lt;details&gt;</Code> · <Code>&lt;summary&gt;</Code> 를 쓰면 브라우저가 상태 전달을 처리합니다.</>,
            '펼침 버튼에는 무엇이 펼쳐지는지 알 수 있는 레이블을 씁니다 — "더보기" 대신 "첨부파일 안내 보기".',
            '필수 입력 항목이나 오류 메시지를 접어 두지 않습니다.',
          ]}
        />
      </Section>

      <Section id="text-list" title="Text List" krds="레이아웃 및 표현 > 텍스트 목록">
        <P>계층이 있는 텍스트를 읽기 쉽게 구성합니다. 표를 쓸 자리가 아닌 곳에 씁니다.</P>
        <ExampleBlock>
          <div className="space-y-4 text-sm">
            <div>
              <p className="mb-1.5 font-bold">순서 없는 목록</p>
              <ul className="ml-5 list-disc space-y-1 text-text-secondary">
                <li>사업자등록증 사본</li>
                <li>사업계획서</li>
              </ul>
            </div>
            <div>
              <p className="mb-1.5 font-bold">순서 있는 목록</p>
              <ol className="ml-5 list-decimal space-y-1 text-text-secondary">
                <li>자격 확인</li>
                <li>정보 입력</li>
                <li>제출</li>
              </ol>
            </div>
            <div>
              <p className="mb-1.5 font-bold">정의 목록</p>
              <dl className="grid grid-cols-[8rem_1fr] gap-y-1 text-text-secondary">
                <dt className="font-medium text-text-primary">접수번호</dt>
                <dd>2026-0142</dd>
                <dt className="font-medium text-text-primary">처리 기간</dt>
                <dd>접수일로부터 14일</dd>
              </dl>
            </div>
          </div>
        </ExampleBlock>
        <DoDont
          do={<>항목 간 순서가 의미를 가지면 <Code>&lt;ol&gt;</Code>, 아니면 <Code>&lt;ul&gt;</Code>, 이름-값 쌍이면 <Code>&lt;dl&gt;</Code> 을 씁니다.</>}
          dont={<>줄바꿈과 가운뎃점으로 목록을 흉내 내지 않습니다. 스크린리더가 항목 수를 알리지 못합니다.</>}
        />
      </Section>

      <Section id="image" title="Image" krds="레이아웃 및 표현 > 이미지">
        <P>텍스트로 표현하기 어려운 정보를 전달합니다. 대체 텍스트가 이미지의 절반입니다.</P>
        <Spec
          head={['이미지 성격', 'alt 작성', '예']}
          rows={[
            ['정보 전달', '이미지가 전달하는 정보를 문장으로', 'alt="2026년 신청 건수 1,240건, 전년 대비 12% 증가"'],
            ['장식', '빈 문자열', <Code>alt=&quot;&quot;</Code>],
            ['링크 · 버튼 안', '이미지가 아니라 행동을 설명', 'alt="홈으로 이동"'],
            ['복잡한 도표', '요약을 alt 에, 상세는 본문이나 표로', <>alt + <Code>aria-describedby</Code></>],
            ['텍스트가 담긴 이미지', '가급적 쓰지 않음. 불가피하면 전문을 alt 에', '—'],
          ]}
        />
        <List
          items={[
            '이미지가 로드되지 않아도 정보가 전달되어야 합니다. 이미지 차단 상태로 한 번 확인합니다.',
            <>가로세로 비율을 지정해 레이아웃이 밀리지 않게 합니다 — <Code>width</Code> · <Code>height</Code> 속성.</>,
            '확대해도 정보를 읽을 수 있어야 합니다. 저해상도 이미지에 작은 글자를 넣지 않습니다.',
          ]}
        />
      </Section>

      <Section id="favicon" title="Favicon" krds="레이아웃 및 표현 > 파비콘">
        <P>
          브라우저 탭 · 즐겨찾기 · 홈 화면에서 서비스를 식별하는 아이콘입니다. 공공 서비스의
          신뢰성과 일관성을 위한 필수 요소입니다.
        </P>
        <Spec
          head={['용도', '크기', '형식']}
          rows={[
            ['브라우저 탭', '32 × 32', 'ICO · PNG'],
            ['고해상도 탭 · 즐겨찾기', '48 × 48', 'PNG'],
            ['모바일 홈 화면', '180 × 180', 'PNG (apple-touch-icon)'],
            ['벡터 (권장)', '가변', 'SVG'],
          ]}
        />
        <List
          items={[
            '기관 · 서비스 식별자를 단순화해 사용합니다. 작은 크기에서 읽히는지 확인합니다.',
            '배경이 투명한 경우 다크 모드 탭에서도 보이는지 확인합니다.',
            '모든 화면에서 동일한 파비콘을 제공합니다.',
          ]}
        />
      </Section>

      <Section id="bottom-sheet" title="Bottom Sheet" krds="모바일 > 바텀시트">
        <P>
          모바일에서 화면 하단에서 올라오는 패널입니다. 모달보다 맥락을 덜 끊으면서 선택지를
          제시할 때 씁니다.
        </P>
        <List
          items={[
            <>모달과 동일하게 <Code>role=&quot;dialog&quot; aria-modal=&quot;true&quot;</Code> 를 지정하고 포커스를 가둡니다.</>,
            '열릴 때 첫 상호작용 요소로, 닫을 때 열기 버튼으로 포커스를 되돌립니다.',
            '드래그로만 닫히게 하지 않습니다. 닫기 버튼을 항상 함께 제공합니다.',
            '화면 높이의 80%를 넘기면 별도 화면으로 전환하는 것을 검토합니다.',
          ]}
        />
        <Callout>
          이 시스템에서는 shadcn 의 <Code>Sheet</Code> 를 <Code>side=&quot;bottom&quot;</Code> 으로 써서
          구현합니다. Radix 기반이라 포커스 트랩과 Esc 닫기가 기본 제공됩니다.
        </Callout>
      </Section>

      <Section id="tab-bar" title="Tab Bar" krds="모바일 > 탭바">
        <P>모바일 화면 하단에 고정되어 주요 영역을 오갑니다.</P>
        <List
          items={[
            '항목은 3~5개로 제한합니다. 그 이상은 마지막 항목을 "더보기"로 묶습니다.',
            '아이콘과 텍스트를 함께 제공합니다. 아이콘만으로는 의미가 전달되지 않습니다.',
            <>현재 위치를 <Code>aria-current=&quot;page&quot;</Code> 로 알리고, 색 외에 굵기·아이콘 변화로도 구분합니다.</>,
            '터치 영역은 최소 44 × 44px 을 확보합니다.',
            '스크롤해도 위치가 바뀌지 않아야 하며, 키보드 이용자를 위해 본문 다음 순서에 둡니다.',
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------ 도움 */}
      <Section id="tooltip" title="Tooltip" krds="도움 > 툴팁">
        <Example>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label="도움말">
                <Icon name="search" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>사업명 또는 신청번호로 검색합니다</TooltipContent>
          </Tooltip>
        </Example>
        <P>
          툴팁은 <b>보조 정보</b>에만 씁니다. 툴팁 없이는 이해할 수 없는 화면이라면 툴팁이 아니라 화면을
          고쳐야 합니다. 모바일에서는 툴팁 대신 도움말 텍스트를 상시 노출합니다.
        </P>
      </Section>

      <Section id="help-panel" title="Help Panel" status="todo" krds="도움 > 도움말">
        <P>
          화면 우측에서 열리는 상세 도움말 패널입니다. 아직 정의되지 않았습니다. 확정 전까지는 Accordion
          FAQ를 사용해 주세요.
        </P>
        <List
          items={[
            '도움말이 작업을 가리지 않아야 합니다 — 모달이 아니라 패널을 씁니다.',
            '도움말을 열어도 입력 중인 값이 유지되어야 합니다.',
          ]}
        />
      </Section>
    </DocLayout>
  )
}
