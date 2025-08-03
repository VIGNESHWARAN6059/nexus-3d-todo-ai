"use client"

import type React from "react"

import { useMemo } from "react"
import { useTaskContext } from "@/contexts/task-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap, Target, Calendar, Flame, Award, Crown, Sparkles, CheckCircle } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  requirement: number
  current: number
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
}

export function AchievementSystem() {
  const { state } = useTaskContext()

  const achievements = useMemo((): Achievement[] => {
    const completedTasks = state.tasks.filter((t) => t.completed).length
    const totalTasks = state.tasks.length
    const streak = state.stats.streak
    const urgentCompleted = state.tasks.filter((t) => t.completed && t.priority === "urgent").length
    const categoriesUsed = new Set(state.tasks.map((t) => t.category)).size

    return [
      {
        id: "first-task",
        title: "Getting Started",
        description: "Complete your first task",
        icon: <CheckCircle className="w-6 h-6" />,
        requirement: 1,
        current: completedTasks,
        unlocked: completedTasks >= 1,
        rarity: "common",
        points: 10,
      },
      {
        id: "task-master",
        title: "Task Master",
        description: "Complete 10 tasks",
        icon: <Target className="w-6 h-6" />,
        requirement: 10,
        current: completedTasks,
        unlocked: completedTasks >= 10,
        rarity: "common",
        points: 50,
      },
      {
        id: "productivity-guru",
        title: "Productivity Guru",
        description: "Complete 50 tasks",
        icon: <Star className="w-6 h-6" />,
        requirement: 50,
        current: completedTasks,
        unlocked: completedTasks >= 50,
        rarity: "rare",
        points: 200,
      },
      {
        id: "task-legend",
        title: "Task Legend",
        description: "Complete 100 tasks",
        icon: <Crown className="w-6 h-6" />,
        requirement: 100,
        current: completedTasks,
        unlocked: completedTasks >= 100,
        rarity: "legendary",
        points: 500,
      },
      {
        id: "streak-starter",
        title: "Streak Starter",
        description: "Maintain a 3-day streak",
        icon: <Flame className="w-6 h-6" />,
        requirement: 3,
        current: streak,
        unlocked: streak >= 3,
        rarity: "common",
        points: 30,
      },
      {
        id: "consistency-king",
        title: "Consistency King",
        description: "Maintain a 7-day streak",
        icon: <Calendar className="w-6 h-6" />,
        requirement: 7,
        current: streak,
        unlocked: streak >= 7,
        rarity: "rare",
        points: 100,
      },
      {
        id: "unstoppable",
        title: "Unstoppable",
        description: "Maintain a 30-day streak",
        icon: <Zap className="w-6 h-6" />,
        requirement: 30,
        current: streak,
        unlocked: streak >= 30,
        rarity: "epic",
        points: 300,
      },
      {
        id: "urgent-hero",
        title: "Urgent Hero",
        description: "Complete 5 urgent tasks",
        icon: <Award className="w-6 h-6" />,
        requirement: 5,
        current: urgentCompleted,
        unlocked: urgentCompleted >= 5,
        rarity: "rare",
        points: 150,
      },
      {
        id: "well-rounded",
        title: "Well Rounded",
        description: "Use all 5 categories",
        icon: <Sparkles className="w-6 h-6" />,
        requirement: 5,
        current: categoriesUsed,
        unlocked: categoriesUsed >= 5,
        rarity: "epic",
        points: 250,
      },
    ]
  }, [state.tasks, state.stats.streak])

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-500 bg-gray-500/10 text-gray-300"
      case "rare":
        return "border-blue-500 bg-blue-500/10 text-blue-300"
      case "epic":
        return "border-purple-500 bg-purple-500/10 text-purple-300"
      case "legendary":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-300"
    }
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
            Achievements
          </h2>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            {unlockedAchievements.length}/{achievements.length} Unlocked
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}
            </div>
            <div className="text-white/60">Achievement Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{unlockedAchievements.length}</div>
            <div className="text-white/60">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </div>
            <div className="text-white/60">Completion</div>
          </div>
        </div>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Unlocked Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`bg-white/10 backdrop-blur-md border-2 ${getRarityColor(achievement.rarity)} p-4 relative overflow-hidden`}
              >
                <div className="absolute top-2 right-2">
                  <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-yellow-400 mt-1">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{achievement.title}</h4>
                    <p className="text-white/70 text-sm mt-1">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="secondary" className="bg-white/10 text-white">
                        +{achievement.points} pts
                      </Badge>
                      <div className="text-green-400 text-sm font-medium">✓ Unlocked</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-white/60" />
            In Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-4 relative opacity-75"
              >
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="border-white/30 text-white/60">
                    {achievement.rarity}
                  </Badge>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-white/40 mt-1">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white/80">{achievement.title}</h4>
                    <p className="text-white/50 text-sm mt-1">{achievement.description}</p>

                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Progress</span>
                        <span className="text-white/60">
                          {Math.min(achievement.current, achievement.requirement)}/{achievement.requirement}
                        </span>
                      </div>
                      <Progress value={(achievement.current / achievement.requirement) * 100} className="h-2" />
                      <Badge variant="outline" className="border-white/30 text-white/60">
                        +{achievement.points} pts
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
