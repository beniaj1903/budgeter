/**
 * Script para migrar datos de SQLite local a Turso
 *
 * Uso:
 * 1. Asegúrate de tener DATABASE_URL y DATABASE_AUTH_TOKEN en .env
 * 2. Ejecuta: npx tsx scripts/migrate-data.ts
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import Database from 'better-sqlite3'

// Cliente para la base de datos LOCAL
const localDb = new Database('dev.db', { readonly: true })

// Cliente para Turso (producción)
const tursoAdapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN
})
const tursoClient = new PrismaClient({ adapter: tursoAdapter })

async function migrateData() {
  try {
    console.log('🔄 Iniciando migración de datos...\n')

    // 1. Migrar categorías
    console.log('📁 Migrando categorías...')
    const categories = localDb.prepare('SELECT * FROM Category').all()
    for (const category of categories as any[]) {
      await tursoClient.category.upsert({
        where: { id: category.id },
        create: {
          id: category.id,
          name: category.name,
          color: category.color,
          icon: category.icon,
          type: category.type,
          isDefault: category.isDefault === 1,
          createdAt: new Date(category.createdAt),
        },
        update: {
          name: category.name,
          color: category.color,
          icon: category.icon,
          type: category.type,
          isDefault: category.isDefault === 1,
        }
      })
    }
    console.log(`✓ ${categories.length} categorías migradas\n`)

    // 2. Migrar transacciones
    console.log('💰 Migrando transacciones...')
    const transactions = localDb.prepare('SELECT * FROM Transaction').all()
    for (const transaction of transactions as any[]) {
      await tursoClient.transaction.upsert({
        where: { id: transaction.id },
        create: {
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          date: new Date(transaction.date),
          categoryId: transaction.categoryId,
          createdAt: new Date(transaction.createdAt),
        },
        update: {
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          date: new Date(transaction.date),
          categoryId: transaction.categoryId,
        }
      })
    }
    console.log(`✓ ${transactions.length} transacciones migradas\n`)

    // 3. Migrar presupuestos
    console.log('💼 Migrando presupuestos...')
    const budgets = localDb.prepare('SELECT * FROM Budget').all()
    for (const budget of budgets as any[]) {
      await tursoClient.budget.upsert({
        where: { id: budget.id },
        create: {
          id: budget.id,
          name: budget.name,
          amount: budget.amount,
          period: budget.period,
          startDate: new Date(budget.startDate),
          endDate: new Date(budget.endDate),
          startTime: budget.startTime,
          createdAt: new Date(budget.createdAt),
        },
        update: {
          name: budget.name,
          amount: budget.amount,
          period: budget.period,
          startDate: new Date(budget.startDate),
          endDate: new Date(budget.endDate),
          startTime: budget.startTime,
        }
      })
    }
    console.log(`✓ ${budgets.length} presupuestos migrados\n`)

    // 4. Migrar relaciones presupuesto-categoría
    console.log('🔗 Migrando relaciones presupuesto-categoría...')
    const budgetCategories = localDb.prepare('SELECT * FROM BudgetCategory').all()
    for (const bc of budgetCategories as any[]) {
      await tursoClient.budgetCategory.upsert({
        where: {
          budgetId_categoryId: {
            budgetId: bc.budgetId,
            categoryId: bc.categoryId
          }
        },
        create: {
          id: bc.id,
          budgetId: bc.budgetId,
          categoryId: bc.categoryId,
          createdAt: new Date(bc.createdAt),
        },
        update: {}
      })
    }
    console.log(`✓ ${budgetCategories.length} relaciones migradas\n`)

    // 5. Migrar transacciones recurrentes
    console.log('🔄 Migrando transacciones recurrentes...')
    const recurring = localDb.prepare('SELECT * FROM RecurringTransaction').all()
    for (const rt of recurring as any[]) {
      await tursoClient.recurringTransaction.upsert({
        where: { id: rt.id },
        create: {
          id: rt.id,
          description: rt.description,
          amount: rt.amount,
          type: rt.type,
          frequency: rt.frequency,
          categoryId: rt.categoryId,
          startDate: new Date(rt.startDate),
          endDate: rt.endDate ? new Date(rt.endDate) : null,
          isActive: rt.isActive === 1,
          lastProcessed: rt.lastProcessed ? new Date(rt.lastProcessed) : null,
          createdAt: new Date(rt.createdAt),
        },
        update: {
          description: rt.description,
          amount: rt.amount,
          type: rt.type,
          frequency: rt.frequency,
          categoryId: rt.categoryId,
          startDate: new Date(rt.startDate),
          endDate: rt.endDate ? new Date(rt.endDate) : null,
          isActive: rt.isActive === 1,
          lastProcessed: rt.lastProcessed ? new Date(rt.lastProcessed) : null,
        }
      })
    }
    console.log(`✓ ${recurring.length} transacciones recurrentes migradas\n`)

    console.log('✅ Migración completada exitosamente!')
    console.log('\nVerifica los datos en: https://turso.tech/app')

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  } finally {
    localDb.close()
    await tursoClient.$disconnect()
  }
}

// Ejecutar migración
migrateData()
