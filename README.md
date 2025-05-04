# Calculator App with User Roles and JWT Authentication

This is a full-stack application with a React frontend, NestJS backend, and PostgreSQL database using Supabase. The application features a calculator with operation history, user roles (admin/user), and JWT authentication.

## Features

- **Calculator functionality** with operation history
- **User authentication** with JWT
- **Role-based access control**:
  - Regular users can use the calculator and view their own history
  - Admins can use the calculator, view all users' history, and filter by user
- **Secure API** with protected endpoints
- **Database integration** with PostgreSQL via Supabase

## Technology Stack

### Frontend
- React
- React Router for navigation
- Axios for API requests
- Bootstrap for styling

### Backend
- NestJS (Node.js framework)
- TypeORM for database operations
- JWT for authentication
- Passport.js for security
- bcrypt for password hashing

### Database
- PostgreSQL (via Supabase)

## Project Structure

```
calculator-project/
│
├── calculator-frontend/     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── App.js           # Main App component
│   ├── package.json
│   └── README.md
│
└── calculator-backend/      # NestJS backend
    ├── src/
    │   ├── auth/            # Authentication module
    │   ├── calculations/    # Calculations module
    │   ├── users/           # Users module
    │   ├── entities/        # Database entities
    │   └── config/          # Configuration
    ├── .env                 # Environment variables
    ├── package.json
    └── README.md
```

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Supabase account (or any PostgreSQL database)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd calculator-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   JWT_SECRET=your_very_secure_secret_key
   SUPABASE_URL=your_supabase_postgres_connection_string
   SUPABASE_KEY=your_supabase_api_key
   ```

4. Start the backend server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd calculator-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the application at `http://localhost:3000`

## Database Setup with Supabase

1. Create a new project in Supabase
2. Go to the SQL Editor and execute the following SQL:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' NOT NULL
);

-- Create calculations table
CREATE TABLE calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expression VARCHAR(255) NOT NULL,
  result VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Create an admin user (password: admin123)
INSERT INTO users (username, password, role)
VALUES ('admin', '$2b$10$X7aHn1bVQR.qX5A7IhQJVecQyB4cOr4oTTk0/uDWGQsVC3ZGKfzb2', 'admin');
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Calculations
- `POST /calculations` - Perform a calculation and save to history
- `GET /calculations/history` - Get calculation history (filtered by user role)
- `GET /calculations/history/:userId` - Get calculation history for a specific user (admin only)

### Users
- `GET /users` - Get all users (admin only)

## User Roles

### Regular User
- Can register and login
- Can use the calculator
- Can view their own calculation history

### Admin
- Can use the calculator
- Can view all users' calculation history
- Can filter history by user

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API endpoints
- Input validation

## Future Enhancements

- Add pagination for history
- Add more complex calculator functions
- Implement password reset functionality
- Add user profile management
- Add more detailed analytics for admins
