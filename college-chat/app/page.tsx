import ChatInput from '@/components/ChatInput'
import SuggestedQuestions from '@/components/SuggestedQuestions'
import { getAllLogs } from '@/lib/logger'
import { ChatState, Message } from '@/types'
import { DatabaseZap, ShieldCheck, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: { sessionId?: string } }) {
  const sessionId = searchParams.sessionId || crypto.randomUUID()
  
  // Fetch existing logs for this session if any (persistence)
  const allLogs = getAllLogs()
  const sessionLogs = allLogs
    .filter(log => log.session_id === sessionId)
    .reverse() // Oldest first for chat flow

  const messages: Message[] = []
  sessionLogs.forEach(log => {
    messages.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: log.user_message,
      timestamp: log.timestamp
    })
    messages.push({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: log.ai_response,
      timestamp: log.timestamp,
      toolCalled: log.tool_called !== 'none' ? log.tool_called : undefined
    })
  })

  const initialState: ChatState = {
    messages: messages.slice(-50), // Show last 50
    sessionId
  }

  return (
    <div className="flex h-full min-w-0 bg-slate-950/20">
      {/* Sidebar - Desktop */}
      <aside className="w-80 border-r border-slate-800/80 bg-slate-900/60 hidden lg:flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-800/30 flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-500">
               <DatabaseZap size={22} />
             </div>
             <h2 className="text-sm font-black tracking-widest text-slate-100 uppercase">Engine Status</h2>
           </div>
           
           <div className="space-y-3 px-1">
             <div className="flex items-center justify-between group cursor-default">
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-2">
                 <ShieldCheck size={12} />
                 SQLite Engine
               </span>
               <span className="text-[10px] font-black text-emerald-500 uppercase">Operational</span>
             </div>
             <div className="flex items-center justify-between group cursor-default">
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-2">
                 <Sparkles size={12} />
                 Gemini Agentic
               </span>
               <span className="text-[10px] font-black text-emerald-500 uppercase">Active</span>
             </div>
             <div className="flex items-center justify-between group cursor-default pt-1 border-t border-slate-800/20">
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Session ID</span>
               <span className="text-[9px] font-mono text-slate-600 truncate max-w-[120px]">{sessionId}</span>
             </div>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4 pb-8 space-y-8">
           <div className="px-1">
              <SuggestedQuestions sessionId={sessionId} />
           </div>
           
           <div className="px-6 py-4 space-y-3">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                Statistics
              </h3>
              <div className="bg-slate-950/40 rounded-2xl p-4 border border-slate-800/50 space-y-3">
                 <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/50 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Students</span>
                    <span className="text-xs font-black text-white">25</span>
                 </div>
                 <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/50 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg GPA</span>
                    <span className="text-xs font-black text-white">3.32</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="p-6 border-t border-slate-800/50 mt-auto bg-slate-950/20 flex flex-col items-center gap-4">
           <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700/50 shadow-inner">
             <div className="absolute top-0 left-0 h-full w-[78%] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
           </div>
           <span className="text-[9px] font-medium text-slate-500 uppercase tracking-[0.15em] animate-pulse">
             System synchronization active
           </span>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col min-w-0 bg-slate-900/30">
        <ChatInput initialState={initialState} />
      </section>
    </div>
  )
}
