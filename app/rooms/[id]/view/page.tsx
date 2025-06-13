"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Printer } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useLanguage } from "@/lib/i18n/language-context"
import type { RoomData } from "@/lib/types"
import { motion } from "framer-motion"

export default function StudentViewPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<RoomData | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("classroomFlowRooms") || "[]")
    const foundRoom = storedRooms.find((r: RoomData) => r.id === params.id)

    if (foundRoom) {
      setRoom(foundRoom)
    } else {
      router.push("/")
    }
  }, [params.id, router])

  const handleSubTaskToggle = (taskId: string, completed: boolean) => {
    if (!room) return

    const updatedSubTasks = room.subTasks.map((task) => (task.id === taskId ? { ...task, completed } : task))

    const completedCount = updatedSubTasks.filter((task) => task.completed).length
    const progress = updatedSubTasks.length > 0 ? Math.round((completedCount / updatedSubTasks.length) * 100) : 0

    const updatedRoom = {
      ...room,
      subTasks: updatedSubTasks,
      progress,
    }

    // Update in localStorage
    const storedRooms = JSON.parse(localStorage.getItem("classroomFlowRooms") || "[]")
    const updatedRooms = storedRooms.map((r: RoomData) => (r.id === updatedRoom.id ? updatedRoom : r))
    localStorage.setItem("classroomFlowRooms", JSON.stringify(updatedRooms))

    setRoom(updatedRoom)
  }

  const handleTextChange = (taskId: string, text: string) => {
    if (!room) return

    const updatedSubTasks = room.subTasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, text }

        // Check if the text meets the required character count
        if (task.requiredCharacters && text.length >= task.requiredCharacters) {
          updatedTask.completed = true
        } else {
          updatedTask.completed = false
        }

        return updatedTask
      }
      return task
    })

    const completedCount = updatedSubTasks.filter((task) => task.completed).length
    const progress = updatedSubTasks.length > 0 ? Math.round((completedCount / updatedSubTasks.length) * 100) : 0

    const updatedRoom = {
      ...room,
      subTasks: updatedSubTasks,
      progress,
    }

    // Update in localStorage
    const storedRooms = JSON.parse(localStorage.getItem("classroomFlowRooms") || "[]")
    const updatedRooms = storedRooms.map((r: RoomData) => (r.id === updatedRoom.id ? updatedRoom : r))
    localStorage.setItem("classroomFlowRooms", JSON.stringify(updatedRooms))

    setRoom(updatedRoom)
  }

  const handlePrintRoom = () => {
    if (!room) return

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    // Generate HTML content for printing
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${room.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { margin-bottom: 5px; }
          .deadline { color: #666; margin-bottom: 20px; }
          .description { margin-bottom: 30px; }
          .tasks { margin-bottom: 30px; }
          .task { margin-bottom: 15px; padding-left: 20px; position: relative; }
          .task:before { content: "□"; position: absolute; left: 0; }
          .task.completed:before { content: "☑"; }
          .text-task { margin-bottom: 25px; }
          .text-task-title { font-weight: bold; margin-bottom: 5px; }
          .text-area { border: 1px solid #ccc; padding: 10px; min-height: 100px; white-space: pre-wrap; }
          .required-chars { color: #666; font-size: 0.9em; margin-top: 5px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${room.title}</h1>
        <div class="deadline">Due: ${format(parseISO(room.deadline), "PPP")}</div>
        <div class="description">${room.description}</div>
        
        <div class="tasks">
          <h2>Tasks:</h2>
          ${room.subTasks
            .map((task) => {
              if (task.type === "text") {
                return `
                  <div class="text-task">
                    <div class="text-task-title">${task.title}</div>
                    <div class="text-area">${task.text || ""}</div>
                    <div class="required-chars">Required characters: ${task.requiredCharacters} (Current: ${
                      (task.text || "").length
                    })</div>
                  </div>
                `
              } else {
                return `<div class="task ${task.completed ? "completed" : ""}">${task.title}</div>`
              }
            })
            .join("")}
        </div>
        
        <div class="no-print">
          <button onclick="window.print()">Print</button>
        </div>
      </body>
      </html>
    `

    // Write to the new window and trigger print
    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Give the browser a moment to render before printing
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  if (!room) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <motion.div 
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="card-gradient shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{room.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {t("rooms.due")} {format(parseISO(room.deadline), "PPP")}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handlePrintRoom} className="gap-2 shadow-sm">
                  <Printer className="h-4 w-4" />
                  {t("common.printRoom")}
                </Button>
                <div className="text-right">
                  <div className="text-2xl font-bold">{room.progress}%</div>\
