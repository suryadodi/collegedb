import { DepartmentStat, Student } from '@/types'
import Database from 'better-sqlite3'
import { join } from 'path'
import 'server-only'

const dbPath = join(process.cwd(), 'college.db')

// ✅ Singleton pattern
let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(dbPath)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initSchema(_db)
  }
  return _db
}

// ✅ Schema + seed separated into own function
function initSchema(db: Database.Database) {
  db.exec(`
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

  const { count } = db.prepare(
    'SELECT COUNT(*) as count FROM students'
  ).get() as { count: number }

  if (count === 0) seedStudents(db)
}

function seedStudents(db: Database.Database) {
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

  const insert = db.prepare(`
    INSERT INTO students (name, email, department, year, gpa, phone)
    VALUES (@name, @email, @department, @year, @gpa, @phone)
  `)

  db.transaction((data: typeof students) => {
    for (const s of data) insert.run(s)
  })(students)
}

// ═══════════════════════════════════════
// EXPORTED QUERY FUNCTIONS
// ═══════════════════════════════════════

export function getAllStudents(): Student[] {
  try {
    return getDb()
      .prepare('SELECT * FROM students ORDER BY name ASC')
      .all() as Student[]
  } catch (e) { console.error(e); return [] }
}

export function getStudentsByDepartment(department: string): Student[] {
  try {
    return getDb()
      .prepare('SELECT * FROM students WHERE department = ? COLLATE NOCASE ORDER BY gpa DESC')
      .all(department) as Student[]
  } catch (e) { console.error(e); return [] }
}

export function getTopStudents(limit: number): Student[] {
  try {
    return getDb()
      .prepare('SELECT * FROM students ORDER BY gpa DESC LIMIT ?')
      .all(limit) as Student[]
  } catch (e) { console.error(e); return [] }
}

export function getStudentsByYear(year: number): Student[] {
  try {
    return getDb()
      .prepare('SELECT * FROM students WHERE year = ? ORDER BY name ASC')
      .all(year) as Student[]
  } catch (e) { console.error(e); return [] }
}

export function searchStudentByName(name: string): Student[] {
  try {
    return getDb()
      .prepare('SELECT * FROM students WHERE name LIKE ? ORDER BY name ASC')
      .all(`%${name}%`) as Student[]
  } catch (e) { console.error(e); return [] }
}

export function getStudentsByGpaRange(min: number, max: number): Student[] {
  try {
    return getDb()
      .prepare('SELECT * FROM students WHERE gpa BETWEEN ? AND ? ORDER BY gpa DESC')
      .all(min, max) as Student[]
  } catch (e) { console.error(e); return [] }
}

export function getStudentById(id: number): Student | null {
  try {
    const result = getDb()
      .prepare('SELECT * FROM students WHERE student_id = ?')
      .get(id)
    return (result as Student) ?? null
  } catch (e) { console.error(e); return null }
}

export function getDepartmentStats(): DepartmentStat[] {
  try {
    return getDb().prepare(`
      SELECT 
        department,
        COUNT(*)          AS count,
        ROUND(AVG(gpa),2) AS avg_gpa,
        MIN(gpa)          AS min_gpa,
        MAX(gpa)          AS max_gpa
      FROM students
      GROUP BY department
      ORDER BY department ASC
    `).all() as DepartmentStat[]
  } catch (e) { console.error(e); return [] }
}

export function getStudentCount(): { total: number } {
  try {
    return getDb()
      .prepare('SELECT COUNT(*) as total FROM students')
      .get() as { total: number }
  } catch (e) { console.error(e); return { total: 0 } }
}

export function getStudentsAboveGpa(gpa: number): Student[] {
  try {
    return getDb()
      .prepare('SELECT * FROM students WHERE gpa >= ? ORDER BY gpa DESC')
      .all(gpa) as Student[]
  } catch (e) { console.error(e); return [] }
}

export function createStudent(student: Omit<Student, 'student_id' | 'created_at'>): { success: boolean; id?: number; error?: string } {
  try {
    const insert = getDb().prepare(`
      INSERT INTO students (name, email, department, year, gpa, phone)
      VALUES (@name, @email, @department, @year, @gpa, @phone)
    `)
    const result = insert.run(student)
    return { success: true, id: result.lastInsertRowid as number }
  } catch (e: any) {
    console.error(e)
    return { success: false, error: e.message }
  }
}
