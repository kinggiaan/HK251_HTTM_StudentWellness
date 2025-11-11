import dayjs from 'dayjs';

type DurationUnit = 's' | 'm' | 'h' | 'd' | 'w';

const UNIT_TO_DAYJS: Record<DurationUnit, dayjs.ManipulateType> = {
  s: 'second',
  m: 'minute',
  h: 'hour',
  d: 'day',
  w: 'week'
};

export function addDurationToNow(duration: string): Date {
  const match = duration.trim().match(/^(\d+)([smhdw])$/i);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }
  const value = Number(match[1]);
  const unit = match[2].toLowerCase() as DurationUnit;
  return dayjs().add(value, UNIT_TO_DAYJS[unit]).toDate();
}

export function durationToSeconds(duration: string): number {
  const match = duration.trim().match(/^(\d+)([smhdw])$/i);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }
  const value = Number(match[1]);
  const unit = match[2].toLowerCase() as DurationUnit;

  const unitSeconds: Record<DurationUnit, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800
  };

  return value * unitSeconds[unit];
}

