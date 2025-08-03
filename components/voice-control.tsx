"use client"

import { useState, useRef, useEffect } from "react"
import { useTaskContext } from "@/contexts/task-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2 } from "lucide-react"

// Extend global Window interface
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceControl() {
  const { dispatch } = useTaskContext()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [mounted, setMounted] = useState(false)
  const recognition = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
      
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition()
        recognition.current.continuous = true
        recognition.current.interimResults = true
        recognition.current.lang = 'en-US'

        recognition.current.onresult = (event: any) => {
          const current = event.resultIndex
          const transcript = event.results[current][0].transcript
          setTranscript(transcript)
          
          if (event.results[current].isFinal) {
            processVoiceCommand(transcript)
          }
        }

        recognition.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognition.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const processVoiceCommand = (command: string) => {
    const lowercaseCommand = command.toLowerCase().trim()
    
    if (lowercaseCommand.includes("add task") || lowercaseCommand.includes("create task")) {
      const taskText = lowercaseCommand.replace(/add task|create task/g, "").trim()
      if (taskText) {
        dispatch({
          type: "ADD_TASK",
          payload: {
            title: taskText,
            completed: false,
            priority: "medium",
            category: "general",
            tags: [],
            energy: 75 // Fixed energy value for consistency
          }
        })
        speak(`Task added: ${taskText}`)
      }
    } else if (lowercaseCommand.includes("complete") || lowercaseCommand.includes("finish")) {
      // Since there's no complete all action, we'll just provide feedback
      speak("To complete tasks, please use the interface or say 'toggle task'")
    } else if (lowercaseCommand.includes("clear") || lowercaseCommand.includes("delete all")) {
      // Since there's no clear completed action, we'll just provide feedback
      speak("To clear tasks, please use the interface")
    } else if (lowercaseCommand.includes("show all")) {
      dispatch({ type: "SET_FILTER", payload: "all" })
      speak("Showing all tasks")
    } else if (lowercaseCommand.includes("show active")) {
      dispatch({ type: "SET_FILTER", payload: "active" })
      speak("Showing active tasks")
    } else if (lowercaseCommand.includes("show completed")) {
      dispatch({ type: "SET_FILTER", payload: "completed" })
      speak("Showing completed tasks")
    } else if (lowercaseCommand.includes("focus mode")) {
      speak("Focus mode activated")
    } else {
      speak("Command not recognized. Try saying 'add task' followed by your task description.")
    }
    
    setTranscript("")
  }

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (!recognition.current) return

    if (isListening) {
      recognition.current.stop()
      setIsListening(false)
    } else {
      recognition.current.start()
      setIsListening(true)
    }
  }

  if (!mounted) {
    return null // Avoid hydration mismatch
  }

  if (!isSupported) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground">
          <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Voice control not supported in this browser</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Control
        </h3>
        <Badge variant={isListening ? "default" : "secondary"}>
          {isListening ? "Listening..." : "Ready"}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "default"}
          className="w-full"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Listening
            </>
          )}
        </Button>
        
        {transcript && (
          <div className="p-2 bg-muted rounded text-sm">
            <strong>Transcript:</strong> {transcript}
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Voice Commands:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>"Add task [description]" - Create a new task</li>
          <li>"Show all" - Show all tasks</li>
          <li>"Show active" - Show active tasks</li>
          <li>"Show completed" - Show completed tasks</li>
          <li>"Focus mode" - Activate focus mode</li>
        </ul>
      </div>
    </Card>
  )
}
