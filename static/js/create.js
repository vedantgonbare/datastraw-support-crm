const form = document.getElementById("create-form");
const errorDiv = document.getElementById("form-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorDiv.classList.add("hidden");

  const data = {
    customer_name: document.getElementById("customer_name").value.trim(),
    customer_email: document.getElementById("customer_email").value.trim(),
    subject: document.getElementById("subject").value.trim(),
    description: document.getElementById("description").value.trim(),
    priority: document.getElementById("priority").value,
  };

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";

  try {
    const result = await apiCreateTicket(data);
    window.location.href = `/ticket.html?id=${result.ticket_id}`;
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.classList.remove("hidden");
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Ticket";
  }
});