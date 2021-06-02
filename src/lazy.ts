type Callback = (...args: any[]) => void;

type ClearFunction = () => void;

type Func = () => (callback: Callback) => ClearFunction;

const cache: Map<Func, ReturnType<Func>> = new Map();

export default function lazy(fn: Func): ReturnType<Func> {
  if (!cache.has(fn)) {
    cache.set(fn, fn());
  }
  return cache.get(fn)!;
}
