/**
 * SOLIDEO Design System — 자산 라이브러리
 *
 * 솔리데오가 진행한 프로젝트의 목업 · 화면기획 · 코드 자산 목록입니다.
 * 자산을 추가하려면 이 배열에 항목 하나만 넣으면 됩니다.
 *
 * status  ready    : 지금 바로 내려받기 가능
 *         internal : 사내망 · 권한 필요 (href에 사내 저장소 주소)
 *         pending  : 등록 대기 (파일 수집 중)
 */

export type Role = 'designer' | 'developer'
export type AssetStatus = 'ready' | 'internal' | 'pending'
export type Preview = 'screens' | 'grid' | 'palette' | 'code' | 'doc' | 'kit' | 'brand'

export interface Asset {
  role: Role
  kind: string
  title: string
  project: string
  year: string
  format: string
  size: string
  desc: string
  owner: string
  href: string
  status: AssetStatus
  preview: Preview
  /** 어떤 스택에서 쓰는 자산인지 (개발자 탭 필터) */
  stack?: string[]
}

export const ASSETS: Asset[] = [
  /* ------------------------------------------------------------ Designer */
  {
    role: 'designer', kind: 'UI 키트', title: 'Solid Flow UI Kit',
    project: '디자인 시스템', year: '2026', format: 'Figma', size: '—',
    desc: '전 컴포넌트 · 토큰 · 아이콘이 들어 있는 마스터 파일. 모든 신규 화면은 이 파일에서 시작합니다.',
    owner: '디자인팀', href: '#', status: 'internal', preview: 'kit',
  },
  {
    role: 'designer', kind: '토큰', title: '피그마 토큰 (Tokens Studio)',
    project: '디자인 시스템', year: '2026', format: 'JSON', size: '16 KB',
    desc: 'Tokens Studio 플러그인에 그대로 import 합니다. Primitive · Semantic 컬렉션이 나뉘어 있고 참조 관계가 유지됩니다.',
    owner: '디자인팀', href: 'dist/solideo-figma.tokens.json', status: 'ready', preview: 'palette',
  },
  {
    role: 'designer', kind: '토큰', title: '컬러 · 타이포 팔레트 (flat)',
    project: '디자인 시스템', year: '2026', format: 'JSON', size: '15 KB',
    desc: '평탄한 목록 형태. Style Dictionary 등 외부 도구 연동용입니다.',
    owner: '디자인팀', href: 'dist/solideo-tokens.flat.json', status: 'ready', preview: 'palette',
  },
  {
    role: 'designer', kind: '화면기획', title: '행정정보 통합 플랫폼 화면기획서',
    project: '플랫폼정부', year: '2025', format: 'PPTX', size: '—',
    desc: '신청 · 검토 · 승인 전 과정의 화면 흐름도와 IA. 공공 행정 폼 설계의 기준 사례입니다.',
    owner: '정보서비스본부', href: '#', status: 'pending', preview: 'screens',
  },
  {
    role: 'designer', kind: '목업', title: 'JADOit 대시보드 목업',
    project: '데이터 플랫폼', year: '2025', format: 'Figma', size: '—',
    desc: '부동산 빅데이터 대시보드. 데이터 시각화 색 운용과 대용량 표 레이아웃 사례입니다.',
    owner: '데이터사업팀', href: '#', status: 'pending', preview: 'grid',
  },
  {
    role: 'designer', kind: '목업', title: 'NSPACE 협업 화면 목업',
    project: '스마트 솔루션', year: '2024', format: 'Sketch', size: '—',
    desc: '클라우드 협업 도구. 좌측 트리 + 우측 상세 패턴의 원형이 된 화면입니다.',
    owner: '솔루션개발팀', href: '#', status: 'pending', preview: 'screens',
  },
  {
    role: 'designer', kind: '목업', title: 'PINO 전자증명서 발급 흐름',
    project: '데이터 플랫폼', year: '2024', format: 'Figma', size: '—',
    desc: '본인확인 → 발급 → 유통 3단계 여정. 개인 식별 정보 입력 패턴의 원형입니다.',
    owner: '데이터사업팀', href: '#', status: 'pending', preview: 'screens',
  },
  {
    role: 'designer', kind: '브랜드', title: '솔리데오 CI 가이드',
    project: '공통', year: '2026', format: 'PDF · AI', size: '—',
    desc: '로고 사용 규정 · 최소 여백 · 금지 사례. 제안서와 화면 모두에 적용됩니다.',
    owner: '경영지원', href: '#', status: 'internal', preview: 'brand',
  },
  {
    role: 'designer', kind: '문서', title: '접근성 검수 체크리스트',
    project: '공통', year: '2026', format: 'XLSX', size: '—',
    desc: 'KWCAG 2.2 항목별 검수표. 납품 전 자체 점검용으로 그대로 제출할 수 있습니다.',
    owner: '디자인팀', href: '#', status: 'pending', preview: 'doc',
  },

  /* ----------------------------------------------------------- Developer */
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — CSS',
    project: '디자인 시스템', year: '2026', format: 'CSS', size: '7.7 KB',
    desc: 'CSS Custom Properties. 순수 HTML · JSP · Thymeleaf 등 모든 환경에서 그대로 씁니다.',
    owner: '디자인시스템', href: 'dist/solideo-tokens.css', status: 'ready', preview: 'code',
    stack: ['공통', 'HTML/JSP', 'React', 'Vue'],
  },
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — SCSS',
    project: '디자인 시스템', year: '2026', format: 'SCSS', size: '9.9 KB',
    desc: 'Sass 변수와 맵. 기존 SCSS 기반 프로젝트에 그대로 붙습니다.',
    owner: '디자인시스템', href: 'dist/solideo-tokens.scss', status: 'ready', preview: 'code',
    stack: ['Sass'],
  },
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — Less',
    project: '디자인 시스템', year: '2026', format: 'LESS', size: '4.7 KB',
    desc: 'Less 변수. 레거시 SI 프로젝트 대응용입니다.',
    owner: '디자인시스템', href: 'dist/solideo-tokens.less', status: 'ready', preview: 'code',
    stack: ['Less'],
  },
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — JS · TypeScript',
    project: '디자인 시스템', year: '2026', format: 'JS · CJS · D.TS', size: '16 KB',
    desc: 'ESM/CJS 모듈과 타입 선언. 차트 · 캔버스에서 색을 코드로 참조할 때 씁니다.',
    owner: '디자인시스템', href: 'dist/solideo-tokens.js', status: 'ready', preview: 'code',
    stack: ['React', 'Vue', 'Quasar', 'Node'],
  },
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — Quasar',
    project: '디자인 시스템', year: '2026', format: 'SASS', size: '5.8 KB',
    desc: 'Quasar의 $primary · $negative 등 브랜드 변수를 솔리데오 토큰에 연결합니다.',
    owner: '디자인시스템', href: 'dist/quasar.variables.sass', status: 'ready', preview: 'code',
    stack: ['Quasar', 'Vue'],
  },
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — Spring Boot (properties)',
    project: '디자인 시스템', year: '2026', format: 'PROPERTIES', size: '5.7 KB',
    desc: '서버 렌더링 화면 · 메일 템플릿 · PDF 생성에서 색을 하드코딩하지 않게 합니다.',
    owner: '디자인시스템', href: 'dist/solideo-tokens.properties', status: 'ready', preview: 'code',
    stack: ['Spring Boot', 'Java', 'eGovFrame'],
  },
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — Java 상수 클래스',
    project: '디자인 시스템', year: '2026', format: 'JAVA', size: '16 KB',
    desc: 'SolideoTokens.java. 타입 안전하게 서버 코드에서 참조합니다.',
    owner: '디자인시스템', href: 'dist/SolideoTokens.java', status: 'ready', preview: 'code',
    stack: ['Java', 'Spring Boot'],
  },
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — Tailwind preset',
    project: '디자인 시스템', year: '2026', format: 'CJS', size: '4.5 KB',
    desc: 'Tailwind v3 프로젝트용 preset. 유틸리티 클래스가 토큰을 참조하게 됩니다.',
    owner: '디자인시스템', href: 'dist/tailwind.preset.cjs', status: 'ready', preview: 'code',
    stack: ['Tailwind'],
  },
  {
    role: 'developer', kind: '토큰', title: 'shadcn/ui 테마 레이어',
    project: '디자인 시스템', year: '2026', format: 'CSS', size: '8.9 KB',
    desc: 'shadcn 표준 변수(--primary · --border · --ring)를 솔리데오 토큰에 연결 + Tailwind v4 @theme.',
    owner: '디자인시스템', href: 'dist/solideo-shadcn.css', status: 'ready', preview: 'code',
    stack: ['Tailwind', 'React', 'shadcn/ui'],
  },
  {
    role: 'developer', kind: '원본', title: '토큰 원본 + 빌드 · 검증 스크립트',
    project: '디자인 시스템', year: '2026', format: 'JSON · MJS', size: '—',
    desc: 'tokens.json 단일 원본과 무의존 빌드/검증 스크립트. 새 포맷이 필요하면 여기에 추가합니다.',
    owner: '디자인시스템', href: 'tokens/tokens.json', status: 'ready', preview: 'code',
    stack: ['공통'],
  },
  {
    role: 'developer', kind: '컴포넌트', title: '컴포넌트 — CSS only',
    project: '디자인 시스템', year: '2026', format: 'CSS', size: '15 KB',
    desc: 'React 없이 쓰는 .sds-* 클래스 73개. JSP · Thymeleaf · 퍼블리싱 산출물에 그대로 붙습니다.',
    owner: '디자인시스템', href: 'dist/solideo-components.css', status: 'ready', preview: 'code',
    stack: ['HTML/JSP', 'Thymeleaf', '공통'],
  },
  {
    role: 'developer', kind: '토큰', title: '디자인 토큰 — 다크 모드',
    project: '디자인 시스템', year: '2026', format: 'CSS', size: '3.4 KB',
    desc: 'Semantic 매핑만 뒤집습니다. data-theme="dark" 하나로 전환되고 컴포넌트는 손대지 않습니다.',
    owner: '디자인시스템', href: 'dist/solideo-dark.css', status: 'ready', preview: 'palette',
    stack: ['공통'],
  },
  {
    role: 'developer', kind: '스타터킷', title: '스타터 킷 — React + shadcn/ui',
    project: '공통', year: '2026', format: 'ZIP', size: '—',
    desc: '이 문서 사이트가 곧 스타터 킷입니다. Vite + Tailwind v4 + shadcn 24종이 연결되어 있습니다.',
    owner: '디자인시스템', href: '#', status: 'pending', preview: 'kit',
    stack: ['React', 'Tailwind', 'shadcn/ui'],
  },
  {
    role: 'developer', kind: '스타터킷', title: '스타터 킷 — Vue 3 + Quasar',
    project: '공통', year: '2026', format: 'ZIP', size: '—',
    desc: 'Quasar 브랜드 변수가 연결된 시작 템플릿. 목록/상세/폼 3종 화면 포함.',
    owner: '디자인시스템', href: '#', status: 'pending', preview: 'kit',
    stack: ['Vue', 'Quasar'],
  },
  {
    role: 'developer', kind: '스타터킷', title: '스타터 킷 — Spring Boot + Thymeleaf',
    project: '공통', year: '2026', format: 'ZIP', size: '—',
    desc: '레이아웃 프래그먼트 · GNB · LNB · 행정 폼 템플릿. eGovFrame 구조에 맞췄습니다.',
    owner: '디자인시스템', href: '#', status: 'pending', preview: 'kit',
    stack: ['Spring Boot', 'Java', 'eGovFrame'],
  },
  {
    role: 'developer', kind: '스타터킷', title: '스타터 킷 — HTML · JSP (동작 예제)',
    project: '공통', year: '2026', format: 'HTML', size: '—',
    desc: '빌드 도구 없이 바로 열리는 신청 관리 화면. GNB · 검색 · 표 · 다단계 폼 · 모달 · 푸터가 모두 들어 있고 접근성 검사 위반 0건입니다.',
    owner: '디자인시스템', href: 'starters/html/index.html', status: 'ready', preview: 'kit',
    stack: ['HTML/JSP', 'Thymeleaf'],
  },
  {
    role: 'developer', kind: '퍼블리싱', title: '행정 폼 퍼블리싱 템플릿',
    project: '플랫폼정부', year: '2025', format: 'HTML', size: '—',
    desc: '다단계 신청 폼 · 약관 동의 · 파일 첨부. 접근성 검수를 통과한 마크업입니다.',
    owner: '정보서비스본부', href: '#', status: 'pending', preview: 'doc',
    stack: ['HTML/JSP'],
  },
]
