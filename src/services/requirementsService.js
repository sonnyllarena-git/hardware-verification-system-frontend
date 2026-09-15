import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY;

// Sent only on writes (add/edit/delete) — the backend's requireAdmin middleware checks this
// against its own ADMIN_API_KEY. Reads (fetchRequirements) stay unauthenticated, same as every
// other GET in this app.
const ADMIN_HEADERS = { headers: { Authorization: `Bearer ${ADMIN_API_KEY}` } };

export async function fetchRequirements() {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/compliance-requirements`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to fetch requirements");
  }
}

export async function createRequirement(requirement) {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/compliance-requirements`,
      requirement,
      ADMIN_HEADERS,
    );
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to create requirement");
  }
}

export async function updateRequirement(id, requirement) {
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/compliance-requirements/${id}`,
      requirement,
      ADMIN_HEADERS,
    );
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to update requirement");
  }
}

export async function deleteRequirement(id) {
  try {
    await axios.delete(`${API_BASE_URL}/compliance-requirements/${id}`, ADMIN_HEADERS);
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to delete requirement");
  }
}
