# Calculadora Web con Autenticación, Roles y Persistencia

Una aplicación full-stack moderna que implementa una calculadora con historial de operaciones, sistema de autenticación JWT con refresh tokens, y control de acceso basado en roles.

## Características

- **Calculadora funcional** con operaciones matemáticas básicas
- **Historial de operaciones** almacenado en base de datos
- **Sistema de autenticación seguro**:
  - JWT para acceso
  - Refresh tokens para sesiones prolongadas
  - Contraseñas cifradas con bcrypt
- **Control de acceso basado en roles**:
  - **Usuario normal**: Puede usar la calculadora y ver su propio historial
  - **Administrador**: Puede usar la calculadora y ver el historial de todos los usuarios
- **Interfaz responsiva** desarrollada con React y Bootstrap

## Tecnologías Utilizadas

### Frontend
- **React** para la creación de la interfaz de usuario
- **React Router** para la navegación
- **Axios** para las peticiones HTTP
- **Bootstrap** para estilos y componentes UI
- **JWT Decode** para decodificar y verificar tokens

### Backend
- **NestJS** como framework de desarrollo para Node.js
- **Prisma ORM** para el acceso y manipulación de la base de datos
- **JWT** para la autenticación basada en tokens
- **Passport.js** para estrategias de autenticación
- **bcrypt** para el cifrado seguro de contraseñas

### Base de Datos
- **PostgreSQL** alojada en Supabase

## Estructura del Proyecto

```
/
├── calculator-frontend/
│   ├── public/                # Archivos estáticos
│   └── src/
│       ├── components/        # Componentes React
│       │   ├── Calculator.js  # Componente de calculadora
│       │   ├── History.js     # Visualización de historial
│       │   ├── Login.js       # Formulario de inicio de sesión
│       │   ├── Register.js    # Formulario de registro
│       │   └── NavBar.js      # Barra de navegación
│       ├── services/          # Servicios
│       │   └── api.service.js # Cliente API con interceptores
│       └── App.js             # Componente principal
│
└── calculator-backend/
    ├── prisma/                # Configuración y schemas de Prisma
    │   └── schema.prisma      # Modelo de datos
    └── src/
        ├── auth/              # Módulo de autenticación
        ├── calculations/      # Módulo de cálculos
        ├── users/             # Módulo de usuarios
        ├── prisma/            # Servicio de Prisma
        └── main.ts            # Punto de entrada
```

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- PostgreSQL (o cuenta en Supabase)

## Configuración e Instalación

### Backend (NestJS + Prisma)

1. Navega al directorio del backend:
   ```bash
   cd calculator-backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz con las siguientes variables:
   ```
   PORT=3001
   JWT_SECRET=tu_clave_secreta_muy_segura
   DATABASE_URL="postgresql://usuario:contraseña@host:puerto/basededatos"
   ```

4. Genera el cliente Prisma basado en tu esquema:
   ```bash
   npx prisma generate
   ```

5. Aplica las migraciones a la base de datos (si es necesario):
   ```bash
   npx prisma migrate dev --name init
   ```

6. Inicia el servidor en modo desarrollo:
   ```bash
   npm run start:dev
   ```

### Frontend (React)

1. Navega al directorio del frontend:
   ```bash
   cd calculator-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia la aplicación:
   ```bash
   npm start
   ```

4. Accede a la aplicación en: `http://localhost:3000`

## Usuarios Predeterminados

La aplicación incluye dos usuarios predeterminados para pruebas:

1. **Administrador**
   - Username: `admin`
   - Password: `admin123`
   - Role: `admin`

2. **Usuario Regular**
   - Username: `user`
   - Password: `user123`
   - Role: `user`

## API Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar un nuevo usuario |
| POST | `/auth/login` | Iniciar sesión y obtener tokens |
| POST | `/auth/refresh` | Renovar el token de acceso |
| POST | `/auth/logout` | Cerrar sesión (invalidar refresh token) |

### Cálculos

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/calculations` | Realizar y guardar un cálculo |
| GET | `/calculations/history` | Obtener historial (según rol) |
| GET | `/calculations/history/:userId` | Obtener historial de un usuario específico (solo admin) |

### Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Obtener todos los usuarios (solo admin) |

## Funcionalidades y Flujos

### Sistema de Autenticación con Refresh Tokens

1. **Login**: El usuario se autentica y recibe un access token (JWT) y un refresh token
2. **Access Token**: Token de corta duración (15 minutos) usado para autenticar peticiones
3. **Refresh Token**: Token de larga duración (7 días) almacenado en la base de datos
4. **Renovación automática**: Cuando el access token expira, se utiliza el refresh token para obtener uno nuevo sin necesidad de volver a iniciar sesión
5. **Logout**: Invalida el refresh token en la base de datos

### Calculadora

1. El usuario introduce operaciones matemáticas usando la interfaz
2. Los resultados se calculan y muestran instantáneamente
3. Cada operación se envía al servidor y se guarda en la base de datos
4. El historial es accesible para referencia futura

### Historial de Cálculos

1. **Usuario regular**: Puede ver solo su propio historial de cálculos
2. **Administrador**: Puede ver el historial de todos los usuarios y filtrar por usuario
3. El historial muestra la expresión, el resultado y la fecha/hora

## Seguridad

- **JWT de corta duración**: Minimiza el impacto de tokens comprometidos
- **Refresh tokens**: Almacenados de forma segura con hash en la base de datos
- **Contraseñas**: Cifradas con bcrypt antes de ser almacenadas
- **CORS**: Configurado para permitir solo orígenes confiables
- **Guards en NestJS**: Protegen las rutas según los roles del usuario

## Prisma ORM

Este proyecto utiliza Prisma ORM para el acceso a la base de datos, proporcionando:

- **Type safety**: Tipos TypeScript generados automáticamente
- **Migraciones**: Gestión sencilla de cambios en el esquema
- **Query builder**: API intuitiva para consultas complejas
- **Prisma Studio**: Interfaz visual para explorar y manipular datos

### Comandos útiles de Prisma

```bash
# Generar cliente
npx prisma generate

# Crear una migración
npx prisma migrate dev --name nombre_migracion

# Introspección (generar schema desde DB existente)
npx prisma db pull

# Abrir Prisma Studio (GUI para la base de datos)
npx prisma studio
```

## Desarrollo y Despliegue

### Comandos Útiles

```bash
# Backend
npm run start:dev     # Iniciar en modo desarrollo
npm run build         # Compilar para producción
npm run start:prod    # Ejecutar versión de producción

# Frontend
npm start             # Iniciar en modo desarrollo
npm run build         # Compilar para producción
npm test              # Ejecutar pruebas
```

### Despliegue

Para desplegar la aplicación en producción:

1. **Backend**: 
   - Configura variables de entorno para producción
   - Ejecuta `npm run build`
   - Despliega la carpeta `dist` con el archivo `.env`

2. **Frontend**:
   - Ejecuta `npm run build`
   - Despliega la carpeta `build` en un servidor web estático

## Solución de Problemas

### Problemas comunes y soluciones

1. **Error de conexión a la base de datos**: Verifica la URL de conexión y los permisos.
2. **Error "Column does not exist"**: Actualiza tu esquema Prisma para que coincida con la base de datos:
   ```bash
   npx prisma db pull
   npx prisma generate
   ```
3. **Tokens no válidos**: Asegúrate de que el mismo JWT_SECRET se usa en toda la aplicación.

## Licencia

Este proyecto está licenciado bajo la licencia MIT.

## Autor

Flavio Arregoces
