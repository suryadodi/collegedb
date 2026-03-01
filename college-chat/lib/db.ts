import { DepartmentStat, Student } from '@/types';
import { Client, createClient } from '@libsql/client';
import 'server-only';

// ✅ Turso Configuration
const url = process.env.TURSO_DATABASE_URL || 'file:college.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

// ✅ Singleton pattern
let _client: Client | null = null

function getClient(): Client {
  if (!_client) {
    _client = createClient({
      url: url,
      authToken: authToken,
    })
  }
  return _client
}

// ✅ Database Initialization
export async function initSchema() {
  const client = getClient()
  await client.execute(`
    CREATE TABLE IF NOT EXISTS students (
      student_id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT NOT NULL,
      email        TEXT UNIQUE NOT NULL,
      department   TEXT NOT NULL,
      year         INTEGER NOT NULL,
      gpa          REAL NOT NULL,
      phone        TEXT,
      created_at   TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Also create logs table for persistent chat history
  await client.execute(`
    CREATE TABLE IF NOT EXISTS chat_logs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id   TEXT NOT NULL,
      timestamp    TEXT NOT NULL,
      user_message TEXT NOT NULL,
      ai_response  TEXT NOT NULL,
      tool_called  TEXT,
      tool_args    TEXT
    );
  `)

  const res = await client.execute('SELECT COUNT(*) as count FROM students')
  const count = Number(res.rows[0]?.count || 0)

  if (count === 0) await seedStudents(client)
}

async function seedStudents(client: Client) {
  const students = [
    { name: "Arjun Sharma",     email: "arjun.s@college.edu",     department: "CS",    year: 1, gpa: 3.80, phone: "9876543210" },
    { name: "Priya Patel",      email: "priya.p@college.edu",     department: "CS",    year: 2, gpa: 3.95, phone: "9876543211" },
    { name: "Sanjay Gupta",     email: "sanjay.g@college.edu",    department: "CS",    year: 3, gpa: 3.50, phone: "9876543212" },
    { name: "Deepa Rao",        email: "deepa.r@college.edu",     department: "CS",    year: 4, gpa: 3.20, phone: "9876543213" },
    { name: "Rohan Varma",      email: "rohan.v@college.edu",     department: "CS",    year: 1, gpa: 2.10, phone: "9876543214" },
    { name: "Ishani Das",       email: "ishani.d@college.edu",    department: "ECE",   year: 2, gpa: 3.70, phone: "9876543215" },
    { name: "Kiran Kumar",      email: "kiran.k@college.edu",     department: "ECE",   year: 3, gpa: 3.40, phone: "9876543216" },
    { name: "Sameer Joshi",     email: "sameer.j@college.edu",    department: "ECE",   year: 4, gpa: 3.10, phone: "9876543217" },
    { name: "Kavita Singh",     email: "kavita.s@college.edu",    department: "ECE",   year: 1, gpa: 2.80, phone: "9876543218" },
    { name: "Vikram Reddy",     email: "vikram.r@college.edu",    department: "ECE",   year: 2, gpa: 3.60, phone: "9876543219" },
    { name: "Ananya Iyer",      email: "ananya.i@college.edu",    department: "MBA",   year: 3, gpa: 3.90, phone: "9876543220" },
    { name: "Rahul Deshmukh",   email: "rahul.d@college.edu",     department: "MBA",   year: 4, gpa: 3.30, phone: "9876543221" },
    { name: "Neha Malhotra",    email: "neha.m@college.edu",      department: "MBA",   year: 1, gpa: 2.90, phone: "9876543222" },
    { name: "Siddharth Menon",  email: "siddharth.m@college.edu", department: "MBA",   year: 2, gpa: 3.75, phone: "9876543223" },
    { name: "Meera Nair",       email: "meera.n@college.edu",     department: "MBA",   year: 3, gpa: 3.45, phone: "9876543224" },
    { name: "Karthik Raj",      email: "karthik.r@college.edu",   department: "MECH",  year: 4, gpa: 3.15, phone: "9876543225" },
    { name: "Shanti Swaroop",   email: "shanti.s@college.edu",    department: "MECH",  year: 1, gpa: 2.50, phone: "9876543226" },
    { name: "Arvind Saxena",    email: "arvind.s@college.edu",    department: "MECH",  year: 2, gpa: 3.35, phone: "9876543227" },
    { name: "Sunita Roy",       email: "sunita.r@college.edu",    department: "MECH",  year: 3, gpa: 3.65, phone: "9876543228" },
    { name: "Ajay Bose",        email: "ajay.b@college.edu",      department: "MECH",  year: 4, gpa: 3.00, phone: "9876543229" },
    { name: "Lakshmi Prabha",   email: "lakshmi.p@college.edu",   department: "CIVIL", year: 1, gpa: 2.75, phone: "9876543230" },
    { name: "Venkatesh Babu",   email: "venkatesh.b@college.edu", department: "CIVIL", year: 2, gpa: 3.25, phone: "9876543231" },
    { name: "Radha Krishnan",   email: "radha.k@college.edu",     department: "CIVIL", year: 3, gpa: 3.85, phone: "9876543232" },
    { name: "Suresh Prabhu",    email: "suresh.p@college.edu",    department: "CIVIL", year: 4, gpa: 3.55, phone: "9876543233" },
    { name: "Indira Gandhi",    email: "indira.g@college.edu",    department: "CIVIL", year: 1, gpa: 2.40, phone: "9876543234" },
  ]

  const stmts = students.map(s => ({
    sql: `INSERT INTO students (name, email, department, year, gpa, phone) VALUES (?, ?, ?, ?, ?, ?)`,
    args: [s.name, s.email, s.department, s.year, s.gpa, s.phone]
  }))

  await client.batch(stmts, "write")
}

// ═══════════════════════════════════════
// EXPORTED ASYNC QUERY FUNCTIONS
// ═══════════════════════════════════════

export async function getAllStudents(): Promise<Student[]> {
  try {
    const res = await getClient().execute('SELECT * FROM students ORDER BY name ASC')
    return res.rows as unknown as Student[]
  } catch (e) { console.error(e); return [] }
}

export async function getStudentsByDepartment(department: string): Promise<Student[]> {
  try {
    const res = await getClient().execute({
      sql: 'SELECT * FROM students WHERE department = ? ORDER BY gpa DESC',
      args: [department]
    })
    return res.rows as unknown as Student[]
  } catch (e) { console.error(e); return [] }
}

export async function getTopStudents(limit: number): Promise<Student[]> {
  try {
    const res = await getClient().execute({
      sql: 'SELECT * FROM students ORDER BY gpa DESC LIMIT ?',
      args: [limit]
    })
    return res.rows as unknown as Student[]
  } catch (e) { console.error(e); return [] }
}

export async function getStudentsByYear(year: number): Promise<Student[]> {
  try {
    const res = await getClient().execute({
      sql: 'SELECT * FROM students WHERE year = ? ORDER BY name ASC',
      args: [year]
    })
    return res.rows as unknown as Student[]
  } catch (e) { console.error(e); return [] }
}

export async function searchStudentByName(name: string): Promise<Student[]> {
  try {
    const res = await getClient().execute({
      sql: 'SELECT * FROM students WHERE name LIKE ? ORDER BY name ASC',
      args: [`%${name}%`]
    })
    return res.rows as unknown as Student[]
  } catch (e) { console.error(e); return [] }
}

export async function getStudentsByGpaRange(min: number, max: number): Promise<Student[]> {
  try {
    const res = await getClient().execute({
      sql: 'SELECT * FROM students WHERE gpa BETWEEN ? AND ? ORDER BY gpa DESC',
      args: [min, max]
    })
    return res.rows as unknown as Student[]
  } catch (e) { console.error(e); return [] }
}

export async function getStudentById(id: number): Promise<Student | null> {
  try {
    const res = await getClient().execute({
      sql: 'SELECT * FROM students WHERE student_id = ?',
      args: [id]
    })
    return (res.rows[0] as unknown as Student) ?? null
  } catch (e) { console.error(e); return null }
}

export async function getDepartmentStats(): Promise<DepartmentStat[]> {
  try {
    const res = await getClient().execute(`
      SELECT 
        department,
        COUNT(*)          AS count,
        ROUND(AVG(gpa),2) AS avg_gpa,
        MIN(gpa)          AS min_gpa,
        MAX(gpa)          AS max_gpa
      FROM students
      GROUP BY department
      ORDER BY department ASC
    `)
    return res.rows as unknown as DepartmentStat[]
  } catch (e) { console.error(e); return [] }
}

export async function getStudentCount(): Promise<{ total: number }> {
  try {
    const res = await getClient().execute('SELECT COUNT(*) as total FROM students')
    return { total: Number(res.rows[0].total) }
  } catch (e) { console.error(e); return { total: 0 } }
}

export async function getStudentsAboveGpa(gpa: number): Promise<Student[]> {
  try {
    const res = await getClient().execute({
      sql: 'SELECT * FROM students WHERE gpa >= ? ORDER BY gpa DESC',
      args: [gpa]
    })
    return res.rows as unknown as Student[]
  } catch (e) { console.error(e); return [] }
}

export async function createStudent(student: Omit<Student, 'student_id' | 'created_at'>): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const res = await getClient().execute({
      sql: `INSERT INTO students (name, email, department, year, gpa, phone) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [student.name, student.email, student.department, student.year, student.gpa, student.phone]
    })
    return { success: true, id: Number(res.lastInsertRowid) }
  } catch (e: any) {
    console.error(e)
    return { success: false, error: e.message }
  }
}

// ═══════════════════════════════════════
// LOG STORAGE IN DATABASE
// ═══════════════════════════════════════

export async function saveLogToDb(log: any) {
  try {
    await getClient().execute({
      sql: `INSERT INTO chat_logs (session_id, timestamp, user_message, ai_response, tool_called, tool_args) 
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [log.session_id, log.timestamp, log.user_message, log.ai_response, log.tool_called, JSON.stringify(log.tool_args)]
    })
  } catch (e) { console.error('Failed to save log to Turso:', e) }
}

export async function clearLogsFromDb() {
  try {
    await getClient().execute('DELETE FROM chat_logs')
  } catch (e) { console.error(e) }
}

export async function getLogsFromDb(): Promise<any[]> {
  try {
    const res = await getClient().execute('SELECT * FROM chat_logs ORDER BY timestamp DESC LIMIT 100')
    return res.rows.map(r => ({
      ...r,
      tool_args: JSON.parse(r.tool_args as string || '{}')
    }))
  } catch (e) { console.error(e); return [] }
}
