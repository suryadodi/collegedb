import { ChatLog } from '@/types'
import 'server-only'
import * as db from './db'

export async function saveMessage(
  sessionId: string,
  userMessage: string,
  aiResponse: string,
  toolCalled: string,
  toolArgs: any
) {
  const newLog: ChatLog = {
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    user_message: userMessage,
    ai_response: aiResponse,
    tool_called: toolCalled || 'none',
    tool_args: toolArgs || {}
  }

  await db.saveLogToDb(newLog)
}

export async function getAllLogs(): Promise<ChatLog[]> {
  return await db.getLogsFromDb()
}

export async function clearLogs() {
  await db.clearLogsFromDb()
}
