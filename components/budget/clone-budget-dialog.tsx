'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addDays, addMonths } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { createBudget } from '@/lib/actions/budgets'
import { BudgetWithStats } from '@/lib/types'
import { cn } from '@/lib/utils'
import { es } from 'date-fns/locale'

const cloneBudgetSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  startDate: z.date({
    message: 'La fecha de inicio es requerida',
  }),
  endDate: z.date({
    message: 'La fecha de fin es requerida',
  }),
}).refine((data) => data.endDate > data.startDate, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['endDate'],
})

type CloneBudgetFormValues = z.infer<typeof cloneBudgetSchema>

interface CloneBudgetDialogProps {
  budget: BudgetWithStats
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CloneBudgetDialog({ budget, open, onOpenChange }: CloneBudgetDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcular sugerencia de fechas basada en el período
  const suggestNextPeriod = () => {
    const originalStart = new Date(budget.startDate)
    const originalEnd = new Date(budget.endDate)

    switch (budget.period) {
      case 'monthly':
        return {
          startDate: addMonths(originalEnd, 1),
          endDate: addMonths(addMonths(originalEnd, 1), 1)
        }
      case 'weekly':
        return {
          startDate: addDays(originalEnd, 1),
          endDate: addDays(originalEnd, 8)
        }
      case 'annual':
        return {
          startDate: addMonths(originalEnd, 1),
          endDate: addMonths(originalEnd, 13)
        }
      default:
        return {
          startDate: addDays(originalEnd, 1),
          endDate: addDays(originalEnd, 2)
        }
    }
  }

  const suggestedDates = suggestNextPeriod()

  const form = useForm<CloneBudgetFormValues>({
    resolver: zodResolver(cloneBudgetSchema),
    defaultValues: {
      name: `${budget.name} (Copia)`,
      startDate: suggestedDates.startDate,
      endDate: suggestedDates.endDate,
    },
  })

  const onSubmit = async (data: CloneBudgetFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await createBudget({
        name: data.name,
        amount: budget.amount,
        period: budget.period,
        startDate: data.startDate,
        endDate: data.endDate,
        categoryIds: budget.categories?.map(cat => cat.id) || [],
      })

      if (result.success) {
        form.reset()
        onOpenChange(false)
        router.refresh()
      } else {
        alert(result.error || 'Error al clonar el presupuesto')
      }
    } catch (error) {
      alert('Error al clonar el presupuesto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Clonar Presupuesto</DialogTitle>
          <DialogDescription>
            Crear una copia de "{budget.name}" con las mismas categorías y monto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre del presupuesto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PP', { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={es}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PP', { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={es}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
              <p className="font-medium">Detalles del presupuesto clonado:</p>
              <p className="text-muted-foreground">Monto: ${budget.amount.toFixed(2)}</p>
              <p className="text-muted-foreground">Período: {budget.period}</p>
              <p className="text-muted-foreground">
                Categorías: {budget.categories?.map(c => c.name).join(', ') || 'Ninguna'}
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Clonando...' : 'Clonar Presupuesto'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
