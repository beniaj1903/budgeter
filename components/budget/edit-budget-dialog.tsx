'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { CalendarIcon } from 'lucide-react'
import { updateBudget } from '@/lib/actions/budgets'
import { BudgetPeriod } from '@/lib/types'
import { Category } from '@/lib/types'
import { BudgetWithStats } from '@/lib/types'

interface EditBudgetDialogProps {
  budget: BudgetWithStats
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBudgetDialog({
  budget,
  categories,
  open,
  onOpenChange,
}: EditBudgetDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState<BudgetPeriod>(budget.period)
  const [startDate, setStartDate] = useState<Date>(new Date(budget.startDate))
  const [endDate, setEndDate] = useState<Date>(new Date(budget.endDate))
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    budget.categories?.map(c => c.id) || []
  )
  const [formData, setFormData] = useState({
    name: budget.name,
    amount: budget.amount.toString(),
    startTime: budget.startTime || '',
  })

  const expenseCategories = categories.filter(c => c.type === 'expense')

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCategories.length === 0) {
      alert('Debes seleccionar al menos una categoría')
      return
    }

    setLoading(true)

    try {
      const result = await updateBudget(budget.id, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        period,
        startDate,
        endDate,
        startTime: formData.startTime || undefined,
        categoryIds: selectedCategories,
      })

      if (result.success) {
        onOpenChange(false)
        router.refresh()
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Error al actualizar el presupuesto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Presupuesto</DialogTitle>
          <DialogDescription>
            Modifica los detalles del presupuesto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre del Presupuesto</Label>
            <Input
              id="edit-name"
              placeholder="Ej: Presupuesto de Alimentación"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Monto Total</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={period} onValueChange={(value: BudgetPeriod) => setPeriod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categorías de Gasto</Label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              {expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <label
                    htmlFor={`edit-${category.id}`}
                    className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedCategories.length} categoría(s) seleccionada(s)
              </p>
            )}
          </div>

          {period === 'daily' && (
            <div className="space-y-2">
              <Label htmlFor="edit-startTime">Hora de Inicio (opcional)</Label>
              <Input
                id="edit-startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
          )}

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
              <Label>Fecha de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, 'PP', { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
