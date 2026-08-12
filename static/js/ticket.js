function getTicketIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function statusBadgeClass(status) {
  if (status === "Open") return "bg-yellow-100 text-yellow-800";
  if (status === "In Progress") return "bg-blue-100 text-blue-800";
  if (status === "Closed") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
}

function priorityBadgeClass(priority) {
  if (priority === "Urgent") return "bg-red-100 text-red-800";
  if (priority === "High") return "bg-orange-100 text-orange-800";
  if (priority === "Medium") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
}

function renderNotes(notes) {
  const notesList = document.getElementById("notes-list");
  const noNotes = document.getElementById("no-notes");

  if (!notes || notes.length === 0) {
    noNotes.classList.remove("hidden");
    notesList.innerHTML = "";
    return;
  }
  noNotes.classList.add("hidden");

  notesList.innerHTML = notes
    .map(
      (n) => `
      <div class="border-l-2 border-blue-200 pl-3 py-1">
        <p class="text-gray-700 text-sm">${n.note_text}</p>
        <p class="text-gray-400 text-xs mt-1">${new Date(n.created_at).toLocaleString()}</p>
      </div>
    `
    )
    .join("");
}

function renderTicket(ticket) {
  document.getElementById("ticket-id").textContent = ticket.ticket_id;
  document.getElementById("ticket-subject").textContent = ticket.subject;
  document.getElementById("customer-name").textContent = ticket.customer_name;
  document.getElementById("customer-email").textContent = ticket.customer_email;
  document.getElementById("ticket-description").textContent = ticket.description;
  document.getElementById("created-at").textContent = new Date(ticket.created_at).toLocaleString();
  document.getElementById("updated-at").textContent = new Date(ticket.updated_at).toLocaleString();

  const statusBadge = document.getElementById("status-badge");
  statusBadge.textContent = ticket.status;
  statusBadge.className = `text-xs px-3 py-1 rounded-full font-medium ${statusBadgeClass(ticket.status)}`;

  const priorityBadge = document.getElementById("priority-badge");
  priorityBadge.textContent = ticket.priority;
  priorityBadge.className = `text-xs px-3 py-1 rounded-full font-medium ${priorityBadgeClass(ticket.priority)}`;

  document.getElementById("update-status").value = ticket.status;
  document.getElementById("update-priority").value = ticket.priority;

  renderNotes(ticket.notes);
}

const ticketId = getTicketIdFromUrl();

async function loadTicket() {
  if (!ticketId) {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("not-found").classList.remove("hidden");
    return;
  }

  try {
    const ticket = await apiGetTicket(ticketId);
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("ticket-content").classList.remove("hidden");
    renderTicket(ticket);
  } catch (err) {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("not-found").classList.remove("hidden");
  }
}

document.getElementById("update-btn").addEventListener("click", async () => {
  const updateBtn = document.getElementById("update-btn");
  const errorDiv = document.getElementById("update-error");
  const successDiv = document.getElementById("update-success");
  errorDiv.classList.add("hidden");
  successDiv.classList.add("hidden");

  const status = document.getElementById("update-status").value;
  const priority = document.getElementById("update-priority").value;
  const notes = document.getElementById("new-note").value.trim();

  const payload = { status, priority };
  if (notes) payload.notes = notes;

  updateBtn.disabled = true;
  updateBtn.textContent = "Saving...";

  try {
    await apiUpdateTicket(ticketId, payload);
    document.getElementById("new-note").value = "";
    successDiv.textContent = "Ticket updated successfully.";
    successDiv.classList.remove("hidden");
    await loadTicket();
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.classList.remove("hidden");
  } finally {
    updateBtn.disabled = false;
    updateBtn.textContent = "Save Changes";
  }
});

loadTicket();