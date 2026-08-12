const tbody = document.getElementById("tickets-tbody");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const statusCounts = document.getElementById("status-counts");

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

function renderTickets(tickets) {
  tbody.innerHTML = "";

  if (tickets.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  tickets.forEach((t) => {
    const row = document.createElement("tr");
    row.className = "border-t border-gray-100 hover:bg-gray-50 cursor-pointer";
    row.onclick = () => (window.location.href = `/static/ticket.html?id=${t.ticket_id}`);

    row.innerHTML = `
      <td class="px-4 py-3 font-medium text-blue-600">${t.ticket_id}</td>
      <td class="px-4 py-3">${t.customer_name}</td>
      <td class="px-4 py-3">${t.subject}</td>
      <td class="px-4 py-3">
        <span class="text-xs px-2 py-1 rounded-full ${priorityBadgeClass(t.priority)}">${t.priority}</span>
      </td>
      <td class="px-4 py-3">
        <span class="text-xs px-2 py-1 rounded-full ${statusBadgeClass(t.status)}">${t.status}</span>
      </td>
      <td class="px-4 py-3 text-gray-500 text-sm">${new Date(t.created_at).toLocaleDateString()}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderStatusCounts(tickets) {
  const counts = { Open: 0, "In Progress": 0, Closed: 0 };
  tickets.forEach((t) => {
    if (counts[t.status] !== undefined) counts[t.status]++;
  });

  statusCounts.innerHTML = `
    <div class="bg-white rounded-lg shadow p-4 text-center">
      <div class="text-2xl font-semibold text-yellow-600">${counts.Open}</div>
      <div class="text-sm text-gray-500">Open</div>
    </div>
    <div class="bg-white rounded-lg shadow p-4 text-center">
      <div class="text-2xl font-semibold text-blue-600">${counts["In Progress"]}</div>
      <div class="text-sm text-gray-500">In Progress</div>
    </div>
    <div class="bg-white rounded-lg shadow p-4 text-center">
      <div class="text-2xl font-semibold text-green-600">${counts.Closed}</div>
      <div class="text-sm text-gray-500">Closed</div>
    </div>
  `;
}

let debounceTimer;
async function loadTickets() {
  try {
    const status = statusFilter.value;
    const search = searchInput.value.trim();
    const tickets = await apiGetTickets(status, search);
    renderTickets(tickets);

    // Dashboard always reflects ALL tickets, not the filtered view
    if (!status && !search) {
      renderStatusCounts(tickets);
    }
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-center text-red-500">Failed to load tickets.</td></tr>`;
  }
}

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadTickets, 300);
});

statusFilter.addEventListener("change", loadTickets);

loadTickets();