import { CategoryInput } from './validations'

export const DEFAULT_EXPENSE_CATEGORIES: CategoryInput[] = [
  { name: 'Alimentación', type: 'expense', color: '#ef4444', icon: 'UtensilsCrossed', isDefault: true },
  { name: 'Transporte', type: 'expense', color: '#3b82f6', icon: 'Car', isDefault: true },
  { name: 'Vivienda', type: 'expense', color: '#8b5cf6', icon: 'Home', isDefault: true },
  { name: 'Entretenimiento', type: 'expense', color: '#ec4899', icon: 'Gamepad2', isDefault: true },
  { name: 'Salud', type: 'expense', color: '#10b981', icon: 'HeartPulse', isDefault: true },
  { name: 'Educación', type: 'expense', color: '#f59e0b', icon: 'GraduationCap', isDefault: true },
  { name: 'Compras', type: 'expense', color: '#06b6d4', icon: 'ShoppingBag', isDefault: true },
  { name: 'Servicios', type: 'expense', color: '#6366f1', icon: 'Zap', isDefault: true },
  { name: 'Otros Gastos', type: 'expense', color: '#64748b', icon: 'MoreHorizontal', isDefault: true },
]

export const DEFAULT_INCOME_CATEGORIES: CategoryInput[] = [
  { name: 'Salario', type: 'income', color: '#22c55e', icon: 'Wallet', isDefault: true },
  { name: 'Freelance', type: 'income', color: '#14b8a6', icon: 'Briefcase', isDefault: true },
  { name: 'Inversiones', type: 'income', color: '#84cc16', icon: 'TrendingUp', isDefault: true },
  { name: 'Ventas', type: 'income', color: '#a3e635', icon: 'DollarSign', isDefault: true },
  { name: 'Otros Ingresos', type: 'income', color: '#4ade80', icon: 'PiggyBank', isDefault: true },
]

export const ALL_DEFAULT_CATEGORIES = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
]
