# ZoomClone — Video Conferencing Platform

A Zoom-style video conferencing web application built for an SDE Fullstack Assignment.

The application supports instant meetings, joining meetings by ID/link, scheduled meetings, participant management, meeting controls, and a Zoom-inspired user interface.

---

## 1. Tech Stack

### Frontend
- Next.js 14
- Pages Router
- React
- Plain CSS
- Browser MediaDevices API (`getUserMedia`) for the self-camera preview

### Backend
- FastAPI
- Python
- Pydantic
- Uvicorn
- Python's built-in `sqlite3` module
- No ORM

### Database
- SQLite

### Deployment
- Frontend: Vercel
- Backend: Render or Railway

---

## 2. Project Structure

```text
zoom-clone/
├── backend/
│   ├── main.py              # FastAPI application and API routes
│   ├── models.py            # Data helpers and meeting ID generation
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── database.py          # SQLite connection and database schema
│   ├── seed.py              # Sample meeting/participant data
│   └── requirements.txt
│
└── frontend/
    ├── pages/
    │   ├── index.js         # Dashboard
    │   ├── join.js          # Join Meeting
    │   ├── schedule.js      # Schedule Meeting
    │   ├── meetings.js      # Upcoming/Recent Meetings
    │   ├── login.js         # Optional login
    │   ├── signup.js        # Optional signup
    │   ├── _document.js     # Document configuration
    │   └── meeting/
    │       └── [id].js      # Meeting room
    │
    ├── components/
    │   ├── Navbar.js
    │   ├── MeetingRow.js
    │   └── icons.js
    │
    ├── lib/
    │   └── api.js           # Frontend API client
    │
    └── styles/
        └── globals.css      # Application styling
```

---

## 3. Database Schema

### `meetings`

The meetings table contains:

- `id` — Zoom-style meeting ID such as `123-456-789`
- `title`
- `description`
- `host_name`
- `type` — `instant` or `scheduled`
- `status` — `live`, `upcoming`, or `completed`
- `scheduled_at`
- `duration_minutes`
- `invite_link`
- `created_at`

### `participants`

The participants table contains:

- `id`
- `meeting_id`
- `name`
- `joined_at`

A meeting can have multiple participants.

---

# 4. Setup Instructions

## Step 1 — Clone the Repository

After the repository has been uploaded to GitHub, clone it using:

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

Replace the URL with your actual GitHub repository URL.

---

# 5. Backend Setup

Open a terminal in the project folder.

### Step 1 — Go to the backend

```bash
cd backend
```

### Step 2 — Create a virtual environment

#### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

#### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3 — Install dependencies

```bash
pip install -r requirements.txt
```

### Step 4 — Seed the database

Run:

```bash
python seed.py
```

This creates/seeds the SQLite database with sample meetings and participants.

### Step 5 — Start the FastAPI server

```bash
uvicorn main:app --reload --port 8000
```

The backend will run at:

```text
http://localhost:8000
```

FastAPI's interactive API documentation is available at:

```text
http://localhost:8000/docs
```

Keep this terminal running.

---

# 6. Frontend Setup

Open a **new terminal** while keeping the backend running.

### Step 1 — Go to the frontend

From the project root:

```bash
cd frontend
```

### Step 2 — Install Node dependencies

```bash
npm install
```

### Step 3 — Start the Next.js development server

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

Open that address in your browser.

---

# 7. Connecting Frontend and Backend

By default, the frontend API client uses:

```text
http://localhost:8000
```

If your backend is running on another URL, create a `.env.local` file inside the `frontend` directory:

```text
NEXT_PUBLIC_API_URL=https://your-backend-url
```

For local development, this is normally not required.

After changing `.env.local`, restart the Next.js server.

---

# 8. How to Use the Application

## Dashboard

The dashboard provides:

- Current date and time
- New Meeting
- Join Meeting
- Schedule Meeting
- Upcoming meetings
- Recent meetings
- Meeting navigation
- Sidebar navigation

---

## Start an Instant Meeting

1. Open the dashboard.
2. Click **New Meeting**.
3. The application creates a meeting through the FastAPI backend.
4. You are redirected to the meeting room.
5. The meeting receives a Zoom-style ID.
6. The meeting link can be shared with other users.

---

## Join a Meeting

1. Open the **Join** page.
2. Enter the meeting ID or meeting link.
3. Enter your display name if required.
4. Join the meeting.
5. The participant is registered in the backend database.

---

## Schedule a Meeting

1. Open **Scheduler** or **Schedule**.
2. Enter the meeting title.
3. Optionally enter a description.
4. Select the date.
5. Select the time.
6. Select the duration.
7. Click **Schedule Meeting**.
8. The meeting appears in the upcoming meetings list.

---

## Meeting Room

The meeting room includes Zoom-style controls such as:

- Microphone mute/unmute
- Camera on/off
- Participants panel
- Participant management for the host
- Chat panel
- Screen sharing
- Meeting link copying
- Leave meeting
- Meeting information

The self-camera preview uses the browser's camera permission through `getUserMedia`.

When the browser asks for camera/microphone permission, select **Allow** if you want to use the camera and microphone.

---

# 9. Meeting Links

Meeting IDs are generated in the format:

```text
XXX-XXX-XXX
```

Example:

```text
123-456-789
```

The invite link follows this structure:

```text
http://localhost:3000/meeting/123-456-789
```

When deployed, the link uses the deployed frontend URL instead.

---

# 10. GitHub Upload Instructions

## Step 1 — Create a GitHub Repository

1. Go to GitHub.
2. Click **New repository**.
3. Enter a repository name such as:

```text
zoom-clone
```

4. Set the repository visibility to **Public**.
5. Create the repository.

## Step 2 — Open the project folder in a terminal

```bash
cd zoom-clone
```

## Step 3 — Initialize Git

If Git has not already been initialized:

```bash
git init
```

## Step 4 — Add the files

```bash
git add .
```

## Step 5 — Create the first commit

```bash
git commit -m "Initial ZoomClone project"
```

## Step 6 — Connect the GitHub repository

Replace the URL below with your own repository URL:

```bash
git remote add origin https://github.com/YOUR-USERNAME/zoom-clone.git
```

## Step 7 — Push the project

```bash
git branch -M main
git push -u origin main
```

Your repository should now be available publicly on GitHub.

---

# 11. Deploy the Backend

The backend can be deployed on Render or Railway.

## Render

1. Create an account on Render.
2. Create a new **Web Service**.
3. Connect your public GitHub repository.
4. Select the repository.
5. Set the root directory to:

```text
backend
```

6. Install command:

```bash
pip install -r requirements.txt
```

7. Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

8. Deploy the service.
9. Copy the backend URL after deployment.

It should look similar to:

```text
https://your-backend.onrender.com
```

10. Open:

```text
https://your-backend.onrender.com/docs
```

to verify that the FastAPI application is running.

### Database note

Run the seed command once after deployment if sample data is required:

```bash
python seed.py
```

---

# 12. Deploy the Frontend

The frontend can be deployed using Vercel.

## Step 1 — Open Vercel

1. Create/sign in to a Vercel account.
2. Import the GitHub repository.
3. Select the project.

## Step 2 — Configure the project

Set the root directory to:

```text
frontend
```

Vercel should automatically detect Next.js.

## Step 3 — Add the backend environment variable

In Vercel project settings, add:

```text
NEXT_PUBLIC_API_URL
```

Set its value to the deployed backend URL:

```text
https://your-backend.onrender.com
```

Do not add a trailing slash unless your API client specifically requires one.

## Step 4 — Deploy

Click **Deploy**.

After deployment, Vercel will provide a URL similar to:

```text
https://your-zoomclone.vercel.app
```

---

# 13. Final Deployment Checklist

Before submitting the assignment, verify:

- [ ] GitHub repository is public
- [ ] Frontend is deployed
- [ ] Backend is deployed
- [ ] Frontend has the correct `NEXT_PUBLIC_API_URL`
- [ ] Dashboard loads successfully
- [ ] New Meeting works
- [ ] Join Meeting works
- [ ] Schedule Meeting works
- [ ] Meeting links work
- [ ] Participants appear in the meeting room
- [ ] Camera permission works
- [ ] Microphone mute/unmute works
- [ ] Camera on/off works
- [ ] Participant controls work
- [ ] Chat UI works
- [ ] Screen sharing works where supported by the browser
- [ ] Leave Meeting works
- [ ] Upcoming and Recent meetings display correctly

---

# 14. Assumptions and Scope

### No forced login

The application assumes a default user named **Saloni** for the core functionality. There is no mandatory login wall preventing access to the main features.

Login and signup pages are included as optional functionality.

### Video/WebRTC scope

The application provides a real self-camera preview using the browser's `getUserMedia` API.

The assignment does not require a complete peer-to-peer WebRTC/signaling/TURN infrastructure, so the application does not implement full production-grade peer video streaming.

The participants list is backed by the SQLite database and records real meeting joins.

### Participant mute state

Participant mute controls are implemented at the application/UI level. They do not remotely mute a participant's physical microphone because there is no full WebRTC audio/signaling system.

### Meeting status

A scheduled meeting can become `live` when someone joins it and can become `completed` when the host ends/leaves the meeting. These states are used to populate upcoming and recent meeting sections.

### Browser permissions

Camera and microphone features depend on browser permissions and supported browser APIs.

Screen sharing depends on browser support for `navigator.mediaDevices.getDisplayMedia()` and may require HTTPS in deployed environments.

### SQLite deployment

SQLite is used as required by the assignment. For a production-scale conferencing application, a server database such as PostgreSQL would generally be more appropriate.

---

# 15. Assignment Submission

Submit both of the following:

### GitHub Repository

```text
https://github.com/YOUR-USERNAME/zoom-clone
```

The repository must be **public**.

### Deployed Application

```text
https://your-frontend.vercel.app
```

Replace both example URLs with the actual URLs after deployment.

---

## Author

**Saloni**

ZoomClone — SDE Fullstack Assignment
