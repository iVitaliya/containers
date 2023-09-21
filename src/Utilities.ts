import { EqualsFunction, CompareFunction } from "./typedefs/Utilities";

/** Default function to testify against the equality of item `a` and item `b`. */
export const defaultEquals = <T>(a: T, b: T): boolean => {
    return a == b;
}

/** 
 * Default function to compare the element order of item `a` and item `b`.
 * 
 * Function returnables: -1 (`b` greater than `a`), 0 (equal each other), 1 (everything else) */
export const defaultCompare = <T>(a: T, b: T): number => {
    if (a < b) {
        return -1;
    } else if (a === b) {
        return 0;
    } else {
        return 1;
    }
};