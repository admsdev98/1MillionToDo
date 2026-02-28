import { el } from "./ui.js";

function planCard({ title, tone, features }) {
  return el("article", { class: `pricing-card pricing-card-${tone}` }, [
    el("h3", { class: "pricing-card-title", text: title }),
    el(
      "ul",
      { class: "pricing-features" },
      features.map((text) => el("li", { text }))
    ),
  ]);
}

export function renderLandingView(root, { isAuthenticated, onLogout, onToggleLanguage, t }) {
  root.innerHTML = "";

  const shell = el("div", { class: "landing-shell page-fade" });

  const header = el("header", { class: "landing-header" });
  const brand = el("a", { class: "brand-link", href: "/", "data-link": "true", text: "1Million ToDo" });

  const actions = el("div", { class: "landing-actions" });
  const languageToggle = el("button", {
    class: "btn btn-language",
    type: "button",
    text: t("language.label"),
  });
  languageToggle.addEventListener("click", onToggleLanguage);

  actions.append(languageToggle);

  if (isAuthenticated) {
    const dashboardLink = el("a", {
      class: "btn btn-ghost",
      href: "/app",
      "data-link": "true",
      text: t("nav.dashboard"),
    });
    const logoutButton = el("button", { class: "btn btn-primary", type: "button", text: t("nav.logout") });
    logoutButton.addEventListener("click", onLogout);
    actions.append(dashboardLink, logoutButton);
  } else {
    actions.append(
      el("a", {
        class: "btn btn-ghost",
        href: "/auth/login",
        "data-link": "true",
        text: t("landing.action.login"),
      }),
      el("a", {
        class: "btn btn-primary",
        href: "/auth/register",
        "data-link": "true",
        text: t("landing.action.register"),
      })
    );
  }

  header.append(brand, actions);

  const hero = el("section", { class: "landing-hero" });
  hero.append(
    el("p", { class: "landing-kicker", text: t("landing.hero.kicker") }),
    el("h1", {
      class: "landing-title",
      text: t("landing.hero.title"),
    }),
    el("p", {
      class: "landing-subtitle",
      text: t("landing.hero.subtitle"),
    }),
    el("div", { class: "landing-hero-actions" }, [
      el("a", {
        class: "btn btn-primary btn-large",
        href: "/auth/login",
        "data-link": "true",
        text: t("landing.hero.cta"),
      }),
      el("a", {
        class: "btn btn-ghost btn-large",
        href: "/auth/register",
        "data-link": "true",
        text: t("landing.action.register"),
      }),
    ])
  );

  const pricing = el("section", { class: "landing-section" });
  pricing.append(
    el("h2", { class: "section-title", text: t("landing.pricing.title") }),
    el("p", { class: "landing-subtitle", text: t("landing.pricing.subtitle") }),
    el("div", { class: "pricing-grid" }, [
      planCard({
        title: t("landing.plan.free"),
        tone: "neutral",
        features: [
          t("landing.plan.free.feature1"),
          t("landing.plan.free.feature2"),
          t("landing.plan.free.feature3"),
        ],
      }),
      planCard({
        title: t("landing.plan.premium"),
        tone: "cta",
        features: [
          t("landing.plan.premium.feature1"),
          t("landing.plan.premium.feature2"),
          t("landing.plan.premium.feature3"),
        ],
      }),
      planCard({
        title: t("landing.plan.enterprise"),
        tone: "ink",
        features: [
          t("landing.plan.enterprise.feature1"),
          t("landing.plan.enterprise.feature2"),
          t("landing.plan.enterprise.feature3"),
        ],
      }),
    ])
  );

  const footerText = t("landing.footer");
  const footer = footerText && footerText !== "landing.footer" ? el("footer", { class: "landing-footer", text: footerText }) : null;

  shell.append(header, hero, pricing);
  if (footer) {
    shell.appendChild(footer);
  }
  root.appendChild(shell);
}
