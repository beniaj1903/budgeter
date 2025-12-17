'use server'

import { prisma } from '@/lib/prisma'
import { recurringTransactionSchema, RecurringTransactionInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { addDays, addWeeks, addMonths, addYears, isAfter, isBefore } from 'date-fns'

export async function createRecurringTransaction(data: RecurringTransactionInput) {
  try {
    const validated = recurringTransactionSchema.parse(data)
    const recurring = await prisma.recurringTransaction.create({
      data: validated,
      include: {
        category: true,
      },
    })
    revalidatePath('/')
    return { success: true, data: recurring }
  } catch (error) {
    return { success: false, error: 'Error al crear la transacción recurrente' }
  }
}

export async function updateRecurringTransaction(id: string, data: RecurringTransactionInput) {
  try {
    const validated = recurringTransactionSchema.parse(data)
    const recurring = await prisma.recurringTransaction.update({
      where: { id },
      data: validated,
      include: {
        category: true,
      },
    })
    revalidatePath('/')
    return { success: true, data: recurring }
  } catch (error) {
    return { success: false, error: 'Error al actualizar la transacción recurrente' }
  }
}

export async function deleteRecurringTransaction(id: string) {
  try {
    await prisma.recurringTransaction.delete({
      where: { id },
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar la transacción recurrente' }
  }
}

export async function getRecurringTransactions() {
  try {
    const recurring = await prisma.recurringTransaction.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return recurring
  } catch (error) {
    return []
  }
}

export async function toggleRecurringTransaction(id: string) {
  try {
    const recurring = await prisma.recurringTransaction.findUnique({
      where: { id },
    })

    if (!recurring) {
      return { success: false, error: 'Transacción recurrente no encontrada' }
    }

    await prisma.recurringTransaction.update({
      where: { id },
      data: { isActive: !recurring.isActive },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al cambiar el estado' }
  }
}

export async function processRecurringTransactions() {
  try {
    const now = new Date()
    const recurring = await prisma.recurringTransaction.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
      },
    })

    for (const item of recurring) {
      const lastProcessed = item.lastProcessed || item.startDate
      let nextDate = new Date(lastProcessed)

      switch (item.frequency) {
        case 'daily':
          nextDate = addDays(nextDate, 1)
          break
        case 'weekly':
          nextDate = addWeeks(nextDate, 1)
          break
        case 'monthly':
          nextDate = addMonths(nextDate, 1)
          break
        case 'yearly':
          nextDate = addYears(nextDate, 1)
          break
      }

      if (isBefore(nextDate, now) || nextDate.toDateString() === now.toDateString()) {
        if (!item.endDate || isBefore(nextDate, item.endDate)) {
          await prisma.transaction.create({
            data: {
              description: item.description,
              amount: item.amount,
              type: item.type,
              date: nextDate,
              categoryId: item.categoryId,
            },
          })

          await prisma.recurringTransaction.update({
            where: { id: item.id },
            data: { lastProcessed: nextDate },
          })
        }
      }
    }

    revalidatePath('/')
    return { success: true, message: 'Transacciones recurrentes procesadas' }
  } catch (error) {
    return { success: false, error: 'Error al procesar transacciones recurrentes' }
  }
}
