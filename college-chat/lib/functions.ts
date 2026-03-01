import 'server-only'
import * as db from './db'

export async function runFunction(name: string, args: any) {
  try {
    switch (name) {
      case 'getAllStudents':
        return await db.getAllStudents()
      case 'getStudentsByDepartment':
        return await db.getStudentsByDepartment(args.department)
      case 'getTopStudents':
        return await db.getTopStudents(Number(args.limit))
      case 'getStudentsByYear':
        return await db.getStudentsByYear(Number(args.year))
      case 'searchStudentByName':
        return await db.searchStudentByName(args.name)
      case 'getStudentsByGpaRange':
        return await db.getStudentsByGpaRange(Number(args.min), Number(args.max))
      case 'getStudentById':
        return await db.getStudentById(Number(args.id))
      case 'getDepartmentStats':
        return await db.getDepartmentStats()
      case 'getStudentCount':
        return await db.getStudentCount()
      case 'getStudentsAboveGpa':
        return await db.getStudentsAboveGpa(Number(args.gpa))
      case 'createStudent':
        return await db.createStudent(args)
      default:
        throw new Error(`Unknown function: ${name}`)
    }
  } catch (error: any) {
    return { error: error.message }
  }
}
