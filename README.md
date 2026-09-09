# SOLIDEO Design System — Solid Flow

솔리데오가 수행하는 SI 프로젝트의 공통 UI/UX 기반입니다.
개발 언어와 무관하게 같은 화면 · 같은 접근성이 나오도록 **디자인 토큰**과 **구현 계약**을 제공합니다.

- 문서 사이트: Tailwind CSS v4 + shadcn/ui (React) 로 구축
- 공공 사업 기준: **KRDS**(대한민국 정부 디자인시스템) 분류 · **KWCAG 2.2 AA** 준수
- 브랜드: 솔리데오 CI 크림슨 `#C12554`

---

## 빠른 시작

```bash
# 전체 검증 — 토큰 생성 · 아이콘 생성 · 접근성 · 폐쇄망 보안
npm run check

# 문서 사이트 실행
cd app && npm install && npm run dev    # http://localhost:5173
```

| 명령 | 하는 일 |
|---|---|
| `npm run build:tokens` | tokens.json → 15종 산출물 |
| `npm run build:icons` | Material Symbols → 인라인 아이콘 |
| `npm run build:css` | CSS 컴포넌트 검증 · 배포 · 스타터 킷 갱신 |
| `npm run build:krds` | KRDS 컴포넌트 55종 + 기본 패턴 12종 → 대응표 · 지침 |
| `npm run verify` | 명도 대비 · 토큰 계층 검증 |
| `npm run audit` | 외부 참조 · 개인정보 감사 |
| `npm run check` | 위 4가지를 한 번에 (CI 게이트) |

---

## 구조

```
solideo/
├─ tokens/
│  ├─ tokens.json        ← 단일 원본. 값을 바꾸려면 여기만 고칩니다
│  ├─ build.mjs          ← 15종 산출물 생성 (무의존)
│  └─ verify.mjs         ← 접근성 · 토큰 계층 검증 (CI 게이트)
├─ tools/
│  ├─ build-icons.mjs    ← Material Symbols에서 쓰는 아이콘만 인라인으로 굽기
│  ├─ build-krds.mjs     ← KRDS 컴포넌트 55종 대응표 · 지침 생성
│  ├─ build-krds-patterns.mjs  ← KRDS 기본 패턴 12종 대응표 · 지침 생성
│  ├─ krds-cache/        ← KRDS 수집 결과 (폐쇄망에서도 재생성 가능)
│  └─ audit-offline.mjs  ← 외부 참조 · 개인정보 감사 (CI 게이트)
├─ css/
│  └─ solideo-components.css  ← CSS 전용 컴포넌트 원본 (퍼블리셔용)
├─ starters/
│  └─ html/              ← 빌드 도구 없이 바로 열리는 동작 예제
├─ dist/                 ← 생성된 산출물. 프로젝트에 복사해 사용
└─ app/                  ← 문서 사이트 (React + Tailwind v4 + shadcn/ui)
   ├─ src/data/ia.ts        정보구조 — 여기만 고치면 GNB·LNB·검색이 따라옴
   ├─ src/data/library.ts   자산 라이브러리 목록
   ├─ src/components/ui/    shadcn 컴포넌트 24종 (프로젝트가 소유하는 소스)
   └─ src/styles/           tokens.json에서 자동 생성된 CSS
```

---

## 스택별 적용

| 스택 | 파일 | 비고 |
|---|---|---|
| 순수 HTML · JSP · Thymeleaf | `solideo-tokens.css` + `solideo-components.css` | 빌드 도구 없음. `.sds-*` 클래스 70개 |
| React + shadcn/ui | `solideo-shadcn.css` + `solideo-tokens.js` | 이 저장소의 `app/` 이 그 구현 |
| Vue 3 | `solideo-tokens.css` + `.js` | SFC에서 `var()` 직접 참조 |
| Quasar | `quasar.variables.sass` | `$primary` 등 브랜드 변수 연결 |
| Spring Boot · Java | `solideo-tokens.properties` · `SolideoTokens.java` | 메일 · PDF 등 서버 렌더링 |
| Sass · Less | `solideo-tokens.scss` · `.less` | 레거시 프로젝트 |
| Tailwind v3 | `tailwind.preset.cjs` | v4는 shadcn 레이어 사용 |
| Figma · Style Dictionary | `solideo-tokens.flat.json` | 외부 도구 연동 |

가장 단순한 형태:

```html
<link rel="stylesheet" href="/css/solideo-tokens.css">

<button style="background: var(--fill-accent); color: var(--text-inverse);">
  신청서 제출
</button>
```

---

## 토큰 체계

**Primitive → Semantic 2계층.** 제품 코드는 Semantic만 참조합니다.

```css
/* 안됨 */
.submit { background: #C12554; }
.submit { background: var(--crimson-500); }   /* Primitive 직접 참조도 금지 */

/* 됨 */
.submit { background: var(--fill-accent); }
```

- Primitive: `--gray-25 ~ 900`(20단계), `--crimson/ink/green/blue/amber/red-100 ~ 800`, `--opacity-*`
- Semantic: `--text-*` `--bg-*` `--fill-*` `--border-*` `--icon-*` `--accent-*`
- shadcn 표준 변수(`--primary`, `--border`, `--ring` …)가 Semantic에 연결되어 있어
  컴포넌트 코드를 고치지 않고 브랜드만 바뀝니다.

### 검증이 CI 게이트입니다

`node tokens/verify.mjs` 는 다음을 확인하고, 실패하면 종료 코드 1을 반환합니다.

- 시맨틱 토큰이 primitive만 참조하는가 (계층 역전 차단)
- 텍스트가 흰 배경 · 회색 배경에서 4.5:1 이상인가
- 버튼 · 테두리 · 포커스링 등 UI 요소가 3:1 이상인가
- Accent와 Critical이 서로 충분히 구별되는가

> 실제로 이 검증이 입력 필드 테두리가 2.23:1로 미달인 것을 잡아 `gray.300 → gray.400`으로 올렸습니다.

---

## 폐쇄망 · 보안

공공 SI는 대부분 망분리 환경입니다. **런타임 외부 요청이 0건**이 되도록 설계했습니다.

| 항목 | 일반적인 방식 | 이 시스템 |
|---|---|---|
| 웹폰트 | Google Fonts CDN | Pretendard woff2 4종을 `app/public/fonts/` 에 포함 |
| 아이콘 | Material Symbols 폰트 CDN | 쓰는 아이콘만 path 데이터로 번들에 인라인 (39개) |
| CSS · JS | unpkg · jsdelivr | 전부 로컬 번들. 외부 스크립트 태그 없음 |
| 분석 · 추적 | GA · Hotjar 삽입 | 넣지 않음 |
| 상태 저장 | 서버 · 외부 스토리지 | 글자·화면 설정만 `localStorage` |

```bash
$ npm run audit

  PASS  CDN-01  외부 호스트 참조
  PASS  CDN-02  원격 CSS @import
  PASS  CDN-03  원격 스크립트 · 스타일 태그
  PASS  NET-01  외부 전송 호출
  PASS  PII-01  개인정보로 보이는 저장소 키

외부 요청 0건. 폐쇄망에 그대로 반입할 수 있습니다.
```

CI에 걸어 두면 누군가 CDN 링크를 추가하는 순간 빌드가 실패합니다.

### 아이콘

Google **Material Symbols**(Outlined 400, Apache 2.0)를 씁니다. CDN을 호출하지 않고,
실제로 쓰는 아이콘만 골라 path 데이터를 번들에 인라인으로 굽습니다.

```tsx
import { Icon } from '@/components/ui/icon'

<Icon name="search" />                  // 장식 (aria-hidden 자동)
<Icon name="close" label="닫기" />       // 의미 전달 (role="img")
<Icon name="download" size="lg" />      // sm(16) md(20) lg(24) xl(32)
```

아이콘 추가는 `tools/build-icons.mjs` 의 `ICONS` 에 한 줄 넣고 `npm run build:icons`.

---

## KRDS 준수 요소

공공 · 행정 사업 화면에 그대로 옮겨 쓰는 구현이 문서 사이트에 포함되어 있습니다.

| 요소 | 구현 |
|---|---|
| 전자정부 누리집 안내 배너 | `app/src/components/layout/GovBanner.tsx` |
| 본문 바로가기 | `app/src/App.tsx` — 첫 번째 포커스 대상 |
| 글자 크기 3단계 조절 | `app/src/components/layout/A11ySettings.tsx` |
| 선명한 화면 모드 | 토큰 `[data-contrast="high"]` 한 줄로 전체 전환 |
| 컴포넌트 · 패턴 분류 | `app/src/data/ia.ts` 의 `krds` 필드로 대조 가능 |
| 대응표 | KRDS 컴포넌트 55종 + 기본 패턴 12종 = 67종 중 64종 대응 (96%) |
| 항목별 KRDS 지침 | 각 문서 하단에 자동 표시 (723문장) |
| 폐쇄망 재생성 | `tools/krds-cache/` 에 수집 결과를 두어 네트워크 없이 빌드 |

---

## 참고

- 컴포넌트 · 패턴 분류: [KRDS](https://www.krds.go.kr)
- 문서 구성 형식: KT UX Design System (Seamless Flow)
- 컴포넌트 기반: [shadcn/ui](https://ui.shadcn.com) (Radix UI)
- 아이콘: Google Material Symbols · Apache License 2.0
- 서체: Pretendard · SIL Open Font License 1.1

ⓒ 2026 SOLIDEO Corporation. All rights reserved.
