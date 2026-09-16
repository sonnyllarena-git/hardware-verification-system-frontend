import apiClient from "./apiClient";
import { parseDbTimestamp } from "../utils/dateTime";

export async function fetchResults() {
  const { data } = await apiClient.get("/results");
  return data;
}

export async function deleteResult(id) {
  try {
    await apiClient.delete(`/results/${id}`);
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to delete result");
  }
}

// Type order the compliance breakdown displays in — mirrors the order the old hardcoded list
// used (os, cpu, ram, storage, internet, screen, hardware).
const TYPE_ORDER = ["os", "cpu", "ram", "storage", "internet", "screen", "hardware"];

// Major version numbers for the only 3 macOS releases HR currently allows: Sonoma (14),
// Sequoia (15), Tahoe (26 — Apple switched to year-based numbering in 2025, so this isn't 16).
const APPROVED_MACOS_MAJORS = [14, 15, 26];

// Any Mac (Apple Silicon or Intel) is approved purely by being on one of those 3 OS versions —
// chip family doesn't matter for Mac. Windows instead gates on CPU family: Intel Core i5/i7/i9
// or AMD Ryzen 3/5/7/9. Core count isn't part of this gate either way. Duplicated (by hand) in
// tcp-hardware-check-api's routes/submit.js and direct-submit-rpc.sql — see those files' own
// copies.
function isApprovedCpu(specs) {
  if ((specs.osVersion ?? "").startsWith("macOS")) {
    const macMajor = Number(specs.osVersion?.match(/macOS\s+(\d+)/)?.[1] ?? "-1");
    return APPROVED_MACOS_MAJORS.includes(macMajor);
  }

  const model = (specs.cpuModel ?? "").toLowerCase();
  return /\bi[579]\b/.test(model) || /ryzen\s*[3579]\b/.test(model);
}

// Mirrors tcp-hardware-check-api's routes/submit.js checkRequirement() (and direct-submit-rpc.sql's
// equivalent CASE) so the dashboard's displayed PASS/FAIL matches what actually gated the
// applicant's status, using the admin's live Settings values instead of hardcoded thresholds.
function checkRequirement(requirement, specs) {
  const min = requirement.minValue;
  switch (requirement.type) {
    case "os": {
      // min is like "macOS 12" / "Windows 11"; specs.osVersion is like "macOS 14.6.2" or
      // "Windows 10 (build N)" (see the extension's getOSLabel()) — compare major version
      // numerically, fail closed if either isn't parseable. This used to special-case Windows
      // as "is it 10 or 11 at all", which ignored the configured minimum entirely — a
      // "Windows 11" minimum let a Windows 10 machine through, since 10 or 11 both satisfied
      // that check.
      const osLabel = requirement.appliesTo === "macos" ? "macOS" : "Windows";
      const minMajor = Number(min.match(/(\d+)/)?.[1] ?? "999");
      const applicantMajor = Number(
        specs.osVersion?.match(new RegExp(`${osLabel}\\s+(\\d+)`))?.[1] ?? "-1",
      );
      return applicantMajor >= minMajor;
    }
    case "cpu":
      return isApprovedCpu(specs);
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
  if (requirement.type === "cpu") {
    return requirement.appliesTo === "macos"
      ? `${requirement.name} (macOS Sonoma, Sequoia, or Tahoe)`
      : `${requirement.name} (Intel i5/i7/i9 or AMD Ryzen 3/5/7/9)`;
  }
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
  // A requirement toggled "Required: No" doesn't gate pass/fail (see routes/submit.js and
  // direct-submit-rpc.sql) — excluded here too so this breakdown matches what actually decided
  // the applicant's PASS/FAIL, instead of showing a check that looks decisive but wasn't.
  const applicable = requirements
    .filter((r) => r.appliesTo === osFamily && r.required)
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

// The dashboard's other stats (Total/Pass/Fail/Windows/Macbook) already read straight from
// results — the trend chart is bucketed here on the same Eastern calendar the rest of the app
// displays times in (see dateTime.js's own comment on this), so "today"/"this week" match what
// a viewer actually sees on result timestamps rather than drifting with their local timezone.
const EASTERN_TZ = "America/New_York";
const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_LABEL_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const MONTH_LABEL_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

function easternDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

// Represents an Eastern calendar date as a UTC-midnight timestamp — every bucket below only
// ever compares/labels calendar dates, never real instants, so this keeps the day-math (adding
// or subtracting whole days) simple and immune to DST shifts.
function easternDateKey(date) {
  const { year, month, day } = easternDateParts(date);
  return Date.UTC(year, month - 1, day);
}

// PENDING results have no submittedDate and never contributed a PASS/FAIL, so they're excluded
// before bucketing rather than silently falling out of every date comparison below.
function submittedPassFailDates(results) {
  return results
    .filter((r) => r.status === "PASS" || r.status === "FAIL")
    .map((r) => ({ status: r.status, date: parseDbTimestamp(r.submittedDate) }))
    .filter((r) => r.date !== null);
}

function tallyIntoBuckets(dated, buckets, keyFor) {
  const byKey = new Map(buckets.map((b) => [b.key, b]));
  for (const { status, date } of dated) {
    const bucket = byKey.get(keyFor(date));
    if (bucket) bucket[status === "PASS" ? "pass" : "fail"] += 1;
  }
  return buckets.map(({ label, pass, fail }) => ({ label, pass, fail }));
}

export function buildDailyBreakdown(results, days = 7) {
  const todayKey = easternDateKey(new Date());
  const buckets = Array.from({ length: days }, (_, i) => {
    const key = todayKey - (days - 1 - i) * DAY_MS;
    return { key, label: DAY_LABEL_FORMAT.format(key), pass: 0, fail: 0 };
  });
  return tallyIntoBuckets(submittedPassFailDates(results), buckets, easternDateKey);
}

export function buildWeeklyBreakdown(results, weeks = 4) {
  const todayKey = easternDateKey(new Date());
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const weeksAgo = weeks - 1 - i;
    const start = todayKey - (weeksAgo * 7 + 6) * DAY_MS;
    return { key: start, label: DAY_LABEL_FORMAT.format(start), pass: 0, fail: 0 };
  });
  // A week "key" is its start date; a result belongs to the last bucket whose start it's on or
  // after, so this walks buckets oldest-to-newest and keeps the latest match. Dates outside the
  // whole displayed window (older than the first bucket, or somehow after today) match nothing,
  // rather than spilling into the oldest/newest bucket.
  const keyFor = (date) => {
    const day = easternDateKey(date);
    if (day < buckets[0].key || day > todayKey) return null;
    let match = buckets[0].key;
    for (const bucket of buckets) {
      if (day >= bucket.key) match = bucket.key;
    }
    return match;
  };
  return tallyIntoBuckets(submittedPassFailDates(results), buckets, keyFor);
}

export function buildMonthlyBreakdown(results, months = 6) {
  const { year, month } = easternDateParts(new Date());
  const currentMonthIndex = year * 12 + (month - 1);
  const buckets = Array.from({ length: months }, (_, i) => {
    const monthIndex = currentMonthIndex - (months - 1 - i);
    const key = Date.UTC(Math.floor(monthIndex / 12), ((monthIndex % 12) + 12) % 12, 1);
    return { key, label: MONTH_LABEL_FORMAT.format(key), pass: 0, fail: 0 };
  });
  const keyFor = (date) => {
    const { year: y, month: m } = easternDateParts(date);
    return Date.UTC(y, m - 1, 1);
  };
  return tallyIntoBuckets(submittedPassFailDates(results), buckets, keyFor);
}
