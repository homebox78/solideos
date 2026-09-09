# SOLIDEO Design System — 프로젝트 컨텍스트

## 이 프로젝트가 무엇인가

솔리데오가 수행하는 **SI 프로젝트의 공통 UI/UX 기반**이다.
개발 언어와 무관하게 같은 화면 · 같은 접근성이 나오도록 디자인 토큰과 구현 계약을 제공한다.

- 문서 사이트: Tailwind CSS v4 + shadcn/ui (React) — `app/`
- 공공 사업 기준: **KRDS**(대한민국 정부 디자인시스템) 분류 · **KWCAG 2.2 AA**
- 브랜드: 솔리데오 CI 크림슨 `#C12554`
- **폐쇄망 전제** — 런타임 외부 요청 0건. CDN·웹폰트·아이콘 전부 번들에 포함

## 절대 어기면 안 되는 것

이 셋은 사업 검수와 직결된다. 편의를 위해 우회하지 않는다.

1. **CDN 금지** — 폰트·아이콘·스크립트를 외부에서 불러오지 않는다. 폐쇄망에서 죽고 이용자 IP가 외부로 나간다
2. **하드코딩 금지** — 색·간격·치수는 토큰만 참조한다. 원시값(`#C12554`)도 Primitive(`--crimson-500`)도 직접 쓰지 않고 Semantic(`--fill-accent`)을 쓴다
3. **개인정보** — 주민번호·연락처·토큰을 `localStorage`·URL·알림에 남기지 않는다

## 작업 전에 반드시

```bash
npm run check
```

토큰 생성 → 아이콘 생성 → CSS 검증 → KRDS 생성 → 접근성 검증 → 폐쇄망 감사를 한 번에 돈다.
**이 검사가 실제로 결함을 잡아 왔다** — 입력 필드 대비 2.23:1 미달, 글자 크기 설정 무효화,
React/CSS 구현 불일치(36px 대 40px)가 전부 여기서 나왔다. 통과 없이 완료라고 하지 않는다.

| 명령 | 하는 일 |
|---|---|
| `npm run check` | 전체 검증 (CI 게이트) |
| `npm run build` | 산출물 + 문서 사이트 빌드 |
| `npm run dev` | 문서 사이트 실행 |

## 구조

```
tokens/tokens.json     단일 원본. 값을 바꾸려면 여기만 고친다
tokens/build.mjs       15종 산출물 생성 (무의존)
tokens/verify.mjs      명도 대비 · 토큰 계층 검증
tools/build-icons.mjs      Material Symbols → 인라인 (CDN 없음)
tools/build-krds*.mjs      KRDS 컴포넌트 55종 · 기본 패턴 12종
tools/build-components-css.mjs  CSS 전용 컴포넌트 검증 · 배포
tools/audit-offline.mjs    외부 참조 · 개인정보 · 구현 일치 감사
css/solideo-components.css CSS 전용 컴포넌트 원본 (퍼블리셔용)
app/src/data/ia.ts     정보구조 — 여기만 고치면 GNB·LNB·검색이 따라옴
starters/html/         빌드 도구 없이 열리는 동작 예제
```

## 두 구현을 함께 유지한다

같은 컴포넌트를 **React 판(`app/src/components/ui/`)** 과 **CSS 판(`css/solideo-components.css`)** 으로
제공한다. React를 쓰지 않는 퍼블리셔·JSP 프로젝트가 이 시스템의 주 사용자이기 때문이다.

치수는 `component.*` 토큰을 양쪽이 함께 읽는다. 한쪽에 `h-9`·`rounded-md` 같은 값을 직접 쓰면
조용히 갈라지므로 감사 규칙 `PARITY-01`이 막는다.

## 문서를 고칠 때

문서와 구현이 어긋나면 **문서가 아니라 구현을 고친다.**
실제로 문서는 "버튼 반경 4px"이라 했는데 React가 8px이었고, 문서가 옳았다.

## 대상 사용자 셋

디자이너 · **퍼블리셔** · 개발자. 퍼블리셔가 가장 놓치기 쉽다 —
React 예제만 있고 HTML이 없으면 이 시스템은 그들에게 컬러 팔레트일 뿐이다.
컴포넌트 문서에는 **React / HTML·JSP 탭을 둘 다** 둔다.
