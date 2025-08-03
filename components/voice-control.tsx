"use client"

import { useState, useRef, useEffect } from "react"
import { useTaskContext } from "@/contexts/task-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2 } from "lucide-react"
import type SpeechRecognition from "speech-recognition"

export function VoiceControl() {
  const { dispatch } = useTaskContext()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [lastCommand, setLastCommand] = useState("")

  const recognition = useRef<SpeechRecognition | null>(null)
  const synthesis = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = true
      recognition.current.interimResults = true
      recognition.current.lang = "en-US"

      recognition.current.onstart = () => {
        setIsListening(true)
      }

      recognition.current.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(interimTranscript || finalTranscript)

        if (finalTranscript) {
          processVoiceCommand(finalTranscript.toLowerCase().trim())
        }
      }

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognition.current.onend = () => {
        setIsListening(false)
      }
    }

    // Check for speech synthesis support
    if ("speechSynthesis" in window) {
      synthesis.current = window.speechSynthesis
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop()
      }
    }
  }, [])

  const processVoiceCommand = (command: string) => {
    setLastCommand(command)

    // Add task commands
    if (command.startsWith("add task") || command.startsWith("create task") || command.startsWith("new task")) {
      const taskTitle = command.replace(/^(add task|create task|new task)\s*/, "")
      if (taskTitle) {
        dispatch({
          type: "ADD_TASK",
          payload: {
            title: taskTitle,
            completed: false,
            priority: "medium",
            category: "Personal",
            tags: [],
            energy: 5,
          },
        })
        speak(`Added task: ${taskTitle}`)
      }
    }

    // Priority-based task creation
    else if (command.includes("urgent task")) {
      const taskTitle = command.replace(/.*urgent task\s*/, "")
      if (taskTitle) {
        dispatch({
          type: "ADD_TASK",
          payload: {
            title: taskTitle,
            completed: false,
            priority: "urgent",
            category: "Personal",
            tags: [],
            energy: 8,
          },
        })
        speak(`Added urgent task: ${taskTitle}`)
      }
    }

    // Show stats
    else if (command.includes("show stats") || command.includes("my stats")) {
      speak("Opening your productivity statistics")
    }

    // Focus mode
    else if (command.includes("focus mode") || command.includes("start focus")) {
      speak("Activating focus mode")
    }

    // Help command
    else if (command.includes("help") || command.includes("what can you do")) {
      speak(
        'I can help you add tasks, set priorities, show statistics, and activate focus mode. Try saying "add task" followed by your task description.',
      )
    }

    // Unknown command
    else {
      speak("I didn't understand that command. Try saying 'help' to see what I can do.")
    }

    // Clear transcript after processing
    setTimeout(() => {
      setTranscript("")
    }, 2000)
  }

  const speak = (text: string) => {
    if (synthesis.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      synthesis.current.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (!recognition.current) return

    if (isListening) {
      recognition.current.stop()
    } else {
      recognition.current.start()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-2">
        {/* Transcript Display */}
        {(transcript || lastCommand) && (
          <Card className="bg-black/80 backdrop-blur-md border-white/20 p-3 max-w-xs">
            {transcript && (
              <div className="text-white text-sm mb-2">
                <Badge className="bg-blue-500/20 text-blue-300 mb-1">Listening...</Badge>
                <p>"{transcript}"</p>
              </div>
            )}
            {lastCommand && !transcript && (
              <div className="text-white text-sm">
                <Badge className="bg-green-500/20 text-green-300 mb-1">Processed</Badge>
                <p>"{lastCommand}"</p>
              </div>
            )}
          </Card>
        )}

        {/* Voice Control Button */}
        <Button
          onClick={toggleListening}
          className={`w-14 h-14 rounded-full ${
            isListening
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          } shadow-lg`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>

        {/* Voice Commands Help */}
        <Card className="bg-black/80 backdrop-blur-md border-white/20 p-3 max-w-xs text-xs text-white/70">
          <div className="flex items-center mb-2">
            <Volume2 className="w-4 h-4 mr-1" />
            <span className="font-semibold">Voice Commands</span>
          </div>
          <ul className="space-y-1">
            <li>"Add task [description]"</li>
            <li>"Urgent task [description]"</li>
            <li>"Show stats"</li>
            <li>"Focus mode"</li>
            <li>"Help"</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
