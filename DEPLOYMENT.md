# Guía de Despliegue en Netlify con Turso

## Paso 1: Configurar Turso

### 1.1 Instalar Turso CLI

```bash
# Usando curl
curl -sSfL https://get.tur.so/install.sh | bash

# O usando Homebrew
brew install tursodatabase/tap/turso
```

### 1.2 Crear cuenta y base de datos

```bash
# Crear cuenta o iniciar sesión
turso auth signup
# o si ya tienes cuenta:
turso auth login

# Crear base de datos
turso db create budgeter-db

# Obtener la URL de conexión
turso db show budgeter-db --url

# Crear token de autenticación
turso db tokens create budgeter-db
```

### 1.3 Actualizar archivo .env local

Copia los valores obtenidos a tu archivo `.env`:

```bash
DATABASE_URL="libsql://budgeter-db-[tu-usuario].turso.io"
DATABASE_AUTH_TOKEN="eyJ..."
```

### 1.4 Sincronizar esquema de base de datos

```bash
# Asegúrate de usar la versión correcta de Node
nvm use

# Sincroniza el esquema de Prisma con Turso
npm run db:push
```

## Paso 2: Preparar el proyecto

### 2.1 Ignorar archivos locales

Asegúrate de que tu `.gitignore` incluye:

```
.env
.env.local
*.db
*.db-journal
node_modules/
.next/
```

### 2.2 Verificar que funciona localmente con Turso

```bash
# Detén el servidor actual
# Actualiza tu .env con las credenciales de Turso
# Inicia el servidor
npm run dev
```

Verifica que la aplicación funciona correctamente en http://localhost:3008

## Paso 3: Desplegar en Netlify

### 3.1 Preparar repositorio Git

```bash
git add .
git commit -m "Configurar Turso para producción"
git push origin main
```

### 3.2 Crear sitio en Netlify

1. Ve a [netlify.com](https://netlify.com) e inicia sesión
2. Click en "Add new site" → "Import an existing project"
3. Conecta tu repositorio de GitHub/GitLab/Bitbucket
4. Selecciona tu repositorio `budgeter`

### 3.3 Configurar variables de entorno en Netlify

En la configuración del sitio, ve a:
**Site settings → Environment variables**

Agrega estas variables:

```
DATABASE_URL = libsql://budgeter-db-[tu-usuario].turso.io
DATABASE_AUTH_TOKEN = eyJ...tu-token-aqui...
```

### 3.4 Configuración de Build

Netlify debería detectar automáticamente Next.js. Verifica:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: (dejar vacío, se usa por defecto)

### 3.5 Desplegar

1. Click en "Deploy site"
2. Espera a que el build complete
3. Tu sitio estará disponible en `https://tu-sitio.netlify.app`

## Paso 4: Inicializar datos en producción

Después del primer despliegue, necesitas inicializar las categorías por defecto:

1. Visita tu sitio en producción
2. Ve a la pestaña "Categorías"
3. Las categorías se crearán automáticamente en la primera carga

## Comandos útiles de Turso

```bash
# Ver todas tus bases de datos
turso db list

# Ver detalles de tu base de datos
turso db show budgeter-db

# Abrir shell SQL interactivo
turso db shell budgeter-db

# Ver uso y estadísticas
turso db inspect budgeter-db

# Crear backups
turso db snapshot budgeter-db

# Ver tokens activos
turso db tokens list budgeter-db

# Revocar un token (útil si se compromete)
turso db tokens revoke budgeter-db [token-name]
```

## Troubleshooting

### Error de conexión a la base de datos

Verifica que:
- Las variables de entorno están correctamente configuradas en Netlify
- El token de Turso no ha expirado
- La URL incluye el protocolo `libsql://`

### Build falla en Netlify

Revisa los logs de build en Netlify. Problemas comunes:
- Falta configurar variables de entorno
- Errores de TypeScript (ejecuta `npm run build` localmente primero)
- Versión de Node incorrecta (Netlify usa Node 18 por defecto)

### Datos no persisten

Si los datos no se guardan:
- Verifica que estás usando las credenciales de Turso en producción
- Revisa los logs de funciones en Netlify
- Confirma que `npm run db:push` se ejecutó exitosamente

## Monitoreo

Turso ofrece un dashboard para monitorear:
- Número de filas en cada tabla
- Uso de almacenamiento
- Número de queries
- Latencia

Accede al dashboard en: https://turso.tech/app

## Costos

Turso Free Tier incluye:
- 500 bases de datos
- 9 GB de almacenamiento total
- 1 billón de filas leídas/mes
- Más que suficiente para uso personal/hobby

## Dominios personalizados

Para usar un dominio personalizado:
1. En Netlify: **Domain settings → Add custom domain**
2. Sigue las instrucciones para configurar DNS
3. Netlify provee SSL automático con Let's Encrypt

## Alternativa: Vercel

Si prefieres Vercel en lugar de Netlify:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno
vercel env add DATABASE_URL
vercel env add DATABASE_AUTH_TOKEN

# Desplegar a producción
vercel --prod
```

Vercel tiene mejor integración con Next.js ya que son del mismo equipo.
