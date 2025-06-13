"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Copy, Edit, MoreHorizontal, Share2, Trash, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for project rooms
const mockRooms = [
  {
    id: "1",
    title: "Biology: Ecosystem Project",
    description: "Research and present on a specific ecosystem",
    subject: "science",
    tasks: 8,
    completedTasks: 3,
    dueDate: "2023-06-30",
  },
  {
    id: "2",
    title: "Math: Geometry Fundamentals",
    description: "Practice problems and group work on geometric principles",
    subject: "math",
    tasks: 12,
    completedTasks: 5,
    dueDate: "2023-07-15",
  },
  {
    id: "3",
    title: "Literature Analysis",
    description: "Character and theme analysis for 'To Kill a Mockingbird'",
    subject: "language",
    tasks: 6,
    completedTasks: 2,
    dueDate: "2023-07-05",
  },
  {
    id: "4",
    title: "Art History: Renaissance",
    description: "Research and presentation on Renaissance artists",
    subject: "arts",
    tasks: 5,
    completedTasks: 0,
    dueDate: "2023-07-20",
  },
  {
    id: "5",
    title: "World War II Research",
    description: "Group research project on WWII events and impacts",
    subject: "history",
    tasks: 10,
    completedTasks: 4,
    dueDate: "2023-07-10",
  },
]

export default function RoomsList() {
  const [rooms, setRooms] = useState(mockRooms)

  const getSubjectStyles = (subject: string) => {
    switch (subject) {
      case "science":
        return "theme-science"
      case "math":
        return "theme-math"
      case "language":
        return "theme-language"
      case "arts":
        return "theme-arts"
      case "history":
        return "theme-history"
      default:
        return ""
    }
  }

  const getSubjectBadge = (subject: string) => {
    const styles = {
      science: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      math: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      language: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      arts: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      history: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    }

    return styles[subject as keyof typeof styles] || ""
  }

  const calculateDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room.id} className={cn("overflow-hidden", getSubjectStyles(room.subject))}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <Badge className={getSubjectBadge(room.subject)}>
                  {room.subject.charAt(0).toUpperCase() + room.subject.slice(1)}
                </Badge>
                <CardTitle className="mt-2">{room.title}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{room.description}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {room.completedTasks}/{room.tasks} tasks
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(room.completedTasks / room.tasks) * 100}%` }} />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Due in {calculateDaysRemaining(room.dueDate)} days</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/rooms/${room.id}`}>View Room</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Card className="flex flex-col items-center justify-center border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="rounded-full bg-primary/10 p-3 mb-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-1">Create New Room</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">Set up a new project room for your class</p>
          <Button>Create Room</Button>
        </CardContent>
      </Card>
    </div>
  )
}
