import apiClient from "./apiClient";

export async function listUsers() {
  try {
    const { data } = await apiClient.get("/users");
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to fetch users");
  }
}

export async function createUser({ username, role, temporaryPassword }) {
  try {
    const { data } = await apiClient.post("/users", { username, role, temporaryPassword });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to create user");
  }
}

export async function updateUser(id, { username, role }) {
  try {
    const { data } = await apiClient.put(`/users/${id}`, { username, role });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to update user");
  }
}

export async function resetUserPassword(id, temporaryPassword) {
  try {
    const { data } = await apiClient.post(`/users/${id}/reset-password`, { temporaryPassword });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to reset password");
  }
}

export async function deleteUser(id) {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to delete user");
  }
}
