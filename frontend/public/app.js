import { apiFetch } from "./shared/api-client.js";
import { authStore } from "./shared/auth-store.js";
import { getLanguage, toggleLanguage, t } from "./shared/i18n.js";
import { renderLandingView } from "./views/landing-view.js";
import { renderAuthView, renderPasswordRequestPlaceholderView } from "./views/auth-view.js";
import { renderDashboardView } from "./views/dashboard-view.js";
import { renderSettingsView } from "./views/settings-view.js";
import { renderErrorView } from "./views/error-view.js";

const appRoot = document.getElementById("app-root");

const ROUTES = {
  "/": "landing",
  "/auth/login": "auth-login",
  "/auth/register": "auth-register",
  "/auth/request-password": "auth-request-password",
  "/app": "dashboard",
  "/app/settings": "settings",
  "/error/not-found": "error-not-found",
  "/error/forbidden": "error-forbidden",
  "/error/unexpected": "error-unexpected",
};

function normalizePath(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  if (pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function resolveRoute(pathname) {
  const normalizedPath = normalizePath(pathname);
  return {
    path: normalizedPath,
    id: ROUTES[normalizedPath] || "error-not-found",
  };
}

function navigate(path, options = {}) {
  const normalizedPath = normalizePath(path);
  const method = options.replace ? "replaceState" : "pushState";
  window.history[method](options.state || null, "", normalizedPath);
  void renderCurrentRoute();
}

function onInternalLinkClick(event) {
  const link = event.target.closest("a[data-link]");
  if (!link) {
    return;
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const href = link.getAttribute("href");
  if (!href || !href.startsWith("/")) {
    return;
  }

  event.preventDefault();
  navigate(href);
}

function logoutAndGoToLanding() {
  authStore.clearToken();
  navigate("/", { replace: true });
}

function toggleLanguageAndRerender() {
  toggleLanguage();
  void renderCurrentRoute();
}

async function renderCurrentRoute() {
  const route = resolveRoute(window.location.pathname);
  const isAuthenticated = Boolean(authStore.getToken());
  const language = getLanguage();

  // Product "home" lives at /app. Keep landing for unauthenticated users only.
  if (route.id === "landing" && isAuthenticated) {
    window.history.replaceState(null, "", "/app");
    void renderCurrentRoute();
    return;
  }

  if ((route.id === "dashboard" || route.id === "settings") && !isAuthenticated) {
    navigate("/auth/login", { replace: true });
    return;
  }

  if ((route.id === "auth-login" || route.id === "auth-register") && isAuthenticated) {
    navigate("/app", { replace: true });
    return;
  }

  if (route.id === "landing") {
    renderLandingView(appRoot, {
      isAuthenticated,
      onLogout: logoutAndGoToLanding,
      language,
      onToggleLanguage: toggleLanguageAndRerender,
      t,
    });
    return;
  }

  if (route.id === "auth-login") {
    renderAuthView(appRoot, {
      mode: "login",
      authStore,
      navigate,
      language,
      onToggleLanguage: toggleLanguageAndRerender,
      t,
    });
    return;
  }

  if (route.id === "auth-register") {
    renderAuthView(appRoot, {
      mode: "register",
      authStore,
      navigate,
      language,
      onToggleLanguage: toggleLanguageAndRerender,
      t,
    });
    return;
  }

  if (route.id === "auth-request-password") {
    renderPasswordRequestPlaceholderView(appRoot, {
      apiFetch,
      navigate,
      language,
      onToggleLanguage: toggleLanguageAndRerender,
      t,
    });
    return;
  }

  if (route.id === "dashboard") {
    renderDashboardView(appRoot, {
      apiFetch,
      authStore,
      navigate,
      onLogout: logoutAndGoToLanding,
      language,
      onToggleLanguage: toggleLanguageAndRerender,
      t,
    });
    return;
  }

  if (route.id === "settings") {
    renderSettingsView(appRoot, {
      apiFetch,
      navigate,
      onLogout: logoutAndGoToLanding,
      language,
      onToggleLanguage: toggleLanguageAndRerender,
      t,
    });
    return;
  }

  if (route.id === "error-forbidden") {
    renderErrorView(appRoot, {
      kind: "forbidden",
      navigate,
      isAuthenticated,
      t,
    });
    return;
  }

  if (route.id === "error-unexpected") {
    renderErrorView(appRoot, {
      kind: "unexpected",
      navigate,
      isAuthenticated,
      details: window.history.state && window.history.state.message,
      t,
    });
    return;
  }

  renderErrorView(appRoot, {
    kind: "not-found",
    navigate,
    isAuthenticated,
    t,
  });
}

document.addEventListener("click", onInternalLinkClick);
window.addEventListener("popstate", () => {
  void renderCurrentRoute();
});

window.addEventListener("unhandledrejection", () => {
  navigate("/error/unexpected", {
    replace: true,
    state: {
      message: t("error.unexpected.defaultDetails"),
    },
  });
});

void renderCurrentRoute();
