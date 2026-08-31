export const MOCK_RESULTS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "PASS",
    submittedDate: "2026-08-31",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "FAIL",
    submittedDate: "2026-08-31",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@example.com",
    status: "PASS",
    submittedDate: "2026-08-30",
  },
  {
    id: 4,
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    status: "FAIL",
    submittedDate: "2026-08-30",
  },
  {
    id: 5,
    name: "Alex Chen",
    email: "alex.chen@example.com",
    status: "PASS",
    submittedDate: "2026-08-29",
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
