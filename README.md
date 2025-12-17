# Budgeter - Gestor de Finanzas Personales

Una aplicación web moderna y sencilla para gestionar tus finanzas personales. Creada con Next.js 14, TypeScript, Prisma y shadcn/ui.

## Características

- **Dashboard Intuitivo**: Visualiza tu balance, ingresos, gastos y presupuestos activos de un vistazo
- **Presupuestos Flexibles**: Crea presupuestos mensuales, semanales, diarios o anuales con fechas de inicio personalizables
- **Categorías Personalizables**: Usa categorías predefinidas o crea las tuyas propias con colores e íconos
- **Transacciones**: Registra tus ingresos y gastos de manera sencilla
- **Gastos Recurrentes**: Configura transacciones que se agreguen automáticamente en la periodicidad que elijas
- **Gráficos y Estadísticas**: Visualiza tus gastos y el estado de tus presupuestos

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Base de Datos**: Prisma ORM con SQLite (desarrollo) / PostgreSQL (producción)
- **Validación**: Zod
- **Fechas**: date-fns
- **Gráficos**: Recharts
- **Iconos**: Lucide React

## Requisitos Previos

- Node.js 18.17 o superior
- npm o yarn

## Instalación

1. Clona el repositorio (o ya estás en él)

2. Instala las dependencias:
```bash
npm install
```

3. Genera el cliente de Prisma y crea la base de datos:
```bash
npm run db:push
npm run db:generate
```

## Scripts Disponibles

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar el servidor de producción
npm start

# Ejecutar el linter
npm run lint

# Sincronizar el esquema de Prisma con la base de datos
npm run db:push

# Abrir Prisma Studio (interfaz visual para la base de datos)
npm run db:studio

# Generar el cliente de Prisma
npm run db:generate
```

## Uso

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

3. La primera vez que accedas, se crearán automáticamente las categorías predefinidas

## Estructura del Proyecto

```
budgeter/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal con dashboard
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── budget/           # Componentes de presupuestos
│   ├── transaction/      # Componentes de transacciones
│   ├── category/         # Componentes de categorías
│   └── dashboard/        # Componentes del dashboard
├── lib/                   # Utilidades y lógica
│   ├── actions/          # Server Actions de Next.js
│   │   ├── budgets.ts   # Acciones de presupuestos
│   │   ├── categories.ts # Acciones de categorías
│   │   ├── transactions.ts # Acciones de transacciones
│   │   └── recurring.ts  # Acciones de transacciones recurrentes
│   ├── types/            # Definiciones de tipos TypeScript
│   ├── validations/      # Esquemas de validación Zod
│   ├── constants.ts      # Categorías predefinidas
│   ├── prisma.ts         # Cliente de Prisma
│   └── utils.ts          # Funciones utilitarias
├── prisma/
│   ├── schema.prisma     # Esquema de la base de datos
│   └── dev.db            # Base de datos SQLite (desarrollo)
└── package.json
```

## Modelos de Datos

### Category (Categorías)
- Nombre, tipo (ingreso/gasto), color e ícono
- Categorías predefinidas y personalizadas

### Budget (Presupuestos)
- Nombre, monto, período (diario/semanal/mensual/anual)
- Fechas de inicio y fin personalizables
- Hora de inicio para presupuestos diarios

### Transaction (Transacciones)
- Descripción, monto, tipo, fecha
- Relacionada con una categoría
- Opcionalmente asociada a un presupuesto

### RecurringTransaction (Transacciones Recurrentes)
- Similar a Transaction pero con frecuencia (diaria/semanal/mensual/anual)
- Se procesan automáticamente en la periodicidad configurada
- Pueden activarse/desactivarse

## Próximas Funcionalidades

- Formularios completos para crear y editar transacciones
- Formularios para crear y editar presupuestos
- Gestión visual de categorías
- Gráficos detallados con Recharts
- Filtros y búsqueda de transacciones
- Exportación de datos
- Modo oscuro
- Autenticación de usuarios
- Multi-moneda

## Base de Datos

El proyecto usa SQLite para desarrollo. Para producción, puedes cambiar fácilmente a PostgreSQL modificando el archivo `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Y actualizando la variable `DATABASE_URL` en tu archivo `.env`.

## Deploy en Vercel

La forma más fácil de desplegar tu app de Next.js es usar [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## Licencia

MIT
