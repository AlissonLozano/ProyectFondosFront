/* eslint @typescript-eslint/no-explicit-any: "off" */
type TypingMethod = "GET" | "POST" | "PUT" | "DELETE";

export const fetchApp = async (
  url: string,
  method: TypingMethod,
  params: { [key: string]: any } = {},
  body: { [key: string]: unknown } = {},
  timeout: number = 60000
) => {
  if (!["GET", "POST", "PUT", "DELETE"].includes(method)) {
    throw new Error("Method not suported");
  }

  let urlCompleto = url;

  if (method === "GET" || method === "PUT") {
    if (Object.keys(params).length > 0) {
      const queries = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      urlCompleto += `?${queries}`;
    }
  }

  const fetchOptions: { [key: string]: any } = {
    method: method,
  };

  fetchOptions.headers = {};

  if (method === "POST" || method === "PUT") {
    fetchOptions.headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(body);
  }

  async function fetchWithTimeout(
    resource: string,
    options: { [key: string]: unknown },
    timeout: number
  ) {
    const abortController = new AbortController();
    const id = setTimeout(() => abortController.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: abortController.signal,
    });
    clearTimeout(id);
    return response;
  }

  const response = await fetchWithTimeout(urlCompleto, fetchOptions, timeout);
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const json = await response.json();
    return json;
  }
};

export default fetchApp;
