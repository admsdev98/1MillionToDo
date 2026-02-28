import { apiFetch } from "./shared/api-client.js";
import { authStore } from "./shared/auth-store.js";
import { renderLoginView } from "./views/login-view.js";
import { renderDashboardView } from "./views/dashboard-view.js";
import { renderSettingsView } from "./views/settings-view.js";
import { setBanner } from "./views/ui.js";

const viewRoot = document.getElementById("view-root");
const banner = document.getElementById("banner");
const navButtons = Array.from(document.querySelectorAll("[data-nav]"));

function setActiveNav(target) {
  for (const btn of navButtons) {
    btn.dataset.active = btn.dataset.nav === target ? "true" : "false";
  }
}

function hideNavWhenLoggedOut() {
  const isLoggedIn = Boolean(authStore.getToken());
  for (const btn of navButtons) {
    btn.disabled = !isLoggedIn && btn.dataset.nav !== "logout";
    btn.style.display = isLoggedIn ? "" : "none";
  }
}

async function navigate(target) {
  setBanner(banner, null);
  hideNavWhenLoggedOut();

  if (target === "logout") {
    authStore.clearToken();
    setActiveNav("dashboard");
    await navigate("login");
    return;
  }

  if (!authStore.getToken()) {
    setActiveNav("dashboard");
    renderLoginView(viewRoot, {
      onLoggedIn: async () => {
        await navigate("dashboard");
      },
      setBanner: (kind, message) => setBanner(banner, kind ? { kind, message } : null),
    });
    return;
  }

  if (target === "settings") {
    setActiveNav("settings");
    renderSettingsView(viewRoot, {
      apiFetch,
      authStore,
      setBanner: (kind, message) => setBanner(banner, kind ? { kind, message } : null),
    });
    return;
  }

  setActiveNav("dashboard");
  renderDashboardView(viewRoot, {
    apiFetch,
    authStore,
    setBanner: (kind, message) => setBanner(banner, kind ? { kind, message } : null),
  });
}

for (const btn of navButtons) {
  btn.addEventListener("click", async () => {
    await navigate(btn.dataset.nav);
  });
}

// Initial load
hideNavWhenLoggedOut();
await navigate("dashboard");
