export const numberToUsd = (number: number) => {
  return number.toLocaleString("en-US", { currency: "USD", maximumFractionDigits: 2, minimumFractionDigits: 2 });
};
