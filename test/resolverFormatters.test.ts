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

  it("extracts array values from metadata array structure", () => {
    const clientConfig: FormattersConfig = {
      'regexpMatch': {
        xyxz: { value: 'xyxz' }
      }
    }

    // Simulate: keyValue(key: "metadata", source: root)
    // This is the full entity metadata array structure
    const metadataArray = [
      {
        "key": "model_name",
        "value": "imec-triton"
      },
      {
        "key": "detection_size",
        "value": {
          "xyxz": [
            282.492431640625,
            540.0955810546875,
            445.96014404296875,
            660.2772216796875
          ]
        }
      },
      {
        "key": "label",
        "value": "Asphalt - Missing material"
      }
    ];

    expect(handleRegexpFormatter({
      value: metadataArray,
      formatter: 'regexpMatch|xyxz',
      formatterSettings: clientConfig
    })).toStrictEqual({
      label: [
        282.492431640625,
        540.0955810546875,
        445.96014404296875,
        660.2772216796875
      ],
      formatter: 'regexpMatch|xyxz'
    });
  });
});