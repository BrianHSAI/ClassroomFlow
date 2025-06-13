"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, LinkIcon, Plus, Printer } from "lucide-react"
import { format, parseISO } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SubTask, RoomData } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

export default function RoomPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<RoomData | null>(null)
  const [newSubTask, setNewSubTask] = useState("")
  const [newTaskType, setNewTaskType] = useState<"checkbox" | "text">("checkbox")
  const [requiredCharacters, setRequiredCharacters] = useState(100)
  const [shareLink, setShareLink] = useState("")

  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("classroomFlowRooms") || "[]")
    const foundRoom = storedRooms.find((r: RoomData) => r.id === params.id)

    if (foundRoom) {
      setRoom(foundRoom)
      // Generate a shareable link
      const baseUrl = window.location.origin
      setShareLink(`${baseUrl}/rooms/${foundRoom.id}/view`)
    } else {
      router.push("/rooms")
    }
  }, [params.id, router])

  const updateRoom = (updatedRoom: RoomData) => {
    const storedRooms = JSON.parse(localStorage.getItem("classroomFlowRooms") || "[]")
    const updatedRooms = storedRooms.map((r: RoomData) => (r.id === updatedRoom.id ? updatedRoom : r))
    localStorage.setItem("classroomFlowRooms", JSON.stringify(updatedRooms))
    setRoom(updatedRoom)
  }

  const handleProgressChange = (value: number[]) => {
    if (!room) return
    const updatedRoom = { ...room, progress: value[0] }
    updateRoom(updatedRoom)
  }

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

    updateRoom(updatedRoom)
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

    updateRoom(updatedRoom)
  }

  const handleAddSubTask = () => {
    if (!room || !newSubTask.trim()) return

    const task: SubTask = {
      id: crypto.randomUUID(),
      title: newSubTask,
      completed: false,
      type: newTaskType,
    }

    if (newTaskType === "text") {
      task.requiredCharacters = requiredCharacters
      task.text = ""
    }

    const updatedSubTasks = [...room.subTasks, task]

    const updatedRoom = { ...room, subTasks: updatedSubTasks }
    updateRoom(updatedRoom)
    setNewSubTask("")
    setNewTaskType("checkbox")
    setRequiredCharacters(100)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    toast({
      title: t("common.linkCopied"),
      description: shareLink,
    })
  }

  const handleExportRoom = () => {
    if (!room) return

    const dataStr = JSON.stringify(room, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `${room.title.replace(/\s+/g, "-").toLowerCase()}-room.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
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
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold">{room.title}</h1>
          <p className="text-muted-foreground mt-1">
            {t("rooms.due")} {format(parseISO(room.deadline), "PPP")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrintRoom} className="gap-2 shadow-sm">
            <Printer className="h-4 w-4" />
            {t("common.printRoom")}
          </Button>
          <Button variant="outline" onClick={handleExportRoom} className="gap-2 shadow-sm">
            <Download className="h-4 w-4" />
            {t("common.exportRoom")}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-gradient shadow-md">
            <CardHeader>
              <CardTitle>{t("room.roomDetails")}</CardTitle>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t("room.overallProgress")}</Label>
                  <span className="font-medium">{room.progress}%</span>
                </div>
                <div className="relative">
                  <Slider value={[room.progress]} onValueChange={handleProgressChange} max={100} step={1} />
                  <div className="absolute -bottom-5 left-0 text-xs text-muted-foreground">0%</div>
                  <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">100%</div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <Label>{t("room.subTasks")}</Label>
                  <div className="text-sm bg-muted px-2 py-1 rounded-full">
                    {room.subTasks.filter((t) => t.completed).length}/{room.subTasks.length} {t("room.completed")}
                  </div>
                </div>

                <div className="space-y-4">
                  {room.subTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      className="border rounded-md p-4 card-hover"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <h3 className="font-medium mb-2">{task.title}</h3>

                      {task.type === "text" ? (
                        <div className="space-y-2">
                          <Textarea
                            value={task.text || ""}
                            onChange={(e) => handleTextChange(task.id, e.target.value)}
                            placeholder={t("room.textFieldPlaceholder")}
                            rows={4}
                            className="resize-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                          />
                          <div className="flex justify-between text-sm">
                            <span>
                              {t("room.characterCount")}: {(task.text || "").length} / {task.requiredCharacters}
                            </span>
                            <span className={task.completed ? "text-green-600 font-medium" : "text-muted-foreground"}>
                              {task.completed ? "✓ " + t("studentView.complete") : ""}
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent"
                              style={{
                                width: `${Math.min(100, ((task.text || "").length / task.requiredCharacters) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={task.id}
                            checked={task.completed}
                            onCheckedChange={(checked) => handleSubTaskToggle(task.id, checked === true)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={task.id}
                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                              task.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {t("studentView.complete")}
                          </label>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <Select
                        value={newTaskType}
                        onValueChange={(value) => setNewTaskType(value as "checkbox" | "text")}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder={t("common.taskType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkbox">{t("common.checkbox")}</SelectItem>
                          <SelectItem value="text">{t("common.textField")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder={t("room.addNewSubTask")}
                        value={newSubTask}
                        onChange={(e) => setNewSubTask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddSubTask()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddSubTask} className="shadow-sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {newTaskType === "text" && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="requiredChars" className="whitespace-nowrap">
                          {t("room.requiredCharacters")}:
                        </Label>
                        <Input
                          id="requiredChars"
                          type="number"
                          min="1"
                          value={requiredCharacters}
                          onChange={(e) => setRequiredCharacters(Number.parseInt(e.target.value) || 100)}
                          className="w-24"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="card-gradient shadow-md">
            <CardHeader>
              <CardTitle>{t("common.shareRoom")}</CardTitle>
              <CardDescription>{t("common.shareLinkDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("room.shareableLink")}</Label>
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly className="bg-muted/50" />
                  <Button variant="outline" size="icon" onClick={handleCopyLink} className="shadow-sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <div className="rounded-md bg-muted p-4 glass-effect">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t("room.studentViewDescription")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
