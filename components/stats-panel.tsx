"use client"

import { useMemo } from "react"
import { useTaskContext } from "@/contexts/task-context"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Target, TrendingUp, Zap, Calendar, Award, Activity, CheckCircle } from "lucide-react"

export function StatsPanel() {
  const { state } = useTaskContext()

  const analytics = useMemo(() => {
    const now = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      return date.toDateString()
    }).reverse()

    const dailyCompletions = last7Days.map((dateStr) => {
      const completed = state.tasks.filter(
        (task) => task.completed && task.completedAt?.toDateString() === dateStr,
      ).length
      return {
        date: new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" }),
        completed,
      }
    })

    const priorityDistribution = [
      { name: "Urgent", value: state.tasks.filter((t) => t.priority === "urgent").length, color: "#ef4444" },
      { name: "High", value: state.tasks.filter((t) => t.priority === "high").length, color: "#f97316" },
      { name: "Medium", value: state.tasks.filter((t) => t.priority === "medium").length, color: "#eab308" },
      { name: "Low", value: state.tasks.filter((t) => t.priority === "low").length, color: "#22c55e" },
    ].filter((item) => item.value > 0)

    const categoryStats = state.categories
      .map((category) => ({
        category,
        total: state.tasks.filter((t) => t.category === category).length,
        completed: state.tasks.filter((t) => t.category === category && t.completed).length,
      }))
      .filter((stat) => stat.total > 0)

    const avgEnergyLevel =
      state.tasks.length > 0 ? state.tasks.reduce((sum, task) => sum + task.energy, 0) / state.tasks.length : 0

    const upcomingTasks = state.tasks
      .filter((task) => !task.completed && task.dueDate)
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime())
      .slice(0, 5)

    return {
      dailyCompletions,
      priorityDistribution,
      categoryStats,
      avgEnergyLevel,
      upcomingTasks,
    }
  }, [state.tasks, state.categories])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{Math.round(state.stats.completionRate)}%</p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
          <Progress value={state.stats.completionRate} className="mt-2" />
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-white">{state.stats.streak} days</p>
            </div>
            <Award className="w-8 h-8 text-orange-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Points</p>
              <p className="text-2xl font-bold text-white">{state.stats.points}</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Avg Energy</p>
              <p className="text-2xl font-bold text-white">{analytics.avgEnergyLevel.toFixed(1)}/10</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Completions */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Daily Completions (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.dailyCompletions}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Bar dataKey="completed" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Priority Distribution */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analytics.priorityDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analytics.priorityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Category Performance
        </h3>
        <div className="space-y-4">
          {analytics.categoryStats.map((stat) => (
            <div key={stat.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white">{stat.category}</span>
                <span className="text-white/70 text-sm">
                  {stat.completed}/{stat.total} completed
                </span>
              </div>
              <Progress value={(stat.completed / stat.total) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Deadlines
        </h3>
        {analytics.upcomingTasks.length === 0 ? (
          <p className="text-white/60">No upcoming deadlines</p>
        ) : (
          <div className="space-y-3">
            {analytics.upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{task.title}</p>
                  <p className="text-white/60 text-sm">{task.category}</p>
                </div>
                <div className="text-right">
                  <Badge
                    className={`${
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
                  <p className="text-white/60 text-sm mt-1">{task.dueDate?.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
