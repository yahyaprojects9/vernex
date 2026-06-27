import { z } from "zod";

const requiredText = z.string().trim().min(1, "This field is required");

export const roleSchema = z.object({
  name: requiredText,
  description: requiredText,
  hierarchyLevel: z.coerce.number().int().min(1).max(100),
  status: z.enum(["Active", "Inactive"])
});

export const userSchema = z.object({
  name: requiredText,
  email: z.string().email(),
  phone: requiredText,
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  roleId: requiredText,
  branchId: requiredText,
  departmentId: requiredText,
  employeeCode: requiredText,
  joiningDate: requiredText,
  status: z.enum(["Active", "Inactive", "Suspended"])
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const branchSchema = z.object({
  name: requiredText,
  code: requiredText,
  location: requiredText,
  description: z.string(),
  managerId: requiredText,
  phone: requiredText,
  operatingHours: requiredText
});

export const departmentSchema = z.object({
  name: requiredText,
  description: z.string(),
  branchId: requiredText,
  managerId: requiredText,
  memberIds: z.array(z.string())
});
