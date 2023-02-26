import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="mb-24">{children}</main>
      <SiteFooter />
    </>
  )
}
