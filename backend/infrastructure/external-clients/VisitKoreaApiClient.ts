export class VisitKoreaApiClient {
  async get<T>(endpoint: string, params: Record<string, string | number>): Promise<T> {
    const url = new URL(`https://apis.data.go.kr${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}
