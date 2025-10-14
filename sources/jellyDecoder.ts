// Generated with ChatGPT 10/10/2025 14:30 - This script will handle the decoding of the jelly binaries
// @ts-ignore
import protobuf from 'protobufjs';
import { DataFactory, Quad } from 'n3';
const { namedNode, literal } = DataFactory;

export async function decodeJellyToTriples(reader: any): Promise<void> {
  // load the proto definitions
  const root = await protobuf.load('node_modules/base-graphql/jelly/rdf.proto');

  const Frame = root.lookupType(
    'eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame'
  );

  const frame = Frame.decodeDelimited(reader) as any;

  // 4️⃣ verwerk elke row in volgorde
  for (const row of frame.rows ?? []) {
    if (row.triple) {
      const t = row.triple;
      console.log('Triple row:', JSON.stringify(t));
    }
    // ...zelfde voor options / prefix / quad enz.
  }
}

interface MongoDoc {
  _id: string;
  type?: string;
  metadata?: { key: string; value: string }[];
  identifiers?: string[];
  relations?: { type: string; key: string; roles?: string[] }[];
  location?: { coordinates: [number, number] };
}

export function triplesToMongo(quads: Quad[]): MongoDoc {
  if (quads.length === 0) throw new Error('No triples provided');

  // Subject (extract _id from URI)
  const subject = quads[0].subject.value;
  const id = subject.split('/').pop()!;

  const doc: MongoDoc = {
    _id: id,
    metadata: [],
    identifiers: [],
    relations: [],
  };

  for (const quad of quads) {
    const predicate = quad.predicate.value;
    const object = quad.object;

    if (predicate.endsWith('type')) {
      doc.type = object.value;
    } else if (predicate.includes('identifier')) {
      doc.identifiers!.push(object.value);
    } else if (predicate.endsWith('lat')) {
      doc.location = doc.location || { coordinates: [0, 0] };
      doc.location.coordinates[1] = parseFloat(object.value);
    } else if (predicate.endsWith('lon')) {
      doc.location = doc.location || { coordinates: [0, 0] };
      doc.location.coordinates[0] = parseFloat(object.value);
    } else if (predicate.includes('role')) {
      let rel = doc.relations!.find((r) => r.type === 'role');
      if (!rel) {
        rel = { type: 'role', key: '', roles: [] };
        doc.relations!.push(rel);
      }
      rel.roles!.push(object.value);
    } else {
      doc.metadata!.push({
        key: predicate.split('#').pop() || predicate,
        value: object.value,
      });
    }
  }

  return doc;
}
