const eventsEl = document.getElementById("events");
const participantsEl = document.getElementById("participants");
const refreshEventsBtn = document.getElementById("refresh-events");
const refreshParticipantsBtn = document.getElementById("refresh-participants");
const eventForm = document.getElementById("event-form");
const participantForm = document.getElementById("participant-form");
const eventMessage = document.getElementById("event-message");
const participantMessage = document.getElementById("participant-message");
const authForm = document.getElementById("auth-form");
const authMessage = document.getElementById("auth-message");
const toggleButtons = document.querySelectorAll(".toggle-btn");
const sessionStatus = document.getElementById("session-status");
const tokenPreview = document.getElementById("token-preview");
const logoutBtn = document.getElementById("logout");
const eventSelect = document.getElementById("event-select");

const AUTH_STORAGE_KEY = "socialInitiativesAuth";
let authMode = "login";
let currentAuth = loadAuth();

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toISOFromDateTimeLocal(value) {
  const date = new Date(value);
  return date.toISOString();
}

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function saveAuth(auth) {
  if (auth) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  currentAuth = auth;
  renderSession();
  updateAdminForms();
}

function renderSession() {
  if (!currentAuth) {
    sessionStatus.textContent = "Not signed in";
    tokenPreview.textContent = "—";
    return;
  }

  sessionStatus.textContent = `Signed in as ${currentAuth.user.email} (${currentAuth.user.role})`;
  tokenPreview.textContent = currentAuth.token;
}

function setMessage(el, text) {
  el.textContent = text || "";
}

function apiHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (currentAuth?.token) {
    headers.Authorization = `Bearer ${currentAuth.token}`;
  }
  return headers;
}

function renderEvents(events) {
  if (!Array.isArray(events) || events.length === 0) {
    eventsEl.innerHTML = "<p class=\"muted\">No events yet.</p>";
    return;
  }

  eventsEl.innerHTML = events
    .map((event) => {
      const tags = Array.isArray(event.tags) ? event.tags.join(", ") : "";
      return `
        <article class="item">
          <div class="item-title">${escapeHtml(event.title)}</div>
          <div class="item-meta">
            <span><strong>Date:</strong> ${escapeHtml(new Date(event.date).toLocaleString())}</span>
            <span><strong>Location:</strong> ${escapeHtml(event.location)}</span>
            <span><strong>Organizer:</strong> ${escapeHtml(event.organizer)}</span>
            <span><strong>Status:</strong> ${escapeHtml(event.status)}</span>
          </div>
          ${event.description ? `<p>${escapeHtml(event.description)}</p>` : ""}
          ${tags ? `<p class=\"muted\">Tags: ${escapeHtml(tags)}</p>` : ""}
          <p class="muted">ID: ${escapeHtml(event._id)}</p>
        </article>
      `;
    })
    .join("");
}

function renderParticipants(participants) {
  if (!Array.isArray(participants) || participants.length === 0) {
    participantsEl.innerHTML = "<p class=\"muted\">No participants yet.</p>";
    return;
  }

  participantsEl.innerHTML = participants
    .map((participant) => {
      const event = participant.event || {};
      return `
        <article class="item">
          <div class="item-title">${escapeHtml(participant.name)}</div>
          <div class="item-meta">
            <span><strong>Email:</strong> ${escapeHtml(participant.email)}</span>
            <span><strong>Status:</strong> ${escapeHtml(participant.status)}</span>
            <span><strong>Event:</strong> ${escapeHtml(event.title || "Unknown")}</span>
            <span><strong>Date:</strong> ${event.date ? escapeHtml(new Date(event.date).toLocaleDateString()) : "—"}</span>
          </div>
          <p class="muted">ID: ${escapeHtml(participant._id)}</p>
        </article>
      `;
    })
    .join("");
}

function updateEventOptions(events) {
  const options = events
    .map((event) => `<option value="${escapeHtml(event._id)}">${escapeHtml(event.title)}</option>`)
    .join("");
  eventSelect.innerHTML = `<option value="">Select event</option>${options}`;
}

async function loadEvents() {
  const res = await fetch("/api/events");
  const data = await res.json();
  renderEvents(data);
  if (Array.isArray(data)) {
    updateEventOptions(data);
  }
}

async function loadParticipants() {
  const res = await fetch("/api/participants");
  const data = await res.json();
  renderParticipants(data);
}

function updateAdminForms() {
  const isAdmin = currentAuth?.user?.role === "admin";
  eventForm.querySelector("button").disabled = !isAdmin;
  participantForm.querySelector("button").disabled = !isAdmin;

  if (!isAdmin) {
    setMessage(eventMessage, "Admin access required for create/update actions.");
    setMessage(participantMessage, "Admin access required for create/update actions.");
  } else {
    setMessage(eventMessage, "");
    setMessage(participantMessage, "");
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  setMessage(authMessage, "");

  const fd = new FormData(authForm);
  const payload = {
    email: fd.get("email"),
    password: fd.get("password")
  };

  const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    setMessage(authMessage, data.message || "Authentication failed");
    return;
  }

  saveAuth({ token: data.token, user: data.user });
  setMessage(authMessage, authMode === "register" ? "Registered successfully." : "Logged in successfully.");
}

async function handleEventSubmit(event) {
  event.preventDefault();
  setMessage(eventMessage, "");

  if (currentAuth?.user?.role !== "admin") {
    setMessage(eventMessage, "Admin access required.");
    return;
  }

  const fd = new FormData(eventForm);
  const payload = {
    title: fd.get("title"),
    description: fd.get("description"),
    date: toISOFromDateTimeLocal(fd.get("date")),
    location: fd.get("location"),
    organizer: fd.get("organizer"),
    type: fd.get("type"),
    capacity: Number(fd.get("capacity")),
    status: fd.get("status"),
    tags: String(fd.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  };

  const res = await fetch("/api/events", {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    setMessage(eventMessage, data.message || "Request failed");
    return;
  }

  eventForm.reset();
  setMessage(eventMessage, "Event created.");
  await loadEvents();
}

async function handleParticipantSubmit(event) {
  event.preventDefault();
  setMessage(participantMessage, "");

  if (currentAuth?.user?.role !== "admin") {
    setMessage(participantMessage, "Admin access required.");
    return;
  }

  const fd = new FormData(participantForm);
  const payload = {
    event: fd.get("event"),
    name: fd.get("name"),
    email: fd.get("email"),
    status: fd.get("status")
  };

  const res = await fetch("/api/participants", {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    setMessage(participantMessage, data.message || "Request failed");
    return;
  }

  participantForm.reset();
  setMessage(participantMessage, "Participant added.");
  await loadParticipants();
}

function handleModeToggle(event) {
  const mode = event.target.dataset.mode;
  if (!mode || mode === authMode) return;

  authMode = mode;
  toggleButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  setMessage(authMessage, "");
}

function handleLogout() {
  saveAuth(null);
  setMessage(authMessage, "Logged out.");
}

authForm.addEventListener("submit", handleAuthSubmit);
logoutBtn.addEventListener("click", handleLogout);
toggleButtons.forEach((btn) => btn.addEventListener("click", handleModeToggle));

eventForm.addEventListener("submit", handleEventSubmit);
participantForm.addEventListener("submit", handleParticipantSubmit);
refreshEventsBtn.addEventListener("click", loadEvents);
refreshParticipantsBtn.addEventListener("click", loadParticipants);

renderSession();
updateAdminForms();
loadEvents();
loadParticipants();
