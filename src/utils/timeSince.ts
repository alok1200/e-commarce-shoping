function timeSince(timestamp: string): string | undefined {
  const time = Date.parse(timestamp);
  const now = Date.now();
  const secondsPast = (now - time) / 1000;
  const suffix = "ago";

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const i in intervals) {
    const interval = intervals[i];
    if (secondsPast >= interval) {
      const count = Math.floor(secondsPast / interval);
      return `${count} ${i}${count > 1 ? "s" : ""} ${suffix}`;
    }
  }

  // If the time is in the future or just now, you can return something
  return "just now";
}

export default timeSince;
