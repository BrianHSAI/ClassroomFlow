import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, MessageSquare, Upload } from "lucide-react"

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "comment",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      content: "Added a comment on 'Research Phase' task",
      room: "Biology: Ecosystem Project",
      time: "10 minutes ago",
    },
    {
      id: 2,
      type: "upload",
      user: {
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MG",
      },
      content: "Uploaded 'Math_Assignment_3.pdf'",
      room: "Math: Geometry Fundamentals",
      time: "25 minutes ago",
    },
    {
      id: 3,
      type: "task",
      user: {
        name: "James Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JW",
      },
      content: "Marked 'Character Analysis' task as completed",
      room: "Literature Analysis",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "comment",
      user: {
        name: "Sophia Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SC",
      },
      content: "Added a comment on 'Renaissance Artists' task",
      room: "Art History: Renaissance",
      time: "2 hours ago",
    },
    {
      id: 5,
      type: "upload",
      user: {
        name: "Daniel Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DB",
      },
      content: "Uploaded 'WWII_Timeline.docx'",
      room: "World War II Research",
      time: "3 hours ago",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "upload":
        return <Upload className="h-4 w-4" />
      case "task":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.user.name}</p>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <span className="rounded-full bg-muted p-1">{getActivityIcon(activity.type)}</span>
              <span>{activity.content}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">{activity.room}</span> • {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
