import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { GovBanner } from '@/components/layout/GovBanner'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
const Home = lazy(() => import('@/pages/Home'))
const Foundations = lazy(() => import('@/pages/Foundations'))
const Components = lazy(() => import('@/pages/Components'))
const Patterns = lazy(() => import('@/pages/Patterns'))
const VisualCommunication = lazy(() => import('@/pages/VisualCommunication'))
const UxWriting = lazy(() => import('@/pages/UxWriting'))
const AiInteraction = lazy(() => import('@/pages/AiInteraction'))
const Resources = lazy(() => import('@/pages/Resources'))

/*
 * HashRouter 를 씁니다.
 *
 * 공공 SI 산출물은 Apache · Tomcat · nginx 정적 경로나 WAR 안에 그대로 반입되는
 * 경우가 많고, 서버 rewrite 규칙을 추가할 수 없는 현장도 있습니다.
 * BrowserRouter 는 /foundations 로 새로고침하면 404 가 나므로,
 * 서버 설정에 의존하지 않는 해시 라우팅을 기본으로 합니다.
 * 하위 디렉터리에 두거나 file:// 로 열어도 동작합니다.
 */
export default function App() {
  return (
        <HashRouter>
      <TooltipProvider delayDuration={200}>
        {/* KRDS — 본문 바로가기 */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
        >
          본문 바로가기
        </a>
        <GovBanner />
        <SiteHeader />
        {/*
          라우트 단위 코드 분할.
          저사양 단말 · 저속 내부망에서 첫 화면이 먼저 뜨도록 합니다.
          청크는 모두 함께 반입되므로 폐쇄망에서도 추가 다운로드가 없습니다.
        */}
        <Suspense fallback={<div className="p-16 text-sm text-text-secondary">불러오는 중입니다…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/foundations" element={<Foundations />} />
          <Route path="/components" element={<Components />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/visual-communication" element={<VisualCommunication />} />
          <Route path="/ux-writing" element={<UxWriting />} />
          <Route path="/ai-interaction" element={<AiInteraction />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
        </Suspense>
        <SiteFooter />
        <Toaster position="bottom-center" />
      </TooltipProvider>
    </HashRouter>
  )
}
