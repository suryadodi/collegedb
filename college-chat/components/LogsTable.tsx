import { ChatLog } from '@/types'
import { clsx } from 'clsx'
import { Clock, LayoutList, MessageSquare, Terminal } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export default function LogsTable({ logs }: { logs: ChatLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-3xl opacity-60">
        <LayoutList size={40} className="text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No chat history available yet.</p>
        <p className="text-gray-400 text-xs mt-1 italic">Start a conversation to see detailed logs here.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
             <Terminal size={20} className="text-blue-600" />
           </div>
           <div>
             <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Audit Trail</h2>
             <p className="text-xs text-gray-500 font-medium tracking-tight">Viewing last {logs.length} interactions</p>
           </div>
        </div>
        <div className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
           Live Feed
        </div>
      </div>

      <div className="overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50 uppercase text-[10px] font-bold tracking-[0.15em] text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">User Question</th>
                <th className="px-6 py-4">AI Response Snippet</th>
                <th className="px-6 py-4">Tool Used</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium">
              {logs.map((log, i) => (
                <tr 
                  key={i} 
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-default"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-gray-400 font-mono">
                    <div className="flex items-center gap-2">
                       <Clock size={12} className="opacity-50" />
                       {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-[200px] truncate text-gray-900">
                    <div className="flex items-center gap-2">
                       <MessageSquare size={12} className="text-blue-500 opacity-40 shrink-0" />
                       {log.user_message}
                    </div>
                  </td>
                  <td className="px-6 py-5 max-w-[300px] truncate text-gray-600 italic font-normal">
                    {log.ai_response.length > 80 ? log.ai_response.substring(0, 80) + '...' : log.ai_response}
                  </td>
                  <td className="px-6 py-5">
                    {log.tool_called !== 'none' ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold uppercase text-[9px] tracking-wide">
                        <Terminal size={10} />
                        {log.tool_called}
                      </div>
                    ) : (
                      <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest pl-1">Natural Lang</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
