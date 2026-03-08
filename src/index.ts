import { create } from 'zustand';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type HashState = Record<string, JsonValue | undefined>;

const parseHash = (): HashState => {
  const raw = location.hash.slice(1);
  if (!raw) return {};
  try {
    return JSON.parse(decodeURIComponent(raw)) as HashState;
  } catch {
    return {};
  }
};

const writeHash = (state: HashState) => {
  const hash = encodeURIComponent(JSON.stringify(state));
  history.replaceState(null, '', `#${hash}`);
};

export const useHashStore = create<HashState>()(parseHash);

useHashStore.subscribe(writeHash);

if (typeof window !== 'undefined') {
  addEventListener('hashchange', () => {
    useHashStore.setState(parseHash(), true);
  });
}
