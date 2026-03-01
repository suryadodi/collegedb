import { ChatLog } from '@/types'
import fs from 'fs'
import path from 'path'
import 'server-only'

const logsDir = path.join(process.cwd(), 'logs')
const logsFile = path.join(logsDir, 'chat-history.json')

function ensureFile() {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }
  if (!fs.existsSync(logsFile)) {
    fs.writeFileSync(logsFile, JSON.stringify([], null, 2))
  }
}

export function saveMessage(
  sessionId: string,
  userMessage: string,
  aiResponse: string,
  toolCalled: string,
  toolArgs: any
) {
  ensureFile()
  const logs: ChatLog[] = JSON.parse(fs.readFileSync(logsFile, 'utf8'))
  const newLog: ChatLog = {
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    user_message: userMessage,
    ai_response: aiResponse,
    tool_called: toolCalled || 'none',
    tool_args: toolArgs || {}
  }
  logs.unshift(newLog)
  fs.writeFileSync(logsFile, JSON.stringify(logs.slice(0, 100), null, 2))
}

export function getAllLogs(): ChatLog[] {
  ensureFile()
  return JSON.parse(fs.readFileSync(logsFile, 'utf8'))
}

export function clearLogs() {
  ensureFile()
  fs.writeFileSync(logsFile, JSON.stringify([], null, 2))
}
