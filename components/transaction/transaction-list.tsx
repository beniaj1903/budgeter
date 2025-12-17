'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteTransaction } from '@/lib/actions/transactions'
import { TransactionWithCategory } from '@/lib/types'
import { EditTransactionDialog } from './edit-transaction-dialog'
import { Category } from '@prisma/client'

interface TransactionListProps {
  transactions: TransactionWithCategory[]
  categories: Category[]
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<TransactionWithCategory | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta transacción?')) return

    setDeletingId(id)
    try {
      const result = await deleteTransaction(id)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Error al eliminar la transacción')
    } finally {
      setDeletingId(null)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay transacciones registradas
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {transactions.map((transaction) => (
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
                  <span suppressHydrationWarning>{format(new Date(transaction.date), 'PPP', { locale: es })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                  {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTransaction(transaction)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(transaction.id)}
                disabled={deletingId === transaction.id}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingTransaction && (
        <EditTransactionDialog
          transaction={editingTransaction}
          categories={categories}
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
        />
      )}
    </>
  )
}
