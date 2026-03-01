import 'server-only'

export const tools: any[] = [
  {
    type: "function",
    function: {
      name: "getAllStudents",
      description: "Get a list of all students in the database.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getStudentsByDepartment",
      description: "Find students belonging to a specific department (CS, ECE, MBA, MECH, CIVIL).",
      parameters: {
        type: "object",
        properties: {
          department: { type: "string", description: "The department name" }
        },
        required: ["department"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getTopStudents",
      description: "Get high-performing students ordered by GPA.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Number of students to return" }
        },
        required: ["limit"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getStudentsByYear",
      description: "List students in a particular academic year (1 to 4).",
      parameters: {
        type: "object",
        properties: {
          year: { type: "number", description: "The year level" }
        },
        required: ["year"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "searchStudentByName",
      description: "Search for a student by their full or partial name.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The name to search" }
        },
        required: ["name"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getStudentsByGpaRange",
      description: "Find students with GPAs within a specified range.",
      parameters: {
        type: "object",
        properties: {
          min: { type: "number", description: "Minimum GPA" },
          max: { type: "number", description: "Maximum GPA" }
        },
        required: ["min", "max"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getStudentById",
      description: "Retrieve complete details for a single student by their unique ID.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "number", description: "The unique student ID" }
        },
        required: ["id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getDepartmentStats",
      description: "Get summary statistics for each department including counts and average GPA.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getStudentCount",
      description: "Get the total number of students currently enrolled.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getStudentsAboveGpa",
      description: "List all students whose GPA is higher than the provided threshold.",
      parameters: {
        type: "object",
        properties: {
          gpa: { type: "number", description: "Minimum GPA threshold" }
        },
        required: ["gpa"]
      }
    }
  }
]
