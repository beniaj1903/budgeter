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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import * as Icons from 'lucide-react'
import { createCategory, deleteCategory } from '@/lib/actions/categories'
import { Category } from '@prisma/client'

interface CategoryManagerProps {
  categories: Category[]
}

const ICON_OPTIONS = [
  'Wallet', 'Briefcase', 'TrendingUp', 'DollarSign', 'PiggyBank',
  'UtensilsCrossed', 'Car', 'Home', 'Gamepad2', 'HeartPulse',
  'GraduationCap', 'ShoppingBag', 'Zap', 'MoreHorizontal',
]

const COLOR_OPTIONS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
]

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: COLOR_OPTIONS[0],
    icon: ICON_OPTIONS[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createCategory(formData)
      if (result.success) {
        setFormData({
          name: '',
          type: 'expense',
          color: COLOR_OPTIONS[0],
          icon: ICON_OPTIONS[0],
        })
        setOpen(false)
        router.refresh()
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Error al crear la categoría')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

    setDeletingId(id)
    try {
      const result = await deleteCategory(id)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Error al eliminar la categoría')
    } finally {
      setDeletingId(null)
    }
  }

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName]
    return Icon ? <Icon className="h-4 w-4" /> : null
  }

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Categorías</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>
                Personaliza tus categorías con nombre, color e ícono
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Ej: Restaurantes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'income' | 'expense') =>
                    setFormData({ ...formData, type: value })
                  }
                >
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
                <Label>Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${
                        formData.color === color ? 'border-foreground scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ícono</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((iconName) => (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          {getIcon(iconName)}
                          {iconName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Categoría'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <span>Categorías de Gastos</span>
            <Badge variant="secondary">{expenseCategories.length}</Badge>
          </h4>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white">{getIcon(category.icon)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    {category.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Predefinida
                      </Badge>
                    )}
                  </div>
                </div>
                {!category.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <span>Categorías de Ingresos</span>
            <Badge variant="secondary">{incomeCategories.length}</Badge>
          </h4>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {incomeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white">{getIcon(category.icon)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    {category.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Predefinida
                      </Badge>
                    )}
                  </div>
                </div>
                {!category.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                    disabled={deletingId === category.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
