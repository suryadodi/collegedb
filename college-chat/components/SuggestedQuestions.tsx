import { Award, BarChart3, Filter, GraduationCap, HelpCircle, Search, Terminal, TrendingUp, Users } from 'lucide-react'

const questions = [
  { text: "Show all students", icon: <Users size={14} />, query: "Show all students" },
  { text: "Who has the highest GPA?", icon: <TrendingUp size={14} />, query: "Who has the highest GPA?" },
  { text: "Show all CS students", icon: <Terminal size={14} />, query: "Show all CS students" },
  { text: "List year 2 students", icon: <Filter size={14} />, query: "List year 2 students" },
  { text: "Top 5 students by GPA", icon: <Award size={14} />, query: "Top 5 students by GPA" },
  { text: "How many students total?", icon: <GraduationCap size={14} />, query: "How many students total?" },
  { text: "Show department statistics", icon: <BarChart3 size={14} />, query: "Show department statistics" },
  { text: "Students with GPA above 3.5", icon: <TrendingUp size={14} />, query: "Students with GPA above 3.5" },
  { text: "Search for Rahul", icon: <Search size={14} />, query: "Search for Rahul" },
  { text: "Show MECH students", icon: <HelpCircle size={14} />, query: "Show MECH students" },
]

export default function SuggestedQuestions({ sessionId }: { sessionId: string }) {
  return (
    <div className="flex flex-col gap-2 p-4">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
        Suggested Queries
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {questions.map((q, i) => (
          <form 
            key={i} 
            action={`/?sessionId=${sessionId}`} 
            method="POST" 
            className="w-full"
          >
            <input type="hidden" name="message" value={q.query} />
            <input type="hidden" name="sessionId" value={sessionId} />
            {/* Note: In a real Next.js app, we normally use Server Actions directly. 
                But for the chips to work as separate forms, we'll use a trick or just simple buttons.
                Let's use a button that submits to a hidden server action handler or use client-side navigation.
            */}
            <button
              type="submit"
              className="w-full text-left bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/50 text-slate-300 hover:text-white px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition-all group active:scale-95"
            >
              <span className="text-slate-500 group-hover:text-blue-500 transition-colors">
                {q.icon}
              </span>
              <span className="flex-1 truncate">{q.text}</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  )
}
