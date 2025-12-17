import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color hexadecimal inválido'),
  icon: z.string().min(1, 'El ícono es requerido'),
  isDefault: z.boolean().optional().default(false),
})

export const budgetSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  amount: z.number().positive('El monto debe ser positivo'),
  period: z.enum(['daily', 'weekly', 'monthly', 'annual']),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, 'Debes seleccionar al menos una categoría'),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['endDate'],
})

export const transactionSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number().positive('El monto debe ser positivo'),
  type: z.enum(['income', 'expense']),
  date: z.date(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
})

export const recurringTransactionSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida'),
  amount: z.number().positive('El monto debe ser positivo'),
  type: z.enum(['income', 'expense']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  startDate: z.date(),
  endDate: z.date().optional(),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  isActive: z.boolean().optional().default(true),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type BudgetInput = z.infer<typeof budgetSchema>
export type TransactionInput = z.infer<typeof transactionSchema>
export type RecurringTransactionInput = z.infer<typeof recurringTransactionSchema>
