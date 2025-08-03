"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text, Environment, Stars } from "@react-three/drei"
import { useTaskContext } from "@/contexts/task-context"
import { useTheme } from "@/contexts/theme-context"
import type * as THREE from "three"

function TaskSphere({ task, position }: { task: any; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { dispatch } = useTaskContext()

  const color = useMemo(() => {
    if (task.completed) return "#4ade80"
    switch (task.priority) {
      case "urgent":
        return "#ef4444"
      case "high":
        return "#f97316"
      case "medium":
        return "#eab308"
      case "low":
        return "#22c55e"
      default:
        return "#6366f1"
    }
  }, [task.completed, task.priority])

  const scale = useMemo(() => {
    const baseScale = task.completed ? 0.8 : 1
    const priorityScale = {
      urgent: 1.4,
      high: 1.2,
      medium: 1,
      low: 0.8,
    }[task.priority]
    return baseScale * priorityScale
  }, [task.completed, task.priority])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01

      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2

      // Pulsing for urgent tasks
      if (task.priority === "urgent" && !task.completed) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
        meshRef.current.scale.setScalar(scale * pulse)
      } else {
        meshRef.current.scale.setScalar(scale)
      }
    }
  })

  const handleClick = () => {
    dispatch({ type: "TOGGLE_TASK", payload: task.id })
  }

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={task.completed ? 0.1 : 0.3}
          transparent
          opacity={task.completed ? 0.6 : 0.9}
        />
      </mesh>

      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {task.title}
      </Text>

      {/* Priority indicator */}
      <mesh position={[0, 0.8, 0]}>
        <ringGeometry args={[0.3, 0.4, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function TaskUniverse() {
  const { state } = useTaskContext()
  const { camera } = useThree()

  const taskPositions = useMemo(() => {
    return state.tasks.map((task, index) => {
      // Arrange tasks in a spiral pattern
      const angle = (index * 2.4) % (Math.PI * 2)
      const radius = 3 + ((index * 0.5) % 8)
      const height = Math.sin(index * 0.8) * 3

      return [Math.cos(angle) * radius, height, Math.sin(angle) * radius] as [number, number, number]
    })
  }, [state.tasks])

  useFrame((state) => {
    // Gentle camera rotation
    const time = state.clock.elapsedTime * 0.1
    camera.position.x = Math.cos(time) * 15
    camera.position.z = Math.sin(time) * 15
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {state.tasks.map((task, index) => (
        <TaskSphere key={task.id} task={task} position={taskPositions[index]} />
      ))}

      {/* Central hub */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
      </mesh>

      {/* Ambient particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={new Float32Array(Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 50))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
      </points>
    </>
  )
}

export function TaskVisualization() {
  const { state } = useTaskContext()
  const { theme, themes } = useTheme()

  if (state.tasks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-white/60">
        <div className="text-center">
          <div className="text-6xl mb-4">🌌</div>
          <h3 className="text-xl font-semibold mb-2">Your Task Universe Awaits</h3>
          <p>Create tasks to see them floating in your personal 3D space!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10">
      <Canvas camera={{ position: [10, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

        <Environment preset="night" />

        <TaskUniverse />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={30} />
      </Canvas>

      <div className="absolute bottom-4 left-4 text-white/60 text-sm">
        <p>🖱️ Drag to rotate • 🔍 Scroll to zoom • Click spheres to toggle tasks</p>
      </div>
    </div>
  )
}
