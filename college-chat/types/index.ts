export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  toolCalled?: string
}

export type Student = {
  student_id: number
  name: string
  email: string
  department: string
  year: number
  gpa: number
  phone: string
  created_at: string
}

export type DepartmentStat = {
  department: string
  count: number
  avg_gpa: number
  min_gpa: number
  max_gpa: number
}

export type ChatLog = {
  session_id: string
  timestamp: string
  user_message: string
  ai_response: string
  tool_called: string
  tool_args: Record<string, any>
}

export type ChatState = {
  messages: Message[]
  sessionId: string
}
