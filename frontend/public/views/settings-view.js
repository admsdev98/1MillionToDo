import { el, setBanner } from "./ui.js";

function shouldOpenForbidden(response) {
  return response.status === 401 || response.status === 403;
}

function shouldOpenUnexpected(response) {
  return response.status >= 500 || response.status === 0;
}

function formatRequestLogLine(log) {
  const date = new Date(log.timestamp);
  const timestamp = Number.isNaN(date.getTime()) ? log.timestamp : date.toLocaleString();
  return `${timestamp} - ${log.method} ${log.url} - ${log.statusCode} (${log.executionTimeMs} ms)`;
}

export function renderSettingsView(root, { apiFetch, navigate, onLogout }) {
  root.innerHTML = "";

  const shell = el("div", { class: "dashboard-shell page-fade" });
  const header = el("header", { class: "dashboard-header" });
  const brand = el("a", { class: "brand-link", href: "/", "data-link": "true", text: "1Million ToDo" });
  const nav = el("nav", { class: "dashboard-nav", "aria-label": "Settings" });
  const homeLink = el("a", { class: "dashboard-link", href: "/", "data-link": "true", text: "Home" });
  const dashboardLink = el("a", { class: "dashboard-link", href: "/app", "data-link": "true", text: "Dashboard" });
  const settingsLink = el("a", {
    class: "dashboard-link dashboard-link-active",
    href: "/app/settings",
    "data-link": "true",
    text: "Settings",
  });
  const logoutButton = el("button", { class: "btn btn-ghost", type: "button", text: "Logout" });
  logoutButton.addEventListener("click", onLogout);
  nav.append(homeLink, dashboardLink, settingsLink, logoutButton);
  header.append(brand, nav);

  const banner = el("div", {
    class: "banner",
    id: "settings-banner",
    role: "status",
    "aria-live": "polite",
  });

  const layout = el("main", { class: "dashboard-grid" });
  const left = el("section", { class: "dashboard-panel" });
  const right = el("section", { class: "dashboard-panel dashboard-panel-muted" });

  const meTitle = el("h1", { class: "section-title", text: "Settings" });
  const meSubtitle = el("p", {
    class: "dashboard-subtitle",
    text: "Plan updates apply immediately because limits are evaluated from database state.",
  });
  const accountLine = el("p", { class: "dashboard-account-line", text: "Loading account details..." });

  const planField = el("div", { class: "field" });
  const planLabel = el("label", { for: "settings-plan", text: "Plan" });
  const planSelect = el("select", { id: "settings-plan", name: "plan" });
  for (const plan of ["free", "premium", "enterprise"]) {
    planSelect.appendChild(el("option", { value: plan, text: plan }));
  }

  const planActions = el("div", { class: "settings-actions" });
  const savePlanButton = el("button", { class: "btn btn-primary", type: "button", text: "Update plan" });
  planActions.appendChild(savePlanButton);
  planField.append(planLabel, planSelect, planActions);

  left.append(meTitle, meSubtitle, accountLine, planField);

  const logsTitle = el("h2", { class: "section-title", text: "Recent request logs" });
  const logsSubtitle = el("p", {
    class: "dashboard-subtitle",
    text: "This view reads `GET /v1/me/request-logs` and shows your last requests.",
  });
  const refreshLogsButton = el("button", { class: "btn btn-ghost", type: "button", text: "Refresh logs" });
  const logsList = el("ul", { class: "request-log-list" });
  right.append(logsTitle, logsSubtitle, refreshLogsButton, logsList);

  layout.append(left, right);
  shell.append(header, banner, layout);
  root.appendChild(shell);

  async function loadMe() {
    const meResponse = await apiFetch("/v1/me");
    if (!meResponse.ok) {
      if (shouldOpenForbidden(meResponse)) {
        navigate("/error/forbidden", { replace: true });
        return;
      }
      if (shouldOpenUnexpected(meResponse)) {
        navigate("/error/unexpected", {
          replace: true,
          state: { message: meResponse.error.message },
        });
        return;
      }

      setBanner(banner, { kind: "error", message: meResponse.error.message });
      return;
    }

    accountLine.textContent = `Signed in as ${meResponse.data.email} - current plan: ${meResponse.data.plan}`;
    planSelect.value = meResponse.data.plan;
  }

  async function loadLogs() {
    const logsResponse = await apiFetch("/v1/me/request-logs");
    if (!logsResponse.ok) {
      if (shouldOpenForbidden(logsResponse)) {
        navigate("/error/forbidden", { replace: true });
        return;
      }
      if (shouldOpenUnexpected(logsResponse)) {
        navigate("/error/unexpected", {
          replace: true,
          state: { message: logsResponse.error.message },
        });
        return;
      }

      setBanner(banner, { kind: "error", message: logsResponse.error.message });
      return;
    }

    logsList.innerHTML = "";
    if (!Array.isArray(logsResponse.data) || logsResponse.data.length === 0) {
      logsList.appendChild(el("li", { class: "request-log-item", text: "No request logs yet." }));
      return;
    }

    for (const log of logsResponse.data) {
      logsList.appendChild(el("li", { class: "request-log-item", text: formatRequestLogLine(log) }));
    }
  }

  savePlanButton.addEventListener("click", async () => {
    savePlanButton.disabled = true;
    const planResponse = await apiFetch("/v1/me/plan", {
      method: "PATCH",
      body: JSON.stringify({ plan: planSelect.value }),
    });
    savePlanButton.disabled = false;

    if (!planResponse.ok) {
      if (shouldOpenForbidden(planResponse)) {
        navigate("/error/forbidden", { replace: true });
        return;
      }
      if (shouldOpenUnexpected(planResponse)) {
        navigate("/error/unexpected", {
          replace: true,
          state: { message: planResponse.error.message },
        });
        return;
      }

      setBanner(banner, { kind: "error", message: planResponse.error.message });
      return;
    }

    setBanner(banner, { kind: "success", message: `Plan updated to ${planResponse.data.plan}.` });
    await loadMe();
    await loadLogs();
  });

  refreshLogsButton.addEventListener("click", async () => {
    await loadLogs();
  });

  void loadMe();
  void loadLogs();
}
