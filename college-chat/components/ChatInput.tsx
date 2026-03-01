"use client"

import { sendMessageAction } from '@/app/actions/chat'
import { ChatState } from '@/types'
import { Send, Terminal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import ChatMessages from './ChatMessages'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-all font-semibold shadow-lg shadow-blue-500/20 active:scale-95"
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
  const [inputValue, setInputValue] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  // Clear input when messages length changes (meaning new message sent)
  useEffect(() => {
    setInputValue('')
  }, [state.messages.length])

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ChatMessages messages={state.messages} isPending={false} />
        <div ref={bottomRef} className="h-4" />
      </div>
      
      <div className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 lg:p-6 shadow-2xl">
        <form 
          ref={formRef}
          action={formAction}
          className="max-w-4xl mx-auto flex items-end gap-3"
        >
          <input type="hidden" name="sessionId" value={state.sessionId} />
          
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <Terminal size={18} />
            </div>
            <textarea
              name="message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about students, GPAs, departments..."
              rows={1}
              required
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (inputValue.trim()) formRef.current?.requestSubmit()
                }
              }}
              className="w-full bg-slate-800/80 border border-slate-700/50 text-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none shadow-inner"
            />
          </div>
          
          <SubmitButton />
        </form>
        
        <p className="text-[10px] text-center text-slate-500 mt-3 font-medium tracking-wide uppercase opacity-50">
          Powered by Gemini AI Engine & SQLite
        </p>
      </div>
    </div>
  )
}
