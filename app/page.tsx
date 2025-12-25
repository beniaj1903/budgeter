import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, LayoutDashboard, Receipt, Folder, Repeat } from 'lucide-react'
import { initializeDefaultCategories, getCategories } from '@/lib/actions/categories'
import { getActiveBudgets, getBudgets } from '@/lib/actions/budgets'
import { getRecentTransactions, getTransactions } from '@/lib/actions/transactions'
import { getRecurringTransactions } from '@/lib/actions/recurring'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { TransactionForm } from '@/components/transaction/transaction-form'
import { TransactionList } from '@/components/transaction/transaction-list'
import { BudgetFormNew } from '@/components/budget/budget-form-new'
import { BudgetList } from '@/components/budget/budget-list'
import { BudgetsWithFilter } from '@/components/budget/budgets-with-filter'
import { CategoryManager } from '@/components/category/category-manager'
import { RecurringTransactionForm } from '@/components/transaction/recurring-transaction-form'
import { ExpenseChart } from '@/components/dashboard/expense-chart'

async function DashboardStats() {
  const transactions = await getRecentTransactions(100)
  const budgets = await getActiveBudgets()

  const totalIncome = transactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Presupuestos Activos</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{budgets.length}</div>
        </CardContent>
      </Card>
    </div>
  )
}

async function RecentTransactionsList() {
  const transactions = await getRecentTransactions(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transacciones Recientes</CardTitle>
        <CardDescription>Últimas 5 transacciones registradas</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay transacciones registradas</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction: any) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: transaction.category.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {transaction.category.name} • {format(new Date(transaction.date), 'PPP', { locale: es })}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function Home() {
  await initializeDefaultCategories()

  const categories = await getCategories()
  const budgets = await getBudgets()
  const activeBudgets = await getActiveBudgets()
  const allTransactions = await getTransactions()
  const recurringTransactions = await getRecurringTransactions()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Budgeter</h1>
          <p className="text-muted-foreground">Gestiona tus finanzas personales de forma sencilla</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Transacciones</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              <span className="hidden sm:inline">Presupuestos</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span className="hidden sm:inline">Categorías</span>
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              <span className="hidden sm:inline">Recurrentes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Suspense fallback={<div>Cargando estadísticas...</div>}>
              <DashboardStats />
            </Suspense>

            <div className="grid gap-6 md:grid-cols-2">
              <Suspense fallback={<div>Cargando transacciones...</div>}>
                <RecentTransactionsList />
              </Suspense>

              <ExpenseChart transactions={allTransactions} />
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Nueva Transacción</CardTitle>
                  <CardDescription>Registra un ingreso o gasto</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionForm categories={categories} />
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Todas las Transacciones</CardTitle>
                    <CardDescription>Historial completo de ingresos y gastos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionList
                      transactions={allTransactions}
                      categories={categories}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Nuevo Presupuesto</CardTitle>
                  <CardDescription>Crea un presupuesto personalizado</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetFormNew categories={categories} />
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <BudgetsWithFilter budgets={budgets} categories={categories} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categorías</CardTitle>
                <CardDescription>Gestiona las categorías de tus transacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryManager categories={categories} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recurring">
            <Card>
              <CardHeader>
                <CardTitle>Transacciones Recurrentes</CardTitle>
                <CardDescription>Automatiza tus ingresos y gastos periódicos</CardDescription>
              </CardHeader>
              <CardContent>
                <RecurringTransactionForm
                  categories={categories}
                  recurringTransactions={recurringTransactions}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
