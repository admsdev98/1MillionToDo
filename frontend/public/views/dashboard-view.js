import { listTasks, createTask, patchTask, deleteTask, shareTask } from "../features/tasks/tasks-api.js";
import { renderTaskCard } from "../features/tasks/task-card.js";
import { el, setBanner } from "./ui.js";
import { formatT } from "../shared/i18n.js";

const DEFAULT_TAGS_BY_LANGUAGE = {
  es: ["TRABAJO", "PERSONAL", "URGENTE", "SEGUIMIENTO"],
  en: ["WORK", "PERSONAL", "URGENT", "FOLLOW UP"],
};

function normalizeTag(rawValue) {
  const clean = (rawValue || "").trim();
  if (!clean) {
    return null;
  }
  return clean.toUpperCase();
}

function shouldOpenForbidden(response) {
  return response.status === 401 || response.status === 403;
}

function shouldOpenUnexpected(response) {
  return response.status >= 500 || response.status === 0;
}

export function renderDashboardView(root, { apiFetch, navigate, onLogout, onToggleLanguage, t, language }) {
  root.innerHTML = "";

  const shell = el("div", { class: "dashboard-shell page-fade" });
  const header = el("header", { class: "dashboard-header" });
  const brand = el("a", { class: "brand-link", href: "/", "data-link": "true", text: "1Million ToDo" });
  const nav = el("nav", { class: "dashboard-nav", "aria-label": t("nav.dashboard") });
  const homeLink = el("a", { class: "dashboard-link", href: "/", "data-link": "true", text: t("nav.home") });
  const appLink = el("a", { class: "dashboard-link dashboard-link-active", href: "/app", "data-link": "true", text: t("nav.dashboard") });
  const settingsLink = el("a", { class: "dashboard-link", href: "/app/settings", "data-link": "true", text: t("nav.settings") });
  const languageToggle = el("button", {
    class: "btn btn-language",
    type: "button",
    text: t("language.label"),
  });
  languageToggle.addEventListener("click", onToggleLanguage);

  const logoutButton = el("button", { class: "btn btn-ghost", type: "button", text: t("nav.logout") });
  logoutButton.addEventListener("click", onLogout);
  nav.append(homeLink, appLink, settingsLink, languageToggle, logoutButton);
  header.append(brand, nav);

  const banner = el("div", {
    class: "banner",
    id: "dashboard-banner",
    role: "status",
    "aria-live": "polite",
  });

  const layout = el("main", { class: "dashboard-grid" });
  const left = el("section", { class: "dashboard-panel" });
  const right = el("section", { class: "dashboard-panel dashboard-panel-muted" });

  const listHeading = el("div", { class: "dashboard-heading" }, [
    el("h1", { class: "section-title", text: t("dashboard.title") }),
    el("p", { class: "dashboard-subtitle", text: t("dashboard.subtitle") }),
  ]);

  const accountLine = el("p", { class: "dashboard-account-line", text: t("dashboard.account.loading") });
  const listBox = el("div", { class: "task-list" });
  left.append(listHeading, accountLine, listBox);

  const formHeading = el("h2", { class: "section-title", text: t("task.create.title") });
  const formSubtitle = el("p", { class: "dashboard-subtitle", text: t("task.create.subtitle") });
  const form = el("form", { class: "task-form" });

  const titleField = el("div", { class: "field" });
  const titleLabel = el("label", { for: "new-title", text: t("task.field.title") });
  const titleInput = el("input", {
    id: "new-title",
    name: "title",
    required: "true",
    maxlength: "200",
    placeholder: t("task.placeholder.title"),
  });
  titleField.append(titleLabel, titleInput);

  const descriptionField = el("div", { class: "field" });
  const descriptionLabel = el("label", { for: "new-description", text: t("task.field.description") });
  const descriptionInput = el("textarea", {
    id: "new-description",
    name: "description",
    rows: "4",
    maxlength: "4000",
    placeholder: t("task.placeholder.description"),
  });
  descriptionField.append(descriptionLabel, descriptionInput);

  const dueDateField = el("div", { class: "field" });
  const dueDateLabel = el("label", { for: "new-due-date", text: t("task.field.dueDate") });
  const dueDateInput = el("input", {
    id: "new-due-date",
    name: "due_date",
    type: "date",
  });
  dueDateField.append(dueDateLabel, dueDateInput);

  const tagField = el("div", { class: "field" });
  const tagLabel = el("label", { for: "new-tag", text: t("task.field.tag") });
  const tagInput = el("input", {
    id: "new-tag",
    name: "tag",
    maxlength: "60",
    placeholder: t("task.placeholder.tag"),
    list: "task-tag-options",
  });
  tagField.append(tagLabel, tagInput);

  tagInput.addEventListener("blur", () => {
    const next = normalizeTag(tagInput.value);
    tagInput.value = next || "";
  });

  const createShareField = el("div", { class: "field" });
  const createShareLabel = el("label", { for: "new-share-email", text: t("task.field.shareEmail") });
  const createShareInput = el("input", {
    id: "new-share-email",
    name: "share_email",
    type: "email",
    autocomplete: "email",
    placeholder: t("task.placeholder.shareEmail"),
  });
  createShareField.append(createShareLabel, createShareInput);

  const submitButton = el("button", { class: "btn btn-primary btn-block", type: "submit", text: t("task.action.create") });
  form.append(titleField, descriptionField, dueDateField, tagField, createShareField, submitButton);
  right.append(formHeading, formSubtitle, form);

  const tagOptions = DEFAULT_TAGS_BY_LANGUAGE[language] || DEFAULT_TAGS_BY_LANGUAGE.es;
  const tagDataList = el(
    "datalist",
    { id: "task-tag-options" },
    tagOptions.map((value) => el("option", { value }))
  );

  const modalBackdrop = el("div", {
    class: "task-modal-backdrop task-modal-backdrop-hidden",
    role: "presentation",
  });
  const modal = el("section", {
    class: "task-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "task-modal-title",
  });
  const modalHeader = el("div", { class: "task-modal-header" }, [
    el("h2", { id: "task-modal-title", class: "section-title", text: t("task.details.title") }),
    el("span", { class: "access-pill access-pill-owner", text: t("task.access.owned"), id: "task-modal-access" }),
  ]);

  const modalReadOnlyHint = el("p", {
    class: "task-hint",
    text: t("task.readOnlyHint"),
  });

  const modalForm = el("form", { class: "task-modal-form" });

  const modalTitleField = el("div", { class: "field" });
  const modalTitleLabel = el("label", { for: "task-modal-title-input", text: t("task.field.title") });
  const modalTitleInput = el("input", {
    id: "task-modal-title-input",
    name: "title",
    required: "true",
    maxlength: "200",
  });
  modalTitleField.append(modalTitleLabel, modalTitleInput);

  const modalDescriptionField = el("div", { class: "field" });
  const modalDescriptionLabel = el("label", {
    for: "task-modal-description-input",
    text: t("task.field.description"),
  });
  const modalDescriptionInput = el("textarea", {
    id: "task-modal-description-input",
    name: "description",
    rows: "4",
    maxlength: "4000",
  });
  modalDescriptionField.append(modalDescriptionLabel, modalDescriptionInput);

  const modalDueDateField = el("div", { class: "field" });
  const modalDueDateLabel = el("label", { for: "task-modal-due-date-input", text: t("task.field.dueDate") });
  const modalDueDateInput = el("input", {
    id: "task-modal-due-date-input",
    name: "due_date",
    type: "date",
  });
  modalDueDateField.append(modalDueDateLabel, modalDueDateInput);

  const modalTagField = el("div", { class: "field" });
  const modalTagLabel = el("label", { for: "task-modal-tag-input", text: t("task.field.tag") });
  const modalTagInput = el("input", {
    id: "task-modal-tag-input",
    name: "tag",
    maxlength: "60",
    placeholder: "",
    list: "task-tag-options",
  });
  modalTagField.append(modalTagLabel, modalTagInput);

  modalTagInput.addEventListener("blur", () => {
    const next = normalizeTag(modalTagInput.value);
    modalTagInput.value = next || "";
  });

  const shareField = el("div", { class: "field" });
  const shareLabel = el("label", { for: "task-modal-share-email", text: t("task.field.shareByEmail") });
  const shareRow = el("div", { class: "task-modal-inline" });
  const shareEmailInput = el("input", {
    id: "task-modal-share-email",
    name: "share_email",
    type: "email",
    autocomplete: "email",
    placeholder: t("task.placeholder.shareEmail"),
  });
  const shareButton = el("button", { class: "btn btn-ghost", type: "button", text: t("task.action.share") });
  shareRow.append(shareEmailInput, shareButton);
  shareField.append(shareLabel, shareRow);

  const modalActions = el("div", { class: "task-modal-actions" });
  const closeButton = el("button", { class: "btn btn-ghost", type: "button", text: t("task.action.close") });
  const deleteButton = el("button", { class: "btn btn-ghost", type: "button", text: t("task.action.delete") });
  const saveButton = el("button", { class: "btn btn-primary", type: "submit", text: t("task.action.save") });
  modalActions.append(closeButton, deleteButton, saveButton);

  modalForm.append(
    modalTitleField,
    modalDescriptionField,
    modalDueDateField,
    modalTagField,
    shareField,
    modalReadOnlyHint,
    modalActions
  );
  modal.append(modalHeader, modalForm);
  modalBackdrop.appendChild(modal);

  const helpButton = el("button", {
    class: "help-fab",
    type: "button",
    "aria-expanded": "false",
    "aria-controls": "dashboard-help-panel",
    text: t("help.button"),
  });

  const helpPanel = el("aside", {
    class: "help-panel help-panel-hidden",
    id: "dashboard-help-panel",
    "aria-label": t("help.title"),
  });
  const helpHeader = el("div", { class: "help-panel-header" }, [
    el("h2", { class: "section-title", text: t("help.title") }),
  ]);
  const helpCloseButton = el("button", { class: "btn btn-ghost", type: "button", text: t("help.close") });
  helpHeader.appendChild(helpCloseButton);

  const helpBody = el("div", { class: "help-panel-body" });
  const helpInstructions = el("ul", { class: "help-list" }, [
    el("li", { text: t("help.tip1") }),
    el("li", { text: t("help.tip2") }),
    el("li", { text: t("help.tip3") }),
    el("li", { text: t("help.tip4") }),
  ]);

  const demoUsersTitle = el("h3", { class: "help-subtitle", text: t("help.sampleAccounts.title") });
  const demoUsersState = el("p", {
    class: "dashboard-subtitle",
    text: "",
  });
  const demoUsersList = el("ul", { class: "help-list" });
  helpBody.append(helpInstructions, demoUsersTitle, demoUsersState, demoUsersList);
  helpPanel.append(helpHeader, helpBody);

  layout.append(left, right);
  shell.append(header, banner, layout, modalBackdrop, helpButton, helpPanel, tagDataList);
  root.appendChild(shell);

  const modalAccessBadge = modalHeader.querySelector("#task-modal-access");
  let selectedTask = null;
  let hasAttemptedDemoUsersLoad = false;

  function openModal(task) {
    selectedTask = task;
    modalTitleInput.value = task.title || "";
    modalDescriptionInput.value = task.description || "";
    modalDueDateInput.value = task.due_date || "";
    modalTagInput.value = task.tag ? String(task.tag).toUpperCase() : "";
    shareEmailInput.value = "";

    const isShared = task.access === "shared";
    modalAccessBadge.textContent = isShared ? t("task.access.shared") : t("task.access.owned");
    modalAccessBadge.className = `access-pill ${isShared ? "access-pill-shared" : "access-pill-owner"}`;

    modalTitleInput.disabled = isShared;
    modalDescriptionInput.disabled = isShared;
    modalDueDateInput.disabled = isShared;
    modalTagInput.disabled = isShared;

    shareField.style.display = isShared ? "none" : "grid";
    saveButton.style.display = isShared ? "none" : "inline-flex";
    deleteButton.style.display = isShared ? "none" : "inline-flex";
    modalReadOnlyHint.style.display = isShared ? "block" : "none";

    modalBackdrop.classList.remove("task-modal-backdrop-hidden");
  }

  function closeModal() {
    selectedTask = null;
    modalBackdrop.classList.add("task-modal-backdrop-hidden");
  }

  closeButton.addEventListener("click", () => {
    closeModal();
  });

  modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });

  async function loadDemoUsers() {
    demoUsersState.textContent = t("help.sampleAccounts.loading");
    const debugUsersResponse = await apiFetch("/v1/debug/users");
    demoUsersList.innerHTML = "";

    if (!debugUsersResponse.ok) {
      if (debugUsersResponse.status === 404) {
        demoUsersState.textContent = t("help.sampleAccounts.unavailable");
        return;
      }

      demoUsersState.textContent = debugUsersResponse.error.message || t("help.sampleAccounts.unavailable");
      return;
    }

    if (!Array.isArray(debugUsersResponse.data) || debugUsersResponse.data.length === 0) {
      demoUsersState.textContent = t("help.sampleAccounts.empty");
      return;
    }

    demoUsersState.textContent = t("help.sampleAccounts.ready");
    for (const user of debugUsersResponse.data) {
      demoUsersList.appendChild(el("li", { text: `${user.email} (${user.plan})` }));
    }
  }

  function openHelpPanel() {
    helpPanel.classList.remove("help-panel-hidden");
    helpButton.setAttribute("aria-expanded", "true");

    if (!hasAttemptedDemoUsersLoad) {
      hasAttemptedDemoUsersLoad = true;
      void loadDemoUsers();
    }
  }

  function closeHelpPanel() {
    helpPanel.classList.add("help-panel-hidden");
    helpButton.setAttribute("aria-expanded", "false");
  }

  helpButton.addEventListener("click", () => {
    if (helpPanel.classList.contains("help-panel-hidden")) {
      openHelpPanel();
      return;
    }

    closeHelpPanel();
  });

  helpCloseButton.addEventListener("click", () => {
    closeHelpPanel();
  });

  async function loadAccountDetails() {
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

      accountLine.textContent = t("dashboard.account.failed");
      return;
    }

    accountLine.textContent = formatT("dashboard.account.line", {
      email: meResponse.data.email,
      plan: meResponse.data.plan,
    });
  }

  async function loadTasks() {
    const response = await listTasks(apiFetch);
    if (!response.ok) {
      if (shouldOpenForbidden(response)) {
        navigate("/error/forbidden", { replace: true });
        return;
      }
      if (shouldOpenUnexpected(response)) {
        navigate("/error/unexpected", {
          replace: true,
          state: { message: response.error.message },
        });
        return;
      }

      setBanner(banner, { kind: "error", message: response.error.message });
      return;
    }

    setBanner(banner, null);
    listBox.innerHTML = "";

    if (!response.data || response.data.length === 0) {
      listBox.appendChild(el("p", { class: "dashboard-empty", text: t("dashboard.empty") }));
      return;
    }

    for (const task of response.data) {
      const card = renderTaskCard(task, {
        onToggleComplete: async (nextValue) => {
          const patchResponse = await patchTask(apiFetch, task.id, { is_completed: nextValue });
          if (!patchResponse.ok) {
            if (shouldOpenForbidden(patchResponse)) {
              navigate("/error/forbidden", { replace: true });
              return;
            }
            if (shouldOpenUnexpected(patchResponse)) {
              navigate("/error/unexpected", {
                replace: true,
                state: { message: patchResponse.error.message },
              });
              return;
            }

            setBanner(banner, { kind: "error", message: patchResponse.error.message });
            return;
          }

          await loadTasks();
        },
        onOpenDetails: () => {
          openModal(task);
        },
        t,
      });
      listBox.appendChild(card);
    }
  }

  modalForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!selectedTask || selectedTask.access === "shared") {
      return;
    }

    saveButton.disabled = true;
    const patchResponse = await patchTask(apiFetch, selectedTask.id, {
      title: modalTitleInput.value.trim(),
      description: modalDescriptionInput.value.trim() || null,
      due_date: modalDueDateInput.value || null,
      tag: normalizeTag(modalTagInput.value),
    });
    saveButton.disabled = false;

    if (!patchResponse.ok) {
      if (shouldOpenForbidden(patchResponse)) {
        navigate("/error/forbidden", { replace: true });
        return;
      }
      if (shouldOpenUnexpected(patchResponse)) {
        navigate("/error/unexpected", {
          replace: true,
          state: { message: patchResponse.error.message },
        });
        return;
      }

      setBanner(banner, { kind: "error", message: patchResponse.error.message });
      return;
    }

    setBanner(banner, { kind: "success", message: t("task.banner.updated") });
    closeModal();
    await loadTasks();
  });

  deleteButton.addEventListener("click", async () => {
    if (!selectedTask || selectedTask.access === "shared") {
      return;
    }

    const deleteResponse = await deleteTask(apiFetch, selectedTask.id);
    if (!deleteResponse.ok) {
      if (shouldOpenForbidden(deleteResponse)) {
        navigate("/error/forbidden", { replace: true });
        return;
      }
      if (shouldOpenUnexpected(deleteResponse)) {
        navigate("/error/unexpected", {
          replace: true,
          state: { message: deleteResponse.error.message },
        });
        return;
      }

      setBanner(banner, { kind: "error", message: deleteResponse.error.message });
      return;
    }

    setBanner(banner, { kind: "success", message: t("task.banner.deleted") });
    closeModal();
    await loadTasks();
  });

  shareButton.addEventListener("click", async () => {
    if (!selectedTask || selectedTask.access === "shared") {
      return;
    }

    const email = shareEmailInput.value.trim().toLowerCase();
    if (!email) {
      setBanner(banner, { kind: "error", message: t("task.banner.shareNeedEmail") });
      return;
    }

    shareButton.disabled = true;
    const shareResponse = await shareTask(apiFetch, selectedTask.id, email);
    shareButton.disabled = false;

    if (!shareResponse.ok) {
      if (shouldOpenForbidden(shareResponse)) {
        navigate("/error/forbidden", { replace: true });
        return;
      }
      if (shouldOpenUnexpected(shareResponse)) {
        navigate("/error/unexpected", {
          replace: true,
          state: { message: shareResponse.error.message },
        });
        return;
      }

      setBanner(banner, { kind: "error", message: shareResponse.error.message });
      return;
    }

    setBanner(banner, { kind: "success", message: formatT("task.banner.shared", { email }) });
    shareEmailInput.value = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    setBanner(banner, null);

    const createResponse = await createTask(apiFetch, {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      due_date: dueDateInput.value,
      tag: normalizeTag(tagInput.value),
    });

    submitButton.disabled = false;

    if (!createResponse.ok) {
      if (shouldOpenForbidden(createResponse)) {
        navigate("/error/forbidden", { replace: true });
        return;
      }
      if (shouldOpenUnexpected(createResponse)) {
        navigate("/error/unexpected", {
          replace: true,
          state: { message: createResponse.error.message },
        });
        return;
      }

      setBanner(banner, { kind: "error", message: createResponse.error.message });
      return;
    }

    let postCreateBanner = { kind: "success", message: t("task.banner.created") };
    const shareEmail = createShareInput.value.trim().toLowerCase();
    if (shareEmail) {
      const shareAfterCreateResponse = await shareTask(apiFetch, createResponse.data.id, shareEmail);
      if (!shareAfterCreateResponse.ok) {
        if (shouldOpenForbidden(shareAfterCreateResponse)) {
          navigate("/error/forbidden", { replace: true });
          return;
        }
        if (shouldOpenUnexpected(shareAfterCreateResponse)) {
          navigate("/error/unexpected", {
            replace: true,
            state: { message: shareAfterCreateResponse.error.message },
          });
          return;
        }

        postCreateBanner = {
          kind: "warning",
          message: formatT("task.banner.createdShareFailed", {
            message: shareAfterCreateResponse.error.message,
          }),
        };
      } else {
        postCreateBanner = { kind: "success", message: formatT("task.banner.createdShared", { email: shareEmail }) };
      }
    }

    titleInput.value = "";
    descriptionInput.value = "";
    dueDateInput.value = "";
    tagInput.value = "";
    createShareInput.value = "";
    await loadTasks();
    setBanner(banner, postCreateBanner);
  });

  void loadAccountDetails();
  void loadTasks();
}
