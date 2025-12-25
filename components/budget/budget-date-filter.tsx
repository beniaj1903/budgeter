'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BudgetDateFilterProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void
}

// Función para calcular el rango de fechas por defecto
const getDefaultDateRange = () => {
  const today = new Date()
  const currentDay = today.getDate()

  if (currentDay >= 15) {
    // Desde el 15 del mes actual hasta el 14 del mes siguiente
    const startDate = new Date(today.getFullYear(), today.getMonth(), 15)
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 14)
    return { startDate, endDate, referenceMonth: today }
  } else {
    // Desde el 15 del mes pasado hasta el 14 del mes actual
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 15)
    const endDate = new Date(today.getFullYear(), today.getMonth(), 14)
    return { startDate, endDate, referenceMonth: subMonths(today, 1) }
  }
}

// Función para calcular rango basado en un mes de referencia
const getDateRangeForMonth = (referenceMonth: Date) => {
  const startDate = new Date(referenceMonth.getFullYear(), referenceMonth.getMonth(), 15)
  const endDate = new Date(referenceMonth.getFullYear(), referenceMonth.getMonth() + 1, 14)
  return { startDate, endDate }
}

export function BudgetDateFilter({ onDateRangeChange }: BudgetDateFilterProps) {
  const [referenceMonth, setReferenceMonth] = useState<Date>(() => getDefaultDateRange().referenceMonth)
  const [dateRange, setDateRange] = useState(() => {
    const { startDate, endDate } = getDefaultDateRange()
    return { startDate, endDate }
  })

  useEffect(() => {
    onDateRangeChange(dateRange.startDate, dateRange.endDate)
  }, [dateRange, onDateRangeChange])

  const handlePreviousMonth = () => {
    const newMonth = subMonths(referenceMonth, 1)
    setReferenceMonth(newMonth)
    const { startDate, endDate } = getDateRangeForMonth(newMonth)
    setDateRange({ startDate, endDate })
  }

  const handleNextMonth = () => {
    const newMonth = addMonths(referenceMonth, 1)
    setReferenceMonth(newMonth)
    const { startDate, endDate } = getDateRangeForMonth(newMonth)
    setDateRange({ startDate, endDate })
  }

  const handleToday = () => {
    const { startDate, endDate, referenceMonth: newMonth } = getDefaultDateRange()
    setReferenceMonth(newMonth)
    setDateRange({ startDate, endDate })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Filtrar por Período
        </CardTitle>
        <CardDescription>
          Mostrando presupuestos del 15 de {format(referenceMonth, 'MMMM', { locale: es })} al 14 de {format(addMonths(referenceMonth, 1), 'MMMM yyyy', { locale: es })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            title="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 text-center">
            <Button
              variant="outline"
              onClick={handleToday}
              className="w-full"
            >
              Período Actual
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            title="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          {format(dateRange.startDate, 'dd/MM/yyyy', { locale: es })} - {format(dateRange.endDate, 'dd/MM/yyyy', { locale: es })}
        </div>
      </CardContent>
    </Card>
  )
}
