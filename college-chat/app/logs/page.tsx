import { clearLogsAction } from '@/app/actions/logs'
import LogsTable from '@/components/LogsTable'
import { getAllLogs } from '@/lib/logger'
import { ArrowLeft, Database, Download, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  const logs = getAllLogs()

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900/40 p-10 lg:p-20 relative isolate">
      {/* Decorative background effects */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-blue-600/5 -z-10 blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-full bg-emerald-600/5 -z-10 blur-3xl opacity-10"></div>
      
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-10 border-b border-slate-800/80">
          <div className="space-y-4">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider group active:scale-95 border border-slate-700/50 shadow-lg"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Chat Console
            </a>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.9] flex items-center gap-4">
              <span className="bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">CHAT</span>
              <span className="bg-blue-600 text-white rounded-2xl px-6 py-2 shadow-2xl shadow-blue-500/30 text-3xl md:text-5xl border border-blue-400/20">LOGS</span>
            </h1>
            <p className="text-slate-400 font-medium tracking-tight max-w-xl text-sm md:text-base leading-relaxed pl-1">
              Complete audit history of user-ai interactions, including tool selection, database queries, and raw session data.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-3">
               <div className="flex-1 bg-slate-800/80 rounded-2xl border border-slate-700 p-4 min-w-[120px] flex flex-col gap-1 shadow-inner relative overflow-hidden group">
                  <div className="absolute -top-1 -right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Database size={48} className="text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Total Logs</span>
                  <span className="text-3xl font-black text-white leading-none">{logs.length}</span>
               </div>
               
               <form action={clearLogsAction}>
                 <button 
                   type="submit"
                   className="h-full px-6 flex flex-col items-center justify-center bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-400 text-red-500 hover:text-white rounded-2xl transition-all group active:scale-95 shadow-lg min-w-[100px]"
                 >
                   <Trash2 size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Wipe Data</span>
                 </button>
               </form>
             </div>
             
             <button className="flex items-center gap-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-inner active:scale-95">
               <Download size={14} />
               Export as CSV
             </button>
          </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-10 duration-700">
           <LogsTable />
        </section>
        
        <footer className="pt-20 pb-10 flex flex-col items-center justify-center gap-6 border-t border-slate-800/40">
           <div className="flex items-center gap-2 opacity-30 grayscale saturate-0">
             <div className="bg-slate-800 p-2 rounded-lg"><Database size={16} /></div>
             <div className="bg-slate-800 p-2 rounded-lg"><Download size={16} /></div>
           </div>
           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
             End of Audit Stream
           </p>
        </footer>
      </div>
    </div>
  )
}
