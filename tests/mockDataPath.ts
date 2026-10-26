export function mockDataPath(filename: string) {
  return decodeURIComponent(
    new URL(`./mockData/${filename}`, import.meta.url).pathname,
  );
}
