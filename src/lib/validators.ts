import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signupSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  orgName: z.string().min(1, "Organization name is required"),
})

export const createTicketSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  categoryId: z.string().uuid().optional(),
})

export const updateTicketSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
})

export const createMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  isInternal: z.boolean().optional().default(false),
})

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  icon: z.string().optional(),
  parentId: z.string().uuid().optional(),
})

export const inviteTeamMemberSchema = z.object({
  email: z.email("Invalid email address"),
  role: z.enum(["admin", "agent", "customer"]),
})

export const updateOrgSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only").optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CreateTicketInput = z.infer<typeof createTicketSchema>
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>
export type CreateMessageInput = z.infer<typeof createMessageSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>
export type UpdateOrgInput = z.infer<typeof updateOrgSchema>
