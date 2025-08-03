"use client"

import { useState } from "react"
import { useTaskContext, type Task } from "@/contexts/task-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreVertical, Calendar, Clock, Zap, Trash2, Edit, Star, Target, Sparkles } from "lucide-react"
import { format } from "date-fns"

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { dispatch } = useTaskContext()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleToggle = () => {
    dispatch({ type: "TOGGLE_TASK", payload: task.id })
  }

  const handleDelete = () => {
    dispatch({ type: "DELETE_TASK", payload: task.id })
    setShowDeleteDialog(false)
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Work: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Personal: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Health: "bg-green-500/20 text-green-300 border-green-500/30",
      Learning: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      Creative: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  return (
    <>
      <Card
        className={`bg-white/10 backdrop-blur-md border-white/20 p-4 transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] ${
          task.completed ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggle}
              className="border-white/30 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-pink-600"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-semibold text-white ${task.completed ? "line-through" : ""}`}>{task.title}</h3>
                {task.description && (
                  <p className={`text-sm text-white/70 mt-1 ${task.completed ? "line-through" : ""}`}>
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <div className="flex items-center space-x-1 text-xs text-white/60">
                  <Sparkles className="w-3 h-3" />
                  <span>{Math.round(task.aiScore)}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/80 backdrop-blur-md border-white/20">
                    <DropdownMenuItem className="text-white hover:bg-white/10">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/10">
                      <Star className="w-4 h-4 mr-2" />
                      Add to favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge className={getPriorityColor(task.priority)}>
                <Target className="w-3 h-3 mr-1" />
                {task.priority}
              </Badge>

              <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>

              {task.dueDate && (
                <Badge variant="outline" className="border-white/30 text-white/70">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(task.dueDate, "MMM d")}
                </Badge>
              )}

              {task.estimatedTime && (
                <Badge variant="outline" className="border-white/30 text-white/70">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.estimatedTime}h
                </Badge>
              )}

              <Badge variant="outline" className="border-white/30 text-white/70">
                <Zap className="w-3 h-3 mr-1" />
                {task.energy}/10
              </Badge>

              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-white/30 text-white/70 text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-black/90 backdrop-blur-md border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
