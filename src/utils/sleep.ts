export const CYCLE_MINUTES = 90
export const CYCLES = [4, 5, 6]

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000)
}

export function subtractMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() - minutes * 60000)
}

export function getIdealWakeUpTimes(bedTime: Date): Date[] {
  // If we go to bed at X, we want to wake up after 4, 5, or 6 cycles.
  // We typically add 15 minutes for falling asleep in real apps,
  // but strictly following the prompt's logic: "allot enough time for 4 to 6 90-minute cycles".
  // I will add the cycles directly.
  return CYCLES.map((cycleCount) => addMinutes(bedTime, cycleCount * CYCLE_MINUTES))
}

export function getIdealBedTimes(wakeUpTime: Date): Date[] {
  // If we want to wake up at X, we should go to bed 4, 5, or 6 cycles BEFORE.
  return CYCLES.map((cycleCount) => subtractMinutes(wakeUpTime, cycleCount * CYCLE_MINUTES))
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
