export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.getDay()}. ${date.getMonth()}. ${date.getFullYear()} ${date.getSeconds()}:${date.getMinutes()}:${date.getHours()}`;
};

export const formatTimestampShort = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.getDay()}. ${date.getMonth()}. ${date.getFullYear()}`;
};

export const formatNrOfPlayers = (v: { min: number, max: number }): string => {
  if (v.min === v.max) {
    return `${v.min}`;
  }
  return `${v.min}-${v.max}`;
};
