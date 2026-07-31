// export async function fetchWithTimeout(
//   url: string,
//   options: RequestInit = {},
//   timeout = 5000
// ) {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeout);
//   try {
//     const res = await fetch(url, { ...options, signal: controller.signal });
//     return res;
//   } finally {
//     clearTimeout(id);
//   }
// }
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 5000,
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(`[TIMEOUT] ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}
