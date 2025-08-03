"use client"

import { useState, useEffect, useRef } from "react"
import { useTaskContext } from "@/contexts/task-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Target, CheckCircle } from "lucide-react"

interface FocusModeProps {
  onExit: () => void
}

export function FocusMode({ onExit }: FocusModeProps) {
  const { state, dispatch } = useTaskContext()
  const [selectedTask, setSelectedTask] = useState<string>("")
  const [timeRemaining, setTimeRemaining] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [ambientSound, setAmbientSound] = useState<string>("none")
  const [soundEnabled, setSoundEnabled] = useState(true)

  const intervalRef = useRef<NodeJS.Timeout>()
  const audioRef = useRef<HTMLAudioElement>()

  const activeTasks = state.tasks.filter((task) => !task.completed)
  const currentTask = activeTasks.find((task) => task.id === selectedTask)

  const ambientSounds = [
    { value: "none", label: "No Sound" },
    { value: "rain", label: "Rain" },
    { value: "forest", label: "Forest" },
    { value: "ocean", label: "Ocean Waves" },
    { value: "cafe", label: "Coffee Shop" },
    { value: "white-noise", label: "White Noise" },
  ]

  useEffect(() => {
    if (activeTasks.length > 0 && !selectedTask) {
      // Auto-select highest priority task
      const sortedTasks = [...activeTasks].sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
      setSelectedTask(sortedTasks[0].id)
    }
  }, [activeTasks, selectedTask])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleTimerComplete = () => {
    setIsRunning(false)

    if (!isBreak) {
      setCompletedPomodoros((prev) => prev + 1)
      // Start break (5 minutes for short break, 15 for long break every 4 pomodoros)
      const isLongBreak = (completedPomodoros + 1) % 4 === 0
      setTimeRemaining(isLongBreak ? 15 * 60 : 5 * 60)
      setIsBreak(true)
    } else {
      // Break finished, start new pomodoro
      setTimeRemaining(25 * 60)
      setIsBreak(false)
    }

    // Play notification sound
    if (soundEnabled) {
      const audio = new Audio("/notification.mp3")
      audio.play().catch(() => {}) // Ignore errors if sound file doesn't exist
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(isBreak ? (completedPomodoros % 4 === 0 ? 15 * 60 : 5 * 60) : 25 * 60)
  }

  const completeCurrentTask = () => {
    if (currentTask) {
      dispatch({ type: "TOGGLE_TASK", payload: currentTask.id })
      // Auto-select next task
      const remainingTasks = activeTasks.filter((t) => t.id !== currentTask.id)
      if (remainingTasks.length > 0) {
        setSelectedTask(remainingTasks[0].id)
      } else {
        setSelectedTask("")
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = isBreak
    ? (((completedPomodoros % 4 === 0 ? 15 * 60 : 5 * 60) - timeRemaining) /
        (completedPomodoros % 4 === 0 ? 15 * 60 : 5 * 60)) *
      100
    : ((25 * 60 - timeRemaining) / (25 * 60)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.2),transparent_50%)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Focus Mode</h1>
          <Badge className="bg-white/20 text-white">{completedPomodoros} Pomodoros Completed</Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white hover:bg-white/10"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={onExit} className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 max-w-md w-full text-center">
          {/* Timer Display */}
          <div className="mb-8">
            <div className="text-6xl font-mono font-bold mb-2">{formatTime(timeRemaining)}</div>
            <div className="text-lg text-white/70 mb-4">
              {isBreak ? (
                <div className="flex items-center justify-center">
                  <Coffee className="w-5 h-5 mr-2" />
                  {completedPomodoros % 4 === 0 ? "Long Break" : "Short Break"}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Target className="w-5 h-5 mr-2" />
                  Focus Session
                </div>
              )}
            </div>
            <Progress value={progress} className="h-2 mb-6" />
          </div>

          {/* Current Task */}
          {!isBreak && (
            <div className="mb-6">
              <label className="block text-sm text-white/70 mb-2">Current Task</label>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select a task to focus on" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 backdrop-blur-md border-white/20">
                  {activeTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id} className="text-white hover:bg-white/10">
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={`text-xs ${
                            task.priority === "urgent"
                              ? "bg-red-500/20 text-red-300"
                              : task.priority === "high"
                                ? "bg-orange-500/20 text-orange-300"
                                : task.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {task.priority}
                        </Badge>
                        <span>{task.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentTask && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg text-left">
                  <h3 className="font-semibold">{currentTask.title}</h3>
                  {currentTask.description && <p className="text-sm text-white/70 mt-1">{currentTask.description}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <Badge className="bg-white/10 text-white">{currentTask.category}</Badge>
                    <Button onClick={completeCurrentTask} size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isRunning ? "Pause" : "Start"}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Ambient Sound */}
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-2">Ambient Sound</label>
            <Select value={ambientSound} onValueChange={setAmbientSound}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-md border-white/20">
                {ambientSounds.map((sound) => (
                  <SelectItem key={sound.value} value={sound.value} className="text-white hover:bg-white/10">
                    {sound.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{completedPomodoros}</div>
              <div className="text-white/70">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.ceil(completedPomodoros / 4)}</div>
              <div className="text-white/70">Cycles</div>
            </div>
          </div>
        </Card>

        {/* Motivational Quote */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-white/70 italic">
            "The way to get started is to quit talking and begin doing." - Walt Disney
          </p>
        </div>
      </div>
    </div>
  )
}
