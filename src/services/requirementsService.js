import apiClient from "./apiClient";

// Writes used to send a static ADMIN_API_KEY bearer token (see git history) — now that real
// per-user sessions exist, apiClient attaches the logged-in admin's JWT instead, and the API's
// requireAdmin middleware checks its role.
export async function fetchRequirements() {
  try {
    const { data } = await apiClient.get("/compliance-requirements");
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to fetch requirements");
  }
}

export async function createRequirement(requirement) {
  try {
    const { data } = await apiClient.post("/compliance-requirements", requirement);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to create requirement");
  }
}

export async function updateRequirement(id, requirement) {
  try {
    const { data } = await apiClient.put(`/compliance-requirements/${id}`, requirement);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to update requirement");
  }
}

export async function deleteRequirement(id) {
  try {
    await apiClient.delete(`/compliance-requirements/${id}`);
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to delete requirement");
  }
}
