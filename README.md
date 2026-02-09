# API RESTful - Gestión de Productos (Stock)

Examen Final - Taller de Programación 2

## Descripción

API RESTful en Node.js con Express para gestionar productos y su stock. Implementa persistencia dual (MongoDB Atlas o archivo JSON local) y autenticación flexible (x-api-key o JWT).

## Características

- CRUD completo de productos
- Persistencia configurable (MongoDB/JSON)
- Validaciones de negocio
- Manejo estandarizado de errores
- Autenticación flexible (x-api-key y JWT)
- Sistema de usuarios con registro y login
- Integración con API externa para generación de CSV

## Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/giansosa/TP2_FINAL.git
cd TP2_FINAL
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar `.env` según necesidad:
```env
# Persistencia
DB_PROVIDER=mongo  # Opciones: mongo | json
MONGO_URI=mongodb+srv://...

# Autenticación
AUTH_METHOD=api-key  # Opciones: api-key | jwt | both
API_KEY=tu-api-key-secreta
JWT_SECRET=tu-jwt-secret
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=development
```

## Uso

### Modo MongoDB

```bash
# Asegurarse de que DB_PROVIDER=mongo en .env
npm start
```

### Modo JSON

```bash
# Asegurarse de que DB_PROVIDER=json en .env
npm start
```

### Modo Desarrollo

```bash
npm run dev
```

## Endpoints

### Autenticación

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/auth/register` | Registrar usuario | No |
| POST | `/api/v1/auth/login` | Iniciar sesión | No |

### Productos

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/productos` | Crear producto | No |
| GET | `/api/v1/productos` | Listar productos | No |
| GET | `/api/v1/productos/:id` | Obtener producto | No |
| PUT | `/api/v1/productos/:id` | Editar producto | Sí |
| DELETE | `/api/v1/productos/:id` | Eliminar | Sí |

### Albums

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/albums/csv` | Obtener albums en CSV | No |

### Modelo de Producto

```json
{
  "id": "string (UUID o ObjectId)",
  "producto": "string (requerido, no vacío)",
  "stockAmount": "integer ≥ 0 (requerido)",
  "fechaIngreso": "date (YYYY-MM-DD, opcional)"
}
```

### Modelo de Usuario

```json
{
  "id": "string (UUID o ObjectId)",
  "username": "string (requerido, mínimo 3 caracteres)",
  "createdAt": "date (ISO 8601)"
}
```

### Ejemplos de Uso

#### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### Crear producto
```bash
curl -X POST http://localhost:3000/api/v1/productos \
  -H "Content-Type: application/json" \
  -d '{
    "producto": "Laptop HP",
    "stockAmount": 10
  }'
```

#### Listar productos
```bash
curl http://localhost:3000/api/v1/productos
```

#### Obtener producto por ID
```bash
curl http://localhost:3000/api/v1/productos/:id
```

#### Actualizar producto (con x-api-key)
```bash
curl -X PUT http://localhost:3000/api/v1/productos/:id \
  -H "Content-Type: application/json" \
  -H "x-api-key: api-key-secreta-para-pruebas-12345" \
  -d '{
    "stockAmount": 20
  }'
```

#### Actualizar producto (con JWT)
```bash
curl -X PUT http://localhost:3000/api/v1/productos/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "stockAmount": 20
  }'
```

#### Eliminar producto
```bash
curl -X DELETE http://localhost:3000/api/v1/productos/:id \
  -H "x-api-key: api-key-secreta-para-pruebas-12345"
```

#### Obtener albums en CSV
```bash
curl http://localhost:3000/api/v1/albums/csv
```

## Tests

Se incluye un archivo de tests en formato REST Client para VSCode:

`tests/test.endpoints.http`

Para ejecutar los tests:
1. Instalar la extensión "REST Client" en VSCode
2. Abrir el archivo `tests/test.endpoints.http`
3. Hacer clic en "Send Request" sobre cada endpoint

## Estructura del Proyecto

```
proyecto-stock-api/
├── app.js                          # Configuración de Express
├── index.js                        # Punto de entrada
├── package.json                    # Dependencias
├── .env                            # Variables de entorno
├── .env.example                    # Plantilla de variables
├── .gitignore                      # Archivos ignorados
├── README.md                       # Documentación
├── ENTREGA_FINAL.txt               # Archivo de entrega
│
├── config/
│   └── index.js                    # Carga de configuración
│
├── controllers/
│   ├── productoController.js       # Lógica de control de productos
│   ├── authController.js           # Lógica de control de autenticación
│   └── albumsController.js        # Lógica de control de albums
│
├── models/
│   ├── producto.js                 # Esquema/DTO de Producto
│   └── usuario.js                  # Esquema/DTO de Usuario
│
├── repository/
│   ├── productoRepositoryMongo.js  # Implementación MongoDB productos
│   ├── productoRepositoryJson.js   # Implementación JSON productos
│   ├── usuarioRepositoryMongo.js   # Implementación MongoDB usuarios
│   ├── usuarioRepositoryJson.js    # Implementación JSON usuarios
│   └── index.js                    # Factory de repositorios
│
├── routes/
│   ├── productoRoutes.js           # Rutas de productos
│   ├── authRoutes.js               # Rutas de autenticación
│   └── albumsRoutes.js             # Rutas de albums
│
├── services/
│   ├── albumsService.js            # Servicio de albums (API externa)
│   └── csvService.js               # Servicio de generación CSV
│
├── middlewares/
│   └── authMiddleware.js           # Middleware de autenticación
│
├── utils/
│   ├── jwtUtils.js                 # Utilidades JWT
│   ├── apiKeyUtils.js              # Utilidades API Key
│   └── passwordUtils.js            # Utilidades de password (bcrypt)
│
├── database/
│   ├── database.json               # Persistencia JSON (opcional)
│   └── albums_15.csv               # CSV generado (runtime)
│
└── tests/
    └── test.endpoints.http         # Tests REST Client
```

## Validaciones

### Al crear producto
- `producto`: requerido, no vacío
- `stockAmount`: entero ≥ 0
- `fechaIngreso`: opcional, formato YYYY-MM-DD

### Al actualizar producto
- `producto`: no puede estar vacío si se actualiza
- `stockAmount`: entero ≥ 0 si se actualiza

### Al crear usuario
- `username`: requerido, mínimo 3 caracteres, único
- `password`: requerido, mínimo 6 caracteres

## Respuestas de Error

Formato estandarizado:

```json
{
  "statusCode": 400,
  "error": "Mensaje descriptivo"
}
```

Códigos de error comunes:
- `400`: Bad Request (validación fallida)
- `401`: Unauthorized (no autenticado)
- `403`: Forbidden (autenticación inválida)
- `404`: Not Found (recurso no encontrado)
- `409`: Conflict (recurso ya existe)
- `500`: Internal Server Error

## Health Check

```bash
curl http://localhost:3000/health
```

Respuesta:
```json
{
  "status": "ok",
  "dbProvider": "mongo",
  "authMethod": "api-key",
  "timestamp": "2024-02-09T22:00:00.000Z"
}
```

## Notas Importantes

### Configuración de MongoDB Atlas
- La cadena de conexión ya está configurada para el cluster TP2Final
- Usuario: `gianaxelsosa_db_user`

### Sistema de Autenticación
- **x-api-key**: Método simple usando header `x-api-key`
- **JWT**: Método más robusto que requiere registro previo de usuario
- Para usar JWT, primero se debe registrar un usuario vía `POST /api/v1/auth/register`
- Luego iniciar sesión vía `POST /api/v1/auth/login` para obtener el token
- El token se usa en el header `Authorization: Bearer <token>`

### Cambio entre MongoDB y JSON
- Establecer `DB_PROVIDER=mongo` para usar MongoDB Atlas
- Establecer `DB_PROVIDER=json` para usar archivo local `database/database.json`
- El cambio es transparente gracias al patrón Factory en los repositorios

### Seguridad
- Las contraseñas se almacenan hasheadas usando bcrypt
- Los tokens JWT tienen expiración configurable (24h por defecto)
- Las rutas PUT y DELETE de productos están protegidas
- Las rutas de autenticación (register/login) NO requieren autenticación previa

## Autor

Gian Sosa

## Licencia

ISC

