import { z } from "zod"

// Department Schema
export const DepartmentSchema = z.object({
  id: z.string(),
  departmentName: z.object({
    en: z.string(),
    ne: z.string()
  }),
  parentId: z.string().nullable(),
  order: z.number(),
  isActive: z.boolean(),
  employees: z.array(z.any()) // Will be defined below
})

// Employee Schema
export const EmployeeSchema = z.object({
  id: z.string(),
  name: z.object({
    en: z.string(),
    ne: z.string()
  }),
  position: z.object({
    en: z.string(),
    ne: z.string()
  }),
  order: z.number(),
  mobileNumber: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().optional(),
  roomNumber: z.string().optional(),
  photoPresignedUrl: z.string().optional(),
  isActive: z.boolean(),
  departmentId: z.string().optional() // Added for filtering
})

// Department with Employees Schema
export const DepartmentWithEmployeesSchema = DepartmentSchema.extend({
  employees: z.array(EmployeeSchema)
})

// HR API Response Schema
export const HRResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    data: z.array(DepartmentWithEmployeesSchema)
  }),
  error: z.string().optional(), // Added error field
  meta: z.object({
    timestamp: z.string(),
    version: z.string(),
    requestId: z.string(),
    processingTime: z.number()
  }).optional()
})

// Type exports
export type Department = z.infer<typeof DepartmentSchema>
export type Employee = z.infer<typeof EmployeeSchema>
export type DepartmentWithEmployees = z.infer<typeof DepartmentWithEmployeesSchema>
export type HRResponse = z.infer<typeof HRResponseSchema>
