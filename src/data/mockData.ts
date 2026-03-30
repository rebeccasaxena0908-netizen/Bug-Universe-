export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Status = "Open" | "In Progress" | "Resolved" | "Verified" | "Closed";
export type Tag = "UI" | "Backend" | "Security" | "Performance";
export type Role = "Admin" | "Developer" | "Reviewer";

export interface BugItem {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  assignee: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
}

export interface Developer {
  name: string;
  avatar: string;
  bugsFixed: number;
  bugsAssigned: number;
  avgResolutionHours: number;
}

export const developers: Developer[] = [
  { name: "Alice Chen", avatar: "AC", bugsFixed: 47, bugsAssigned: 5, avgResolutionHours: 4.2 },
  { name: "Bob Kumar", avatar: "BK", bugsFixed: 38, bugsAssigned: 8, avgResolutionHours: 6.1 },
  { name: "Carol Díaz", avatar: "CD", bugsFixed: 35, bugsAssigned: 3, avgResolutionHours: 3.8 },
  { name: "Dan Park", avatar: "DP", bugsFixed: 29, bugsAssigned: 7, avgResolutionHours: 5.5 },
  { name: "Eve Nakamura", avatar: "EN", bugsFixed: 24, bugsAssigned: 4, avgResolutionHours: 7.0 },
];

export const bugs: BugItem[] = [
  { id: 101, title: "App crashes on login with SSO", description: "The application crashes with a null pointer exception when users attempt to log in using SSO. Stack trace indicates issue in auth middleware.", severity: "Critical", status: "Open", assignee: "Alice Chen", tags: ["Security", "Backend"], createdAt: "2026-03-28T10:00:00Z", updatedAt: "2026-03-29T14:30:00Z", comments: [{ id: 1, author: "Bob Kumar", text: "I can reproduce this on staging. The OAuth token is null when the redirect happens.", timestamp: "2026-03-28T11:00:00Z", replies: [{ id: 2, author: "Alice Chen", text: "Thanks Bob, I'll check the token refresh logic.", timestamp: "2026-03-28T11:30:00Z" }] }] },
  { id: 102, title: "Dashboard chart rendering slow", description: "The line chart on the dashboard takes over 5 seconds to render with large datasets.", severity: "High", status: "In Progress", assignee: "Bob Kumar", tags: ["Performance", "UI"], createdAt: "2026-03-27T08:00:00Z", updatedAt: "2026-03-29T09:00:00Z", comments: [] },
  { id: 103, title: "Button text misaligned on mobile", description: "Primary action button text is cut off on smaller screen sizes.", severity: "Medium", status: "Resolved", assignee: "Carol Díaz", tags: ["UI"], createdAt: "2026-03-25T14:00:00Z", updatedAt: "2026-03-28T16:00:00Z", comments: [] },
  { id: 104, title: "SQL injection in search endpoint", description: "The /api/search endpoint is vulnerable to SQL injection through the 'q' parameter.", severity: "Critical", status: "In Progress", assignee: "Alice Chen", tags: ["Security", "Backend"], createdAt: "2026-03-26T09:00:00Z", updatedAt: "2026-03-29T12:00:00Z", comments: [{ id: 3, author: "Dan Park", text: "Confirmed using sqlmap. We need parameterized queries.", timestamp: "2026-03-26T10:00:00Z" }] },
  { id: 105, title: "Memory leak in WebSocket handler", description: "WebSocket connections are not being properly cleaned up, causing memory to grow over time.", severity: "High", status: "Open", assignee: "Dan Park", tags: ["Backend", "Performance"], createdAt: "2026-03-24T11:00:00Z", updatedAt: "2026-03-28T15:00:00Z", comments: [] },
  { id: 106, title: "Tooltip flickers on hover", description: "Tooltips on the sidebar flicker when hovering quickly.", severity: "Low", status: "Open", assignee: "Eve Nakamura", tags: ["UI"], createdAt: "2026-03-29T07:00:00Z", updatedAt: "2026-03-29T07:00:00Z", comments: [] },
  { id: 107, title: "API rate limiting not enforced", description: "The rate limiter middleware is bypassed when requests come from internal IPs.", severity: "High", status: "Verified", assignee: "Carol Díaz", tags: ["Security", "Backend"], createdAt: "2026-03-22T13:00:00Z", updatedAt: "2026-03-27T10:00:00Z", comments: [] },
  { id: 108, title: "Dark mode toggle breaks layout", description: "Switching themes causes a brief layout shift on the settings page.", severity: "Medium", status: "Closed", assignee: "Bob Kumar", tags: ["UI"], createdAt: "2026-03-20T09:00:00Z", updatedAt: "2026-03-25T11:00:00Z", comments: [] },
  { id: 109, title: "File upload fails for >10MB", description: "Large file uploads timeout without an error message.", severity: "Medium", status: "Open", assignee: "Dan Park", tags: ["Backend"], createdAt: "2026-03-28T16:00:00Z", updatedAt: "2026-03-29T08:00:00Z", comments: [] },
  { id: 110, title: "Notification badge count incorrect", description: "The unread notification count doesn't update in real-time.", severity: "Low", status: "In Progress", assignee: "Eve Nakamura", tags: ["UI", "Backend"], createdAt: "2026-03-27T10:00:00Z", updatedAt: "2026-03-29T11:00:00Z", comments: [] },
];

export const activityFeed = [
  { action: "Bug #102 moved to In Progress", user: "Bob Kumar", time: "2 hours ago" },
  { action: "Bug #103 resolved", user: "Carol Díaz", time: "5 hours ago" },
  { action: "Bug #104 comment added", user: "Dan Park", time: "8 hours ago" },
  { action: "Bug #107 verified", user: "Carol Díaz", time: "1 day ago" },
  { action: "Bug #108 closed", user: "Bob Kumar", time: "2 days ago" },
  { action: "Bug #101 created", user: "Alice Chen", time: "2 days ago" },
];

export const bugTrendData = [
  { week: "W1", opened: 12, resolved: 8 },
  { week: "W2", opened: 15, resolved: 14 },
  { week: "W3", opened: 8, resolved: 11 },
  { week: "W4", opened: 18, resolved: 16 },
  { week: "W5", opened: 10, resolved: 13 },
  { week: "W6", opened: 14, resolved: 12 },
];
