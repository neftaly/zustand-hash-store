import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useHashStore } from './index';

const setHash = (state: Record<string, unknown>) => {
  location.hash = encodeURIComponent(JSON.stringify(state));
};

describe('useHashStore', () => {
  beforeEach(() => {
    location.hash = '';
    useHashStore.setState({}, true);
  });

  afterEach(() => {
    location.hash = '';
  });

  it('parses valid hash JSON into store state', () => {
    setHash({ foo: 'bar', count: 42 });
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    const state = useHashStore.getState();
    expect(state.foo).toBe('bar');
    expect(state.count).toBe(42);
  });

  it('handles missing hash (empty state)', () => {
    location.hash = '';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(useHashStore.getState()).toEqual({});
  });

  it('handles malformed hash JSON', () => {
    location.hash = 'not-valid-json';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    expect(useHashStore.getState()).toEqual({});
  });

  it('setState writes to URL hash', () => {
    useHashStore.setState({ greeting: 'hello' });
    const hash = decodeURIComponent(location.hash.slice(1));
    const parsed = JSON.parse(hash);
    expect(parsed.greeting).toBe('hello');
  });

  it('round-trips through URL hash', () => {
    const original = { nested: { a: 1, b: [2, 3] } };
    useHashStore.setState(original, true);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    const state = useHashStore.getState();
    expect(state.nested).toEqual({ a: 1, b: [2, 3] });
  });
});
