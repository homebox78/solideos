# SOLIDEO Design System — React 컴포넌트 키트

문서 사이트가 쓰는 컴포넌트 그대로입니다. shadcn/ui 방식이라 **소스를 프로젝트에 복사**해 씁니다.
npm 저장소에 접근할 수 없는 폐쇄망에서도 이 폴더만 반입하면 됩니다.

## 1. 복사

```
dist/react/src/components/ui/  →  <프로젝트>/src/components/ui/
dist/react/src/lib/utils.ts    →  <프로젝트>/src/lib/utils.ts
dist/react/src/styles/         →  <프로젝트>/src/styles/
dist/react/src/solideo.css     →  <프로젝트>/src/solideo.css
dist/react/public/fonts/       →  <프로젝트>/public/fonts/
```

쓰지 않는 컴포넌트 파일은 지워도 됩니다. 단 `icon.tsx` · `icons.generated.ts` 는
여러 컴포넌트가 함께 쓰므로 남겨 두세요.

## 2. 의존성

```json
"dependencies": {
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "radix-ui": "^1.6.7",
  "class-variance-authority": "^0.7.1",
  "cn": "^0.2.6",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.6.0",
  "sonner": "^2.0.8",
  "next-themes": "^0.4.6"
},
"devDependencies": {
  "tailwindcss": "^4.3.3",
  "@tailwindcss/vite": "^4.3.3",
  "tw-animate-css": "^1.4.0"
}
```

## 3. 설정

`vite.config.ts`

```ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
})
```

`tsconfig.json` — `"paths": { "@/*": ["./src/*"] }`

`src/main.tsx` — `import './solideo.css'`

## 4. 사용

```tsx
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/field'

<TextField label="사업자등록번호" required hint="하이픈 없이 숫자만 입력해도 됩니다." />
<Button>신청서 제출</Button>
```

## 글자 크기 설정 (KRDS)

`<html data-font-scale="lg">` 또는 `"xl"` 을 붙이면 전체 글자가 비례해 커집니다.
규칙은 `styles/solideo-tokens.css` 에 들어 있습니다.

## 주의

- 체크박스 · 라디오 · 스위치 · 셀렉트는 Radix 가 `<button>` 으로 그립니다.
  `<label>` 만으로는 접근 가능한 이름이 붙지 않으니 **`CheckboxField` 같은 `field.tsx` 조합**을 쓰세요.
- 치수는 `component.*` 토큰을 읽습니다. `h-9` · `rounded-md` 처럼 값을 직접 쓰면
  CSS 판(`solideo-components.css`)과 어긋납니다.

version 1.3.2
