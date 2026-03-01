import 'server-only'
import * as db from './db'

export function runFunction(name: string, args: any) {
  try {
    switch (name) {
      case 'getAllStudents':
        return db.getAllStudents()
      case 'getStudentsByDepartment':
        return db.getStudentsByDepartment(args.department)
      case 'getTopStudents':
        return db.getTopStudents(Number(args.limit))
      case 'getStudentsByYear':
        return db.getStudentsByYear(Number(args.year))
      case 'searchStudentByName':
        return db.searchStudentByName(args.name)
      case 'getStudentsByGpaRange':
        return db.getStudentsByGpaRange(Number(args.min), Number(args.max))
      case 'getStudentById':
        return db.getStudentById(Number(args.id))
      case 'getDepartmentStats':
        return db.getDepartmentStats()
      case 'getStudentCount':
        return db.getStudentCount()
      case 'getStudentsAboveGpa':
        return db.getStudentsAboveGpa(Number(args.gpa))
      case 'createStudent':
        return db.createStudent(args)
      default:
        throw new Error(`Unknown function: ${name}`)
    }
  } catch (error: any) {
    return { error: error.message }
  }
}
