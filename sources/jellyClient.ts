// jellyClient.ts
import { AuthRESTDataSource } from "main";
import { CollectionAPI } from "./collection";
import { decodeJellyToTriples } from "./jellyDecoder";

export async function getAllTriples(jellyUrl: string): Promise<{ s: string, p: string, o: string | number }[]> {
  const response = await this.get(jellyUrl, {
    method: "GET",
    headers: { "Accept": "application/octet-stream" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Jelly stream: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();

  // decode Jelly binaries
  const triples = await decodeJellyToTriples(arrayBuffer);
  return triples;
}
