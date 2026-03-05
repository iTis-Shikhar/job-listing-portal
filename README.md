# HireSphere - Modern Job Listing Portal

HireSphere is a full-stack web application designed to seamlessly connect employers with top talent. Built with the MERN stack, it features secure role-based authentication, cloud-based resume management, and a real-time application tracking system.

## 🚀 Key Features

**For Job Seekers:**
* **Smart Dashboard:** Browse and search for active job listings with instant frontend filtering by Title, Location, and Job Type.
* **Profile Management:** Maintain a professional profile and securely upload PDF resumes to the cloud.
* **Seamless Applications:** Apply to jobs directly through the platform with custom cover letters.
* **Real-Time Tracking:** Monitor the live status of submitted applications (Pending, Shortlisted, Accepted, Rejected).

**For Employers:**
* **Company Profiles:** Establish a premium employer brand with detailed company profiles.
* **Job Management:** Post, edit, and manage detailed job listings with strict requirement formatting.
* **Applicant Review System:** View candidate profiles, download cloud-hosted resumes, and update applicant statuses directly from the dashboard.
* **Analytics:** Track active job counts and total applicant volume at a glance.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcrypt.js
* **Cloud Storage:** ImageKit (for secure resume/PDF hosting)

## ⚙️ Installation & Setup

**1. Clone the repository:**
`git clone <your-repo-url>`

**2. Setup the Backend:**
`cd server`
`npm install`
* Create a `.env` file in the `server` directory using the `.env.example` template. You will need your MongoDB URI, JWT Secret, and ImageKit API credentials.
* Start the server: `npm run dev`

**3. Setup the Frontend:**
`cd client`
`npm install`
* Start the React development server: `npm run dev`

**4. Access the App:**
Open `http://localhost:5173` in your browser.