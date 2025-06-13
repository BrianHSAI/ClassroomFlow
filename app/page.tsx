"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, FileUp, Plus, CheckCircle, Share2, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { motion } from "framer-motion"

export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const roomData = JSON.parse(content)

        // Store the imported room in localStorage
        const rooms = JSON.parse(localStorage.getItem("classroomFlowRooms") || "[]")

        // Check if room with same ID already exists
        const existingRoomIndex = rooms.findIndex((r: any) => r.id === roomData.id)

        if (existingRoomIndex >= 0) {
          // Replace existing room
          rooms[existingRoomIndex] = roomData
        } else {
          // Add new room
          rooms.push(roomData)
        }

        localStorage.setItem("classroomFlowRooms", JSON.stringify(rooms))

        toast({
          title: t("common.roomImported"),
          description: `"${roomData.title}" ${t("common.roomImported").toLowerCase()}`,
        })

        // Navigate to the rooms page
        router.push("/rooms")
      } catch (error) {
        toast({
          title: t("common.errorImporting"),
          description: t("common.invalidFile"),
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    }

    reader.readAsText(file)
  }

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
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {t("home.headline")}
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">{t("home.subheadline")}</p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="button-gradient shadow-lg">
                  <Link href="/create-room">{t("home.createNewRoom")}</Link>
                </Button>
                <Button variant="outline" size="lg" className="shadow-sm" asChild>
                  <Link href="/rooms">{t("common.viewRooms")}</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="mx-auto lg:mx-0 relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-gray-900/60 flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col card-gradient">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-md bg-primary p-1 text-primary-foreground">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold">{t("rooms.title")}</h3>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-8 bg-blue-100 dark:bg-gray-700 rounded-md flex items-center px-3 text-sm">
                      <span className="w-1/3">{t("room.subTasks")} 1</span>
                      <span className="ml-auto">June 15</span>
                    </div>
                    <div className="h-8 bg-green-100 dark:bg-gray-700 rounded-md flex items-center px-3 text-sm">
                      <span className="w-1/3">{t("room.subTasks")} 2</span>
                      <span className="ml-auto">June 22</span>
                    </div>
                    <div className="h-8 bg-yellow-100 dark:bg-gray-700 rounded-md flex items-center px-3 text-sm">
                      <span className="w-1/3">{t("room.subTasks")} 3</span>
                      <span className="ml-auto">June 29</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight">{t("home.keyFeatures")}</h2>
            <p className="text-muted-foreground mt-2">{t("home.featuresDescription")}</p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <Card className="card-hover h-full card-gradient">
                <CardHeader>
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("home.easyTaskManagement")}</CardTitle>
                  <CardDescription>{t("home.easyTaskManagementDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t("home.easyTaskManagementDetails")}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-hover h-full card-gradient">
                <CardHeader>
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("home.simpleSharing")}</CardTitle>
                  <CardDescription>{t("home.simpleSharingDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t("home.simpleSharingDetails")}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-hover h-full card-gradient">
                <CardHeader>
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("home.progressTracking")}</CardTitle>
                  <CardDescription>{t("home.progressTrackingDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t("home.progressTrackingDetails")}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1">
              <Card className="card-hover card-gradient">
                <CardHeader>
                  <CardTitle>{t("common.createRoom")}</CardTitle>
                  <CardDescription>{t("createRoom.description")}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button asChild className="gap-2 shadow-md">
                    <Link href="/create-room">
                      <Plus className="h-4 w-4" />
                      {t("common.createRoom")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-hover card-gradient">
                <CardHeader>
                  <CardTitle>{t("common.importRoom")}</CardTitle>
                  <CardDescription>{t("home.importRoomDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <Label htmlFor="room-file" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-3">
                        <FileUp className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{t("common.uploadJson")}</span>
                      <Input
                        id="room-file"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-hover card-gradient">
                <CardHeader>
                  <CardTitle>{t("common.viewRooms")}</CardTitle>
                  <CardDescription>{t("home.viewRoomsDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button variant="outline" asChild className="gap-2 shadow-sm">
                    <Link href="/rooms">
                      <BookOpen className="h-4 w-4" />
                      {t("common.viewRooms")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
