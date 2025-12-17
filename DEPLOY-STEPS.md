# Pasos Rápidos para Desplegar

## 1. Instalar Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

## 2. Configurar Turso

```bash
# Login
turso auth signup

# Crear DB
turso db create budgeter-db

# Obtener credenciales
turso db show budgeter-db --url
turso db tokens create budgeter-db
```

## 3. Actualizar .env local

Copia las credenciales a tu `.env`:

```env
DATABASE_URL="libsql://budgeter-db-TU-USUARIO.turso.io"
DATABASE_AUTH_TOKEN="eyJhbGc..."
```

## 4. Sincronizar esquema

```bash
nvm use
npm run db:push
```

## 4.5. Migrar datos existentes (SI TIENES DATOS EN dev.db)

Si ya tienes datos en tu base de datos local, mígralos a Turso:

```bash
npm run db:migrate
```

Este comando copiará todas tus categorías, transacciones, presupuestos y relaciones a Turso.

## 5. Probar localmente

```bash
npm run dev
```

Verifica que funciona en http://localhost:3008

## 6. Subir a GitHub

```bash
git add .
git commit -m "Configurar para producción con Turso"
git push origin main
```

## 7. Desplegar en Netlify

1. Ve a https://netlify.com
2. "Add new site" → "Import existing project"
3. Conecta tu repositorio
4. En "Environment variables" agrega:
   - `DATABASE_URL`
   - `DATABASE_AUTH_TOKEN`
5. Click "Deploy site"

¡Listo! 🚀

---

**Nota**: Revisa [DEPLOYMENT.md](./DEPLOYMENT.md) para más detalles y troubleshooting.
