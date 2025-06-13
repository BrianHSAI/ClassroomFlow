"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Plus, ArrowRight, BookOpen } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useLanguage } from "@/lib/i18n/language-context"
import type { RoomData } from "@/lib/types"
import { motion } from "framer-motion"

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomData[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("classroomFlowRooms") || "[]")
    setRooms(storedRooms)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="container py-8">
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">{t("rooms.title")}</h1>
        <Button asChild className="shadow-md">
          <Link href="/create-room" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("common.createRoom")}
          </Link>
        </Button>
      </motion.div>

      {rooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center p-8 card-gradient">
            <CardContent className="pt-6">
              <div className="rounded-full bg-muted w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mb-4 text-lg">{t("common.noRooms")}</p>
              <Button asChild className="shadow-md">
                <Link href="/create-room">{t("common.createFirstRoom")}</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {rooms.map((room) => (
            <motion.div key={room.id} variants={itemVariants}>
              <Card className="overflow-hidden card-hover card-gradient h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1">{room.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>

                  <div className="space-y-1">
                    <div className="text-sm flex justify-between">
                      <span>{t("rooms.progress")}</span>
                      <span className="font-medium">{room.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden progress-bar-animated">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${room.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>
                      {t("rooms.due")} {format(parseISO(room.deadline), "PPP")}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full group">
                    <Link href={`/rooms/${room.id}`} className="flex items-center justify-center">
                      {t("rooms.viewRoom")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
