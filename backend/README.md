# StackIt Forum Backend API

A RESTful API for a Q&A forum built with Node.js, Express, Prisma, and MongoDB Atlas.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Question Management**: CRUD operations for questions with rich text support
- **User Management**: User registration, login, and profile management
- **Search & Filtering**: Advanced search and filtering capabilities
- **Pagination**: Efficient pagination for large datasets
- **XSS Protection**: HTML sanitization for rich text content
- **Image Support**: Support for image uploads in question descriptions
- **Tag System**: Multi-tag support with popular tags tracking

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **HTML Sanitization**: sanitize-html

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="mongodb+srv://gaurav:Gatt11!!@democluster.zczir.mongodb.net/stackit_forum?retryWrites=true&w=majority&appName=democluster"

# JWT Configuration
JWT_SECRET="d4bc053fab3a38c09fdbb7c37d0f2384"

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: Logging
LOG_LEVEL=info
```

### 3. Database Setup

Generate Prisma client and push schema to database:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication).

#### PUT /api/auth/profile
Update user profile (requires authentication).

#### POST /api/auth/change-password
Change user password (requires authentication).

### Questions

#### POST /api/questions
Create a new question (requires authentication).

**Request Body:**
```json
{
  "title": "How to implement authentication in React?",
  "description": "<p>I'm building a React app and need to implement user authentication...</p>",
  "tags": ["react", "authentication", "javascript"]
}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### GET /api/questions
Get all questions with filtering, search, and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `search` (string): Search in title and description
- `tags` (string): Comma-separated tags to filter by
- `sortBy` (string): Sort field (createdAt, title, answers)
- `sortOrder` (string): Sort order (asc, desc)

**Example:**
```
GET /api/questions?page=1&limit=10&search=react&tags=javascript,react&sortBy=createdAt&sortOrder=desc
```

#### GET /api/questions/:id
Get a single question by ID with answers and comments.

#### PUT /api/questions/:id
Update a question (owner or admin only).

#### DELETE /api/questions/:id
Delete a question (owner or admin only).

#### GET /api/questions/tags/popular
Get popular tags.

### Users

#### GET /api/users
Get all users (admin only).

#### GET /api/users/:id
Get user profile by ID.

#### GET /api/users/:id/questions
Get user's questions.

#### GET /api/users/:id/answers
Get user's answers.

#### PUT /api/users/:id/role
Update user role (admin only).

#### DELETE /api/users/:id
Delete user (admin only).

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  username  String   @unique
  password  String
  role      Role     @default(USER)
  avatar    String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  questions Question[]
  answers   Answer[]
  comments  Comment[]
}
```

### Question Model
```prisma
model Question {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  tags        String[]
  authorId    String   @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  answers  Answer[]
  comments Comment[]
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **XSS Protection**: HTML sanitization for rich text content
- **Rate Limiting**: Prevents abuse with request rate limiting
- **CORS Configuration**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive validation using Joi
- **Role-based Access Control**: Different permission levels for users

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Development

### Available Scripts

- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema changes to database
- `npm run db:studio`: Open Prisma Studio for database management

### Project Structure

```
backend/
├── src/
│   ├── index.js              # Main server file
│   ├── lib/
│   │   └── prisma.js         # Prisma client configuration
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── questions.js      # Question routes
│   │   └── users.js          # User routes
│   ├── validation/
│   │   └── questionValidation.js # Validation schemas
│   └── utils/
│       └── sanitizer.js      # HTML sanitization utilities
├── prisma/
│   └── schema.prisma         # Database schema
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 