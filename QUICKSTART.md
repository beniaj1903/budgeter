# Guía Rápida de Inicio - Budgeter

## Iniciar el Proyecto

```bash
# Asegúrate de estar usando Node 18.17 o superior
nvm use --lts

# Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3008](http://localhost:3008) en tu navegador.

## Funcionalidades Completas

### 1. Dashboard
- **Balance Total**: Visualiza tu balance actual (ingresos - gastos)
- **Estadísticas**: Total de ingresos, gastos y presupuestos activos
- **Transacciones Recientes**: Últimas 5 transacciones
- **Gráfico de Gastos**: Distribución por categorías en gráfico circular

### 2. Transacciones
**Crear Transacción:**
- Selecciona tipo: Ingreso o Gasto
- Ingresa descripción y monto
- Elige una categoría
- Asocia a un presupuesto (opcional, solo para gastos)
- Selecciona la fecha

**Gestionar:**
- Ver todas las transacciones
- Eliminar transacciones
- Las transacciones se actualizan en tiempo real

### 3. Presupuestos
**Crear Presupuesto:**
- Define nombre y monto
- Elige período: Diario, Semanal, Mensual o Anual
- Establece fechas de inicio y fin
- Para presupuestos diarios: define hora de inicio (opcional)

**Monitorear:**
- Barra de progreso visual
- Ver monto gastado vs presupuestado
- Alertas cuando se excede el presupuesto
- Estado de cada presupuesto (activo/inactivo)

### 4. Categorías
**14 Categorías Predefinidas:**
- 9 de Gastos: Alimentación, Transporte, Vivienda, Entretenimiento, Salud, Educación, Compras, Servicios, Otros
- 5 de Ingresos: Salario, Freelance, Inversiones, Ventas, Otros

**Personalizar:**
- Crear categorías custom
- Elegir color (15 opciones)
- Seleccionar ícono (14 opciones)
- Separadas por tipo (Ingreso/Gasto)
- No puedes eliminar categorías predefinidas

### 5. Transacciones Recurrentes
**Configurar:**
- Tipo: Ingreso o Gasto
- Frecuencia: Diaria, Semanal, Mensual o Anual
- Monto fijo
- Categoría
- Fecha de inicio
- Fecha de fin (opcional)

**Gestionar:**
- Activar/Desactivar con un switch
- Ver todas las transacciones recurrentes configuradas
- Se procesarán automáticamente según la frecuencia

## Tips de Uso

1. **Primer Paso**: Crea algunas transacciones para ver datos en el dashboard
2. **Presupuestos**: Comienza con un presupuesto mensual general
3. **Categorías Custom**: Agrega categorías específicas a tus necesidades
4. **Recurrentes**: Configura gastos fijos como Netflix, gimnasio, etc.
5. **Visualización**: El gráfico muestra solo las top 5 categorías de gastos

## Base de Datos

La base de datos SQLite se encuentra en:
```
prisma/dev.db
```

Para explorar la base de datos visualmente:
```bash
npm run db:studio
```

## Estructura de Archivos Creados

```
components/
├── budget/
│   ├── budget-form.tsx          # Formulario de presupuestos
│   └── budget-list.tsx          # Lista de presupuestos
├── category/
│   └── category-manager.tsx     # Gestión de categorías
├── dashboard/
│   └── expense-chart.tsx        # Gráfico de gastos
└── transaction/
    ├── transaction-form.tsx     # Formulario de transacciones
    ├── transaction-list.tsx     # Lista de transacciones
    └── recurring-transaction-form.tsx  # Transacciones recurrentes
```

## Próximos Pasos Sugeridos

1. **Filtros**: Agregar filtros por fecha y categoría en transacciones
2. **Búsqueda**: Búsqueda de transacciones por descripción
3. **Exportar**: Exportar datos a CSV/Excel
4. **Más Gráficos**: Gráfico de líneas para ver tendencias temporales
5. **Modo Oscuro**: Implementar tema oscuro
6. **Autenticación**: Agregar login para múltiples usuarios

## Comandos Útiles

```bash
# Ver la base de datos
npm run db:studio

# Regenerar el cliente de Prisma
npm run db:generate

# Sincronizar cambios en el esquema
npm run db:push

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

¡Listo! Ahora tienes una aplicación completamente funcional de gestión de finanzas personales.
