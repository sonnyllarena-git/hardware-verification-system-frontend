import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchResults() {
  const { data } = await axios.get(`${API_BASE_URL}/results`);
  return data;
}

export async function deleteResult(id) {
  try {
    await axios.delete(`${API_BASE_URL}/results/${id}`);
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to delete result");
  }
}

export const COMPLIANCE_REQUIREMENTS = [
  {
    key: "osVersion",
    label: "OS Version",
    check: (specs) => {
      const version = specs.osVersion ?? "";
      if (version.startsWith("macOS")) {
        return parseFloat(version.replace("macOS ", "")) >= 12;
      }
      return version === "Windows 11" || version === "Windows 10";
    },
  },
  { key: "cpuCores", label: "CPU Cores (4+)", check: (specs) => specs.cpuCores >= 4 },
  { key: "ram", label: "RAM (8GB+)", check: (specs) => specs.ram >= 8 },
  { key: "storageGb", label: "Storage (256GB+)", check: (specs) => specs.storageGb >= 256 },
  {
    key: "internetDown",
    label: "Internet Down (15 Mbps+)",
    check: (specs) => specs.internetDown >= 15,
  },
  { key: "internetUp", label: "Internet Up (5 Mbps+)", check: (specs) => specs.internetUp >= 5 },
  { key: "screenResolution", label: "Screen (720p+)", check: (specs) => specs.screenHeight >= 720 },
  { key: "webcam", label: "Webcam", check: (specs) => specs.webcam === true },
  { key: "headset", label: "Headset", check: (specs) => specs.headset === true },
];

export const DAILY_BREAKDOWN = [
  { label: "Mon", pass: 8, fail: 2 },
  { label: "Tue", pass: 10, fail: 1 },
  { label: "Wed", pass: 6, fail: 3 },
  { label: "Thu", pass: 12, fail: 2 },
  { label: "Fri", pass: 9, fail: 4 },
  { label: "Sat", pass: 3, fail: 1 },
  { label: "Sun", pass: 2, fail: 0 },
];

export const WEEKLY_BREAKDOWN = [
  { label: "Week 1", pass: 40, fail: 10 },
  { label: "Week 2", pass: 35, fail: 8 },
  { label: "Week 3", pass: 50, fail: 12 },
  { label: "Week 4", pass: 45, fail: 9 },
];

export const MONTHLY_BREAKDOWN = [
  { label: "May", pass: 150, fail: 30 },
  { label: "Jun", pass: 170, fail: 25 },
  { label: "Jul", pass: 160, fail: 40 },
  { label: "Aug", pass: 190, fail: 35 },
];
