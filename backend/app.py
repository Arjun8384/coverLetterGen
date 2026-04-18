import os
import io
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq
import PyPDF2

load_dotenv()

app = Flask(
    __name__,
    static_folder="../frontend/static",
    template_folder="../frontend/templates"
)
CORS(app)

# Configure GROQ
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# ──────────────────────────────────────────────
# Serve frontend
# ──────────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory("../frontend/templates", "index.html")

# ──────────────────────────────────────────────
# PDF text extraction
# ──────────────────────────────────────────────
@app.route("/api/parse-pdf", methods=["POST"])
def parse_pdf():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        if not text.strip():
            return jsonify({"error": "Could not extract text from PDF. It may be scanned/image-based."}), 400

        return jsonify({"text": text.strip()[:6000]})  # Cap at 6000 chars

    except Exception as e:
        return jsonify({"error": f"PDF parsing failed: {str(e)}"}), 500


# ──────────────────────────────────────────────
# Cover letter generation
# ──────────────────────────────────────────────
@app.route("/api/generate", methods=["POST"])
def generate_cover_letter():
    data = request.get_json()

    name        = data.get("name", "").strip()
    role        = data.get("role", "").strip()
    company     = data.get("company", "").strip()
    skills      = data.get("skills", "").strip()
    job_desc    = data.get("jobDescription", "").strip()
    resume_text = data.get("resumeText", "").strip()

    if not all([name, role, company]):
        return jsonify({"error": "Name, role, and company are required."}), 400

    if not client:
        return jsonify({"error": "GROQ API key not configured."}), 500
    
    # Build contextual prompt
    resume_section = f"\n\nResume/Background:\n{resume_text}" if resume_text else ""
    skills_section = f"\n\nKey Skills: {skills}" if skills else ""
    jd_section     = f"\n\nJob Description:\n{job_desc}" if job_desc else ""

    prompt = f"""You are an expert career coach and professional writer. Write a compelling, highly personalized cover letter.

Candidate: {name}
Applying for: {role} at {company}{skills_section}{resume_section}{jd_section}

Requirements:
- 3-4 well-structured paragraphs (opening, value proposition, fit/passion, closing CTA)
- Mention specific skills and experiences from the resume/skills provided
- Reference the company name naturally
- Professional yet warm tone — avoid clichés like "I am writing to express my interest"
- End with a clear call-to-action asking for an interview
- Format as plain paragraphs with a blank line between each
- Do NOT include "[Your Address]" or date headers — start directly with "Dear Hiring Manager,"
- Total length: 250-350 words

Output ONLY the cover letter text. No preamble, no explanation."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.7,
        )
        letter = response.choices[0].message.content.strip()
        return jsonify({"letter": letter})

    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
