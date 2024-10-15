import {
    handleRegexpFormatter,
  } from '../resolvers/formatters';
import { expect, describe, it } from 'vitest';
import { type FormattersConfig } from "../types";

describe("resolverFormatters", () => {
  it("returns all matches from json", () => {
    const clientConfig: FormattersConfig = {
      'regexpMatch': {
        wears: { value: '@value' }
      }
    }

    const sample1 = {
      "@type": "Document",
      "Document.type": [
        {
          "@id": "https://example.com/id/document/456123",
          "dcterms:title": {
            "@value": "History of the Renaissance",
            "@language": "en",
          },
        },
        {
          "@id": "example:Genre",
          label: "historical.document",
        },
      ],
    };

    const sample2 = [{
      "@type": "Document",
      "Document.type": [
        {
          "@id": "https://example.com/id/document/456123",
          "dcterms:title": {
            "@value": "History of the Renaissance",
            "@language": "en",
          },
        },
        {
          "@id": "example:Genre",
          label: "historical.document",
        },
      ],
    },
    {
      "@type": "Document",
      "Document.type": [
        {
          "@id": "https://example.com/id/document/456123",
          "dcterms:title": {
            "@value": "History of the Healing",
            "@language": "en",
          },
        },
        {
          "@id": "example:Genre",
          label: "historical.document",
        },
      ],
    }
  ];

    expect(handleRegexpFormatter({value: sample1, formatter: 'regexpMatch|wears', formatterSettings: clientConfig})).toStrictEqual({
      label: ["History of the Renaissance"], formatter: 'regexpMatch|wears'
    });

    expect(handleRegexpFormatter({value: sample2, formatter: 'regexpMatch|wears', formatterSettings: clientConfig})).toStrictEqual({
      label: ["History of the Renaissance", "History of the Healing"], formatter: 'regexpMatch|wears'
    });

    expect(handleRegexpFormatter({value: {}, formatter: 'regexpMatch|wears', formatterSettings: clientConfig})).toStrictEqual({
      label: [], formatter: 'regexpMatch|wears'
    });
  });
});