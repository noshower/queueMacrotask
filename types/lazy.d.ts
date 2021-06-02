declare type Callback = (...args: any[]) => void;
declare type ClearFunction = () => void;
declare type Func = () => (callback: Callback) => ClearFunction;
export default function lazy(fn: Func): ReturnType<Func>;
export {};
