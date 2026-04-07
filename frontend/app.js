const API_BASE = "http://localhost:5001/api/notes";

const elements = {
  apiState: document.getElementById("apiState"),
  noteCount: document.getElementById("noteCount"),
  notesList: document.getElementById("notesList"),
  noteForm: document.getElementById("noteForm"),
  formTitle: document.getElementById("formTitle"),
  titleInput: document.getElementById("titleInput"),
  descriptionInput: document.getElementById("descriptionInput"),
  statusText: document.getElementById("statusText"),
  submitBtn: document.getElementById("submitBtn"),
  resetBtn: document.getElementById("resetBtn"),
  themeToggle: document.getElementById("themeToggle"),
};

let notes = [];
let editingId = null;

const THEME_KEY = "breadcrumb-theme";

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (elements.themeToggle) {
    elements.themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }
};

const initializeTheme = () => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    applyTheme(storedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
};

const setStatus = (message, isError = false) => {
  elements.statusText.textContent = message;
  elements.statusText.style.color = isError ? "var(--danger)" : "var(--muted)";
};

const setApiState = (message, isError = false) => {
  elements.apiState.textContent = message;
  elements.apiState.style.color = isError ? "var(--danger)" : "var(--accent-strong)";
};

const formatDate = (value) => {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const resetForm = () => {
  editingId = null;
  elements.noteForm.reset();
  elements.formTitle.textContent = "Create note";
  elements.submitBtn.textContent = "Save note";
  elements.resetBtn.classList.add("hidden");
  setStatus("Ready to write.");
};

const renderNotes = () => {
  elements.noteCount.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;

  if (!notes.length) {
    elements.notesList.innerHTML = `
      <div class="empty-state">
        <strong>No notes yet.</strong>
        <p>Write your first note on the left and it will appear here.</p>
      </div>
    `;
    return;
  }

  elements.notesList.innerHTML = notes
    .map(
      (note) => `
        <article class="note-card" data-id="${note._id}">
          <header>
            <div>
              <h3>${escapeHtml(note.title)}</h3>
              <time>${formatDate(note.createdAt)}</time>
            </div>
          </header>
          <p>${escapeHtml(note.description)}</p>
          <div class="note-actions">
            <button type="button" class="note-action" data-action="edit">Edit</button>
            <button type="button" class="note-action danger" data-action="delete">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const loadNotes = async () => {
  try {
    setApiState("connecting...");
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);

    notes = await response.json();
    renderNotes();
    setApiState("online");
  } catch (error) {
    setApiState("offline", true);
    setStatus(`Could not load notes: ${error.message}`, true);
    elements.notesList.innerHTML = `
      <div class="empty-state">
        <strong>Backend unavailable.</strong>
        <p>Make sure the API is running on port 5001.</p>
      </div>
    `;
  }
};

const saveNote = async (event) => {
  event.preventDefault();

  const payload = {
    title: elements.titleInput.value.trim(),
    description: elements.descriptionInput.value.trim(),
  };

  if (!payload.title || !payload.description) {
    setStatus("Title and description are required.", true);
    return;
  }

  try {
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? `${API_BASE}/${editingId}` : API_BASE;

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Request failed with ${response.status}`);
    }

    setStatus(editingId ? "Note updated." : "Note saved.");
    resetForm();
    await loadNotes();
  } catch (error) {
    setStatus(error.message, true);
  }
};

const handleCardAction = async (event) => {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;

  const card = event.target.closest("article[data-id]");
  if (!card) return;

  const noteId = card.dataset.id;
  const note = notes.find((item) => item._id === noteId);
  if (!note) return;

  if (actionButton.dataset.action === "edit") {
    editingId = noteId;
    elements.titleInput.value = note.title;
    elements.descriptionInput.value = note.description;
    elements.formTitle.textContent = "Edit note";
    elements.submitBtn.textContent = "Update note";
    elements.resetBtn.classList.remove("hidden");
    setStatus("Editing mode enabled.");
  }

  if (actionButton.dataset.action === "delete") {
    const confirmed = window.confirm(`Delete "${note.title}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/${noteId}`, { method: "DELETE" });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `Request failed with ${response.status}`);
      }

      setStatus("Note deleted.");
      if (editingId === noteId) {
        resetForm();
      }
      await loadNotes();
    } catch (error) {
      setStatus(error.message, true);
    }
  }
};

elements.noteForm.addEventListener("submit", saveNote);
elements.resetBtn.addEventListener("click", resetForm);
elements.notesList.addEventListener("click", handleCardAction);
elements.themeToggle?.addEventListener("click", toggleTheme);

initializeTheme();
loadNotes();
