import { clsx } from 'clsx'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export const metadata: Metadata = {
  title: '🎓 College Student Chat AI',
  description: 'AI-powered database assistant for college students'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(inter.className, "h-full bg-slate-950 text-slate-100 antialiased overflow-hidden")}>
        <div className="flex flex-col h-full relative isolate">
          <header className="h-16 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
             <div className="flex items-center gap-2">
               <div className="bg-blue-600 rounded-lg p-1.5 shadow-lg shadow-blue-500/20">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                   <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                   <path d="M6 12v5c3 3 9 3 12 0v-5" />
                 </svg>
               </div>
               <div>
                  <h1 className="text-sm font-black tracking-tight text-white uppercase leading-none">CollegePulse AI</h1>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Admin Database Engine</span>
               </div>
             </div>
             
             <nav className="flex items-center gap-1">
               <a 
                 href="/" 
                 className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-wider"
               >
                 Chat Console
               </a>
               <a 
                 href="/logs" 
                 className="px-4 py-2 rounded-lg bg-blue-600/10 text-blue-400 text-xs font-bold hover:bg-blue-600/20 transition-all uppercase tracking-wider border border-blue-500/10"
               >
                 Audit Logs
               </a>
             </nav>
          </header>
          
          <main className="flex-1 min-h-0 flex flex-col relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
