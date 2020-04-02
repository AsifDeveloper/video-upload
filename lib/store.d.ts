declare class Store {
    prefix: string;
    constructor(prefix?: string);
    set(key: string, value: string): void;
    get(key: string): string | null | false;
    delete(key: string): void;
}
export declare const store: Store | Map<string, string>;
export {};
