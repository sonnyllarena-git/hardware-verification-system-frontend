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

// Type order the compliance breakdown displays in — mirrors the order the old hardcoded list
// used (os, cpu, ram, storage, internet, screen, hardware).
const TYPE_ORDER = ["os", "cpu", "ram", "storage", "internet", "screen", "hardware"];

// Mirrors tcp-hardware-check-api's routes/submit.js checkRequirement() (and direct-submit-rpc.sql's
// equivalent CASE) so the dashboard's displayed PASS/FAIL matches what actually gated the
// applicant's status, using the admin's live Settings values instead of hardcoded thresholds.
function checkRequirement(requirement, specs) {
  const min = requirement.minValue;
  switch (requirement.type) {
    case "os":
      if (requirement.appliesTo === "macos") {
        const minMajor = Number(min.match(/(\d+)/)?.[1] ?? "999");
        const applicantMajor = Number(specs.osVersion?.match(/macOS\s+(\d+)/)?.[1] ?? "-1");
        return applicantMajor >= minMajor;
      }
      // specs.osVersion is "Windows 10 (build N)" / "Windows 11 (build N)" from the extension's
      // getOSLabel(), not a bare "Windows 10" — match the prefix, not the whole string.
      return specs.osVersion?.startsWith("Windows 10") || specs.osVersion?.startsWith("Windows 11");
    case "cpu":
      return specs.cpuCores >= Number(min);
    case "ram":
      return specs.ram >= Number(min);
    case "storage":
      return specs.storageGb >= Number(min);
    case "internet":
      return requirement.name.includes("Down")
        ? specs.internetDown >= Number(min)
        : specs.internetUp >= Number(min);
    case "screen":
      return specs.screenHeight >= Number(min.split("x")[1]);
    case "hardware":
      return requirement.name === "Webcam" ? specs.webcam === true : specs.headset === true;
    default:
      return true;
  }
}

// requirement_name already carries its own units (e.g. "RAM (GB)", "Internet Speed Down
// (Mbps)") from db-schema.sql's seed data, so the min value is appended plainly rather than
// re-adding units — a hardware requirement (Webcam/Headset) has no numeric min to show.
function formatRequirementLabel(requirement) {
  if (requirement.type === "hardware") return requirement.name;
  if (requirement.type === "screen") {
    return `${requirement.name} (min: ${requirement.minValue.split("x")[1]}p)`;
  }
  return `${requirement.name} (min: ${requirement.minValue})`;
}

// Builds the compliance breakdown from the admin's actual configured requirements (Settings
// page) rather than a hardcoded list, so e.g. a macOS applicant is checked and labeled against
// "macOS 12" while a Windows one sees "Windows 10" — whatever is currently configured.
export function buildComplianceBreakdown(requirements, specs) {
  const osFamily = (specs.osVersion ?? "").startsWith("macOS") ? "macos" : "windows";
  const applicable = requirements
    .filter((r) => r.appliesTo === osFamily)
    .sort((a, b) => {
      const orderDiff = TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
      if (orderDiff !== 0) return orderDiff;
      if (a.type === "internet") return a.name.includes("Down") ? -1 : 1;
      if (a.type === "hardware") return a.name === "Webcam" ? -1 : 1;
      return 0;
    });

  return applicable.map((requirement) => ({
    key: requirement.id,
    label: formatRequirementLabel(requirement),
    passed: checkRequirement(requirement, specs),
  }));
}

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
