"use client"

import { Message } from '@/types'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export default function ChatMessages({ messages, isPending }: { messages: Message[], isPending: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      const h = date.getHours().toString().padStart(2, '0')
      const m = date.getMinutes().toString().padStart(2, '0')
      return `${h}:${m}`
    } catch (e) {
      return "--:--"
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gray-50">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 opacity-50 text-center max-w-sm mx-auto">
          <span className="text-4xl grayscale">🎓</span>
          <div className="space-y-1">
            <p className="font-semibold text-gray-600">College Database Assistant</p>
            <p className="text-xs">Ask queries or register new students.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-left w-full space-y-2">
            <p className="text-[10px] uppercase font-bold text-gray-400">Creation Example:</p>
            <code className="text-[11px] block text-blue-600 leading-relaxed">
              Register a student: Name Arjun, Email arjun@edu.com, Dept CS, Year 1, GPA 3.8
            </code>
          </div>
        </div>
      )}
      
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={cn(
            "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
            msg.role === "user" ? "items-end" : "items-start"
          )}
        >
          <div 
            className={cn(
               "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap",
               msg.role === "user" 
                 ? "bg-blue-600 text-white rounded-tr-none shadow-sm" 
                 : "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm"
            )}
          >
            {msg.content}
          </div>
          

          
          <span 
            className="text-[10px] text-gray-400 mt-1 uppercase font-medium h-4"
            suppressHydrationWarning
          >
            {formatTime(msg.timestamp)}
          </span>
        </div>
      ))}
      
      {isPending && (
        <div className="flex flex-col items-start animate-pulse">
           <div className="bg-white border border-gray-200 text-gray-400 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
             <div className="flex gap-1.5 items-center h-5">
               <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
             </div>
           </div>
        </div>
      )}
    </div>
  )
}
