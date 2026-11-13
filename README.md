# Doctor Tracker Client

Healthcare administrator portal for managing doctors and patients, built with Next.js, React, Redux Toolkit, and Tailwind CSS.

---

## Getting Started Locally

Follow these steps to clone, install dependencies, and run the project locally.

### 1. Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 18.17 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Git](https://git-scm.com/)

---

### 2. Clone the Repository

```bash
git clone https://github.com/ImamHossain-eng/doctor-tracker-client.git
cd doctor-tracker-client
```

---

### 3. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

---

### 4. Environment Variables Setup

Create a `.env.local` file in the root directory by copying the example environment file:

```bash
# On Linux / macOS / Git Bash
cp .env.example .env.local

# On Windows (PowerShell)
Copy-Item .env.example .env.local
```

Ensure the API URL matches your backend server URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 5. Run the Application

Start the local development server:

```bash
npm run dev
```

Once started, open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Builds the application for production |
| `npm run start` | Runs the compiled production build |
| `npm run lint` | Runs Next.js ESLint checks |
