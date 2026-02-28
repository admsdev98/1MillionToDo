const STORAGE_KEY = "todo.jwt";

export const authStore = {
  getToken() {
    return localStorage.getItem(STORAGE_KEY);
  },
  setToken(token) {
    localStorage.setItem(STORAGE_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
