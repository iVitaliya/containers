/** Function signature for checking equality. */
export interface EqualsFunction<T> {
    (a: T, b: T): boolean;
}

/**
 * Function signature for comparing
 * > 0 => a is larger than b
 * = 0 => a equals b
 * < 0 => a is smaller than b */
export interface CompareFunction<T> {
    (a: T, b: T): number;
}