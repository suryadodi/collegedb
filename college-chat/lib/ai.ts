import 'reflect-metadata';
import 'server-only';

import { Message } from '@/types';
import { createSqlAgent, SqlToolkit } from '@langchain/classic/agents/toolkits/sql';
import { SqlDatabase } from '@langchain/classic/sql_db';
import { ChatOpenAI } from '@langchain/openai';
import { createClient } from '@libsql/client';

// Initialize the database connection for LangChain
let _sqlDb: SqlDatabase | null = null

async function getSqlDb() {
  console.log('--- Step 3: [lib/ai.ts -> LangChain] Requesting SQL Database Bridge ---');
  if (!_sqlDb) {
    console.log('--- Step 3.1: [Bridge -> Turso] Connecting to Database... ---');
    const url = process.env.TURSO_DATABASE_URL || 'file:college.db';
    const token = process.env.TURSO_AUTH_TOKEN;
    
    const client = createClient({
      url,
      authToken: token
    });

    const datasource = {
      options: { type: 'sqlite', database: url },
      isInitialized: true,
      initialize: async () => {},
      query: async (sql: string, params?: any[]) => {
        console.log('\n--- Step 5.1: [LangChain -> Database] Executing Generated SQL ---');
        console.log(`QUERY: ${sql}`);
        if (params && params.length > 0) {
          console.log(`PARAMS: ${JSON.stringify(params)}`);
        }
        
        const res = await client.execute({ sql, args: params || [] });
        
        console.log(`--- Step 5.2: [Database -> LangChain] Returned ${res.rows.length} rows ---`);
        return res.rows;
      },
      driver: {
        options: { type: 'sqlite' },
        escape: (name: string) => `"${name}"`,
      }
    };

    _sqlDb = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource as any,
    })
    console.log('--- Step 3.2: [Bridge] SqlDatabase initialized and ready ---');
  }
  return _sqlDb
}

export async function runAIChat(
  userMessage: string,
  previousMessages: Message[]
): Promise<{ content: string; toolCalled: string; toolArgs: any }> {
  
  console.log('\n--- Step 2: [Action -> lib/ai.ts] Message arrived at AI logic ---');
  console.log(`INPUT: "${userMessage}"`);

  // Detect simple greetings to avoid starting the heavy SQL Agent
  const simpleGreetings = /^(hi|hello|hey|greetings|morning|evening)(\s|$)/i;
  if (simpleGreetings.test(userMessage.trim())) {
    console.log('--- Step 2.1: [Greeting Detected] Short-circuiting flow to save resources ---');
    return {
      content: "Hello! I'm your College Database assistant. How can I help you today?",
      toolCalled: 'none',
      toolArgs: {}
    };
  }

  try {
    const db = await getSqlDb()
    
    console.log('--- Step 4: [lib/ai.ts -> GPT-4] Initializing Agent & Sending Prompt ---');
    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
      verbose: true,
    })

    const toolkit = new SqlToolkit(db, model)
    
    const prefix = `You are a helpful conversational AI assistant for a College Database system.
    You have access to a database containing student info, but you can also chat normally.
    
    If you decide to use a tool to query the database, you MUST mention the SQL query you used in your final answer so the user can verify it.
    
    If the user's message is a greeting (like "hi", "hello", "hey"), respond directly without using any SQL tools.
    
    CRITICAL: For every response, if you don't need to use a tool, you MUST end with 'Final Answer: [your response]'.
    
    You have access to the following tools:`;

    const agent = createSqlAgent(model, toolkit, { prefix, verbose: true } as any)
    agent.returnIntermediateSteps = true;
    agent.handleParsingErrors = true;
    agent.maxIterations = 5;

    const history = previousMessages
      .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n')

    const input = history 
      ? `Conversation history:\n${history}\n\nCurrent user question: ${userMessage}`
      : userMessage

    const result = await agent.invoke({
      input: input,
    })

    console.log('--- Step 6: [GPT-4 -> lib/ai.ts] Agent processing complete ---');

    const lastStep = result.intermediateSteps?.[result.intermediateSteps.length - 1];
    const toolCalled = lastStep?.action?.tool || 'none';
    const toolArgs = lastStep?.action?.toolInput || {};
    
    console.log(`RESULT: Found tool [${toolCalled}]`);
    console.log('--- Step 7: [lib/ai.ts -> Action] Returning result to Chat Action ---\n');

    return {
      content: result.output,
      toolCalled: toolCalled,
      toolArgs: toolArgs
    }

  } catch (error: any) {
    console.error('--- ERROR: AI Flow failed ---', error.message);
    return {
      content: `I encountered an error with the SQL Agent: ${error.message}`,
      toolCalled: 'error',
      toolArgs: { error: error.message }
    }
  }
}
