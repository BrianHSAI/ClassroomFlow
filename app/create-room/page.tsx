"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Trash } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SubTask } from "@/lib/types"

export default function CreateRoomPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subTasks, setSubTasks] = useState<SubTask[]>([])
  const [newSubTask, setNewSubTask] = useState("")
  const [newTaskType, setNewTaskType] = useState<"checkbox" | "text">("checkbox")
  const [requiredCharacters, setRequiredCharacters] = useState(100)
  const [date, setDate] = useState<Date>()

  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
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

      setSubTasks([...subTasks, task])
      setNewSubTask("")
      setNewTaskType("checkbox")
      setRequiredCharacters(100)
    }
  }

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter((task) => task.id !== id))
  }

  const handleCreateRoom = () => {
    if (!title) {
      toast({
        title: t("createRoom.missingTitle"),
        description: t("createRoom.pleaseEnterTitle"),
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: t("createRoom.missingDeadline"),
        description: t("createRoom.pleaseSelectDeadline"),
        variant: "destructive",
      })
      return
    }

    const roomData = {
      id: crypto.randomUUID(),
      title,
      description,
      subTasks,
      deadline: date.toISOString(),
      createdAt: new Date().toISOString(),
      progress: 0,
    }

    // Store the room in localStorage
    const rooms = JSON.parse(localStorage.getItem("classroomFlowRooms") || "[]")
    rooms.push(roomData)
    localStorage.setItem("classroomFlowRooms", JSON.stringify(rooms))

    toast({
      title: t("createRoom.roomCreated"),
      description: t("createRoom.roomCreatedSuccess"),
    })

    router.push(`/rooms/${roomData.id}`)
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("createRoom.title")}</CardTitle>
          <CardDescription>{t("createRoom.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t("createRoom.roomTitle")}</Label>
            <Input
              id="title"
              placeholder={t("createRoom.roomTitlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("createRoom.roomDescription")}</Label>
            <Textarea
              id="description"
              placeholder={t("createRoom.roomDescriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("createRoom.deadline")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : t("createRoom.selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <Label>{t("createRoom.subTasks")}</Label>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Select value={newTaskType} onValueChange={(value) => setNewTaskType(value as "checkbox" | "text")}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Task Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="text">Text Field</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder={t("createRoom.addSubTask")}
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddSubTask()
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddSubTask}>
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

            <div className="space-y-2">
              {subTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("createRoom.noSubTasks")}</p>
              ) : (
                subTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <span>{task.title}</span>
                      {task.type === "text" && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">
                          {t("room.requiredCharacters")}: {task.requiredCharacters}
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveSubTask(task.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateRoom} className="w-full">
            {t("common.createRoom")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
