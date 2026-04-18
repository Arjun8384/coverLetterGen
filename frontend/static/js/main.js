/* ─────────────────────────────────────────────
   LetterForge — Frontend Logic
   Handles: PDF upload, form validation, API calls
───────────────────────────────────────────── */

const API_BASE = "";   // empty = same origin (Flask serves both)

let resumeText = "";

// ── PDF UPLOAD ──────────────────────────────
const uploadZone = document.getElementById("uploadZone");
const resumeFile = document.getElementById("resumeFile");
const uploadText = document.getElementById("uploadText");
const resumeStatus = document.getElementById("resumeStatus");

// Drag & drop
uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.classList.add("drag-over");
});
uploadZone.addEventListener("dragleave", () => {
  uploadZone.classList.remove("drag-over");
});
uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

resumeFile.addEventListener("change", () => {
  if (resumeFile.files[0]) handleFile(resumeFile.files[0]);
});

async function handleFile(file) {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    setResumeStatus("Only PDF files are supported.", "err");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    setResumeStatus("File too large (max 10MB).", "err");
    return;
  }

  uploadText.textContent = file.name;
  setResumeStatus("Parsing PDF…", "loading");

  const formData = new FormData();
  formData.append("resume", file);

  try {
    const res = await fetch(`${API_BASE}/api/parse-pdf`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setResumeStatus(`⚠ ${data.error}`, "err");
      resumeText = "";
    } else {
      resumeText = data.text;
      setResumeStatus(
        `✓ Parsed ${resumeText.length.toLocaleString()} characters from resume`,
        "ok"
      );
    }
  } catch {
    setResumeStatus("Network error while parsing PDF.", "err");
    resumeText = "";
  }
}

function setResumeStatus(msg, type) {
  resumeStatus.textContent = msg;
  resumeStatus.className = `resume-status ${type}`;
}

// ── COVER LETTER GENERATION ─────────────────
async function generate() {
  const name    = document.getElementById("name").value.trim();
  const role    = document.getElementById("role").value.trim();
  const company = document.getElementById("company").value.trim();
  const skills  = document.getElementById("skills").value.trim();
  const jobDesc = document.getElementById("jobDesc").value.trim();

  const errorBox = document.getElementById("errorBox");
  errorBox.style.display = "none";

  if (!name || !role || !company) {
    showError("Please fill in Name, Job Role, and Company Name.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, company, skills, jobDescription: jobDesc, resumeText }),
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      showError(data.error || "Something went wrong. Please try again.");
    } else {
      showOutput(data.letter);
    }
  } catch {
    showError("Network error. Is the Flask server running?");
  } finally {
    setLoading(false);
  }
}

function setLoading(on) {
  const btn   = document.getElementById("generateBtn");
  const label = btn.querySelector(".btn-label");
  const load  = btn.querySelector(".btn-loading");
  btn.disabled = on;
  label.style.display = on ? "none" : "inline";
  load.style.display  = on ? "inline" : "none";
}

function showError(msg) {
  const box = document.getElementById("errorBox");
  box.textContent = msg;
  box.style.display = "block";
}

function showOutput(text) {
  document.getElementById("outputPlaceholder").style.display = "none";
  const out = document.getElementById("outputText");
  out.style.display = "block";
  out.textContent = text;
  document.getElementById("outputActions").style.display = "flex";
  out.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── COPY & DOWNLOAD ─────────────────────────
function copyLetter() {
  const text = document.getElementById("outputText").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById("copyToast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  });
}

function downloadLetter() {
  const text     = document.getElementById("outputText").textContent;
  const company  = document.getElementById("company").value.trim() || "company";
  const filename = `cover-letter-${company.toLowerCase().replace(/\s+/g, "-")}.txt`;
  const blob     = new Blob([text], { type: "text/plain" });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── ENTER KEY SUBMIT ─────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate();
});
