import { Message } from '@/types'
import OpenAI from 'openai'
import 'server-only'
import { runFunction } from './functions'
import { tools } from './tools'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function runAIChat(
  userMessage: string,
  previousMessages: Message[]
): Promise<{ content: string; toolCalled: string; toolArgs: any }> {
  
  const messages: any[] = [
    {
      role: 'system',
      content: `You are a PRECISE database agent. 
IDENTITY: You are the College Database Assistant.
DATA INTEGRITY PROTOCOL:
1. DATABASE QUERIES: For student data, you MUST only answer based on TOOL results. If no tools are called for a data query, tell the user you need to search the database.
2. VERIFICATION: If a tool is called but returns no data for a search, say: "No records found in the database."
3. CONVERSATION: You ARE allowed to respond to polite greetings (hi, hello) and general identity questions ("what is your name") naturally and briefly.
4. REGISTRATION: If a user wants to "register" or "create" a student but info is missing, show this template:
   Register a student: Name [Name], Email [Email], Dept [Dept], Year [1-4], GPA [0-4]
5. FORMAT: Plain text, maximal token efficiency.`
    },
    ...previousMessages.map(m => ({
      role: m.role,
      content: m.content
    })),
    { role: 'user', content: userMessage }
  ]

  let lastToolCalled = 'none'
  let lastToolArgs = {}
  let finalContent = ''

  try {
    let iterations = 0
    const maxIterations = 5

    while (iterations < maxIterations) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        tools: tools as any,
        tool_choice: 'auto',
        temperature: 0.1,
      })

      const responseMessage = response.choices[0].message
      messages.push(responseMessage)

      if (responseMessage.tool_calls) {
        for (const toolCall of responseMessage.tool_calls) {
          const functionName = (toolCall as any).function.name
          const functionArgs = JSON.parse((toolCall as any).function.arguments)
          
          lastToolCalled = functionName
          lastToolArgs = functionArgs

          const functionResponse = await runFunction(functionName, functionArgs)
          
          messages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: functionName,
            content: JSON.stringify(functionResponse),
          })
        }
        iterations++
        continue
      }

      finalContent = responseMessage.content || ''
      break
    }
  } catch (error: any) {
    console.error('OpenAI Error:', error)
    finalContent = `I encountered an error with OpenAI: ${error.message}. Please check your API key and billing.`
  }

  return { 
    content: finalContent, 
    toolCalled: lastToolCalled, 
    toolArgs: lastToolArgs 
  }
}
