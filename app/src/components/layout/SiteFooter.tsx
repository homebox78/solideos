import { Link } from 'react-router-dom'
import { SYSTEM } from '@/data/ia'
import { Separator } from '@/components/ui/separator'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted">
      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="text-[0.9375rem] font-extrabold tracking-tight">
              SOLIDEO <span className="font-medium text-text-secondary">Design System</span>
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {SYSTEM.name} {SYSTEM.version} · 데이터로 그리는 혁신적인 미래
            </p>
          </div>
          <nav aria-label="관련 문서" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
            <Link to="/resources#library" className="hover:text-text-primary">자산 라이브러리</Link>
            <Link to="/resources#install" className="hover:text-text-primary">설치</Link>
            <Link to="/resources#checklist" className="hover:text-text-primary">Check List</Link>
            <Link to="/resources#release" className="hover:text-text-primary">Release Note</Link>
            <Link to="/#inclusion" className="hover:text-text-primary">디지털 포용</Link>
          </nav>
        </div>

        <Separator className="my-8" />

        <p className="text-xs leading-relaxed text-text-tertiary">
          ⓒ 2026 SOLIDEO Corporation. All rights reserved.
          <br />
          본 자료는 {SYSTEM.org}의 사전 서면 승인을 받은 경우에 한해 복제, 전송, 배포 등의 사용이 가능합니다.
        </p>
      </div>
    </footer>
  )
}
