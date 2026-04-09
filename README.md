# Profilia 🚀

**Live Demo:** [Click here to view the live application](profiliaa-web-app.netlify.app/)

Profilia is a modern, full-stack B2B SaaS job board platform built to seamlessly connect ambitious talent with industry-leading employers. Featuring a crisp, industry-standard UI, role-based dashboards, and real-time application tracking, Profilia streamlines the entire hiring ecosystem.

---

## ✨ Key Features

### For Job Seekers
* **Smart Dashboard:** Browse, search, and filter active job postings by title, company, location, and job type.
* **One-Click Applications:** Apply to jobs seamlessly with an uploaded resume (PDF) and custom cover letter. 
* **Application Tracking:** Monitor the real-time status of all submitted applications (Pending, Shortlisted, Accepted, Rejected) via a dedicated tracking dashboard.
* **Automated Expiration:** Jobs past their application deadline automatically hide from the active feed.
* **Dynamic Profiles:** Build a comprehensive professional profile, including skills, experience, and an integrated cloud-hosted resume.

### For Employers
* **Analytics Dashboard:** Get a bird's-eye view of total active job postings and total applicant volume.
* **Job Management:** Post highly detailed job listings including salary ranges, required skills, remote options, and application deadlines.
* **Applicant Review System:** Review candidate profiles, download resumes, read cover letters, and update candidate statuses through a clean, modern interface.
* **Company Branding:** Establish a premium company profile to attract top-tier talent.

### UI / UX
* **Modern SaaS Aesthetic:** Built with a highly professional "Trust Blue" and crisp white semantic color palette to reduce eye strain and establish enterprise trust.

---

## 🛠️ Tech Stack

**Frontend (Client)**
* **React.js (Vite):** Core UI framework for fast, dynamic rendering.
* **Tailwind CSS:** Utility-first styling for the Modern SaaS aesthetic.
* **React Router DOM:** Single Page Application (SPA) routing.
* **Axios:** Promise-based HTTP client for secure API requests.
* **Deployment:** Netlify

**Backend (Server)**
* **Node.js & Express.js:** RESTful API architecture.
* **MongoDB Atlas:** Managed Cloud NoSQL database for flexible, scalable data storage.
* **Mongoose:** Object Data Modeling (ODM) for strict schema validation.
* **JWT (JSON Web Tokens):** Secure, encrypted role-based authentication.
* **Multer & FormData:** Middleware for parsing file uploads.
* **ImageKit:** Cloud storage integration for secure resume hosting.
* **Deployment:** Render

---

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
