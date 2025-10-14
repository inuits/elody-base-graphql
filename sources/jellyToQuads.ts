import * as protobuf from 'protobufjs';
import { DataFactory, Quad, NamedNode, Literal, Term } from 'n3';

const { namedNode, blankNode, literal, quad } = DataFactory;

type Tables = {
  prefix: Map<number, string>;
  name: Map<number, string>;
  dtype: Map<number, string>;
};

function iriToTerm(iri: any, t: Tables): NamedNode {
  if (!iri) return namedNode('');
  const full = iri.full ?? iri.iri ?? iri.value;
  if (full) return namedNode(full);
  const base = t.prefix.get(iri.prefixId) ?? '';
  const local = t.name.get(iri.nameId) ?? '';
  return namedNode(base + local);
}

function litToTerm(lit: any, t: Tables): Literal {
  const lex = String(lit?.lex ?? '');
  if (lit?.lang) return literal(lex, String(lit.lang));
  if (lit?.datatypeIri) return literal(lex, iriToTerm(lit.datatypeIri, t));
  if (typeof lit?.datatypeId === 'number') {
    const dt =
      t.dtype.get(lit.datatypeId) ?? 'http://www.w3.org/2001/XMLSchema#string';
    return literal(lex, namedNode(dt));
  }
  return literal(lex);
}

export class JellyToQuads {
  private Frame!: protobuf.Type;
  private tables: Tables = {
    prefix: new Map(),
    name: new Map(),
    dtype: new Map(),
  };
  private acc = new Uint8Array(0);
  private resetOnOptions = true;

  static async create(
    rdfProtoPath: string,
    opts?: { resetOnOptions?: boolean }
  ) {
    const root = await protobuf.load(rdfProtoPath);
    const inst = new JellyToQuads();
    inst.Frame = root.lookupType(
      'eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame'
    );
    inst.resetOnOptions = opts?.resetOnOptions ?? true;
    return inst;
  }

  /** Decode alle (length-delimited) frames uit een volledig buffer */
  decodeAll(buf: Uint8Array): Quad[] {
    const out: Quad[] = [];
    const r = protobuf.Reader.create(buf);
    while (r.pos < r.len) {
      const frame = this.Frame.decodeDelimited(r) as any;
      out.push(...this.processFrame(frame));
    }
    return out;
  }

  /** Streaming: voed binnenkomende chunks; geeft zoveel mogelijk quads terug */
  feed(chunk: Uint8Array): Quad[] {
    // concat acc + chunk
    const merged = new Uint8Array(this.acc.length + chunk.length);
    merged.set(this.acc, 0);
    merged.set(chunk, this.acc.length);
    this.acc = merged;

    const out: Quad[] = [];
    const r = protobuf.Reader.create(this.acc);
    try {
      while (r.pos < r.len) {
        const frame = this.Frame.decodeDelimited(r) as any;
        out.push(...this.processFrame(frame));
      }
      // alles verbruikt
      this.acc = new Uint8Array(0);
    } catch {
      // onvolledig frame → bewaar staart
      this.acc = this.acc.subarray(r.pos);
    }
    return out;
  }

  private processFrame(frame: any): Quad[] {
    const out: Quad[] = [];
    for (const row of frame.rows ?? []) {
      if (row.options) {
        if (this.resetOnOptions) {
          this.tables.prefix.clear();
          this.tables.name.clear();
          this.tables.dtype.clear();
        }
        continue;
      }
      if (row.prefix) {
        const iri = row.prefix.full ?? row.prefix.iri ?? row.prefix.value ?? '';
        if (iri) this.tables.prefix.set(row.prefix.id, iri);
        continue;
      }
      if (row.name) {
        this.tables.name.set(row.name.id, String(row.name.value ?? ''));
        continue;
      }
      if (row.datatype) {
        const iri =
          row.datatype.full ?? row.datatype.iri ?? row.datatype.value ?? '';
        if (iri) this.tables.dtype.set(row.datatype.id, iri);
        continue;
      }
      if (row.triple) {
        const t = row.triple;
        const s = t.sIri
          ? iriToTerm(t.sIri, this.tables)
          : t.sBnode
            ? blankNode(String(t.sBnode.id))
            : null;
        const p = t.pIri ? iriToTerm(t.pIri, this.tables) : null;
        let o: Term | null = null;
        if (t.oIri) o = iriToTerm(t.oIri, this.tables);
        else if (t.oBnode) o = blankNode(String(t.oBnode.id));
        else if (t.oLiteral) o = litToTerm(t.oLiteral, this.tables);
        if (s && p && o) out.push(quad(s, p, o));
        continue;
      }
      if (row.quad) {
        const qd = row.quad;
        const s = qd.sIri
          ? iriToTerm(qd.sIri, this.tables)
          : qd.sBnode
            ? blankNode(String(qd.sBnode.id))
            : null;
        const p = qd.pIri ? iriToTerm(qd.pIri, this.tables) : null;
        let o: Term | null = null;
        if (qd.oIri) o = iriToTerm(qd.oIri, this.tables);
        else if (qd.oBnode) o = blankNode(String(qd.oBnode.id));
        else if (qd.oLiteral) o = litToTerm(qd.oLiteral, this.tables);
        const g = qd.gIri
          ? iriToTerm(qd.gIri, this.tables)
          : qd.gBnode
            ? blankNode(String(qd.gBnode.id))
            : undefined;
        if (s && p && o) out.push(quad(s, p, o, g));
        continue;
      }
      // andere row types negeren
    }
    return out;
  }
}
