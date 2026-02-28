export async function listTasks(apiFetch) {
  return apiFetch("/v1/tasks");
}

export async function createTask(apiFetch, { title, description }) {
  return apiFetch("/v1/tasks", {
    method: "POST",
    body: JSON.stringify({ title, description: description || null }),
  });
}

export async function patchTask(apiFetch, taskId, patch) {
  return apiFetch(`/v1/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}
