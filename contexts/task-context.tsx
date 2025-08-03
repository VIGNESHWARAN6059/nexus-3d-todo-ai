"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  dueDate?: Date
  createdAt: Date
  completedAt?: Date
  estimatedTime?: number
  actualTime?: number
  tags: string[]
  position?: { x: number; y: number; z: number }
  energy: number
  aiScore: number
}

interface TaskState {
  tasks: Task[]
  filter: "all" | "active" | "completed"
  sortBy: "priority" | "dueDate" | "created" | "aiScore"
  categories: string[]
  stats: {
    totalTasks: number
    completedTasks: number
    completionRate: number
    averageCompletionTime: number
    streak: number
    points: number
    level: number
  }
}

type TaskAction =
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "createdAt" | "aiScore"> }
  | { type: "TOGGLE_TASK"; payload: string }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Task> } }
  | { type: "SET_FILTER"; payload: TaskState["filter"] }
  | { type: "SET_SORT"; payload: TaskState["sortBy"] }
  | { type: "LOAD_TASKS"; payload: Task[] }
  | { type: "UPDATE_STATS" }

const initialState: TaskState = {
  tasks: [],
  filter: "all",
  sortBy: "aiScore",
  categories: ["Work", "Personal", "Health", "Learning", "Creative"],
  stats: {
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    streak: 0,
    points: 0,
    level: 1,
  },
}

// AI-powered task scoring algorithm
const calculateAIScore = (task: Omit<Task, "id" | "createdAt" | "aiScore">): number => {
  let score = 50 // Base score

  // Priority weighting
  const priorityWeights = { low: 0.5, medium: 1, high: 1.5, urgent: 2 }
  score += priorityWeights[task.priority] * 20

  // Due date urgency
  if (task.dueDate) {
    const daysUntilDue = Math.ceil((task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysUntilDue <= 1) score += 30
    else if (daysUntilDue <= 3) score += 20
    else if (daysUntilDue <= 7) score += 10
  }

  // Energy level consideration
  score += task.energy * 0.3

  // Time-based factors
  const hour = new Date().getHours()
  if (hour >= 9 && hour <= 11) score += 10 // Peak productivity hours
  if (hour >= 14 && hour <= 16) score += 5 // Afternoon productivity

  return Math.min(100, Math.max(0, score))
}

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "ADD_TASK": {
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        aiScore: calculateAIScore(action.payload),
        position: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 5,
          z: (Math.random() - 0.5) * 10,
        },
      }

      const newTasks = [...state.tasks, newTask]
      return {
        ...state,
        tasks: newTasks,
        stats: calculateStats(newTasks),
      }
    }

    case "TOGGLE_TASK": {
      const newTasks = state.tasks.map((task) =>
        task.id === action.payload
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task,
      )
      return {
        ...state,
        tasks: newTasks,
        stats: calculateStats(newTasks),
      }
    }

    case "DELETE_TASK": {
      const newTasks = state.tasks.filter((task) => task.id !== action.payload)
      return {
        ...state,
        tasks: newTasks,
        stats: calculateStats(newTasks),
      }
    }

    case "UPDATE_TASK": {
      const newTasks = state.tasks.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload.updates } : task,
      )
      return {
        ...state,
        tasks: newTasks,
        stats: calculateStats(newTasks),
      }
    }

    case "SET_FILTER":
      return { ...state, filter: action.payload }

    case "SET_SORT":
      return { ...state, sortBy: action.payload }

    case "LOAD_TASKS":
      return {
        ...state,
        tasks: action.payload,
        stats: calculateStats(action.payload),
      }

    default:
      return state
  }
}

const calculateStats = (tasks: Task[]) => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const completedWithTime = tasks.filter((t) => t.completed && t.completedAt && t.createdAt)
  const averageCompletionTime =
    completedWithTime.length > 0
      ? completedWithTime.reduce((acc, task) => {
          const time = task.completedAt!.getTime() - task.createdAt.getTime()
          return acc + time / (1000 * 60 * 60) // Convert to hours
        }, 0) / completedWithTime.length
      : 0

  // Calculate streak (consecutive days with completed tasks)
  const today = new Date()
  let streak = 0
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(today.getDate() - i)
    const hasCompletedTask = tasks.some(
      (task) => task.completed && task.completedAt && task.completedAt.toDateString() === checkDate.toDateString(),
    )
    if (hasCompletedTask) {
      streak++
    } else if (i > 0) {
      break
    }
  }

  const points = completedTasks * 10 + streak * 5
  const level = Math.floor(points / 100) + 1

  return {
    totalTasks,
    completedTasks,
    completionRate,
    averageCompletionTime,
    streak,
    points,
    level,
  }
}

const TaskContext = createContext<{
  state: TaskState
  dispatch: React.Dispatch<TaskAction>
} | null>(null)

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("ultra-todo-tasks")
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        }))
        dispatch({ type: "LOAD_TASKS", payload: tasks })
      } catch (error) {
        console.error("Failed to load tasks from localStorage:", error)
      }
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("ultra-todo-tasks", JSON.stringify(state.tasks))
  }, [state.tasks])

  return <TaskContext.Provider value={{ state, dispatch }}>{children}</TaskContext.Provider>
}

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
