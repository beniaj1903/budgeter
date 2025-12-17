# 💰 Budgeter

Una aplicación moderna de gestión de finanzas personales construida con Next.js 16, Prisma y Turso.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)](https://www.prisma.io/)
[![Turso](https://img.shields.io/badge/Turso-SQLite-4FC08D)](https://turso.tech/)

## ✨ Características

- 📊 **Dashboard Interactivo** - Visualiza tu balance, ingresos, gastos y estadísticas
- 💸 **Gestión de Transacciones** - Crea, edita y elimina ingresos y gastos
- 🎯 **Presupuestos Inteligentes** - Presupuestos automáticos basados en categorías y fechas
- 📁 **Categorías Personalizables** - 14 categorías predefinidas + categorías custom
- 🔄 **Transacciones Recurrentes** - Automatiza gastos e ingresos periódicos
- 📈 **Gráficos y Análisis** - Visualiza tus gastos por categoría
- 🎨 **UI Moderna** - Construida con shadcn/ui y Tailwind CSS
- ☁️ **Base de Datos en la Nube** - Turso (SQLite distribuido)
- 🚀 **Deploy a Netlify** - Configuración lista para producción

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18.17 o superior
- npm o yarn
- Cuenta en [Turso](https://turso.tech/) (gratis)

### Instalación

1. **Clona el repositorio**

```bash
git clone git@github.com:beniaj1903/budgeter.git
cd budgeter
```

2. **Instala dependencias**

```bash
nvm use  # Usa la versión correcta de Node
npm install
```

3. **Configura Turso**

```bash
# Instala Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Crea cuenta y base de datos
turso auth signup
turso db create budgeter-db

# Obtén credenciales
turso db show budgeter-db --url
turso db tokens create budgeter-db
```

4. **Configura variables de entorno**

Crea un archivo `.env` con tus credenciales de Turso:

```env
DATABASE_URL="libsql://budgeter-db-tu-usuario.turso.io"
DATABASE_AUTH_TOKEN="tu-token-aqui"
```

5. **Sincroniza el esquema de base de datos**

```bash
npm run db:push
```

6. **Inicia el servidor de desarrollo**

```bash
npm run dev
```

Abre [http://localhost:3008](http://localhost:3008) en tu navegador.

## 📖 Documentación

- [📘 Guía de Inicio Rápido](./QUICKSTART.md) - Tutorial completo de funcionalidades
- [🚀 Guía de Despliegue](./DEPLOYMENT.md) - Documentación detallada para producción
- [⚡ Pasos Rápidos de Deploy](./DEPLOY-STEPS.md) - Guía resumida para Netlify

## 🏗️ Tecnologías

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizables
- **[Recharts](https://recharts.org/)** - Gráficos y visualizaciones
- **[date-fns](https://date-fns.org/)** - Manejo de fechas

### Backend
- **[Prisma 7](https://www.prisma.io/)** - ORM de siguiente generación
- **[Turso](https://turso.tech/)** - SQLite edge database
- **[Zod](https://zod.dev/)** - Validación de schemas
- **Server Actions** - Mutations del lado del servidor

### DevOps
- **[Netlify](https://www.netlify.com/)** - Hosting y CI/CD
- **[GitHub](https://github.com/)** - Control de versiones

## 🗂️ Estructura del Proyecto

```
budgeter/
├── app/                      # Next.js App Router
│   ├── budgets/[id]/        # Página de detalle de presupuesto
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Dashboard principal
├── components/              # Componentes React
│   ├── budget/             # Componentes de presupuestos
│   ├── category/           # Gestión de categorías
│   ├── dashboard/          # Componentes del dashboard
│   ├── transaction/        # Componentes de transacciones
│   └── ui/                 # Componentes de shadcn/ui
├── lib/                     # Lógica de negocio
│   ├── actions/            # Server Actions
│   ├── types/              # TypeScript types
│   ├── validations/        # Schemas de Zod
│   ├── constants.ts        # Constantes de la app
│   ├── prisma.ts           # Cliente de Prisma
│   └── utils.ts            # Utilidades
├── prisma/                  # Configuración de Prisma
│   └── schema.prisma       # Schema de base de datos
├── scripts/                 # Scripts de utilidad
│   └── migrate-data.ts     # Migración de datos a Turso
├── .env                     # Variables de entorno (no incluido)
├── .env.example            # Template de variables
├── netlify.toml            # Configuración de Netlify
└── package.json            # Dependencias y scripts
```

## 📊 Base de Datos

El proyecto usa **Turso** (SQLite distribuido) con el siguiente esquema:

- **Category** - Categorías de ingresos/gastos
- **Transaction** - Transacciones individuales
- **Budget** - Presupuestos con períodos personalizables
- **BudgetCategory** - Relación many-to-many entre presupuestos y categorías
- **RecurringTransaction** - Transacciones que se repiten automáticamente

### Migración de Datos

Si tienes datos en SQLite local, puedes migrarlos a Turso:

```bash
npm run db:migrate
```

O usando el script bash:

```bash
./migrate-to-turso.sh
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor en localhost:3008

# Base de datos
npm run db:push          # Sincroniza schema con Turso
npm run db:studio        # Abre Prisma Studio
npm run db:generate      # Genera cliente de Prisma
npm run db:migrate       # Migra datos locales a Turso

# Producción
npm run build            # Construye para producción
npm start                # Inicia servidor de producción
npm run lint             # Linter de código
```

## 🚀 Despliegue

### Netlify (Recomendado)

1. Crea una cuenta en [Netlify](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno:
   - `DATABASE_URL`
   - `DATABASE_AUTH_TOKEN`
4. Deploy automático en cada push a `main`

Ver [guía completa de despliegue](./DEPLOYMENT.md).

### Vercel (Alternativa)

```bash
npm i -g vercel
vercel
vercel env add DATABASE_URL
vercel env add DATABASE_AUTH_TOKEN
vercel --prod
```

## 🎯 Funcionalidades Principales

### 1. Presupuestos Inteligentes
Los presupuestos se asocian automáticamente con transacciones basándose en:
- Categorías seleccionadas
- Rango de fechas del presupuesto
- Sin necesidad de asignación manual

### 2. Períodos Flexibles
Crea presupuestos con diferentes períodos:
- Diario (con hora de inicio opcional)
- Semanal
- Mensual
- Anual

### 3. Gestión Completa de Transacciones
- Edición inline de transacciones
- Soporte para ingresos y gastos
- Categorización personalizable
- Historial completo con filtros

### 4. Dashboard Analítico
- Balance total en tiempo real
- Estadísticas de ingresos y gastos
- Gráfico circular de distribución
- Transacciones recientes
- Estado de presupuestos activos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes de UI
- [Turso](https://turso.tech/) por la base de datos edge
- [Prisma](https://www.prisma.io/) por el excelente ORM
- [Next.js](https://nextjs.org/) por el framework

## 📧 Contacto

Benito Sanchez - [@beniaj1903](https://github.com/beniaj1903)

Link del Proyecto: [https://github.com/beniaj1903/budgeter](https://github.com/beniaj1903/budgeter)

---

Hecho con ❤️ usando Next.js y Turso
