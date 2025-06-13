"use client"

import { useState } from "react"

// Mock data for comments
const mockComments = [
  {
    id: "1",
    user: {
      name: "Ms. Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MJ",
      role: "teacher",
    },
    content:
      "Remember to focus on the interdependencies between organisms in your ecosystem. This is a key aspect of the project.",
    timestamp: "2 days ago",
    task: "Research Phase: Analyze Relationships",
  },
  {
    id: "2",
    user: {
      name: "Student 1",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "S1",
      role: "student",
    },
    content:
      "I've found some great resources on the rainforest ecosystem. Should I focus more on the canopy layer or the forest floor?",
    timestamp: "1 day ago",
    task: "Research Phase: Gather Information",
  },
  {
    id: "3",
    user: {
      name: "Ms. Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MJ",
      role: "teacher",
    },
    content:
      "Great question! Try to cover both but emphasize the layer that has more biodiversity and interesting relationships between species.",
    timestamp: "1 day ago",
    task: "Research Phase: Gather Information",
  },
  {
    id: "4",
    user: {
      name: "Student 3",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "S3",
      role: "student",
    },
    content:
      "I'm having trouble finding information about the specific adaptations of plants in my ecosystem. Does anyone have any good resources?",
    timestamp: "12 hours ago",
    task: "Research Phase: Gather Information",
  },
  {
    id: "5",
    user: {
      name: "Student 2",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "S2",
      role: "student",
    },
    content:
      "I found this great website with detailed information about plant adaptations in different biomes: www.plantadaptations.edu",
    timestamp: "8 hours ago",
    task: "Research Phase: Gather Information",
  },
]

export default function RoomComments() {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  
  const handleAddComment = () => {
    if (
