#!/bin/bash

# Script para migrar datos de SQLite local a Turso
# Uso: ./migrate-to-turso.sh

set -e

echo "🔄 Iniciando migración de datos a Turso..."
echo ""

# Verificar que existe la base de datos local
if [ ! -f "dev.db" ]; then
    echo "❌ Error: No se encontró dev.db en el directorio actual"
    exit 1
fi

# Verificar que Turso CLI está instalado
if ! command -v turso &> /dev/null; then
    echo "❌ Error: Turso CLI no está instalado"
    echo ""
    echo "Instálalo con:"
    echo "  curl -sSfL https://get.tur.so/install.sh | bash"
    echo ""
    exit 1
fi

# Crear backup SQL
echo "📦 Exportando base de datos local..."
sqlite3 dev.db ".dump" > /tmp/budgeter_migration.sql

# Contar líneas para ver el tamaño
LINES=$(wc -l < /tmp/budgeter_migration.sql)
echo "✓ Exportadas $LINES líneas de SQL"
echo ""

# Importar a Turso
echo "☁️  Importando datos a Turso..."
turso db shell budgeter-db < /tmp/budgeter_migration.sql

echo ""
echo "✅ Migración completada!"
echo ""
echo "Verifica los datos con:"
echo "  turso db shell budgeter-db"
echo ""
echo "Luego ejecuta algunos queries de prueba:"
echo "  SELECT COUNT(*) FROM Category;"
echo "  SELECT COUNT(*) FROM Transaction;"
echo "  SELECT COUNT(*) FROM Budget;"
