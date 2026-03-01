"use server"

import { runAIChat } from '@/lib/ai'
import { saveMessage } from '@/lib/logger'
import { ChatState, Message } from '@/types'
import { revalidatePath } from 'next/cache'

export async function sendMessageAction(
  prevState: ChatState,
  formData: FormData
): Promise<ChatState> {
  const userMessage = formData.get("message") as string
  const sessionId = formData.get("sessionId") as string || prevState.sessionId

  if (!userMessage?.trim()) return prevState

  const now = new Date().toISOString()
  const userMsg: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content: userMessage,
    timestamp: now
  }

  const updatedMessages = [...prevState.messages, userMsg]

  const { content, toolCalled, toolArgs } = await runAIChat(userMessage, prevState.messages)

  const aiMsg: Message = {
    id: crypto.randomUUID(),
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    toolCalled
  }

  const newState = {
    ...prevState,
    sessionId,
    messages: [...updatedMessages, aiMsg]
  }

  // Save log after AI response
  saveMessage(sessionId, userMessage, content, toolCalled, toolArgs)
  
  revalidatePath('/')
  return newState
}
