'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { TransactionWithCategory } from '@/lib/types'

interface ExpenseChartProps {
  transactions: TransactionWithCategory[]
}

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense')

  const categoryData = expenseTransactions.reduce((acc: { name: string; value: number; color: string }[], transaction: any) => {
    const categoryName = transaction.category.name
    const existing = acc.find(item => item.name === categoryName)

    if (existing) {
      existing.value += transaction.amount
    } else {
      acc.push({
        name: categoryName,
        value: transaction.amount,
        color: transaction.category.color,
      })
    }

    return acc
  }, [] as { name: string; value: number; color: string }[])

  const sortedData = categoryData.sort((a, b) => b.value - a.value)

  if (sortedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
          <CardDescription>Distribución de tus gastos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No hay datos suficientes para mostrar el gráfico
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoría</CardTitle>
        <CardDescription>Distribución de tus gastos</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {sortedData.slice(0, 5).map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-semibold">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
