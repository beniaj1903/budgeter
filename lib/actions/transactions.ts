'use server'

import { prisma } from '@/lib/prisma'
import { transactionSchema, TransactionInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { TransactionWithCategory } from '@/lib/types'

export async function createTransaction(data: TransactionInput) {
  try {
    const validated = transactionSchema.parse(data)
    const transaction = await prisma.transaction.create({
      data: validated,
      include: {
        category: true,
      },
    })
    revalidatePath('/')
    return { success: true, data: transaction }
  } catch (error) {
    return { success: false, error: 'Error al crear la transacción' }
  }
}

export async function updateTransaction(id: string, data: TransactionInput) {
  try {
    const validated = transactionSchema.parse(data)
    const transaction = await prisma.transaction.update({
      where: { id },
      data: validated,
      include: {
        category: true,
      },
    })
    revalidatePath('/')
    return { success: true, data: transaction }
  } catch (error) {
    return { success: false, error: 'Error al actualizar la transacción' }
  }
}

export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id },
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar la transacción' }
  }
}

export async function getTransactions(
  startDate?: Date,
  endDate?: Date,
  type?: 'income' | 'expense'
) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        ...(startDate && endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
        ...(type && { type }),
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

    return transactions as TransactionWithCategory[]
  } catch (error) {
    return []
  }
}

export async function getRecentTransactions(limit: number = 10) {
  try {
    const transactions = await prisma.transaction.findMany({
      take: limit,
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

    return transactions as TransactionWithCategory[]
  } catch (error) {
    return []
  }
}

// Deprecated: Transactions are now associated with budgets through categories
// export async function getTransactionsByBudget(budgetId: string) {
//   ...
// }
