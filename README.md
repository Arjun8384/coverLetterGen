Project live link: https://coverlettergen-8j66.onrender.com
---

```markdown
# LetterForge — AI Cover Letter Generator

A full-stack web application that generates personalized, professional cover letters using AI. Upload your resume, paste a job description, and get a tailored cover letter in seconds.

---

## Features

- **Resume Parsing** — Upload your PDF resume and the app extracts your experience to personalize the output
- **AI-Powered Writing** — Connects to Groq's LLaMA 3.3 70B model to generate structured, professional letters
- **Job Description Matching** — Paste the JD and the AI aligns your skills to what the employer is looking for
- **Copy & Download** — One-click copy to clipboard or download as a `.txt` file
- **Drag & Drop Upload** — Drop your PDF directly onto the upload zone
- **Fully Responsive** — Works on mobile, tablet, and desktop
- **Secure by Design** — API keys stored in `.env`, never exposed in source code

---

## Tech Stack

**Backend**
- Python 3.11
- Flask — web framework and API routing
- Groq SDK — LLaMA 3.3 70B for letter generation
- PyPDF2 — PDF text extraction
- python-dotenv — environment variable management
- Gunicorn — production WSGI server

**Frontend**
- Vanilla HTML, CSS, JavaScript — no framework dependency
- Google Fonts (Playfair Display + DM Sans)
- Fetch API for backend communication

**Deployment**
- Render (backend + static serving)
- GitHub (version control + auto-deploy trigger)

---

## Project Structure

```
ai-cover-letter/
├── backend/
│   ├── app.py               # Flask app — API routes and AI logic
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── templates/
│   │   └── index.html       # Main page
│   └── static/
│       ├── css/style.css    # Styling
│       └── js/main.js       # Frontend logic
├── .env.example             # Environment variable template
├── .gitignore
├── Procfile                 # Render/Heroku deploy config
└── README.md
```

---

## Local Setup

### Prerequisites
- Python 3.9 or higher
- pip
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ai-cover-letter.git
cd ai-cover-letter
```

**2. Create a virtual environment**
```bash
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

**3. Install dependencies**
```bash
pip install -r backend/requirements.txt
```

**4. Configure environment variables**
```bash
cp .env.example .env
```
Open `.env` and add your Groq API key:
```
GROQ_API_KEY=gsk_your_key_here
```

**5. Start the server**
```bash
python backend/app.py
```

Visit `http://localhost:5000`

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com | Yes |

> ⚠️ Never commit your `.env` file. It is already excluded in `.gitignore`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the frontend |
| `POST` | `/api/parse-pdf` | Accepts PDF, returns extracted text |
| `POST` | `/api/generate` | Accepts form data, returns cover letter |

### POST `/api/generate`

Request body:
```json
{
  "name": "Priya Sharma",
  "role": "Backend Developer",
  "company": "Infocera",
  "skills": "Python, Flask, PostgreSQL",
  "jobDescription": "...",
  "resumeText": "..."
}
```

Response:
```json
{
  "letter": "Dear Hiring Manager at Infocera,\n\n..."
}
```

---

## Deployment on Render

1. Push your code to GitHub (confirm `.env` is not in the repo)
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---|---|
| Language | Python |
| Build Command | `pip install -r ai-cover-letter/backend/requirements.txt` |
| Start Command | `gunicorn --chdir ai-cover-letter/backend app:app --bind 0.0.0.0:$PORT` |

5. Add environment variable: `GROQ_API_KEY` → your key
6. Deploy

Every subsequent push to `main` triggers an automatic redeploy.

---

## Security Notes

- API key is loaded via `python-dotenv` from a local `.env` file
- `.env` is listed in `.gitignore` and never tracked by Git
- PDF content is capped at 6,000 characters before being sent to the AI
- No user data is stored on the server

---

## License

MIT License — free to use, modify, and distribute.
```
