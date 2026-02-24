# Job Listing Portal — Server

Backend REST API for the Job Listing Portal, built with **Express.js** and **MongoDB**.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

## Project Structure

```
server/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js       # Register & login logic
│   │   ├── jobController.js        # Job CRUD operations
│   │   ├── jobSeekerProfileController.js
│   │   └── employerProfileController.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT auth guard
│   │   └── upload.js               # File upload middleware
│   ├── models/
│   │   ├── User.js                 # User schema & password hashing
│   │   ├── Job.js                  # Job listing schema
│   │   ├── JobSeekerProfile.js     # Job seeker profile schema
│   │   └── EmployerProfile.js      # Employer profile schema
│   ├── routes/
│   │   ├── authRoutes.js           # POST /api/auth/register & /login
│   │   ├── userRoutes.js           # GET /api/user/profile (protected)
│   │   ├── jobRoutes.js            # Job listing endpoints
│   │   ├── jobSeekerProfileRoutes.js
│   │   └── employerProfileRoutes.js
│   └── utils/
│       ├── generateToken.js        # JWT token generator (30-day expiry)
│       └── imagekitUpload.js       # ImageKit file upload utility
├── .env                            # Environment variables (not committed)
├── .env.example                    # Example environment variables
├── package.json
└── server.js                       # Server entry point

```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A MongoDB Atlas cluster or local MongoDB instance

### Installation

```bash
# Clone the repo & navigate to the server directory
cd server

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the Server

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

The server will start at **http://localhost:5000**.

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint    | Description             | Access |
| ------ | ----------- | ----------------------- | ------ |
| POST   | `/register` | Register a new user     | Public |
| POST   | `/login`    | Login & receive a token | Public |

### User Routes — `/api/user`

| Method | Endpoint   | Description      | Access  |
| ------ | ---------- | ---------------- | ------- |
| GET    | `/profile` | Get user profile | Private |

### Job Routes — `/api/jobs`

| Method | Endpoint           | Description                   | Access  |
| ------ | ------------------ | ----------------------------- | ------- |
| POST   | `/`                | Create a new job listing      | Private (Employer) |
| GET    | `/`                | Get all active jobs (paginated) | Public |
| GET    | `/:id`             | Get job by ID                 | Public |
| GET    | `/employer/me`     | Get current employer's jobs   | Private (Employer) |
| PUT    | `/:id`             | Update job listing            | Private (Employer, own jobs) |
| PATCH  | `/:id/status`      | Update job status             | Private (Employer, own jobs) |
| DELETE | `/:id`             | Delete job (soft delete)      | Private (Employer, own jobs) |

> **Private** routes require a `Bearer` token in the `Authorization` header.

### Request / Response Examples

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "user"          // optional — "user" (default) or "employer"
}
```

**Success (201):**

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success (200):** Same shape as the register response.

#### Get Profile

```
GET /api/user/profile
Authorization: Bearer <token>
```

**Success (200):**

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

## User Model

| Field      | Type   | Details                             |
| ---------- | ------ | ----------------------------------- |
| name       | String | Required                            |
| email      | String | Required, unique, validated          |
| password   | String | Required, min 6 chars, hashed       |
| role       | String | `"user"` (default) or `"employer"`  |
| createdAt  | Date   | Auto-generated                      |

## License

ISC
