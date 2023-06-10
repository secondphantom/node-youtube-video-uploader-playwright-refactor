export const delay = (delayMs: number) => {
  return new Promise((res) => setTimeout(() => res(null), delayMs));
};
