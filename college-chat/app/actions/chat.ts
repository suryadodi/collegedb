"use server"

import { runAIChat } from '@/lib/ai';
import { initSchema } from '@/lib/db';
import { saveMessage } from '@/lib/logger';
import { ChatState, Message } from '@/types';
import { revalidatePath } from 'next/cache';

export async function sendMessageAction(
  prevState: ChatState,
  formData: FormData
): Promise<ChatState> {
  // Ensure DB and logs table exist before any operations
  await initSchema()
  
  console.log('\n--- Step 1: [UI -> Action] User submitted a new message ---');
  const userMessage = formData.get("message") as string
  const sessionId = formData.get("sessionId") as string || prevState.sessionId

  console.log(`DATA: "${userMessage}" (Session: ${sessionId})`);

  if (!userMessage?.trim()) {
    console.log('--- CANCELLED: Empty message ---');
    return prevState
  }

  const userMsg: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString()
  }

  const updatedMessages = [...prevState.messages, userMsg]

  console.log('--- Step 2: [Action -> AI] Handing off to AI processing chain ---');
  const { content, toolCalled, toolArgs } = await runAIChat(userMessage, prevState.messages)
  console.log('--- Step 8: [AI -> Action] AI Logic finished, updating UI state ---');

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

  // Save log after AI response (async)
  console.log('--- Step 9: [Action -> DB] Saving conversation to logs table ---');
  await saveMessage(sessionId, userMessage, content, toolCalled, toolArgs)
  console.log('--- Step 10: [Action -> UI] Flow Complete, revalidating page ---');
  
  revalidatePath('/')
  return newState
}
