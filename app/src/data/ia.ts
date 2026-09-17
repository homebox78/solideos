/**
 * SOLIDEO Design System — 정보구조(IA)
 *
 * 구성 근거
 *  - 대분류와 문서 형식: KT UX Design System(Seamless Flow) 구조를 참고
 *  - 컴포넌트 · 패턴 분류: KRDS(대한민국 정부 디자인시스템) 분류 체계를 따름
 *    → 공공 · 행정 SI 사업 산출물 검수 시 KRDS 분류와 대조가 가능해야 하기 때문
 *  - 브랜드 · 사례: 솔리데오
 *
 * 여기 한 곳만 고치면 GNB · LNB · 커버 타일 · 통합검색이 모두 따라옵니다.
 */

export type Status = 'ready' | 'wip' | 'todo'

export interface Page {
  name: string
  /** 문서 페이지 내 앵커 id */
  id: string
  status: Status
  /** KRDS 대응 분류 (검수 대조용) */
  krds?: string
}

export interface Group {
  title: string
  pages: Page[]
}

export interface Section {
  id: string
  title: string
  /** 라우트 경로 */
  path: string
  desc: string
  groups: Group[]
  hideFromTiles?: boolean
  hideLnb?: boolean
}

export const SYSTEM = {
  name: 'Solid Flow',
  version: 'v1.3.2',
  org: '㈜솔리데오',
  tagline: '흔들리지 않는 신뢰 위에, 끊기지 않는 흐름',
  meta: '솔리데오 UI/UX 원칙과 가이드를 소개합니다.',
} as const

export const SECTIONS: Section[] = [
  {
    id: 'overview',
    title: 'Solid Flow',
    path: '/',
    desc: '솔리데오 디자인 시스템의 출발점이 되는 원칙과 배경',
    hideFromTiles: true,
    hideLnb: true,
    groups: [
      {
        title: 'Solid Flow',
        pages: [
          { name: '디자인 원칙', id: 'principles', status: 'ready', krds: '디자인 원칙' },
          { name: '디지털 포용', id: 'inclusion', status: 'ready', krds: '디지털 포용' },
          { name: '네이밍 원칙', id: 'naming', status: 'ready', krds: '네이밍 원칙' },
          { name: 'About', id: 'about', status: 'ready' },
        ],
      },
    ],
  },

  {
    id: 'foundations',
    title: 'Foundations',
    path: '/foundations',
    desc: '디자인 구성 요소의 시각적 일관성을 유지하기 위한 규칙',
    groups: [
      {
        title: '디자인 스타일',
        pages: [
          { name: 'Overview', id: 'overview', status: 'ready', krds: '디자인 스타일 소개' },
          { name: 'Design Token', id: 'design-token', status: 'ready', krds: '디자인 토큰' },
          { name: 'Color', id: 'color', status: 'ready', krds: '색상' },
          { name: 'Typography', id: 'typography', status: 'ready', krds: '타이포그래피' },
          { name: 'Shape', id: 'shape', status: 'ready', krds: '형태' },
          { name: 'Layout', id: 'layout', status: 'ready', krds: '레이아웃' },
          { name: 'Iconography', id: 'iconography', status: 'ready', krds: '아이콘' },
          { name: 'Elevation', id: 'elevation', status: 'ready', krds: '엘리베이션' },
          { name: 'Motion', id: 'motion', status: 'ready' },
          { name: '선명한 화면 모드', id: 'contrast-mode', status: 'ready', krds: '선명한 화면 모드' },
          { name: 'Accessibility', id: 'accessibility', status: 'ready', krds: '디지털 포용' },
        ],
      },
    ],
  },

  {
    id: 'components',
    title: 'Components',
    path: '/components',
    desc: '사용자 인터페이스를 구성하는 재사용 가능한 요소',
    groups: [
      {
        title: '아이덴티티',
        pages: [
          { name: 'Government Banner', id: 'gov-banner', status: 'ready', krds: '아이덴티티 > 공식 배너' },
          { name: 'Identifier', id: 'identifier', status: 'ready', krds: '아이덴티티 > 운영기관 식별자' },
          { name: 'Footer', id: 'footer', status: 'ready', krds: '아이덴티티 > 푸터' },
        ],
      },
      {
        title: '액션',
        pages: [
          { name: 'Button', id: 'button', status: 'ready', krds: '액션 > 버튼' },
          { name: 'Link', id: 'link', status: 'ready', krds: '액션 > 링크' },
        ],
      },
      {
        title: '입력',
        pages: [
          { name: 'Text Field', id: 'text-field', status: 'ready', krds: '입력 > 텍스트 입력 필드' },
          { name: 'Textarea', id: 'textarea', status: 'ready', krds: '입력 > 텍스트 영역' },
          { name: 'Select', id: 'select', status: 'ready', krds: '입력 > 셀렉트' },
          { name: 'Date Picker', id: 'date-picker', status: 'todo', krds: '입력 > 날짜 입력' },
          { name: 'Icon', id: 'icon', status: 'ready' },
          { name: 'Masked Input', id: 'masked-input', status: 'ready', krds: '입력 > 개인정보 입력' },
          { name: 'File Upload', id: 'file-upload', status: 'wip', krds: '입력 > 파일 업로드' },
        ],
      },
      {
        title: '선택',
        pages: [
          { name: 'Checkbox', id: 'checkbox', status: 'ready', krds: '선택 > 체크박스' },
          { name: 'Radio Button', id: 'radio', status: 'ready', krds: '선택 > 라디오 버튼' },
          { name: 'Switch', id: 'switch', status: 'ready', krds: '설정 > 스위치' },
          { name: 'Chip', id: 'chip', status: 'ready', krds: '선택 > 칩' },
        ],
      },
      {
        title: '탐색',
        pages: [
          { name: 'Top Navigation', id: 'top-navigation', status: 'ready', krds: '탐색 > 메인 메뉴' },
          { name: 'Side Navigation', id: 'side-navigation', status: 'ready', krds: '탐색 > 사이드 메뉴' },
          { name: 'Breadcrumb', id: 'breadcrumb', status: 'ready', krds: '탐색 > 브레드크럼' },
          { name: 'Tab', id: 'tab', status: 'ready', krds: '탐색 > 탭' },
          { name: 'Pagination', id: 'pagination', status: 'ready', krds: '탐색 > 페이지네이션' },
          { name: 'Skip Link', id: 'skip-link', status: 'ready', krds: '탐색 > 건너뛰기 링크' },
          { name: 'In-page Navigation', id: 'in-page-nav', status: 'ready', krds: '탐색 > 콘텐츠 내 탐색' },
        ],
      },
      {
        title: '피드백',
        pages: [
          { name: 'Alert', id: 'alert', status: 'ready', krds: '피드백 > 알림' },
          { name: 'Critical Alert', id: 'critical-alert', status: 'ready', krds: '레이아웃 및 표현 > 긴급 공지' },
          { name: 'Step Indicator', id: 'step-indicator', status: 'ready', krds: '피드백 > 단계 표시기' },
          { name: 'Spinner', id: 'spinner', status: 'ready', krds: '피드백 > 스피너' },
          { name: 'Snackbar', id: 'snackbar', status: 'ready', krds: '모바일 > 스낵바' },
          { name: 'Toast', id: 'toast', status: 'ready', krds: '피드백 > 토스트' },
          { name: 'Modal', id: 'modal', status: 'ready', krds: '피드백 > 모달' },
          { name: 'Progress', id: 'progress', status: 'ready', krds: '피드백 > 진행 표시' },
          { name: 'Skeleton', id: 'skeleton', status: 'ready', krds: '피드백 > 스켈레톤' },
        ],
      },
      {
        title: '레이아웃 및 표현',
        pages: [
          { name: 'Card', id: 'card', status: 'ready', krds: '레이아웃 및 표현 > 카드' },
          { name: 'Table', id: 'table', status: 'ready', krds: '콘텐츠 > 표' },
          { name: 'Accordion', id: 'accordion', status: 'ready', krds: '레이아웃 및 표현 > 아코디언' },
          { name: 'Badge', id: 'badge', status: 'ready', krds: '콘텐츠 > 뱃지' },
          { name: 'Separator', id: 'separator', status: 'ready', krds: '레이아웃 및 표현 > 구분선' },
          { name: 'Structured List', id: 'structured-list', status: 'ready', krds: '레이아웃 및 표현 > 구조화 목록' },
          { name: 'Disclosure', id: 'disclosure', status: 'ready', krds: '레이아웃 및 표현 > 디스클로저' },
          { name: 'Text List', id: 'text-list', status: 'ready', krds: '레이아웃 및 표현 > 텍스트 목록' },
          { name: 'Image', id: 'image', status: 'ready', krds: '레이아웃 및 표현 > 이미지' },
          { name: 'Favicon', id: 'favicon', status: 'ready', krds: '레이아웃 및 표현 > 파비콘' },
        ],
      },
      {
        title: '콘텐츠',
        pages: [
          { name: 'Visually Hidden', id: 'visually-hidden', status: 'ready', krds: '콘텐츠 > 숨긴 콘텐츠' },
        ],
      },
      {
        title: '모바일',
        pages: [
          { name: 'Bottom Sheet', id: 'bottom-sheet', status: 'ready', krds: '모바일 > 바텀시트' },
          { name: 'Tab Bar', id: 'tab-bar', status: 'ready', krds: '모바일 > 탭바' },
        ],
      },
      {
        title: '도움',
        pages: [
          { name: 'Tooltip', id: 'tooltip', status: 'ready', krds: '도움 > 툴팁' },
          { name: 'Help Panel', id: 'help-panel', status: 'todo', krds: '도움 > 도움말' },
        ],
      },
    ],
  },

  {
    id: 'patterns',
    title: 'Patterns',
    path: '/patterns',
    desc: '반복되는 업무 단위와 문제를 해결하는 가이드라인',
    groups: [
      {
        title: '기본 패턴',
        pages: [
          { name: '입력 폼', id: 'form', status: 'ready', krds: '기본 패턴 > 입력 폼' },
          { name: '개인 식별 정보 입력', id: 'identity', status: 'ready', krds: '기본 패턴 > 개인 식별 정보 입력' },
          { name: '동의', id: 'consent', status: 'ready', krds: '기본 패턴 > 동의' },
          { name: '첨부파일', id: 'attachment', status: 'ready', krds: '기본 패턴 > 첨부파일' },
          { name: '목록 탐색', id: 'list', status: 'ready', krds: '기본 패턴 > 목록 탐색' },
          { name: '필터링 · 정렬', id: 'filter', status: 'ready', krds: '기본 패턴 > 필터링·정렬' },
          { name: '상세 정보 확인', id: 'detail', status: 'ready', krds: '기본 패턴 > 상세 정보 확인' },
          { name: '확인', id: 'confirm', status: 'ready', krds: '기본 패턴 > 확인' },
          { name: '오류', id: 'error', status: 'ready', krds: '기본 패턴 > 오류' },
          { name: '빈 화면', id: 'empty', status: 'ready' },
          { name: '도움', id: 'help', status: 'ready', krds: '기본 패턴 > 도움' },
          { name: '사용자 피드백', id: 'feedback', status: 'ready', krds: '기본 패턴 > 사용자 피드백' },
          { name: '모바일 알림', id: 'mobile-notification', status: 'ready', krds: '기본 패턴 > 모바일' },
        ],
      },
      {
        title: '서비스 패턴',
        pages: [
          { name: '방문', id: 'visit', status: 'wip', krds: '서비스 패턴 > 방문' },
          { name: '검색', id: 'search', status: 'ready', krds: '서비스 패턴 > 검색' },
          { name: '로그인', id: 'login', status: 'ready', krds: '서비스 패턴 > 로그인' },
          { name: '신청', id: 'apply', status: 'ready', krds: '서비스 패턴 > 신청' },
          { name: '시스템 상태', id: 'status', status: 'ready' },
        ],
      },
    ],
  },

  {
    id: 'visual',
    title: 'Visual Communication',
    path: '/visual-communication',
    desc: '솔리데오의 모든 경험을 하나로 잇는 시각 언어 가이드라인',
    groups: [
      {
        title: 'Visual Communication',
        pages: [
          { name: 'Overview', id: 'overview', status: 'ready' },
          { name: 'Message', id: 'message', status: 'ready' },
          { name: 'Infographic', id: 'infographic', status: 'wip' },
          { name: 'Detail Page', id: 'detail-page', status: 'wip' },
        ],
      },
      {
        title: 'Banner',
        pages: [
          { name: 'Hero Banner', id: 'hero-banner', status: 'ready' },
          { name: 'Contents Banner', id: 'contents-banner', status: 'wip' },
        ],
      },
    ],
  },

  {
    id: 'writing',
    title: 'UX Writing',
    path: '/ux-writing',
    desc: '명확하고 일관된 메시지를 전달하기 위한 언어 원칙과 표현',
    groups: [
      {
        title: 'UX Writing',
        pages: [
          { name: 'UX Writing 정의', id: 'definition', status: 'ready' },
          { name: '기준과 원칙', id: 'principles', status: 'ready' },
          { name: '표기 규칙', id: 'notation', status: 'ready' },
          { name: '용어 사전', id: 'glossary', status: 'ready' },
          { name: '상황별 가이드', id: 'cases', status: 'ready' },
        ],
      },
    ],
  },

  {
    id: 'ai',
    title: 'AI Interaction',
    path: '/ai-interaction',
    desc: 'AI 도구와 사용자의 상호작용을 위한 원칙과 가이드라인',
    groups: [
      {
        title: 'AI Interaction',
        pages: [{ name: 'Principles', id: 'principles', status: 'ready' }],
      },
      {
        title: 'Components',
        pages: [
          { name: 'Prompt Input', id: 'prompt-input', status: 'ready' },
          { name: 'Prompt Output', id: 'prompt-output', status: 'ready' },
          { name: 'Process Indicator', id: 'process', status: 'ready' },
          { name: 'Context Panel', id: 'context-panel', status: 'todo' },
        ],
      },
      {
        title: 'Patterns',
        pages: [
          { name: '대화형 질의응답', id: 'qa', status: 'ready' },
          { name: '파일 분석', id: 'file', status: 'ready' },
          { name: '검색', id: 'ai-search', status: 'wip' },
          { name: '음성 입력', id: 'voice', status: 'todo' },
        ],
      },
    ],
  },

  {
    id: 'resources',
    title: 'Resources',
    path: '/resources',
    desc: '자산 라이브러리와 SI 프로젝트 적용 가이드',
    hideFromTiles: true,
    groups: [
      {
        title: '시작하기',
        pages: [
          { name: '자산 라이브러리', id: 'library', status: 'ready', krds: '리소스 다운로드' },
          { name: 'KRDS 대응표', id: 'krds-coverage', status: 'ready', krds: '컴포넌트 소개' },
          { name: '설치', id: 'install', status: 'ready' },
          { name: '스택별 적용', id: 'stack', status: 'ready' },
          { name: 'CSS 컴포넌트', id: 'css-components', status: 'ready' },
          { name: '다크 모드', id: 'dark-mode', status: 'ready' },
          { name: '구현 계약', id: 'contract', status: 'ready' },
          { name: '폐쇄망 · 보안', id: 'security', status: 'ready' },
        ],
      },
      {
        title: '운영',
        pages: [
          { name: '토큰 배포 체계', id: 'tokens-build', status: 'ready' },
          { name: '알려진 오탐', id: 'known-findings', status: 'ready' },
          { name: 'Check List', id: 'checklist', status: 'ready' },
          { name: '기여와 운영', id: 'governance', status: 'ready' },
          { name: 'Release Note', id: 'release', status: 'ready' },
        ],
      },
    ],
  },
]

export const findSection = (pathname: string) =>
  SECTIONS.find((s) => (s.path === '/' ? pathname === '/' : pathname.startsWith(s.path)))

export const allPages = SECTIONS.flatMap((s) =>
  s.groups.flatMap((g) => g.pages.map((p) => ({ ...p, section: s, group: g })))
)
