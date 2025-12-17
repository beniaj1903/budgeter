'use server'

import { prisma } from '@/lib/prisma'
import { budgetSchema, BudgetInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { BudgetWithStats } from '@/lib/types'

export async function createBudget(data: BudgetInput) {
  try {
    const validated = budgetSchema.parse(data)
    const { categoryIds, ...budgetData } = validated

    const budget = await prisma.budget.create({
      data: {
        ...budgetData,
        budgetCategories: {
          create: categoryIds.map(categoryId => ({
            categoryId,
          })),
        },
      },
    })
    revalidatePath('/')
    return { success: true, data: budget }
  } catch (error) {
    return { success: false, error: 'Error al crear el presupuesto' }
  }
}

export async function updateBudget(id: string, data: BudgetInput) {
  try {
    const validated = budgetSchema.parse(data)
    const { categoryIds, ...budgetData } = validated

    // Eliminar las categorías existentes y crear las nuevas
    await prisma.budgetCategory.deleteMany({
      where: { budgetId: id },
    })

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        ...budgetData,
        budgetCategories: {
          create: categoryIds.map(categoryId => ({
            categoryId,
          })),
        },
      },
    })
    revalidatePath('/')
    return { success: true, data: budget }
  } catch (error) {
    return { success: false, error: 'Error al actualizar el presupuesto' }
  }
}

export async function deleteBudget(id: string) {
  try {
    await prisma.budget.delete({
      where: { id },
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar el presupuesto' }
  }
}

export async function getBudgets() {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        budgetCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const budgetsWithStats: BudgetWithStats[] = await Promise.all(
      budgets.map(async (budget) => {
        const categoryIds = budget.budgetCategories.map(bc => bc.categoryId)

        // Obtener transacciones que coinciden con las categorías del presupuesto
        // y están dentro del rango de fechas
        const transactions = await prisma.transaction.findMany({
          where: {
            type: 'expense',
            categoryId: { in: categoryIds },
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
        })

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0)
        const remaining = budget.amount - spent
        const percentage = (spent / budget.amount) * 100

        return {
          id: budget.id,
          name: budget.name,
          amount: budget.amount,
          period: budget.period as any,
          startDate: budget.startDate,
          endDate: budget.endDate,
          startTime: budget.startTime,
          spent,
          remaining,
          percentage,
          categories: budget.budgetCategories.map(bc => bc.category),
        }
      })
    )

    return budgetsWithStats
  } catch (error) {
    return []
  }
}

export async function getActiveBudgets() {
  try {
    const now = new Date()
    const budgets = await prisma.budget.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        budgetCategories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const budgetsWithStats: BudgetWithStats[] = await Promise.all(
      budgets.map(async (budget) => {
        const categoryIds = budget.budgetCategories.map(bc => bc.categoryId)

        const transactions = await prisma.transaction.findMany({
          where: {
            type: 'expense',
            categoryId: { in: categoryIds },
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
        })

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0)
        const remaining = budget.amount - spent
        const percentage = (spent / budget.amount) * 100

        return {
          id: budget.id,
          name: budget.name,
          amount: budget.amount,
          period: budget.period as any,
          startDate: budget.startDate,
          endDate: budget.endDate,
          startTime: budget.startTime,
          spent,
          remaining,
          percentage,
          categories: budget.budgetCategories.map(bc => bc.category),
        }
      })
    )

    return budgetsWithStats
  } catch (error) {
    return []
  }
}

export async function getBudgetById(id: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        budgetCategories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!budget) return null

    const categoryIds = budget.budgetCategories.map(bc => bc.categoryId)

    const transactions = await prisma.transaction.findMany({
      where: {
        type: 'expense',
        categoryId: { in: categoryIds },
        date: {
          gte: budget.startDate,
          lte: budget.endDate,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    const spent = transactions.reduce((sum, t) => sum + t.amount, 0)
    const remaining = budget.amount - spent
    const percentage = (spent / budget.amount) * 100

    return {
      id: budget.id,
      name: budget.name,
      amount: budget.amount,
      period: budget.period as any,
      startDate: budget.startDate,
      endDate: budget.endDate,
      startTime: budget.startTime,
      spent,
      remaining,
      percentage,
      categories: budget.budgetCategories.map(bc => bc.category),
      transactions,
    }
  } catch (error) {
    return null
  }
}
