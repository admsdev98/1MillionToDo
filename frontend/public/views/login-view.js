import { el } from "./ui.js";

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

export function renderLoginView(root, { onLoggedIn, setBanner }) {
  root.innerHTML = "";
  const container = el("div", { class: "content fade-in" });

  const title = el("h1", { class: "title", text: "Welcome" });
  const subtitle = el("div", { class: "muted", text: "Register or log in to manage your tasks." });

  const modeToggleRow = el("div", { class: "row" });
  const loginBtn = el("button", { class: "btn primary", type: "button", text: "Login" });
  const registerBtn = el("button", { class: "btn", type: "button", text: "Register" });
  modeToggleRow.append(loginBtn, registerBtn);

  let mode = "login";
  function setMode(nextMode) {
    mode = nextMode;
    loginBtn.className = mode === "login" ? "btn primary" : "btn";
    registerBtn.className = mode === "register" ? "btn primary" : "btn";
    setBanner(null, null);
  }
  setMode("login");

  const form = el("form", { class: "grid" });
  const left = el("div", { class: "field" });
  const right = el("div", { class: "field" });

  const emailLabel = el("label", { for: "email", text: "Email" });
  const emailInput = el("input", { id: "email", name: "email", type: "email", autocomplete: "email", required: "true" });
  left.append(emailLabel, emailInput);

  const passwordLabel = el("label", { for: "password", text: "Password (min 8 chars)" });
  const passwordInput = el("input", { id: "password", name: "password", type: "password", autocomplete: mode === "register" ? "new-password" : "current-password", required: "true" });
  right.append(passwordLabel, passwordInput);

  const actions = el("div", { class: "row" });
  const submit = el("button", { class: "btn primary", type: "submit", text: "Continue" });
  const hint = el("div", { class: "muted", text: "" });
  actions.append(submit, hint);

  form.append(left, right, actions);

  async function handleSubmit(event) {
    event.preventDefault();
    setBanner(null, null);
    submit.disabled = true;

    const email = normalizeEmail(emailInput.value);
    const password = passwordInput.value;

    if (password.length < 8) {
      setBanner("error", "Password must be at least 8 characters.");
      submit.disabled = false;
      return;
    }

    const path = mode === "register" ? "/v1/auth/register" : "/v1/auth/login";
    const response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const bodyText = await response.text();
    const body = bodyText ? JSON.parse(bodyText) : null;

    if (!response.ok) {
      const message = body && body.error && body.error.message ? body.error.message : "Login failed";
      setBanner("error", message);
      submit.disabled = false;
      return;
    }

    const token = body && body.token;
    if (!token) {
      setBanner("error", "Missing token in response");
      submit.disabled = false;
      return;
    }

    localStorage.setItem("todo.jwt", token);
    await onLoggedIn();
  }

  form.addEventListener("submit", handleSubmit);
  loginBtn.addEventListener("click", () => setMode("login"));
  registerBtn.addEventListener("click", () => setMode("register"));

  container.append(title, subtitle, modeToggleRow, form);
  root.appendChild(container);
}
