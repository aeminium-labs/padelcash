import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
    docs: string
    aeminium: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Padelcash",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [],
  links: {
    twitter: "https://twitter.com/padelcash",
    aeminium: "https://github.com/aeminium-labs",
    github: "https://github.com/aeminium-labs/padelcash",
    docs: "https://padel.cash",
  },
}
