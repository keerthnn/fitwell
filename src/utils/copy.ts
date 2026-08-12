export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
) {
  return count === 1 ? singular : plural;
}

export function formatCount(
  count: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${count} ${pluralize(count, singular, plural)}`;
}

export function formatDaysPerWeek(days: number) {
  return `${formatCount(days, "day")}/week`;
}
