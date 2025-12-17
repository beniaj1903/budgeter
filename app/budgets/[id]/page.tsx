import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, Calendar, DollarSign, TrendingDown } from 'lucide-react'
import { getBudgetById } from '@/lib/actions/budgets'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface BudgetDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BudgetDetailPage({ params }: BudgetDetailPageProps) {
  const { id } = await params
  const budget = await getBudgetById(id)

  if (!budget) {
    notFound()
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{budget.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getPeriodLabel(budget.period)}</Badge>
              <span className="text-muted-foreground" suppressHydrationWarning>
                {format(new Date(budget.startDate), 'PP', { locale: es })} -{' '}
                {format(new Date(budget.endDate), 'PP', { locale: es })}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budget.amount.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastado</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${budget.spent.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Restante</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    budget.remaining < 0 ? 'text-destructive' : 'text-green-600'
                  }`}
                >
                  ${budget.remaining.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progreso del Presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {Math.min(budget.percentage, 100).toFixed(0)}% utilizado
                  </span>
                  <span className="font-medium">
                    ${budget.spent.toFixed(2)} de ${budget.amount.toFixed(2)}
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

              {budget.percentage > 100 && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">
                    ¡Presupuesto excedido por ${Math.abs(budget.remaining).toFixed(2)}!
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {budget.categories && budget.categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Categorías Asociadas</CardTitle>
                <CardDescription>
                  Este presupuesto rastrea gastos de las siguientes categorías
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {budget.categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg"
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Gastos Asociados</CardTitle>
              <CardDescription>
                Transacciones que se contabilizan en este presupuesto
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!budget.transactions || budget.transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay gastos registrados en este presupuesto
                </div>
              ) : (
                <div className="space-y-3">
                  {budget.transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className="h-4 w-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: transaction.category.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{transaction.category.name}</span>
                            <span>•</span>
                            <span suppressHydrationWarning>
                              {format(new Date(transaction.date), 'PPP', { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-red-600">
                          -${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
