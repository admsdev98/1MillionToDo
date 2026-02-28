export async function listTasks(apiFetch) {
  return apiFetch("/v1/tasks");
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
