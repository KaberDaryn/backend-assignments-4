const eventsEl = document.getElementById("events");
const refreshBtn = document.getElementById("refresh");
const form = document.getElementById("event-form");
const msg = document.getElementById("form-message");

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toISOFromDateTimeLocal(value) {
  // `datetime-local` -> local time. Convert to an ISO string.
  const date = new Date(value);
  return date.toISOString();
}

function renderEvents(events) {
  if (!Array.isArray(events) || events.length === 0) {
    eventsEl.innerHTML = "<p class=\"muted\">No events yet.</p>";
    return;
  }

  eventsEl.innerHTML = events
    .map((e) => {
      const tags = Array.isArray(e.tags) ? e.tags.join(", ") : "";
      return `
        <article class="item">
          <div class="item-title">${escapeHtml(e.title)}</div>
          <div class="item-meta">
            <span><strong>Date:</strong> ${escapeHtml(new Date(e.date).toLocaleString())}</span>
            <span><strong>Location:</strong> ${escapeHtml(e.location)}</span>
            <span><strong>Organizer:</strong> ${escapeHtml(e.organizer)}</span>
            <span><strong>Status:</strong> ${escapeHtml(e.status)}</span>
          </div>
          ${e.description ? `<p>${escapeHtml(e.description)}</p>` : ""}
          ${tags ? `<p class=\"muted\">Tags: ${escapeHtml(tags)}</p>` : ""}
          <p class="muted">ID: ${escapeHtml(e._id)}</p>
        </article>
      `;
    })
    .join("");
}

async function loadEvents() {
  const res = await fetch("/api/events");
  const data = await res.json();
  renderEvents(data);
}

function setMessage(text) {
  msg.textContent = text || "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMessage("");

  const fd = new FormData(form);
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
      .map((t) => t.trim())
      .filter(Boolean)
  };

  const tokenRaw = String(fd.get("token") || "").trim();
  const token = tokenRaw.startsWith("Bearer ") ? tokenRaw.slice("Bearer ".length).trim() : tokenRaw;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;


  const res = await fetch("/api/events", {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    setMessage(data.message || "Request failed");
    return;
  }

  const keepToken = tokenRaw;
  form.reset();
  if (keepToken) form.querySelector('input[name="token"]').value = keepToken;
  setMessage("Created");
  await loadEvents();
});

refreshBtn.addEventListener("click", loadEvents);

loadEvents();
