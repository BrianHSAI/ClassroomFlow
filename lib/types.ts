export interface SubTask {
  id: string
  title: string
  completed: boolean
  type?: "checkbox" | "text"
  requiredCharacters?: number
  text?: string
}

export interface RoomData {
  id: string
  title: string
  description: string
  subTasks: SubTask[]
  deadline: string
  createdAt: string
  progress: number
}
