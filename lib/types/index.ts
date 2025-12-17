export type TransactionType = 'income' | 'expense'
export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'annual'
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface CategoryWithStats {
  id: string
  name: string
  type: TransactionType
  color: string
  icon: string
  isDefault: boolean
  totalAmount?: number
  transactionCount?: number
}

export interface BudgetWithStats {
  id: string
  name: string
  amount: number
  period: BudgetPeriod
  startDate: Date
  endDate: Date
  startTime?: string | null
  spent: number
  remaining: number
  percentage: number
  categories?: {
    id: string
    name: string
    color: string
    icon: string
    type: string
  }[]
}

export interface TransactionWithCategory {
  id: string
  description: string
  amount: number
  type: TransactionType
  date: Date
  category: {
    id: string
    name: string
    color: string
    icon: string
  }
}
