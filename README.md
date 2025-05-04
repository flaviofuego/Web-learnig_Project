# Calculadora con Historial y Roles de Usuario

Una aplicación full-stack de calculadora con historial de operaciones, sistema de autenticación y roles de usuario.
## Características

- **Calculadora funcional** con operaciones básicas
- **Historial de operaciones** guardado en base de datos
- **Sistema de autenticación** con JWT
- **Roles de usuario**:
  - **Usuario normal**: Puede usar la calculadora y ver su propio historial
  - **Administrador**: Puede usar la calculadora y ver el historial de todos los usuarios
- **Interfaz responsiva** desarrollada con React y Bootstrap

## Tecnologías Utilizadas

### Frontend
- React
- React Router para navegación
- Axios para solicitudes HTTP
- Bootstrap para estilos y componentes UI

### Backend
- NestJS (framework de Node.js)
- TypeORM para operaciones con la base de datos
- JWT para autenticación
- Passport.js para manejo de estrategias de autenticación
- bcrypt para encriptación de contraseñas

### Base de Datos
- PostgreSQL (Alojada en Supabase)

## Estructura del Proyecto

```
/
├── calculator-frontend/     # Aplicación React
│   ├── public/
│   └── src/
│       ├── components/      # Componentes React
│       ├── services/        # Servicios para comunicación con API
│       └── App.js           # Componente principal
│
└── calculator-backend/      # API de NestJS
    ├── src/
    │   ├── auth/            # Módulo de autenticación
    │   ├── calculations/    # Módulo de cálculos
    │   ├── users/           # Módulo de usuarios
    │   └── entities/        # Entidades de base de datos
    └
```

## Requisitos

- Node.js (v14 o superior)
- npm o yarn
- PostgreSQL (o una cuenta en Supabase)

## Configuración e Instalación

### Backend

1. Navega al directorio del backend:
   ```bash
   cd calculator-backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   PORT=3001
   JWT_SECRET=tu_clave_secreta_muy_segura
   DATABASE_URL=postgresql://usuario:contraseña@host:puerto/basededatos
   ```

4. Ejecuta la aplicación en modo desarrollo:
   ```bash
   npm run start:dev
   ```

### Frontend

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

## Uso de la Aplicación

### Registro e Inicio de Sesión

1. Al acceder por primera vez, regístrate con un nombre de usuario y contraseña
2. Inicia sesión con tus credenciales

### Usando la Calculadora

1. Navega a la sección "Calculator"
2. Usa los botones numéricos y de operaciones para realizar cálculos
3. Los resultados se guardarán automáticamente en tu historial

### Visualizando el Historial

1. Navega a la sección "History"
2. Verás una lista de tus cálculos anteriores (o de todos los usuarios si eres administrador)
3. Si eres administrador, puedes filtrar el historial por usuario

## Usuarios por Defecto

Después de configurar la base de datos, se crean dos usuarios por defecto:

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
- `POST /auth/register` - Registrar un nuevo usuario
- `POST /auth/login` - Iniciar sesión y obtener token JWT

### Cálculos
- `POST /calculations` - Realizar un cálculo y guardarlo en el historial
- `GET /calculations/history` - Obtener historial de cálculos (filtrado por rol)
- `GET /calculations/history/:userId` - Obtener historial de un usuario específico (solo admin)

### Usuarios
- `GET /users` - Obtener todos los usuarios (solo admin)

## Características de Seguridad

- Autenticación con tokens JWT
- Encriptación de contraseñas con bcrypt
- Control de acceso basado en roles
- Validación de datos en cliente y servidor

## Desarrollo

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

## Licencia

Este proyecto se distribuye bajo la licencia MIT.

## Autor

Flavio Arregoces

---
