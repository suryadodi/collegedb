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
      content: `You are a precise college student database assistant.
ALWAYS use tools to answer questions about students.
NEVER guess or make up student data.
Only return what the database actually gives you.
Format responses clearly:
- Student lists: numbered with name, dept, year, GPA
- Single student: all fields neatly labeled
- Stats: clear table format
- Counts: number with context
Suggest follow-up queries the user might find helpful.`
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
