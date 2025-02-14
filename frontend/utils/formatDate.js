export const formatDate = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;

  // Convert milliseconds to different time units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  // Return shortened relative time string
  if (years > 0) {
    return `${years}y ago`;
  } else if (months > 0) {
    return `${months}mo ago`;
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else if (seconds > 0) {
    return `${seconds}s ago`;
  } else {
    return "now";
  }
};

// Example usage:
// formatDate("2024-02-06T05:17:14.217Z")
// Output: "2h ago" or "3d ago" etc.
