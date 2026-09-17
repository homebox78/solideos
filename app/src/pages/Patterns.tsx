import { DocLayout } from '@/components/layout/DocLayout'
import { Icon } from '@/components/ui/icon'
import {
  Callout, Code, DocHeader, DoDont, ExampleBlock, List, P, Section, Spec,
} from '@/components/docs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckboxField, SelectField, TextField } from '@/components/ui/field'
import { MaskedInput } from '@/components/ui/masked-input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Patterns() {
  return (
    <DocLayout>
      <DocHeader eyebrow="Patterns" title="Patterns">
        반복되는 업무 단위와 문제를 해결하는 가이드라인입니다.
        <br />
        분류는 KRDS의 기본 패턴 · 서비스 패턴 체계를 따릅니다.
      </DocHeader>

      <Callout>
        패턴이 지켜야 할 것 — <b>맥락 유지</b>(화면을 이동해도 조건 · 입력값 · 스크롤 위치를 잃지 않음),
        <b> 되돌리기</b>(모든 단계에서 손실 없이 이전으로), <b>현재 위치</b>(전체 몇 단계 중 몇 번째인지),
        <b> 복구 가능</b>(세션이 끊겨도 작성 내용이 남음).
      </Callout>

      <Section id="form" title="입력 폼" krds="기본 패턴 > 입력 폼">
        <P>
          공공 업무 폼은 길어질 수밖에 없습니다. 길이를 줄이려 애쓰는 대신 <b>흐름을 끊지 않는 것</b>에
          집중합니다.
        </P>
        <Spec
          head={['단계', '규칙']}
          rows={[
            ['구조', <>7개 이상 항목은 의미 단위로 묶고 <Code>fieldset</Code> / <Code>legend</Code>를 씁니다</>],
            ['진행', '3단계 이상이면 스텝 인디케이터로 현재 · 완료 · 남은 단계를 표시합니다'],
            ['검증', '입력 중에는 방해하지 않고 필드를 벗어날 때(blur) 검증합니다'],
            ['오류', '제출 실패 시 첫 오류 필드로 포커스를 옮기고 상단에 요약 알림을 둡니다'],
            ['저장', '30초마다 자동 임시저장하고 마지막 저장 시각을 표시합니다'],
            ['이탈', '작성 중 이탈 시 확인합니다'],
          ]}
        />
        <ExampleBlock>
          <div className="max-w-xl space-y-5">
            <div className="space-y-2">
              <Progress value={66} aria-label="신청 진행률" />
              <p className="text-xs text-text-tertiary">3단계 중 2단계 · 신청 정보 입력</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="pf1">사업명 <span className="text-text-critical" aria-hidden>*</span></Label>
                <Input id="pf1" defaultValue="행정정보 통합 플랫폼 구축" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pf2">담당자 <span className="text-text-critical" aria-hidden>*</span></Label>
                <Input id="pf2" placeholder="이름" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary">이전</Button>
              <Button variant="outline">임시저장</Button>
              <Button>다음</Button>
            </div>
          </div>
        </ExampleBlock>
        <DoDont
          do={<>오류 메시지는 해당 필드 바로 아래에 두고 <b>어떻게 고치는지</b> 알려 줍니다.</>}
          dont="오류 발생 시 입력값을 초기화하지 않습니다. 다시 입력하게 만드는 것은 시스템의 잘못입니다."
        />
      </Section>

      <Section id="identity" title="개인 식별 정보 입력" krds="기본 패턴 > 개인 식별 정보 입력">
        <P>
          주민등록번호 · 휴대전화번호 등 민감정보는 <b>수집 근거와 목적을 입력 직전에</b> 밝힙니다.
          공공 서비스에서 가장 자주 지적되는 항목입니다.
        </P>
        <Spec
          head={['항목', '규칙']}
          rows={[
            ['수집 최소화', '해당 업무에 반드시 필요한 항목만 받습니다. 생년월일로 충분하면 주민번호를 받지 않습니다'],
            ['근거 표시', '입력 필드 바로 위에 수집 목적 · 근거 법령 · 보유 기간을 표시합니다'],
            ['마스킹', '입력 후에는 뒷자리를 가립니다. 조회 화면에서도 기본은 마스킹 상태입니다'],
            ['대체 수단', '간편인증 · 공동인증서 등 직접 입력을 대체하는 경로를 함께 제공합니다'],
            ['자동 완성 차단', <><Code>autoComplete=&quot;off&quot;</Code>로 공용 PC 노출을 막습니다</>],
          ]}
        />
        <ExampleBlock>
          <div className="max-w-md space-y-2">
            <div className="rounded-md border-l-[3px] border-l-border-accent bg-fill-accent-subtle px-4 py-3 text-xs leading-relaxed">
              <b>수집 목적</b> 본인 확인 · <b>근거</b> 전자정부법 시행령 제9조 · <b>보유</b> 처리 완료 후 3년
            </div>
            <div className="flex items-end gap-2">
              <TextField
                label="주민등록번호 앞 6자리"
                className="w-36"
                placeholder="000000"
                autoComplete="off"
                inputMode="numeric"
                maxLength={6}
              />
              <span className="pb-2.5" aria-hidden>-</span>
              <MaskedInput
                label="주민등록번호 뒤 7자리"
                className="w-44"
                placeholder="0000000"
                maxLength={7}
              />
            </div>
          </div>
        </ExampleBlock>
      </Section>

      <Section id="consent" title="동의" krds="기본 패턴 > 동의">
        <P>공공 서비스에서 동의는 법적 효력을 갖습니다. 무엇에 동의했는지 나중에도 확인할 수 있어야 합니다.</P>
        <ExampleBlock>
          <div className="max-w-lg">
            <div className="pb-3">
              <CheckboxField label={<span className="font-bold">전체 동의</span>} />
            </div>
            <Separator />
            {[
              ['개인정보 수집 · 이용 동의', '필수'],
              ['제3자 제공 동의', '필수'],
              ['마케팅 정보 수신', '선택'],
            ].map(([label, req]) => (
              <div key={label} className="flex items-center gap-2 pt-3">
                <CheckboxField
                  label={label}
                  trailing={
                    <Badge variant={req === '필수' ? 'critical' : 'secondary'}>
                      {req}
                    </Badge>
                  }
                />
                <button type="button" className="ml-auto text-xs text-text-secondary underline underline-offset-2">
                  {label} 전문 보기
                </button>
              </div>
            ))}
          </div>
        </ExampleBlock>
        <List
          items={[
            '전체 동의는 필수 · 선택을 모두 포함하며, 개별 해제가 가능해야 합니다.',
            '선택 항목은 기본 해제 상태입니다.',
            '전문은 새 창이 아니라 현재 맥락 안(모달 · 아코디언)에서 봅니다.',
            '동의 일시와 약관 버전을 함께 기록합니다.',
          ]}
        />
      </Section>

      <Section id="attachment" title="첨부파일" krds="기본 패턴 > 첨부파일">
        <Spec
          head={['시점', '알려야 할 것']}
          rows={[
            ['업로드 전', '지원 형식 · 최대 용량 · 개수 · 개인정보 마스킹 안내'],
            ['업로드 중', '파일별 진행률 · 취소 수단'],
            ['업로드 후', '파일명 · 용량 · 삭제 버튼. 미리보기가 가능하면 제공'],
            ['실패 시', '어느 파일이 왜 실패했는지. 성공한 파일은 유지'],
          ]}
        />
        <ExampleBlock>
          <div className="max-w-md space-y-2">
            <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
              <Icon name="description" className="size-4 shrink-0 text-icon-tertiary" aria-hidden />
              <span className="flex-1 truncate text-sm">사업계획서_최종.pdf</span>
              <span className="font-mono text-xs text-text-tertiary">4.2MB</span>
              <Button variant="ghost" size="sm">삭제</Button>
            </div>
            <p className="text-xs text-text-tertiary">PDF · HWP · DOCX · 최대 20MB · 5개까지</p>
          </div>
        </ExampleBlock>
      </Section>

      <Section id="list" title="목록 탐색" krds="기본 패턴 > 목록 탐색">
        <Spec
          head={['상황', '권장']}
          rows={[
            ['항목이 많고 스캔 위주', '표 + 페이지네이션 (기본 20건)'],
            ['이미지 · 요약이 중요', '카드 그리드'],
            ['상세를 자주 오가며 비교', '목록 유지 + 우측 패널 상세'],
            ['편집이 필요', '별도 페이지로 이동하되, 저장 후 원래 목록 위치로 복귀'],
          ]}
        />
      </Section>

      <Section id="filter" title="필터링 · 정렬" krds="기본 패턴 > 필터링·정렬">
        <ExampleBlock>
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-2">
              <Label htmlFor="q1">사업명</Label>
              <Input id="q1" placeholder="검색어 입력" className="w-48" />
            </div>
            <SelectField label="상태">
              {(a11y) => (
                <Select>
                  <SelectTrigger {...a11y} className="w-36">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="review">검토중</SelectItem>
                    <SelectItem value="done">승인</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </SelectField>
            <Button>검색</Button>
            <Button variant="secondary">초기화</Button>
          </div>
        </ExampleBlock>
        <Spec
          head={['항목', '규칙']}
          rows={[
            ['적용 시점', '필터 3개 이하는 즉시 적용, 그 이상은 검색 버튼으로 명시 적용'],
            ['조건 유지', '상세로 갔다 돌아와도 검색 조건 · 정렬 · 페이지 번호를 유지합니다'],
            ['조건 표시', '적용된 필터를 Chip으로 노출하고 개별 해제를 제공합니다'],
            ['공유', 'URL 쿼리에 반영해 링크로 공유할 수 있게 합니다'],
          ]}
        />
      </Section>

      <Section id="detail" title="상세 정보 확인" krds="기본 패턴 > 상세 정보 확인">
        <List
          items={[
            '상단에 식별번호 · 상태 · 최종 수정일을 고정합니다.',
            '정보는 신청자 → 사업 → 첨부 → 처리 이력 순으로 배치합니다.',
            '처리 이력은 시간 역순으로, 누가 · 언제 · 무엇을 했는지 남깁니다.',
            '목록으로 돌아가는 경로를 항상 제공하고, 돌아갔을 때 원래 위치를 유지합니다.',
          ]}
        />
      </Section>

      <Section id="confirm" title="확인" krds="기본 패턴 > 확인">
        <Spec
          head={['요소', '규칙', '예시']}
          rows={[
            ['제목', '무엇을 확인하는지 명시', '신청서를 제출할까요?'],
            ['본문', '결과와 되돌릴 수 있는지 여부', '제출 후에는 내용을 수정할 수 없습니다.'],
            ['버튼', <>동사로. <Code>예/아니오</Code> 금지</>, '제출 / 취소'],
            ['기본 포커스', '되돌릴 수 없는 행동에서는 취소에 포커스', '—'],
          ]}
        />
      </Section>

      <Section id="error" title="오류" krds="기본 패턴 > 오류">
        <P>모든 오류는 <b>무엇이 · 왜 · 어떻게</b> 3요소를 담습니다.</P>
        <Spec
          head={['상황', '나쁜 예', '좋은 예']}
          rows={[
            ['필수 미입력', '입력값이 올바르지 않습니다.', '사업자등록번호를 입력해 주세요.'],
            ['형식 오류', 'Invalid format', '이메일 형식이 올바르지 않습니다. 예: hong@solideos.com'],
            ['용량 초과', '업로드 실패', '첨부파일은 20MB까지 가능합니다. 현재 24MB입니다.'],
            ['세션 만료', '세션이 종료되었습니다.', '30분 동안 활동이 없어 자동 로그아웃되었습니다. 작성 중이던 내용은 임시저장되어 있습니다.'],
            ['서버 오류', 'Error 500', '일시적인 문제로 처리하지 못했습니다. 잠시 후 다시 시도해 주세요. (오류 코드 E500)'],
          ]}
        />
      </Section>

      <Section id="empty" title="빈 화면">
        <P>비어 있음은 실패가 아닙니다. 다음에 할 일을 제안하는 자리입니다.</P>
        <ExampleBlock>
          <div className="py-12 text-center">
            <p className="text-xl font-bold">등록된 신청 건이 없습니다</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
              신규 사업 신청서를 작성하면 이곳에서 진행 상태를 확인할 수 있습니다.
            </p>
            <Button className="mt-6">신청서 작성</Button>
          </div>
        </ExampleBlock>
        <Spec
          head={['상황', '구성']}
          rows={[
            ['최초 진입(데이터 없음)', '설명 + 첫 행동 유도 버튼'],
            ['검색 결과 없음', '검색어 표시 + 조건 완화 제안 + 필터 초기화'],
            ['권한 없음', '사유 + 담당자 문의 경로'],
          ]}
        />
      </Section>

      <Section id="help" title="도움" krds="기본 패턴 > 도움">
        <P>
          이용자가 과업 중에 막혔을 때 필요한 정보를 제공합니다. 도움을 얼마나 잘 배치하느냐보다
          <b> 도움 없이도 되게 만드는 것</b>이 먼저입니다.
        </P>
        <Spec
          head={['유형', '언제', '형태']}
          rows={[
            ['필드 도움말', '입력 형식이 특수할 때', '필드 바로 아래 상시 노출'],
            ['툴팁', '보조 정보. 없어도 진행 가능', '아이콘 옆. 모바일에서는 상시 노출로 대체'],
            ['맥락적 도움말', '화면 단위 설명이 필요할 때', '우측 패널. 입력값을 잃지 않고 열림'],
            ['FAQ', '반복되는 질문', '아코디언'],
            ['담당자 연락', '시스템으로 해결 불가', '완료 · 오류 화면에 상시 노출'],
          ]}
        />
        <DoDont
          do="도움말을 열어도 입력 중인 값이 유지되어야 합니다. 새 창이 아니라 현재 맥락 안에서 엽니다."
          dont="도움말 없이는 이해할 수 없는 화면을 만들고 도움말로 때우지 않습니다. 화면을 먼저 고칩니다."
        />
      </Section>

      <Section id="feedback" title="사용자 피드백" krds="기본 패턴 > 사용자 피드백">
        <P>
          이용 경험에 대한 의견 · 불편 · 제안을 수집합니다. 공공 서비스 개선의 근거가 되므로
          <b> 수집 자체보다 응답률</b>이 중요합니다.
        </P>
        <List
          items={[
            '과업을 마친 직후에 묻습니다. 진행 중에 끼어들면 과업을 방해합니다.',
            '2단계를 넘기지 않습니다 — 도움 여부(예/아니오) → 이유(선택 입력).',
            '건너뛸 수 있어야 하고, 건너뛴 뒤 같은 화면에서 다시 묻지 않습니다.',
            '자유 입력란에는 개인정보를 적지 말라고 안내합니다.',
            '수집한 의견이 어떻게 쓰이는지 밝힙니다.',
          ]}
        />
        <ExampleBlock>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-text-secondary">이 페이지가 도움이 되었나요?</span>
            <Button variant="outline" size="sm">도움이 되었어요</Button>
            <Button variant="outline" size="sm">아쉬워요</Button>
          </div>
        </ExampleBlock>
        <Callout>
          이 문서 사이트 각 페이지 하단이 그 구현입니다. 응답 후에는 감사 문구로 바뀌고 다시 묻지 않습니다.
        </Callout>
      </Section>

      <Section id="mobile-notification" title="모바일 알림" krds="기본 패턴 > 모바일">
        <P>
          진행 상태나 중요한 변화를 적시에 알립니다. 푸시 · 인앱 · 알림함 세 경로가 있고,
          <b> 같은 정보를 세 번 보내지 않는 것</b>이 핵심입니다.
        </P>
        <Spec
          head={['경로', '언제', '주의']}
          rows={[
            ['푸시 알림', '앱 밖에서도 알아야 하는 변화 (승인 · 반려 · 마감)', '동의를 먼저 받고, 끄는 경로를 제공합니다'],
            ['인앱 알림', '앱을 쓰는 중에 생긴 변화', '작업을 가리지 않는 위치에 둡니다'],
            ['알림함', '지난 알림 다시 보기', '읽음 상태를 유지하고 원본 화면으로 연결합니다'],
          ]}
        />
        <List
          items={[
            '알림 문구만 읽고도 무슨 일이 있었는지 알 수 있어야 합니다 — "알림이 도착했습니다"는 정보가 아닙니다.',
            '알림을 누르면 관련 화면으로 바로 이동합니다. 홈으로 보내지 않습니다.',
            '야간(21시~08시) 발송을 제한하고, 긴급 알림은 별도 동의를 받습니다.',
            '알림에 개인 식별 정보를 담지 않습니다. 잠금화면에 그대로 노출됩니다.',
          ]}
        />
      </Section>

      <Section id="visit" title="방문" status="wip" krds="서비스 패턴 > 방문">
        <P>
          처음 방문한 이용자가 무엇을 할 수 있는 곳인지 3초 안에 판단할 수 있어야 합니다.
          기능 투어는 기본적으로 쓰지 않습니다 — 설명이 필요한 화면이라면 화면을 먼저 고칩니다.
        </P>
      </Section>

      <Section id="search" title="검색" krds="서비스 패턴 > 검색">
        <ExampleBlock>
          <div className="flex max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-icon-tertiary" aria-hidden />
              <Input className="pl-9" placeholder="사업명 또는 신청번호" aria-label="통합 검색" />
            </div>
            <Button>검색</Button>
          </div>
        </ExampleBlock>
        <List
          items={[
            '검색어는 결과 화면의 입력창에 그대로 유지합니다.',
            '자동완성은 최대 8개까지 노출하고, 키보드로 선택할 수 있어야 합니다.',
            '결과가 없으면 오타 교정 · 유사어 · 조건 완화를 제안합니다.',
          ]}
        />
      </Section>

      <Section id="login" title="로그인" krds="서비스 패턴 > 로그인">
        <Spec
          head={['항목', '규칙']}
          rows={[
            ['인증 수단', '간편인증 · 공동인증서 · 아이디를 나란히 제시하고, 마지막 사용 수단을 기억합니다'],
            ['실패', '아이디/비밀번호 중 무엇이 틀렸는지 알리지 않습니다. 남은 시도 횟수는 알립니다'],
            ['세션', '만료 3분 전 예고 + 연장 버튼. 만료 시 작성 중이던 내용은 임시저장'],
            ['로그아웃', '공용 PC 안내와 함께 명시적 로그아웃 경로를 제공합니다'],
          ]}
        />
      </Section>

      <Section id="apply" title="신청" krds="서비스 패턴 > 신청">
        <P>솔리데오 제품에서 가장 자주 반복되는 여정입니다. 단계 구성은 아래를 기본으로 합니다.</P>
        <Spec
          head={['단계', '화면', '핵심']}
          rows={[
            ['1', '자격 확인', '신청 대상인지 먼저 판단시켜 헛수고를 막습니다'],
            ['2', '동의', '필수 · 선택 구분. 개별 동의 가능'],
            ['3', '정보 입력', '자동 임시저장 · 진행률 표시'],
            ['4', '첨부', '형식 · 용량을 입력 전에 안내'],
            ['5', '확인', '입력값 전체를 읽기 전용으로 다시 보여 주고 수정 경로 제공'],
            ['6', '완료', '접수번호 · 다음에 일어날 일 · 소요 기간 · 조회 경로'],
          ]}
        />
      </Section>

      <Section id="status" title="시스템 상태">
        <P>사용자는 시스템이 지금 무엇을 하고 있는지 항상 알아야 합니다. 원칙 <b>Solid</b>의 실행 지점입니다.</P>
        <Spec
          head={['상황', '메시지 구성']}
          rows={[
            ['처리 중', '무엇을 처리 중인지 + 예상 시간 + 취소 수단'],
            ['처리 완료', '결과 + 식별번호 + 다음 행동'],
            ['서버 오류', '사용자 책임이 아님을 밝히고 재시도 + 오류 코드'],
            ['점검 중', '점검 종료 예정 시각 + 대체 경로'],
          ]}
        />
      </Section>
    </DocLayout>
  )
}
