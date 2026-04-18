# ◆ LetterForge — AI Cover Letter Generator (Level 3)

> Mission 4 Submission · Python/Flask · Google Gemini AI · PDF Parsing · Secure .env

---

## ✦ Features

| Feature | Detail |
|---|---|
| **AI Generation** | Google Gemini 1.5 Flash — 250–350 word, structured cover letters |
| **PDF Parsing** | Upload your resume PDF → text extracted → fed to AI for personalization |
| **Secure API Key** | `.env` file only, never committed to Git |
| **Loading State** | Animated spinner during AI generation |
| **Copy + Download** | One-click copy to clipboard, download as `.txt` |
| **Drag & Drop** | Drag your PDF onto the upload zone |
| **Fully Responsive** | Works on mobile, tablet, desktop |

---

## ◆ Project Structure

```
ai-cover-letter/
├── backend/
│   ├── app.py              ← Flask app (API routes)
│   └── requirements.txt    ← Python dependencies
├── frontend/
│   ├── templates/
│   │   └── index.html      ← Main HTML page
│   └── static/
│       ├── css/style.css   ← All styling
│       └── js/main.js      ← Frontend logic
├── .env.example            ← Template (copy to .env)
├── .gitignore              ← Keeps .env out of Git
├── Procfile                ← For deployment
└── README.md
```

---

## ◆ Quick Start (Local)

### 1. Clone / Extract the project

```bash
cd ai-cover-letter
```

### 2. Create a virtual environment

```bash
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Set up your API Key (CRUCIAL)

```bash
# Copy the template
cp .env.example .env

# Open .env and add your real Gemini key
# Get a free key at: https://aistudio.google.com/app/apikey
```

Your `.env` file should look like:
```
GEMINI_API_KEY=AIzaSy...your_real_key_here
```

> ⚠️ **NEVER commit `.env` to GitHub.** It is already listed in `.gitignore`.

### 5. Run the Flask server

```bash
python backend/app.py
```

Open your browser at: **http://localhost:5000**

---

## ◆ Deployment (Render — Free Tier)

1. Push to GitHub (make sure `.env` is NOT committed)
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo
4. Set:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --chdir backend app:app`
5. Add Environment Variable: `GEMINI_API_KEY` = your key
6. Deploy!

### Alternative: Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add `GEMINI_API_KEY` in Variables tab
4. Railway auto-detects the Procfile

---

## ◆ API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the frontend |
| `POST` | `/api/parse-pdf` | Accepts PDF file, returns extracted text |
| `POST` | `/api/generate` | Accepts form data + resume text, returns cover letter |

---

## ◆ Security Notes

- API key stored in `.env`, loaded via `python-dotenv`
- `.env` listed in `.gitignore` — never tracked by Git
- PDF text is capped at 6,000 characters before sending to AI
- No user data is stored on the server

---

## ◆ Tech Stack

- **Backend**: Python 3.11+, Flask, Flask-CORS
- **AI**: Google Gemini 1.5 Flash (via `google-generativeai`)
- **PDF**: PyPDF2
- **Frontend**: Vanilla HTML/CSS/JS (no framework needed)
- **Fonts**: Playfair Display + DM Sans
- **Deployment**: Gunicorn + Render/Railway/Heroku

---

*Built for Mission 4 — AI Integration, API Keys, and Prompt Engineering*
