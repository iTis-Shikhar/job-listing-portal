# Job Listing Portal — Server

Backend REST API for the Job Listing Portal, built with **Express.js** and **MongoDB**.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v18+ |
| Framework | Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | JWT (30-day tokens) |
| Password Hashing | bcryptjs |
| File Storage | ImageKit (cloud) |
| File Upload | Multer (memory storage) |

---

## Project Structure

```
server/
├── src/
│   ├── app.js                          # Express app + route registration
│   ├── config/
│   │   ├── db.js                       # MongoDB connection
│   │   └── imagekit.config.js          # ImageKit SDK setup
│   ├── controllers/
│   │   ├── authController.js           # Register & login
│   │   ├── jobController.js            # Job CRUD + save/unsave toggle
│   │   ├── jobSeekerProfileController.js
│   │   ├── employerProfileController.js
│   │   ├── applicationController.js    # Apply, view, update status
│   │   ├── dashboardController.js      # Aggregated dashboards
│   │   └── notificationController.js   # Notification management
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT protect guard
│   │   └── upload.js                   # Multer memory storage middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── JobSeekerProfile.js
│   │   ├── EmployerProfile.js
│   │   ├── Application.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── jobSeekerProfileRoutes.js
│   │   ├── employerProfileRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── notificationRoutes.js
│   └── utils/
│       ├── generateToken.js
│       └── imagekitUpload.js
├── .env
├── .env.example
├── package.json
└── server.js
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- MongoDB Atlas cluster or local MongoDB
- [ImageKit](https://imagekit.io/) account (for file uploads)

### Installation

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### Running the Server

```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```

Server runs at **http://localhost:5000**

---

## API Reference

> All **Private** routes require `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login & receive JWT | Public |

### User — `/api/user`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/profile` | Get current user info | Private |

### Job Seeker Profile — `/api/profile/jobseeker`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/` | Create profile (with resume upload) | Private |
| GET | `/me` | Get own profile | Private |
| GET | `/:id` | Get profile by ID | Public |
| PUT | `/` | Update profile (with resume replace) | Private |
| DELETE | `/` | Delete profile | Private |

### Employer Profile — `/api/profile/employer`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/` | Create company profile | Private |
| GET | `/me` | Get own company profile | Private |
| GET | `/:id` | Get company profile by ID | Public |
| PUT | `/` | Update company profile | Private |
| DELETE | `/` | Delete company profile | Private |

### Jobs — `/api/jobs`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all active jobs (search + filter + paginate) | Public |
| GET | `/:id` | Get job by ID | Public |
| GET | `/employer/me` | Get current employer's jobs | Private (Employer) |
| POST | `/` | Create job listing | Private (Employer) |
| PUT | `/:id` | Update job listing | Private (Employer, own) |
| DELETE | `/:id` | Soft-delete job (→ Closed) | Private (Employer, own) |
| PATCH | `/:id/status` | Set job status (Active/Inactive/Closed) | Private (Employer, own) |
| POST | `/:id/save` | Toggle save/unsave a job | Private (Job Seeker) |

**Search & Filter Params** (`GET /api/jobs`):

| Param | Description |
|---|---|
| `keyword` | Search title, description, skills |
| `location` | Filter by city/state/country |
| `jobType` | Filter by job type |
| `minSalary` | Filter by minimum salary |
| `page` | Page number (default: 1) |
| `limit` | Results per page (default: 10) |

### Applications — `/api/applications`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/` | Apply to a job (multipart/form-data with `resume`) | Private (Job Seeker) |
| GET | `/my-applications` | Get own applications | Private (Job Seeker) |
| GET | `/employer/me` | Get applications for employer's jobs | Private (Employer) |
| PATCH | `/:id/status` | Update application status + add note | Private (Employer) |

**Application Statuses:** `Applied → Reviewed → Shortlisted → Interviewing → Rejected / Accepted / Withdrawn`

**Application Sources:** `Profile` (from saved profile) | `Manual` (user-entered) | `Auto-detect` (from resume)

### Dashboard — `/api/dashboard`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/jobseeker` | Job seeker dashboard | Private (Job Seeker) |
| GET | `/employer` | Employer dashboard | Private (Employer) |

**Query Param:** `?period=7d|30d|all` (filters application stats by time window, default: `all`)

**Job Seeker Dashboard returns:**
```json
{
  "profile": {},
  "profileCompletionScore": 75,
  "applications": { "total": 5, "byStatus": { "Applied": 2 }, "recent": [] },
  "savedJobs": [],
  "notifications": { "unreadCount": 3, "recent": [] }
}
```

**Employer Dashboard returns:**
```json
{
  "profile": {},
  "jobs": {
    "total": 4,
    "byStatus": { "Active": 3, "Closed": 1 },
    "listings": [ { "title": "...", "applicationCount": 10, "funnel": { "Applied": 7, "Shortlisted": 3 } } ]
  },
  "applications": { "total": 12, "recent": [] },
  "notifications": { "unreadCount": 2, "recent": [] }
}
```

### Notifications — `/api/notifications`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get notifications (`?unreadOnly=true`) | Private |
| PATCH | `/read-all` | Mark all as read | Private |
| PATCH | `/:id/read` | Mark one as read | Private |
| DELETE | `/:id` | Delete a notification | Private |

**Auto-triggered:**
- Employer ← `APPLICATION_RECEIVED` when a job seeker applies
- Job Seeker ← `APPLICATION_STATUS` when employer updates their status

---

## Data Models Summary

### User
`name` · `email` · `password` (hashed) · `role` (user/employer)

### JobSeekerProfile
`fullName` · `phone` · `location` · `resume` (ImageKit) · `skills[]` · `bio` · `linkedIn` · `portfolio` · `currentJobTitle` · `yearsOfExperience` · `savedJobs[]`

### EmployerProfile
`companyName` · `industry` · `companySize` · `foundedYear` · `website` · `about` · `address` · `socialLinks`

### Job
`title` · `description` · `requirements` · `location` · `jobType` · `salaryRange` · `status` (Active/Inactive/Closed) · `employer` · `employerProfile`

### Application
`job` · `jobSeeker` · `employer` · `resume` (ImageKit: fileId, url) · `source` · `applicantDetails` · `coverLetter` · `status` · `notes[]`

### Notification
`recipient` · `type` · `message` · `read` · `refModel` · `refId`

---

## License

ISC
