'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, TrendingDown, Eye, Pencil } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteBudget } from '@/lib/actions/budgets'
import { BudgetWithStats } from '@/lib/types'
import { EditBudgetDialog } from './edit-budget-dialog'
import { Category } from '@prisma/client'

interface BudgetListProps {
  budgets: BudgetWithStats[]
  categories: Category[]
}

export function BudgetList({ budgets, categories }: BudgetListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingBudget, setEditingBudget] = useState<BudgetWithStats | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este presupuesto?')) return

    setDeletingId(id)
    try {
      const result = await deleteBudget(id)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Error al eliminar el presupuesto')
    } finally {
      setDeletingId(null)
    }
  }

  const getPeriodLabel = (period: string) => {
    const labels: Record<string, string> = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      annual: 'Anual',
    }
    return labels[period] || period
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay presupuestos creados
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {budgets.map((budget) => (
        <Card key={budget.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex-1">
              <CardTitle className="text-lg">{budget.name}</CardTitle>
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{getPeriodLabel(budget.period)}</Badge>
                  <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                    {format(new Date(budget.startDate), 'PP', { locale: es })} -{' '}
                    {format(new Date(budget.endDate), 'PP', { locale: es })}
                  </span>
                </div>
                {budget.categories && budget.categories.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {budget.categories.map((category: any) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                      >
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingBudget(budget)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(budget.id)}
                disabled={deletingId === budget.id}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">
                  {Math.min(budget.percentage, 100).toFixed(0)}%
                </span>
              </div>
              <Progress
                value={Math.min(budget.percentage, 100)}
                className={
                  budget.percentage > 100
                    ? '[&>div]:bg-destructive'
                    : budget.percentage > 80
                    ? '[&>div]:bg-yellow-500'
                    : ''
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Presupuesto</p>
                <p className="font-semibold">${budget.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gastado</p>
                <p className="font-semibold text-red-600">${budget.spent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Restante</p>
                <p
                  className={`font-semibold ${
                    budget.remaining < 0 ? 'text-destructive' : 'text-green-600'
                  }`}
                >
                  ${budget.remaining.toFixed(2)}
                </p>
              </div>
            </div>

            {budget.percentage > 100 && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-2 rounded">
                <TrendingDown className="h-4 w-4" />
                <span>¡Presupuesto excedido!</span>
              </div>
            )}

            <Link href={`/budgets/${budget.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}

      {editingBudget && (
        <EditBudgetDialog
          budget={editingBudget}
          categories={categories}
          open={!!editingBudget}
          onOpenChange={(open) => !open && setEditingBudget(null)}
        />
      )}
    </div>
  )
}
