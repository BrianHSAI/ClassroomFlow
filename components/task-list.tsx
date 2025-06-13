"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronDown, FileText, MessageSquare, MoreHorizontal, Paperclip } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for tasks
const mockTasks = [
  {
    id: "1",
    title: "Research Phase: Select an Ecosystem",
    description: "Choose a specific ecosystem to research and get approval from teacher",
    status: "completed",
    priority: "high",
    dueDate: "2023-06-15",
    category: "Research",
    attachments: 2,
    comments: 3,
    assignedTo: [
      { name: "Student 1", avatar: "/placeholder.svg?height=24&width=24", initials: "S1" },
      { name: "Student 2", avatar: "/placeholder.svg?height=24&width=24", initials: "S2" },
    ],
  },
  {
    id: "2",
    title: "Research Phase: Gather Information",
    description: "Collect data about the ecosystem's climate, geography, and biodiversity",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-06-20",
    category: "Research",
    attachments: 1,
    comments: 5,
    assignedTo: [
      { name: "Student 3", avatar: "/placeholder.svg?height=24&width=24", initials: "S3" },
      { name: "Student 4", avatar: "/placeholder.svg?height=24&width=24", initials: "S4" },
    ],
  },
  {
    id: "3",
    title: "Research Phase: Analyze Relationships",
    description: "Study the relationships between organisms in the ecosystem",
    status: "not-started",
    priority: "medium",
    dueDate: "2023-06-22",
    category: "Research",
    attachments: 0,
    comments: 1,
    assignedTo: [{ name: "Student 5", avatar: "/placeholder.svg?height=24&width=24", initials: "S5" }],
  },
  {
    id: "4",
    title: "Presentation Phase: Create Outline",
    description: "Develop an outline for the presentation including key points to cover",
    status: "not-started",
    priority: "medium",
    dueDate: "2023-06-25",
    category: "Presentation",
    attachments: 0,
    comments: 0,
    assignedTo: [
      { name: "Student 1", avatar: "/placeholder.svg?height=24&width=24", initials: "S1" },
      { name: "Student 3", avatar: "/placeholder.svg?height=24&width=24", initials: "S3" },
    ],
  },
  {
    id: "5",
    title: "Presentation Phase: Visual Aids",
    description: "Create visual aids including charts, graphs, and images for the presentation",
    status: "not-started",
    priority: "low",
    dueDate: "2023-06-27",
    category: "Presentation",
    attachments: 0,
    comments: 0,
    assignedTo: [
      { name: "Student 2", avatar: "/placeholder.svg?height=24&width=24", initials: "S2" },
      { name: "Student 4", avatar: "/placeholder.svg?height=24&width=24", initials: "S4" },
    ],
  },
]

export default function TaskList() {
  const [tasks, setTasks] = useState(mockTasks)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "completed" ? "in-progress" : "completed"
          return { ...task, status: newStatus }
        }
        return task
      }),
    )
  }

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low</Badge>
      default:
        return null
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Research":
        return (
          <Badge variant="outline" className="border-blue-300 text-blue-800 dark:text-blue-300">
            Research
          </Badge>
        )
      case "Presentation":
        return (
          <Badge variant="outline" className="border-purple-300 text-purple-800 dark:text-purple-300">
            Presentation
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "border rounded-lg overflow-hidden transition-all",
            task.status === "completed" ? "bg-muted/50" : "bg-card",
          )}
        >
          <div className="flex items-center p-4 cursor-pointer" onClick={() => toggleTaskExpand(task.id)}>
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={() => toggleTaskStatus(task.id)}
              onClick={(e) => e.stopPropagation()}
              className="mr-4"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={cn("font-medium", task.status === "completed" && "line-through text-muted-foreground")}>
                  {task.title}
                </h3>
                <div className="flex gap-2">
                  {getPriorityBadge(task.priority)}
                  {getCategoryBadge(task.category)}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>Due {task.dueDate}</span>
                </div>
                {task.attachments > 0 && (
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>{task.attachments}</span>
                  </div>
                )}
                {task.comments > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{task.comments}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="flex -space-x-2">
                {task.assignedTo.map((student, i) => (
                  <Avatar key={i} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                    <AvatarFallback className="text-[10px]">{student.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", expandedTask === task.id && "transform rotate-180")}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem>Add Comment</DropdownMenuItem>
                  <DropdownMenuItem>Attach File</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {expandedTask === task.id && (
            <div className="px-4 pb-4 pt-0 border-t mt-2">
              <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="sm" className="gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Add Comment
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Paperclip className="h-3.5 w-3.5" />
                  Attach File
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  View Details
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
