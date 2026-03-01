import { DepartmentStat, Student } from '@/types'
import Database from 'better-sqlite3'
import { join } from 'path'
import 'server-only'

const dbPath = join(process.cwd(), 'college.db')
const db = new Database(dbPath)

// Initialize schema
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

// Seed if empty
const count = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number }
if (count.count === 0) {
  const students = [
    { name: "Arjun Sharma", email: "arjun.s@college.edu", dept: "CS", year: 1, gpa: 3.8, phone: "9876543210" },
    { name: "Priya Patel", email: "priya.p@college.edu", dept: "CS", year: 2, gpa: 3.95, phone: "9876543211" },
    { name: "Sanjay Gupta", email: "sanjay.g@college.edu", dept: "CS", year: 3, gpa: 3.5, phone: "9876543212" },
    { name: "Deepa Rao", email: "deepa.r@college.edu", dept: "CS", year: 4, gpa: 3.2, phone: "9876543213" },
    { name: "Rohan Varma", email: "rohan.v@college.edu", dept: "CS", year: 1, gpa: 2.1, phone: "9876543214" },
    { name: "Ishani Das", email: "ishani.d@college.edu", dept: "ECE", year: 2, gpa: 3.7, phone: "9876543215" },
    { name: "Kiran Kumar", email: "kiran.k@college.edu", dept: "ECE", year: 3, gpa: 3.4, phone: "9876543216" },
    { name: "Sameer Joshi", email: "sameer.j@college.edu", dept: "ECE", year: 4, gpa: 3.1, phone: "9876543217" },
    { name: "Kavita Singh", email: "kavita.s@college.edu", dept: "ECE", year: 1, gpa: 2.8, phone: "9876543218" },
    { name: "Vikram Reddy", email: "vikram.r@college.edu", dept: "ECE", year: 2, gpa: 3.6, phone: "9876543219" },
    { name: "Ananya Iyer", email: "ananya.i@college.edu", dept: "MBA", year: 3, gpa: 3.9, phone: "9876543220" },
    { name: "Rahul Deshmukh", email: "rahul.d@college.edu", dept: "MBA", year: 4, gpa: 3.3, phone: "9876543221" },
    { name: "Neha Malhotra", email: "neha.m@college.edu", dept: "MBA", year: 1, gpa: 2.9, phone: "9876543222" },
    { name: "Siddharth Menon", email: "siddharth.m@college.edu", dept: "MBA", year: 2, gpa: 3.75, phone: "9876543223" },
    { name: "Meera Nair", email: "meera.n@college.edu", dept: "MBA", year: 3, gpa: 3.45, phone: "9876543224" },
    { name: "Karthik Raj", email: "karthik.r@college.edu", dept: "MECH", year: 4, gpa: 3.15, phone: "9876543225" },
    { name: "Shanti Swaroop", email: "shanti.s@college.edu", dept: "MECH", year: 1, gpa: 2.5, phone: "9876543226" },
    { name: "Arvind Saxena", email: "arvind.s@college.edu", dept: "MECH", year: 2, gpa: 3.35, phone: "9876543227" },
    { name: "Sunita Roy", email: "sunita.r@college.edu", dept: "MECH", year: 3, gpa: 3.65, phone: "9876543228" },
    { name: "Ajay Bose", email: "ajay.b@college.edu", dept: "MECH", year: 4, gpa: 3.0, phone: "9876543229" },
    { name: "Lakshmi Prabha", email: "lakshmi.p@college.edu", dept: "CIVIL", year: 1, gpa: 2.75, phone: "9876543230" },
    { name: "Venkatesh Babu", email: "venkatesh.b@college.edu", dept: "CIVIL", year: 2, gpa: 3.25, phone: "9876543231" },
    { name: "Radha Krishnan", email: "radha.k@college.edu", dept: "CIVIL", year: 3, gpa: 3.85, phone: "9876543232" },
    { name: "Suresh Prabhu", email: "suresh.p@college.edu", dept: "CIVIL", year: 4, gpa: 3.55, phone: "9876543233" },
    { name: "Indira Gandhi", email: "indira.g@college.edu", dept: "CIVIL", year: 1, gpa: 2.4, phone: "9876543234" }
  ]

  const insert = db.prepare(`
    INSERT INTO students (name, email, department, year, gpa, phone)
    VALUES (@name, @email, @dept, @year, @gpa, @phone)
  `)

  const insertMany = db.transaction((data) => {
    for (const student of data) insert.run(student)
  })

  insertMany(students)
}

// Export functions
export function getAllStudents(): Student[] {
  return db.prepare('SELECT * FROM students').all() as Student[]
}

export function getStudentsByDepartment(department: string): Student[] {
  return db.prepare('SELECT * FROM students WHERE department = ? COLLATE NOCASE').all(department) as Student[]
}

export function getTopStudents(limit: number): Student[] {
  return db.prepare('SELECT * FROM students ORDER BY gpa DESC LIMIT ?').all(limit) as Student[]
}

export function getStudentsByYear(year: number): Student[] {
  return db.prepare('SELECT * FROM students WHERE year = ?').all(year) as Student[]
}

export function searchStudentByName(name: string): Student[] {
  return db.prepare('SELECT * FROM students WHERE name LIKE ?').all(`%${name}%`) as Student[]
}

export function getStudentsByGpaRange(min: number, max: number): Student[] {
  return db.prepare('SELECT * FROM students WHERE gpa BETWEEN ? AND ?').all(min, max) as Student[]
}

export function getStudentById(id: number): Student | null {
  return db.prepare('SELECT * FROM students WHERE student_id = ?').get(id) as Student | null
}

export function getDepartmentStats(): DepartmentStat[] {
  return db.prepare(`
    SELECT department, count(*) as count, avg(gpa) as avg_gpa, min(gpa) as min_gpa, max(gpa) as max_gpa
    FROM students
    GROUP BY department
  `).all() as DepartmentStat[]
}

export function getStudentCount(): { total: number } {
  return db.prepare('SELECT COUNT(*) as total FROM students').get() as { total: number }
}

export function getStudentsAboveGpa(gpa: number): Student[] {
  return db.prepare('SELECT * FROM students WHERE gpa > ?').all(gpa) as Student[]
}
