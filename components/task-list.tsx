"use client"

import { useState } from "react"
import { useTaskContext } from "@/contexts/task-context"
import { TaskItem } from "./task-item"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, SortAsc } from "lucide-react"

export function TaskList() {
  const { state, dispatch } = useTaskContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTasks = state.tasks
    .filter((task) => {
      const matchesFilter =
        state.filter === "all" ||
        (state.filter === "active" && !task.completed) ||
        (state.filter === "completed" && task.completed)

      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || task.category === selectedCategory

      return matchesFilter && matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (state.sortBy) {
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return a.dueDate.getTime() - b.dueDate.getTime()
        case "created":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "aiScore":
          return b.aiScore - a.aiScore
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={state.filter} onValueChange={(value: any) => dispatch({ type: "SET_FILTER", payload: value })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 backdrop-blur-md border-white/20">
              <SelectItem value="all" className="text-white hover:bg-white/10">
                All
              </SelectItem>
              <SelectItem value="active" className="text-white hover:bg-white/10">
                Active
              </SelectItem>
              <SelectItem value="completed" className="text-white hover:bg-white/10">
                Completed
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 backdrop-blur-md border-white/20">
              <SelectItem value="all" className="text-white hover:bg-white/10">
                All Categories
              </SelectItem>
              {state.categories.map((category) => (
                <SelectItem key={category} value={category} className="text-white hover:bg-white/10">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={state.sortBy} onValueChange={(value: any) => dispatch({ type: "SET_SORT", payload: value })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white w-40">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/80 backdrop-blur-md border-white/20">
              <SelectItem value="aiScore" className="text-white hover:bg-white/10">
                AI Score
              </SelectItem>
              <SelectItem value="priority" className="text-white hover:bg-white/10">
                Priority
              </SelectItem>
              <SelectItem value="dueDate" className="text-white hover:bg-white/10">
                Due Date
              </SelectItem>
              <SelectItem value="created" className="text-white hover:bg-white/10">
                Created
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
          {filteredTasks.length} tasks
        </Badge>
        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
          {filteredTasks.filter((t) => !t.completed).length} active
        </Badge>
        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
          {filteredTasks.filter((t) => t.completed).length} completed
        </Badge>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
            <p>Create your first task to get started on your productivity journey!</p>
          </div>
        ) : (
          filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}
