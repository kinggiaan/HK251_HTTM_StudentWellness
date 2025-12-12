/**
 * Parse sleep duration string to numeric hours
 * Handles formats like: "5-6 hours", "Less than 5 hours", "More than 8 hours"
 */
export function parseSleepHours(sleepDuration: string | number): number {
  // If already a number, return it
  if (typeof sleepDuration === 'number') return sleepDuration;
  
  if (!sleepDuration) return 7;
  
  const lowerDuration = sleepDuration.toLowerCase().replace(/'/g, '');
  
  if (lowerDuration.includes('less than 5')) return 4;
  if (lowerDuration.includes('5-6')) return 5.5;
  if (lowerDuration.includes('7-8')) return 7.5;
  if (lowerDuration.includes('more than 8')) return 9;
  
  // Try to extract number from string
  const match = sleepDuration.match(/(\d+)/);
  return match ? parseInt(match[1]) : 7;
}
