export const isUndefined = <T>(value: T | undefined): value is undefined =>
  typeof value === "undefined";

export const defined = <T>(value: T | undefined): T => {
  if (isUndefined(value)) throw new Error("undefined");
  return value;
};
