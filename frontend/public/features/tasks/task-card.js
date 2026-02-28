import { el } from "../../views/ui.js";

function toLocalDateKey(value = new Date()) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStatus(task) {
  if (task.is_completed) {
    return { key: "done", tone: "done" };
  }

  const today = toLocalDateKey();
  if (task.due_date && task.due_date < today) {
    return { key: "overdue", tone: "overdue" };
  }

  return { key: "open", tone: "open" };
}

export function renderTaskCard(task, { onToggleComplete, onOpenDetails, t }) {
  const isShared = task.access === "shared";
  const status = getStatus(task);
  const wrapper = el("article", {
    class: "task-card",
    role: "button",
    tabindex: "0",
    "aria-label": `${t("task.openDetailsAriaPrefix")} - ${task.title}`,
  });
  const head = el("div", { class: "task-card-head" });

  const left = el("div", { class: "task-main" });
  const checkbox = el("input", {
    type: "checkbox",
    "aria-label": `${t("task.checkboxAriaPrefix")}: ${task.title}`,
  });
  checkbox.checked = Boolean(task.is_completed);
  checkbox.disabled = isShared;
  checkbox.addEventListener("change", async () => {
    await onToggleComplete(Boolean(checkbox.checked));
  });

  const title = el("div", { class: "task-title", text: task.title });
  if (task.is_completed) {
    title.classList.add("task-title-completed");
  }
  left.append(checkbox, title);

  const pill = el("span", {
    class: `access-pill ${isShared ? "access-pill-shared" : "access-pill-owner"}`,
    text: isShared ? t("task.access.shared") : t("task.access.owned"),
  });

  head.append(left, pill);

  const desc = task.description ? el("p", { class: "task-description", text: task.description }) : null;
  const hint = isShared
    ? el("p", { class: "task-hint", text: t("task.readOnlyHint") })
    : el("p", { class: "task-hint", text: t("task.ownerHint") });

  wrapper.append(head);

  const metaRow = el("div", { class: "task-meta-row" });
  const statusPill = el("span", {
    class: `task-status-pill task-status-pill-${status.tone}`,
    text: t(`task.status.${status.key}`),
  });
  metaRow.appendChild(statusPill);

  if (task.tag) {
    metaRow.appendChild(el("span", { class: "task-tag-pill", text: String(task.tag).toUpperCase() }));
  }

  if (task.due_date) {
    metaRow.appendChild(
      el("span", {
        class: "task-date-pill",
        text: `${t("task.duePrefix")} ${task.due_date}`,
      })
    );
  }

  wrapper.appendChild(metaRow);

  if (desc) {
    wrapper.append(desc);
  }
  wrapper.append(hint);

  const openDetails = () => {
    if (typeof onOpenDetails === "function") {
      onOpenDetails();
    }
  };

  wrapper.addEventListener("click", (event) => {
    if (event.target === checkbox) {
      return;
    }
    openDetails();
  });

  wrapper.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openDetails();
  });

  return wrapper;
}
