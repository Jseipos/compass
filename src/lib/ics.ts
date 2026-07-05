// Generate .ics calendar file for daily journaling reminder
// No backend needed — user downloads file and imports to their calendar app

export function generateICSFile(
  hour: number,
  minute: number,
  timezone: string = "America/New_York"
): string {
  const now = new Date();
  // Start tomorrow at the specified time
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(hour, minute, 0, 0);

  // Format as YYYYMMDDTHHMMSS (local time, no Z)
  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear().toString();
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    const hh = d.getHours().toString().padStart(2, "0");
    const min = d.getMinutes().toString().padStart(2, "0");
    return `${yyyy}${mm}${dd}T${hh}${min}00`;
  };

  const dtStart = formatDate(startDate);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Compass//Journaling Reminder//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:compass-reminder-${Date.now()}@compass-journal.app`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${dtStart}`,
    "DURATION:PT15M",
    "RRULE:FREQ=DAILY",
    "SUMMARY:Journal with Compass",
    "DESCRIPTION:Take a few minutes to check in with yourself. Open Compass and write.",
    "BEGIN:VALARM",
    "TRIGGER:-PT0M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Time to journal",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICSFile(hour: number, minute: number) {
  const icsContent = generateICSFile(hour, minute);
  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "compass-journal-reminder.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
