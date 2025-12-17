'use server'

import { prisma } from '@/lib/prisma'
import { categorySchema, CategoryInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { ALL_DEFAULT_CATEGORIES } from '@/lib/constants'

export async function createCategory(data: CategoryInput) {
  try {
    const validated = categorySchema.parse(data)
    const category = await prisma.category.create({
      data: validated,
    })
    revalidatePath('/')
    return { success: true, data: category }
  } catch (error) {
    return { success: false, error: 'Error al crear la categoría' }
  }
}

export async function updateCategory(id: string, data: CategoryInput) {
  try {
    const validated = categorySchema.parse(data)
    const category = await prisma.category.update({
      where: { id },
      data: validated,
    })
    revalidatePath('/')
    return { success: true, data: category }
  } catch (error) {
    return { success: false, error: 'Error al actualizar la categoría' }
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al eliminar la categoría' }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    })
    return categories
  } catch (error) {
    return []
  }
}

export async function getCategoriesByType(type: 'income' | 'expense') {
  try {
    const categories = await prisma.category.findMany({
      where: { type },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    })
    return categories
  } catch (error) {
    return []
  }
}

export async function initializeDefaultCategories() {
  try {
    const existingCategories = await prisma.category.count()

    if (existingCategories === 0) {
      await prisma.category.createMany({
        data: ALL_DEFAULT_CATEGORIES,
      })
      return { success: true, message: 'Categorías predefinidas creadas' }
    }

    return { success: true, message: 'Las categorías ya existen' }
  } catch (error) {
    return { success: false, error: 'Error al inicializar categorías' }
  }
}
