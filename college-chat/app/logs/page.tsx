import { clearLogsAction } from '@/app/actions/logs'
import LogsTable from '@/components/LogsTable'
import { getAllLogs } from '@/lib/logger'
import { ArrowLeft, Database, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  const logs = await getAllLogs()

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-10 lg:p-20 relative isolate">
      {/* Decorative background effects */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-blue-600/5 -z-10 blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-10 border-b border-gray-200">
          <div className="space-y-4">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 rounded-xl text-xs font-bold transition-all uppercase tracking-wider group active:scale-95 border border-gray-200 shadow-sm"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Chat Console
            </a>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-[0.9] flex items-center gap-4">
              <span className="bg-gradient-to-br from-gray-900 to-gray-400 bg-clip-text text-transparent">CHAT</span>
              <span className="bg-blue-600 text-white rounded-2xl px-6 py-2 shadow-xl shadow-blue-500/20 text-3xl md:text-5xl border border-blue-400/20">LOGS</span>
            </h1>
            <p className="text-gray-500 font-medium tracking-tight max-w-xl text-sm md:text-base leading-relaxed pl-1">
              Complete audit history of user-ai interactions, including tool selection, database queries, and raw session data.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-3">
               <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-4 min-w-[120px] flex flex-col gap-1 shadow-sm relative overflow-hidden group/card transition-colors">
                  <div className="absolute -top-1 -right-1 opacity-5 group-hover/card:opacity-10 transition-opacity">
                    <Database size={48} className="text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Total Logs</span>
                  <span className="text-3xl font-black text-gray-900">{logs.length}</span>
               </div>
               
               <form action={clearLogsAction}>
                 <button 
                   type="submit"
                   className="h-full px-6 py-4 flex flex-col items-center justify-center bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-400 text-red-500 hover:text-white rounded-2xl transition-all group active:scale-95 shadow-sm min-w-[100px]"
                 >
                   <Trash2 size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-inherit">Wipe Data</span>
                 </button>
               </form>
             </div>
          </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-10 duration-700 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
           <LogsTable logs={logs as any} />
        </section>
        
        <footer className="pt-20 pb-10 flex flex-col items-center justify-center gap-6 border-t border-gray-100">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
             End of Audit Stream
           </p>
        </footer>
      </div>
    </div>
  )
}
