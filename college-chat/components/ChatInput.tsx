"use client"

import { sendMessageAction } from '@/app/actions/chat'
import { ChatState } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { Plus, PlusCircle, Send, Terminal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { twMerge } from 'tailwind-merge'
import ChatMessages from './ChatMessages'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all font-semibold active:scale-95"
    >
      {pending ? (
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></span>
        </div>
      ) : (
        <>
          <span>Send</span>
          <Send size={16} />
        </>
      )}
    </button>
  )
}

export default function ChatInput({ initialState }: { initialState: ChatState }) {
  const [state, formAction] = useFormState(sendMessageAction, initialState)
  const [showCreate, setShowCreate] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const createFormRef = useRef<HTMLFormElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  // Clear input when messages length changes 
  useEffect(() => {
    setInputValue('')
  }, [state.messages.length])

  const handleQuickCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const prompt = `Register a student: Name ${data.name}, Email ${data.email}, Dept ${data.department}, Year ${data.year}, GPA ${data.gpa}, Phone ${data.phone}`
    
    setInputValue(prompt)
    setShowCreate(false)
    // Small timeout to allow state to update before submit
    setTimeout(() => {
      formRef.current?.requestSubmit()
    }, 10)
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ChatMessages messages={state.messages} isPending={false} />
        <div ref={bottomRef} className="h-4" />
      </div>

      {showCreate && (
        <div className="absolute inset-x-0 bottom-[104px] p-4 animate-in slide-in-from-bottom-4 duration-300 z-20">
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-3xl p-6 relative">
            <button 
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PlusCircle className="text-blue-500" size={18} />
              Quick Register Student
            </h3>
            <form 
              onSubmit={handleQuickCreate} 
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <input 
                name="name" 
                placeholder="Full Name" 
                autoFocus 
                required 
                className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
              />
              <input name="email" type="email" placeholder="Email" required className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              <select name="department" required className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                <option value="CS">CS</option>
                <option value="ECE">ECE</option>
                <option value="MBA">MBA</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
              <input name="year" type="number" min="1" max="4" placeholder="Year (1-4)" required className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              <input name="gpa" type="number" step="0.01" min="0" max="4" placeholder="GPA (0-4.0)" required className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              <input name="phone" placeholder="Phone Number" className="bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              <button type="submit" className="bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 bg-white p-4 lg:p-6">
        <form 
          ref={formRef}
          action={formAction}
          className="max-w-4xl mx-auto flex items-end gap-3"
        >
          <input type="hidden" name="sessionId" value={state.sessionId} />
          
          <button 
            type="button"
            onClick={() => setShowCreate(!showCreate)}
            className={cn(
              "p-4 rounded-2xl border transition-all active:scale-90 flex items-center justify-center",
              showCreate ? "bg-red-50 border-red-100 text-red-500" : "bg-gray-100 border-gray-200 text-gray-500 hover:text-blue-500"
            )}
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>

          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <Terminal size={18} />
            </div>
            <textarea
              name="message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything or use '+' to register..."
              rows={1}
              required
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (inputValue.trim()) formRef.current?.requestSubmit()
                }
              }}
              className="w-full bg-gray-100 border border-gray-200 text-gray-900 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>
          
          <SubmitButton />
        </form>
        
        <p className="text-[10px] text-center text-gray-400 mt-3 font-medium tracking-wide uppercase opacity-50">
          Powered by Gemini AI Engine & SQLite
        </p>
      </div>
    </div>
  )
}
