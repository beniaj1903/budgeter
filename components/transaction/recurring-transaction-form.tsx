'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Repeat } from 'lucide-react'
import { createRecurringTransaction, toggleRecurringTransaction } from '@/lib/actions/recurring'
import { Category, RecurringTransaction } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

interface RecurringTransactionFormProps {
  categories: Category[]
  recurringTransactions: (RecurringTransaction & { category: Category })[]
}

export function RecurringTransactionForm({
  categories,
  recurringTransactions,
}: RecurringTransactionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
  })

  const filteredCategories = categories.filter(cat => cat.type === type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createRecurringTransaction({
        description: formData.description,
        amount: parseFloat(formData.amount),
        type,
        frequency,
        startDate,
        endDate,
        categoryId: formData.categoryId,
        isActive: true,
      })

      if (result.success) {
        setFormData({
          description: '',
          amount: '',
          categoryId: '',
        })
        router.refresh()
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Error al crear la transacción recurrente')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await toggleRecurringTransaction(id)
      router.refresh()
    } catch (error) {
      alert('Error al cambiar el estado')
    }
  }

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      yearly: 'Anual',
    }
    return labels[freq] || freq
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Repeat className="h-5 w-5" />
          Nueva Transacción Recurrente
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Gasto</SelectItem>
                  <SelectItem value="income">Ingreso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Frecuencia</Label>
              <Select
                value={frequency}
                onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') =>
                  setFrequency(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              placeholder="Ej: Suscripción Netflix"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'PP', { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Fin (opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PP', { locale: es }) : 'Sin límite'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Transacción Recurrente'}
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Transacciones Recurrentes Activas</h3>
        {recurringTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay transacciones recurrentes
          </div>
        ) : (
          <div className="space-y-3">
            {recurringTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: transaction.category.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{getFrequencyLabel(transaction.frequency)}</Badge>
                      <span>•</span>
                      <span>${transaction.amount.toFixed(2)}</span>
                      <span>•</span>
                      <span>{transaction.category.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={transaction.isActive ? 'default' : 'secondary'}>
                    {transaction.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <Switch
                    checked={transaction.isActive}
                    onCheckedChange={() => handleToggle(transaction.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
