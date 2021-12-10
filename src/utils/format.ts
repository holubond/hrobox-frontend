const zeroed = (n: number): string => {
  if (n < 10) {
    return `0${n}`;
  }
  return `${n}`;
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()} ${date.getHours()}:${zeroed(date.getMinutes())}:${zeroed(date.getSeconds())}`;
};

export const formatTimestampShort = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
};

export const formatNrOfPlayers = (v: { min: number, max: number }): string => {
  if (v.min === v.max) {
    return `${v.min}`;
  }
  return `${v.min}-${v.max}`;
};
