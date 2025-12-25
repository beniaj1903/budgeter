'use client'

import { useState, useMemo } from 'react'
import { BudgetDateFilter } from './budget-date-filter'
import { BudgetList } from './budget-list'
import { BudgetWithStats, Category } from '@/lib/types'

interface BudgetsWithFilterProps {
  budgets: BudgetWithStats[]
  categories: Category[]
}

export function BudgetsWithFilter({ budgets, categories }: BudgetsWithFilterProps) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
  }

  // Filtrar presupuestos que caen dentro del rango seleccionado
  const filteredBudgets = useMemo(() => {
    if (!startDate || !endDate) return budgets

    return budgets.filter(budget => {
      const budgetStart = new Date(budget.startDate)
      const budgetEnd = new Date(budget.endDate)

      // Un presupuesto se muestra si:
      // - Comienza antes del fin del rango Y termina después del inicio del rango
      // - Es decir, hay algún overlap entre el presupuesto y el rango seleccionado
      return budgetStart <= endDate && budgetEnd >= startDate
    })
  }, [budgets, startDate, endDate])

  return (
    <div className="space-y-6">
      <BudgetDateFilter onDateRangeChange={handleDateRangeChange} />

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay presupuestos en este período
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredBudgets.length} presupuesto{filteredBudgets.length !== 1 ? 's' : ''}
          </div>
          <BudgetList budgets={filteredBudgets} categories={categories} />
        </div>
      )}
    </div>
  )
}
