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

export const MOCK_RESULTS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "PASS",
    submittedDate: "2026-08-31",
    osFamily: "windows",
    specs: {
      osVersion: "Windows 11",
      cpuCores: 8,
      ram: 16,
      storageGb: 512,
      internetDown: 42,
      internetUp: 12,
      screenResolution: "1920x1080",
      screenHeight: 1080,
      webcam: true,
      headset: true,
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "FAIL",
    submittedDate: "2026-08-31",
    osFamily: "windows",
    specs: {
      osVersion: "Windows 10",
      cpuCores: 2,
      ram: 4,
      storageGb: 128,
      internetDown: 8,
      internetUp: 2,
      screenResolution: "1280x720",
      screenHeight: 720,
      webcam: false,
      headset: true,
    },
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    status: "PASS",
    submittedDate: "2026-08-30",
    osFamily: "macos",
    specs: {
      osVersion: "macOS 14",
      cpuCores: 6,
      ram: 16,
      storageGb: 256,
      internetDown: 25,
      internetUp: 8,
      screenResolution: "1920x1080",
      screenHeight: 1080,
      webcam: true,
      headset: true,
    },
  },
  {
    id: 4,
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    status: "FAIL",
    submittedDate: "2026-08-30",
    osFamily: "windows",
    specs: {
      osVersion: "Windows 10",
      cpuCores: 4,
      ram: 8,
      storageGb: 256,
      internetDown: 10,
      internetUp: 5,
      screenResolution: "1366x768",
      screenHeight: 768,
      webcam: true,
      headset: false,
    },
  },
  {
    id: 5,
    name: "Alex Chen",
    email: "alex.chen@example.com",
    status: "PASS",
    submittedDate: "2026-08-29",
    osFamily: "macos",
    specs: {
      osVersion: "macOS 13",
      cpuCores: 8,
      ram: 32,
      storageGb: 1024,
      internetDown: 100,
      internetUp: 20,
      screenResolution: "2560x1440",
      screenHeight: 1440,
      webcam: true,
      headset: true,
    },
  },
  {
    id: 6,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    status: "PENDING",
    submittedDate: null,
    osFamily: null,
    specs: null,
  },
  {
    id: 7,
    name: "Tom Nguyen",
    email: "tom.nguyen@example.com",
    status: "PENDING",
    submittedDate: null,
    osFamily: null,
    specs: null,
  },
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
