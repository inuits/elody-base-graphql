
// Generated with ChatGPT 10/10/2025 14:30 - This script will handle the decoding of the jelly binaries
// @ts-ignore
import protobuf from "../vendor/protobuf"; // adjust path if needed

export async function decodeJellyToTriples(arrayBuffer: ArrayBuffer): Promise<{ s: string, p: string, o: string | number }[]> {
  // load the proto definitions
  const root = await protobuf.load([
    "./proto/rdf.proto",
    "./proto/stream.proto"
  ]);

  const EntityStream = root.lookupType("jelly.stream.EntityStream");

  const message = EntityStream.decode(new Uint8Array(arrayBuffer));
  const obj = EntityStream.toObject(message, { defaults: true });

  const triples: { s: string, p: string, o: string | number }[] = [];

  // obj.entities is usually the top-level container for triples
  if (obj.entities && Array.isArray(obj.entities)) {
    for (const entity of obj.entities) {
      const subject = entity.id || entity.uri;

      if (!subject) continue;

      // entity.properties is an object with predicate -> values
      for (const [pred, values] of Object.entries(entity.properties || {})) {
        for (const val of values as any[]) {
          // simple mode: convert literal numbers to JS numbers, else string
          let o: string | number = val.value;
          if (val.datatype === "xsd:decimal" || val.datatype === "xsd:integer") {
            o = Number(val.value);
          }
          triples.push({ s: subject, p: pred, o });
        }
      }
    }
  }

  return triples;
}
