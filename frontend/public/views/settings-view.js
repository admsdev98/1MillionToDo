import { el, setBanner } from "./ui.js";
import { formatT } from "../shared/i18n.js";

function shouldOpenForbidden(response) {
  return response.status === 401 || response.status === 403;
}

function shouldOpenUnexpected(response) {
  return response.status >= 500 || response.status === 0;
}

function toFriendlyActionLabel(log, t) {
  const url = String(log.url || "");
  const method = String(log.method || "").toUpperCase();

  if (url === "/v1/me") {
    return t("activity.account.view");
  }

  if (url === "/v1/me/plan") {
    return t("activity.account.updatePlan");
  }

  if (url === "/v1/me/request-logs") {
    return t("activity.activity.view");
  }

  if (url.startsWith("/v1/tasks")) {
    if (url.endsWith("/share")) {
      return t("activity.tasks.share");
    }

    if (method === "GET") {
      return t("activity.tasks.view");
    }

    if (method === "POST") {
      return t("activity.tasks.create");
    }

    if (method === "PATCH") {
      return t("activity.tasks.update");
    }

    if (method === "DELETE") {
      return t("activity.tasks.delete");
    }

    return t("activity.tasks.view");
  }

  return t("activity.other");
}

function formatRequestLogLine(log, t) {
  const date = new Date(log.timestamp);
  const timestamp = Number.isNaN(date.getTime()) ? log.timestamp : date.toLocaleString();
  const action = toFriendlyActionLabel(log, t);
  return `${timestamp} - ${action} - ${log.statusCode} (${log.executionTimeMs} ms)`;
}

export function renderSettingsView(root, { apiFetch, navigate, onLogout, onToggleLanguage, t }) {
  root.innerHTML = "";

  const shell = el("div", { class: "dashboard-shell page-fade" });
  const header = el("header", { class: "dashboard-header" });
  const brand = el("a", { class: "brand-link", href: "/app", "data-link": "true", text: "1Million ToDo" });
  const nav = el("nav", { class: "dashboard-nav", "aria-label": t("nav.settings") });
  const dashboardLink = el("a", { class: "dashboard-link", href: "/app", "data-link": "true", text: t("nav.dashboard") });
  const settingsLink = el("a", {
    class: "dashboard-link dashboard-link-active",
    href: "/app/settings",
    "data-link": "true",
    text: t("nav.settings"),
  });
  const languageToggle = el("button", {
    class: "btn btn-language",
    type: "button",
    text: t("language.label"),
  });
  languageToggle.addEventListener("click", onToggleLanguage);

  const logoutButton = el("button", { class: "btn btn-ghost", type: "button", text: t("nav.logout") });
  logoutButton.addEventListener("click", onLogout);
  nav.append(dashboardLink, settingsLink, languageToggle, logoutButton);
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

  const meTitle = el("h1", { class: "section-title", text: t("settings.title") });
  const meSubtitle = el("p", { class: "dashboard-subtitle", text: t("settings.subtitle") });
  const accountLine = el("p", { class: "dashboard-account-line", text: t("dashboard.account.loading") });

  const planField = el("div", { class: "field" });
  const planLabel = el("label", { for: "settings-plan", text: t("settings.plan.label") });
  const planSelect = el("select", { id: "settings-plan", name: "plan" });
  for (const plan of ["free", "premium", "enterprise"]) {
    planSelect.appendChild(el("option", { value: plan, text: plan }));
  }

  const planActions = el("div", { class: "settings-actions" });
  const savePlanButton = el("button", { class: "btn btn-primary", type: "button", text: t("settings.plan.action") });
  planActions.appendChild(savePlanButton);
  planField.append(planLabel, planSelect, planActions);

  left.append(meTitle, meSubtitle, accountLine, planField);

  const logsTitle = el("h2", { class: "section-title", text: t("settings.logs.title") });
  const logsSubtitle = el("p", { class: "dashboard-subtitle", text: t("settings.logs.subtitle") });
  const refreshLogsButton = el("button", { class: "btn btn-ghost", type: "button", text: t("settings.logs.action") });
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

    accountLine.textContent = formatT("dashboard.account.line", {
      email: meResponse.data.email,
      plan: meResponse.data.plan,
    });
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
      logsList.appendChild(el("li", { class: "request-log-item", text: t("settings.logs.empty") }));
      return;
    }

    for (const log of logsResponse.data) {
      logsList.appendChild(el("li", { class: "request-log-item", text: formatRequestLogLine(log, t) }));
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

    setBanner(banner, { kind: "success", message: formatT("settings.plan.updated", { plan: planResponse.data.plan }) });
    await loadMe();
    await loadLogs();
  });

  refreshLogsButton.addEventListener("click", async () => {
    await loadLogs();
  });

  void loadMe();
  void loadLogs();
}
