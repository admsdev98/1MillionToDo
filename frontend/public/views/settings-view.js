import { el } from "./ui.js";

export function renderSettingsView(root, { apiFetch, setBanner }) {
  root.innerHTML = "";
  const container = el("div", { class: "content fade-in" });

  const title = el("h1", { class: "title", text: "Settings" });
  const subtitle = el("div", { class: "muted", text: "Plan is loaded from /v1/me (not inferred from the JWT)." });

  const box = el("div", { class: "field" });
  const planLabel = el("label", { for: "plan", text: "Plan" });
  const planSelect = el("select", { id: "plan", name: "plan" });
  for (const plan of ["free", "premium", "enterprise"]) {
    const opt = el("option", { value: plan, text: plan });
    planSelect.appendChild(opt);
  }

  const actions = el("div", { class: "row" });
  const save = el("button", { class: "btn primary", type: "button", text: "Save" });
  actions.append(save);

  const current = el("div", { class: "muted", text: "" });
  box.append(planLabel, planSelect, actions, current);

  async function loadMe() {
    const response = await apiFetch("/v1/me");
    if (!response.ok) {
      setBanner("error", `${response.error.code}: ${response.error.message}`);
      return;
    }
    planSelect.value = response.data.plan;
    current.textContent = `Signed in as ${response.data.email} (plan: ${response.data.plan})`;
  }

  save.addEventListener("click", async () => {
    setBanner(null, null);
    save.disabled = true;
    const response = await apiFetch("/v1/me/plan", {
      method: "PATCH",
      body: JSON.stringify({ plan: planSelect.value }),
    });
    save.disabled = false;

    if (!response.ok) {
      setBanner("error", `${response.error.code}: ${response.error.message}`);
      return;
    }

    setBanner(null, `Plan updated to ${response.data.plan}. Limits apply immediately.`);
    await loadMe();
  });

  container.append(title, subtitle, box);
  root.appendChild(container);
  void loadMe();
}
