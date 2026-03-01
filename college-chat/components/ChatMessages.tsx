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
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 opacity-50">
          <span className="text-4xl">🎓</span>
          <p>Ask me anything about college students, departments, or GPAs.</p>
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
                 ? "bg-blue-600 text-white rounded-tr-none" 
                 : "bg-slate-700 text-slate-100 rounded-tl-none"
            )}
          >
            {msg.content}
          </div>
          
          {msg.toolCalled && msg.role === "assistant" && (
            <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                {msg.toolCalled}
              </span>
            </div>
          )}
          
          <span 
            className="text-[10px] text-slate-500 mt-1 uppercase font-medium h-4"
            suppressHydrationWarning
          >
            {formatTime(msg.timestamp)}
          </span>
        </div>
      ))}
      
      {isPending && (
        <div className="flex flex-col items-start animate-pulse">
           <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-2xl rounded-tl-none">
             <div className="flex gap-1.5 items-center h-5">
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
             </div>
           </div>
        </div>
      )}
    </div>
  )
}
