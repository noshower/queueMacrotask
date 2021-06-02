declare type Callback = (...args: any[]) => void;
export declare function queueMacrotask(callback: Callback): () => void;
export {};
