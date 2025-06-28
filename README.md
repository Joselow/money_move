# Money Move Backend API

Backend API desarrollado con Node.js, TypeScript y Express para la aplicación Money Move.

## 🚀 Características

- **TypeScript**: Código tipado y seguro
- **Express**: Framework web para Node.js
- **TSX**: Ejecución directa de TypeScript sin compilación
- **Variables de entorno**: Configuración flexible
- **CORS**: Soporte para Cross-Origin Resource Sharing
- **Helmet**: Middleware de seguridad
- **Morgan**: Logging de requests HTTP
- **Manejo de errores**: Middleware centralizado para errores
- **Estructura modular**: Organización clara del código

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- pnpm (recomendado) o npm

## 🛠️ Instalación

1. **Clonar el repositorio** (si aplica):
```bash
git clone <repository-url>
cd money_move_backend
```

2. **Instalar dependencias**:
```bash
pnpm install
```

3. **Configurar variables de entorno**:
```bash
cp env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Uso

### Desarrollo
```bash
pnpm dev
```

### Producción
```bash
# Compilar TypeScript
pnpm build

# Ejecutar servidor
pnpm start
```

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── env.ts          # Configuración de variables de entorno
├── middleware/
│   └── errorHandler.ts # Manejo de errores
├── routes/
│   ├── index.ts        # Rutas principales
│   └── health.ts       # Ruta de health check
├── app.ts              # Configuración de Express
└── index.ts            # Punto de entrada
```

## 🌐 Endpoints

- `GET /api` - Información de la API
- `GET /api/health` - Health check del servidor

## 🔧 Scripts Disponibles

- `pnpm dev` - Ejecutar en modo desarrollo con hot reload
- `pnpm build` - Compilar TypeScript a JavaScript
- `pnpm start` - Ejecutar servidor en producción
- `pnpm test` - Ejecutar tests (pendiente de implementar)

## 📝 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3000` |

## 🔒 Seguridad

- **Helmet**: Headers de seguridad automáticos
- **CORS**: Configuración de Cross-Origin Resource Sharing
- **Morgan**: Logging de requests HTTP (dev: colored, prod: combined)
- **Rate Limiting**: Pendiente de implementar
- **JWT**: Pendiente de implementar

## 📈 Próximas Implementaciones

- [ ] Base de datos (PostgreSQL/MongoDB)
- [ ] Autenticación JWT
- [ ] Validación de datos (Joi/Zod)
- [ ] Rate limiting
- [ ] Logging estructurado
- [ ] Tests unitarios e integración
- [ ] Docker
- [ ] CI/CD

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. 