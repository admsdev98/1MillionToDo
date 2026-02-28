import { el } from "./ui.js";

function getErrorConfig(kind, isAuthenticated, t) {
  if (kind === "forbidden") {
    return {
      eyebrow: t("error.kind.forbidden"),
      title: t("error.forbidden.title"),
      body: t("error.forbidden.body"),
      primaryHref: "/auth/login",
      primaryLabel: t("error.action.goToLogin"),
      secondaryHref: isAuthenticated ? "/app" : "/",
      secondaryLabel: isAuthenticated ? t("error.action.backToDashboard") : t("error.action.backToHome"),
    };
  }

  if (kind === "unexpected") {
    return {
      eyebrow: t("error.kind.unexpected"),
      title: t("error.unexpected.title"),
      body: t("error.unexpected.body"),
      primaryHref: isAuthenticated ? "/app" : "/auth/login",
      primaryLabel: isAuthenticated ? t("error.action.retryInDashboard") : t("error.action.goToLogin"),
      secondaryHref: "/",
      secondaryLabel: t("error.action.backToHome"),
    };
  }

  return {
    eyebrow: t("error.kind.notFound"),
    title: t("error.notFound.title"),
    body: t("error.notFound.body"),
    primaryHref: isAuthenticated ? "/app" : "/",
    primaryLabel: isAuthenticated ? t("error.action.backToDashboard") : t("error.action.backToHome"),
    secondaryHref: "/auth/login",
    secondaryLabel: t("error.action.goToLogin"),
  };
}

export function renderErrorView(root, { kind, isAuthenticated, details, t }) {
  root.innerHTML = "";

  const config = getErrorConfig(kind, isAuthenticated, t);
  const box = el("main", { class: "error-shell page-fade" });
  const card = el("section", { class: "error-card" });

  card.append(
    el("a", { class: "brand-link", href: "/", "data-link": "true", text: "1Million ToDo" }),
    el("p", { class: "error-eyebrow", text: config.eyebrow }),
    el("h1", { class: "section-title", text: config.title }),
    el("p", { class: "auth-panel-subtitle", text: config.body })
  );

  if (details) {
    card.appendChild(el("p", { class: "error-details", text: details }));
  }

  const actions = el("div", { class: "error-actions" }, [
    el("a", {
      class: "btn btn-primary",
      href: config.primaryHref,
      "data-link": "true",
      text: config.primaryLabel,
    }),
    el("a", {
      class: "btn btn-ghost",
      href: config.secondaryHref,
      "data-link": "true",
      text: config.secondaryLabel,
    }),
  ]);

  card.appendChild(actions);
  box.appendChild(card);
  root.appendChild(box);
}
