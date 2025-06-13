"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { BookOpen, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"

export default function Header() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">ClassroomFlow</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Home
              {pathname === "/" && (
                <motion.div
                  className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
            <Link
              href="/rooms"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative",
                pathname.startsWith("/rooms") ? "text-primary" : "text-muted-foreground",
              )}
            >
              {t("common.viewRooms")}
              {pathname.startsWith("/rooms") && (
                <motion.div
                  className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-primary"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm" className="hidden md:flex gap-2 shadow-md" asChild>
            <Link href="/create-room">
              <Plus className="h-4 w-4" />
              {t("common.createRoom")}
            </Link>
          </Button>
          <LanguageSelector />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
