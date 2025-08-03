"use client"
import { useTaskContext } from "@/contexts/task-context"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette, Zap, Trophy, Target } from "lucide-react"

export function Header() {
  const { state } = useTaskContext()
  const { theme, setTheme, themes } = useTheme()

  return (
    <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Nexus 3D Todo AI
                </h1>
                <p className="text-xs text-white/60">Developed by Ahsan Khizar</p>
              </div>
            </div>

            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              Level {state.stats.level}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>{state.stats.points} pts</span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span>{state.stats.streak} day streak</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Palette className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/80 backdrop-blur-md border-white/20">
                {Object.entries(themes).map(([key, themeData]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setTheme(key as any)}
                    className="text-white hover:bg-white/10"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${themeData.accent}`} />
                      <span>{themeData.name}</span>
                      {theme === key && <span className="ml-auto">✓</span>}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
