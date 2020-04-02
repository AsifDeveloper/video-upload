/**
 * @internal
 */
export declare enum ErrorType {
    Restart = 0,
    Auth = 1,
    Retryable = 2,
    FatalError = 3
}
export declare class ErrorHandler {
    static maxAttempts: number;
    static shouldRestartCodes: number[];
    static authErrorCodes: number[];
    static shouldRetryCodes: number[];
    min: number;
    max: number;
    factor: number;
    attempts: number;
    private delay;
    private code?;
    constructor();
    kind(code: number): ErrorType;
    wait(): Promise<number>;
    reset(): void;
}
