import { el, setBanner } from "./ui.js";

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function readQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export function renderAuthView(root, { mode, authStore, navigate, onToggleLanguage, t }) {
  const isRegister = mode === "register";
  const endpoint = isRegister ? "/v1/auth/register" : "/v1/auth/login";
  const initialPlan = readQueryParam("plan") || "free";
  root.innerHTML = "";

  const page = el("main", { class: "auth-shell page-fade" });

  const left = el("section", { class: "auth-aside" }, [
    el("a", { class: "brand-link", href: "/", "data-link": "true", text: "1Million ToDo" }),
    el("h1", { class: "auth-aside-title", text: t("auth.aside.title") }),
    el("p", { class: "auth-aside-text", text: t("auth.aside.body") }),
  ]);

  const panel = el("section", { class: "auth-panel" });
  const panelHeader = el("header", { class: "auth-panel-header" }, [
    el("div", { class: "auth-panel-top" }, [
      el("h2", { class: "section-title", text: isRegister ? t("auth.register.title") : t("auth.login.title") }),
      el("button", {
        class: "btn btn-language",
        type: "button",
        text: t("language.label"),
      }),
    ]),
    el("p", { class: "auth-panel-subtitle", text: isRegister ? t("auth.register.subtitle") : t("auth.login.subtitle") }),
  ]);

  const banner = el("div", {
    class: "banner",
    id: "auth-banner",
    role: "status",
    "aria-live": "polite",
  });

  const form = el("form", { class: "auth-form" });
  const emailField = el("div", { class: "field" });
  const emailLabel = el("label", { for: "email", text: t("auth.field.email") });
  const emailInput = el("input", {
    id: "email",
    name: "email",
    type: "email",
    autocomplete: "email",
    required: "true",
  });
  emailField.append(emailLabel, emailInput);

  const passwordField = el("div", { class: "field" });
  const passwordLabel = el("label", { for: "password", text: t("auth.field.password") });
  const passwordInput = el("input", {
    id: "password",
    name: "password",
    type: "password",
    autocomplete: mode === "register" ? "new-password" : "current-password",
    required: "true",
  });
  passwordField.append(passwordLabel, passwordInput);

  const submit = el("button", {
    class: "btn btn-primary btn-block",
    type: "submit",
    text: isRegister ? t("auth.action.register") : t("auth.action.login"),
  });

  const helperRow = el("div", { class: "auth-helper-row" }, [
    el("span", { text: isRegister ? t("auth.alt.login") : t("auth.alt.register") }),
    el("a", {
      href: isRegister ? "/auth/login" : "/auth/register",
      "data-link": "true",
      text: isRegister ? t("auth.alt.loginCta") : t("auth.alt.registerCta"),
    }),
  ]);

  const resetLink = el("a", {
    class: "auth-reset-link",
    href: "/auth/request-password",
    "data-link": "true",
    text: t("auth.action.forgotPassword"),
  });

  const languageButton = panelHeader.querySelector("button.btn-language");
  languageButton.addEventListener("click", onToggleLanguage);

  let workspaceInput = null;
  let passwordConfirmInput = null;
  let planSelect = null;
  let workspaceField = null;
  let confirmField = null;
  let planField = null;
  if (isRegister) {
    workspaceField = el("div", { class: "field" });
    const workspaceLabel = el("label", { for: "workspace", text: t("auth.field.workspace") });
    workspaceInput = el("input", {
      id: "workspace",
      name: "workspace",
      type: "text",
      maxlength: "80",
      placeholder: t("auth.placeholder.workspace"),
    });
    workspaceField.append(workspaceLabel, workspaceInput);

    confirmField = el("div", { class: "field" });
    const confirmLabel = el("label", { for: "password_confirm", text: t("auth.field.passwordConfirm") });
    passwordConfirmInput = el("input", {
      id: "password_confirm",
      name: "password_confirm",
      type: "password",
      autocomplete: "new-password",
      required: "true",
    });
    confirmField.append(confirmLabel, passwordConfirmInput);

    planField = el("div", { class: "field" });
    const planLabel = el("label", { for: "plan", text: t("auth.field.plan") });
    planSelect = el("select", { id: "plan", name: "plan" });
    for (const plan of ["free", "premium", "enterprise"]) {
      planSelect.appendChild(el("option", { value: plan, text: plan }));
    }
    planSelect.value = initialPlan;
    planField.append(planLabel, planSelect);

  }

  if (isRegister) {
    form.append(emailField, passwordField, confirmField, workspaceField, planField, submit);
  } else {
    form.append(emailField, passwordField, submit);
  }
  panel.append(panelHeader, banner, form, helperRow, resetLink);
  page.append(left, panel);
  root.appendChild(page);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBanner(banner, null);
    submit.disabled = true;

    const email = normalizeEmail(emailInput.value);
    const password = passwordInput.value;

    if (isRegister && passwordConfirmInput && passwordConfirmInput.value !== password) {
      setBanner(banner, { kind: "error", message: t("auth.error.passwordMismatch") });
      submit.disabled = false;
      return;
    }

    if (password.length < 8) {
      setBanner(banner, { kind: "error", message: t("auth.error.passwordTooShort") });
      submit.disabled = false;
      return;
    }

    let response;
    try {
      const body = isRegister
        ? {
            email,
            password,
            plan: planSelect ? planSelect.value : "free",
          }
        : { email, password };

      response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      setBanner(banner, { kind: "error", message: t("auth.error.network") });
      submit.disabled = false;
      return;
    }

    let body = null;
    const bodyText = await response.text();
    if (bodyText) {
      try {
        body = JSON.parse(bodyText);
      } catch {
        body = null;
      }
    }

    if (!response.ok) {
      const message = body && body.error && body.error.message ? body.error.message : t("auth.error.failed");
      setBanner(banner, { kind: "error", message });
      submit.disabled = false;
      return;
    }

    const token = body && body.token;
    if (!token) {
      setBanner(banner, { kind: "error", message: t("auth.error.missingToken") });
      submit.disabled = false;
      return;
    }

    authStore.setToken(token);
    navigate("/app", { replace: true });
  });
}

export function renderPasswordRequestPlaceholderView(root, { apiFetch, navigate, onToggleLanguage, t }) {
  root.innerHTML = "";

  const page = el("main", { class: "auth-shell page-fade" });

  const left = el("section", { class: "auth-aside" }, [
    el("a", { class: "brand-link", href: "/", "data-link": "true", text: "1Million ToDo" }),
    el("h1", { class: "auth-aside-title", text: t("reset.title") }),
    el("p", { class: "auth-aside-text", text: t("reset.subtitle") }),
  ]);

  const panel = el("section", { class: "auth-panel" });
  const panelHeader = el("header", { class: "auth-panel-header" }, [
    el("div", { class: "auth-panel-top" }, [
      el("h2", { class: "section-title", text: t("reset.title") }),
      el("button", {
        class: "btn btn-language",
        type: "button",
        text: t("language.label"),
      }),
    ]),
    el("p", { class: "auth-panel-subtitle", text: t("reset.subtitle") }),
  ]);

  const languageButton = panelHeader.querySelector("button.btn-language");
  languageButton.addEventListener("click", onToggleLanguage);

  const banner = el("div", {
    class: "banner",
    id: "reset-banner",
    role: "status",
    "aria-live": "polite",
  });

  const requestTitle = el("h3", { class: "help-subtitle", text: t("reset.request.title") });
  const requestForm = el("form", { class: "auth-form" });

  const requestEmailField = el("div", { class: "field" });
  const requestEmailLabel = el("label", { for: "reset-email", text: t("auth.field.email") });
  const requestEmailInput = el("input", {
    id: "reset-email",
    name: "email",
    type: "email",
    autocomplete: "email",
    required: "true",
  });
  requestEmailField.append(requestEmailLabel, requestEmailInput);

  const requestButton = el("button", {
    class: "btn btn-primary btn-block",
    type: "submit",
    text: t("reset.request.action"),
  });
  requestForm.append(requestEmailField, requestButton);

  const resetForm = el("form", { class: "auth-form" });

  const codeField = el("div", { class: "field" });
  const codeLabel = el("label", { for: "reset-code", text: t("reset.code.label") });
  const codeInput = el("input", {
    id: "reset-code",
    name: "reset_token",
    type: "text",
    autocomplete: "off",
    required: "true",
  });
  codeField.append(codeLabel, codeInput);

  const newPasswordField = el("div", { class: "field" });
  const newPasswordLabel = el("label", { for: "reset-new-password", text: t("reset.newPassword.label") });
  const newPasswordInput = el("input", {
    id: "reset-new-password",
    name: "new_password",
    type: "password",
    autocomplete: "new-password",
    required: "true",
  });
  newPasswordField.append(newPasswordLabel, newPasswordInput);

  const newPasswordConfirmField = el("div", { class: "field" });
  const newPasswordConfirmLabel = el("label", {
    for: "reset-new-password-confirm",
    text: t("reset.newPasswordConfirm.label"),
  });
  const newPasswordConfirmInput = el("input", {
    id: "reset-new-password-confirm",
    name: "new_password_confirm",
    type: "password",
    autocomplete: "new-password",
    required: "true",
  });
  newPasswordConfirmField.append(newPasswordConfirmLabel, newPasswordConfirmInput);

  const resetButton = el("button", {
    class: "btn btn-primary btn-block",
    type: "submit",
    text: t("reset.reset.action"),
  });

  const backToLogin = el("a", {
    class: "auth-reset-link",
    href: "/auth/login",
    "data-link": "true",
    text: t("reset.backToLogin"),
  });

  resetForm.append(codeField, newPasswordField, newPasswordConfirmField, resetButton);
  panel.append(panelHeader, banner, requestTitle, requestForm, resetForm, backToLogin);
  page.append(left, panel);
  root.appendChild(page);

  requestForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBanner(banner, null);
    requestButton.disabled = true;

    const response = await apiFetch("/v1/auth/request-password-reset", {
      method: "POST",
      body: JSON.stringify({ email: requestEmailInput.value.trim().toLowerCase() }),
    });

    requestButton.disabled = false;

    if (!response.ok) {
      setBanner(banner, { kind: "error", message: response.error.message });
      return;
    }

    if (response.data && response.data.reset_token) {
      codeInput.value = response.data.reset_token;
    }

    setBanner(banner, { kind: "success", message: t("reset.request.success") });
  });

  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBanner(banner, null);

    const code = codeInput.value.trim();
    const nextPassword = newPasswordInput.value;
    if (nextPassword.length < 8) {
      setBanner(banner, { kind: "error", message: t("auth.error.passwordTooShort") });
      return;
    }
    if (newPasswordConfirmInput.value !== nextPassword) {
      setBanner(banner, { kind: "error", message: t("auth.error.passwordMismatch") });
      return;
    }

    resetButton.disabled = true;
    const response = await apiFetch("/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ reset_token: code, new_password: nextPassword }),
    });
    resetButton.disabled = false;

    if (!response.ok) {
      setBanner(banner, { kind: "error", message: response.error.message });
      return;
    }

    setBanner(banner, { kind: "success", message: t("reset.reset.success") });
    navigate("/auth/login", { replace: true });
  });
}
