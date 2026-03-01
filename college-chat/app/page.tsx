import ChatInput from '@/components/ChatInput'
import { getAllLogs } from '@/lib/logger'
import { ChatState, Message } from '@/types'

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
    <div className="flex h-full min-w-0 bg-white">
      {/* Main Content */}
      <section className="flex-1 flex flex-col min-w-0">
        <ChatInput initialState={initialState} />
      </section>
    </div>
  )
}
