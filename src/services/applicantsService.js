import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function generateApiKey({ name, email }) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/applicants/generate-key`, { name, email });
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to generate API key");
  }
}
