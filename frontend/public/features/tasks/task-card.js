import { el } from "../../views/ui.js";

export function renderTaskCard(task, { onToggleComplete }) {
  const isShared = task.access === "shared";
  const wrapper = el("div", { class: "task" });
  const head = el("div", { class: "task-head" });

  const left = el("div", { class: "row" });
  const checkbox = el("input", {
    type: "checkbox",
    "aria-label": "Complete",
  });
  checkbox.checked = Boolean(task.is_completed);
  checkbox.disabled = isShared;
  checkbox.addEventListener("change", async () => {
    await onToggleComplete(Boolean(checkbox.checked));
  });

  const title = el("div", { class: "task-title", text: task.title });
  left.append(checkbox, title);

  const pill = el("span", {
    class: `pill ${isShared ? "shared" : "owner"}`,
    text: isShared ? "Shared" : "Owned",
  });

  head.append(left, pill);

  const desc = task.description ? el("div", { class: "muted", text: task.description }) : null;
  wrapper.append(head);
  if (desc) {
    wrapper.append(desc);
  }

  return wrapper;
}
