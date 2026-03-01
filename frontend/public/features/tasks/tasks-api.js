export async function listTasks(apiFetch, filters = null) {
  if (!filters) {
    return apiFetch("/v1/tasks");
  }

  const params = new URLSearchParams();
  if (filters.due_from) {
    params.set("due_from", filters.due_from);
  }
  if (filters.due_to) {
    params.set("due_to", filters.due_to);
  }

  const query = params.toString();
  const path = query ? `/v1/tasks?${query}` : "/v1/tasks";
  return apiFetch(path);
}

export async function createTask(apiFetch, { title, description, due_date, tag }) {
  return apiFetch("/v1/tasks", {
    method: "POST",
    body: JSON.stringify({
      title,
      description: description || null,
      due_date: due_date || null,
      tag: tag || null,
    }),
  });
}

export async function patchTask(apiFetch, taskId, patch) {
  return apiFetch(`/v1/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteTask(apiFetch, taskId) {
  return apiFetch(`/v1/tasks/${taskId}`, {
    method: "DELETE",
  });
}

export async function shareTask(apiFetch, taskId, email) {
  return apiFetch(`/v1/tasks/${taskId}/share`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
