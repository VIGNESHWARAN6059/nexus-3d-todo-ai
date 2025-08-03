"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useTaskContext } from "@/contexts/task-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
// import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, CalendarIcon, Mic, Sparkles, X } from "lucide-react"
import { format } from "date-fns"
import type { SpeechRecognition } from "web-speech-api"

export function TaskInput() {
  const { state, dispatch } = useTaskContext()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [category, setCategory] = useState("Personal")
  const [dueDate, setDueDate] = useState<Date>()
  const [estimatedTime, setEstimatedTime] = useState<number>()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [energy, setEnergy] = useState(5)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const recognition = useRef<SpeechRecognition | null>(null)

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser")
      return
    }

    if (isListening) {
      recognition.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.current = new SpeechRecognition()
    recognition.current.continuous = false
    recognition.current.interimResults = false
    recognition.current.lang = "en-US"

    recognition.current.onstart = () => {
      setIsListening(true)
    }

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setTitle(transcript)
      setIsListening(false)
    }

    recognition.current.onerror = () => {
      setIsListening(false)
    }

    recognition.current.onend = () => {
      setIsListening(false)
    }

    recognition.current.start()
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    dispatch({
      type: "ADD_TASK",
      payload: {
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        priority,
        category,
        dueDate,
        estimatedTime,
        tags,
        energy,
      },
    })

    // Reset form
    setTitle("")
    setDescription("")
    setPriority("medium")
    setCategory("Personal")
    setDueDate(undefined)
    setEstimatedTime(undefined)
    setTags([])
    setEnergy(5)
    setIsExpanded(false)
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done? (Try voice input!)"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/60 pr-12"
            />
            <Button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 h-8 w-8 ${
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
            </Button>
          </div>

          <Button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <Sparkles className="w-4 h-4" />
          </Button>

          <Button
            type="submit"
            disabled={!title.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 backdrop-blur-md border-white/20">
                  <SelectItem value="low" className="text-white hover:bg-white/10">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-white/10">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-white/10">
                    High
                  </SelectItem>
                  <SelectItem value="urgent" className="text-white hover:bg-white/10">
                    Urgent
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 backdrop-blur-md border-white/20">
                  {state.categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 justify-start"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black/80 backdrop-blur-md border-white/20">
                  <div className="p-4 text-white text-center">
                    Calendar temporarily disabled
                  </div>
                  {/* <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="text-white"
                  /> */}
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80">Energy Level: {energy}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tags..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
                />
                <Button type="button" onClick={addTag} variant="ghost" className="text-white hover:bg-white/10">
                  Add
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/10 text-white border-white/20">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </Card>
  )
}
