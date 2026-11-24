import { describe, expect, it } from 'vitest';
import { orderEndpointUrl } from '../endpoints/orderEndpointUrl';

describe('orderEndpointUrl', () => {
  it('passes the relation and item type on to the order endpoint', () => {
    expect(
      orderEndpointUrl('http://api/', 'A 1', {
        return_type: 'mediafile',
        relation_type: 'ref_mediafiles',
        order_by: 'order',
      })
    ).toBe(
      'http://api/entities/A%201/order?return_type=mediafile&relation_type=ref_mediafiles&order_by=order'
    );
  });

  it('leaves out parameters the request did not carry', () => {
    expect(
      orderEndpointUrl('http://api', 'A-1', {
        return_type: undefined,
        relation_type: 'hasMediafile',
      })
    ).toBe('http://api/entities/A-1/order?relation_type=hasMediafile');
  });
});
