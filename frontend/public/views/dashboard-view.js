import { el } from "./ui.js";
import { listTasks, createTask, patchTask } from "../features/tasks/tasks-api.js";
import { renderTaskCard } from "../features/tasks/task-card.js";

export function renderDashboardView(root, { apiFetch, setBanner }) {
  root.innerHTML = "";
  const container = el("div", { class: "content fade-in" });

  const title = el("h1", { class: "title", text: "Dashboard" });
  const subtitle = el("div", { class: "muted", text: "Owned tasks are editable; shared tasks are read-only." });

  const layout = el("div", { class: "grid" });

  const left = el("div", {});
  const right = el("div", {});

  const listTitle = el("h2", { class: "title", text: "Tasks" });
  listTitle.style.fontSize = "16px";
  const listBox = el("div", { class: "task-list" });
  left.append(listTitle, listBox);

  const formTitle = el("h2", { class: "title", text: "New task" });
  formTitle.style.fontSize = "16px";
  const form = el("form", { class: "field" });

  const titleLabel = el("label", { for: "new-title", text: "Title" });
  const titleInput = el("input", { id: "new-title", name: "title", required: "true", maxlength: "200" });

  const descLabel = el("label", { for: "new-desc", text: "Description (optional)" });
  const descInput = el("input", { id: "new-desc", name: "description", maxlength: "4000" });

  const actions = el("div", { class: "row" });
  const submit = el("button", { class: "btn primary", type: "submit", text: "Create" });
  actions.append(submit);

  form.append(titleLabel, titleInput, descLabel, descInput, actions);
  right.append(formTitle, form);
  layout.append(left, right);

  async function refresh() {
    const response = await listTasks(apiFetch);
    if (!response.ok) {
      setBanner("error", `${response.error.code}: ${response.error.message}`);
      return;
    }

    listBox.innerHTML = "";
    const tasks = response.data || [];
    if (tasks.length === 0) {
      listBox.appendChild(el("div", { class: "muted", text: "No tasks yet." }));
      return;
    }

    for (const task of tasks) {
      const card = renderTaskCard(task, {
        onToggleComplete: async (nextValue) => {
          setBanner(null, null);
          const patchResponse = await patchTask(apiFetch, task.id, { is_completed: nextValue });
          if (!patchResponse.ok) {
            setBanner("error", `${patchResponse.error.code}: ${patchResponse.error.message}`);
            await refresh();
            return;
          }
          await refresh();
        },
      });
      listBox.appendChild(card);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setBanner(null, null);
    submit.disabled = true;

    const createResponse = await createTask(apiFetch, {
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
    });

    submit.disabled = false;

    if (!createResponse.ok) {
      setBanner("error", `${createResponse.error.code}: ${createResponse.error.message}`);
      return;
    }

    titleInput.value = "";
    descInput.value = "";
    await refresh();
  });

  container.append(title, subtitle, layout);
  root.appendChild(container);

  void refresh();
}
