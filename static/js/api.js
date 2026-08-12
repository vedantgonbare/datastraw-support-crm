const API_BASE = "/api/tickets";

async function apiGetTickets(status = "", search = "") {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

async function apiGetTicket(ticketId) {
  const res = await fetch(`${API_BASE}/${ticketId}`);
  if (!res.ok) throw new Error("Failed to fetch ticket");
  return res.json();
}

async function apiCreateTicket(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create ticket");
  }
  return res.json();
}

async function apiUpdateTicket(ticketId, data) {
  const res = await fetch(`${API_BASE}/${ticketId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to update ticket");
  }
  return res.json();
}