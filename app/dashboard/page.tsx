import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Plus, BookOpen, Activity, FileUp, MessageSquare } from "lucide-react"
import Link from "next/link"
import RoomsList from "@/components/rooms-list"
import RecentActivity from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Room
        </Button>
      </div>

      <Tabs defaultValue="my-rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-rooms">My Rooms</TabsTrigger>
          <TabsTrigger value="shared-with-me">Shared with Me</TabsTrigger>
        </TabsList>
        <TabsContent value="my-rooms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">4 due this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student Submissions</CardTitle>
                <FileUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+8 since yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">+12 since yesterday</p>
              </CardContent>
            </Card>
          </div>

          <RoomsList />
        </TabsContent>
        <TabsContent value="shared-with-me">
          <Card>
            <CardHeader>
              <CardTitle>Shared Rooms</CardTitle>
              <CardDescription>Rooms that have been shared with you by other teachers.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No rooms have been shared with you yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent updates from your project rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Science Project Phase 1</p>
                  <p className="text-sm text-muted-foreground">Due in 2 days</p>
                </div>
                <div className="ml-auto font-medium text-sm text-orange-500">High Priority</div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Math Assignment Submission</p>
                  <p className="text-sm text-muted-foreground">Due in 3 days</p>
                </div>
                <div className="ml-auto font-medium text-sm text-yellow-500">Medium Priority</div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">History Research Paper</p>
                  <p className="text-sm text-muted-foreground">Due in 5 days</p>
                </div>
                <div className="ml-auto font-medium text-sm text-green-500">Low Priority</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/calendar">View All Deadlines</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
