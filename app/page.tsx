"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { TaskProvider } from "@/contexts/task-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { Header } from "@/components/header"
import { TaskInput } from "@/components/task-input"
import { TaskList } from "@/components/task-list"
// import { TaskVisualization } from "@/components/task-visualization"
import { StatsPanel } from "@/components/stats-panel"
import { AchievementSystem } from "@/components/achievement-system"
import { FocusMode } from "@/components/focus-mode"
import { VoiceControl } from "@/components/voice-control"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Eye, List, BarChart3, Trophy, Focus } from "lucide-react"

// Dynamically import TaskVisualization to prevent SSR issues
const TaskVisualization = dynamic(
  () => import("@/components/task-visualization").then(mod => ({ default: mod.TaskVisualization })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[600px] flex items-center justify-center bg-white/5 rounded-lg backdrop-blur-sm">
        <div className="text-white text-lg">Loading 3D Universe...</div>
      </div>
    )
  }
)

export default function UltraAdvancedTodoApp() {
  const [activeView, setActiveView] = useState("list")
  const [focusMode, setFocusMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Ultra Todo...</div>
      </div>
    )
  }

  if (focusMode) {
    return (
      <ThemeProvider>
        <TaskProvider>
          <FocusMode onExit={() => setFocusMode(false)} />
        </TaskProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
          {/* Animated Background */}
          <div className="fixed inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]" />
          </div>

          <div className="relative z-10">
            <Header />

            <main className="container mx-auto px-4 py-8">
              <div className="mb-8">
                <TaskInput />
              </div>

              <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="bg-white/10 backdrop-blur-md border border-white/20">
                    <TabsTrigger value="list" className="data-[state=active]:bg-white/20">
                      <List className="w-4 h-4 mr-2" />
                      List View
                    </TabsTrigger>
                    <TabsTrigger value="3d" className="data-[state=active]:bg-white/20">
                      <Eye className="w-4 h-4 mr-2" />
                      3D Universe
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="data-[state=active]:bg-white/20">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="data-[state=active]:bg-white/20">
                      <Trophy className="w-4 h-4 mr-2" />
                      Achievements
                    </TabsTrigger>
                  </TabsList>

                  <Button
                    onClick={() => setFocusMode(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Focus className="w-4 h-4 mr-2" />
                    Focus Mode
                  </Button>
                </div>

                <TabsContent value="list" className="space-y-6">
                  <TaskList />
                </TabsContent>

                <TabsContent value="3d" className="h-[600px]">
                  <TaskVisualization />
                </TabsContent>

                <TabsContent value="stats" className="space-y-6">
                  <StatsPanel />
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                  <AchievementSystem />
                </TabsContent>
              </Tabs>
            </main>

            <VoiceControl />
          </div>
        </div>
      </TaskProvider>
    </ThemeProvider>
  )
}
