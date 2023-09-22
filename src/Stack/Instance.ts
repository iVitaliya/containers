import type { EqualsFunction } from "../typedefs/Utilities";

import LinkedList from "../LinkedList/Instance";

class Stack<T> implements Iterable<T> {
    private list: LinkedList<T>;

    constructor(equalsFunction?: EqualsFunction<T>) {
        if (equalsFunction) this.list = new LinkedList<T>(equalsFunction);
        else this.list = new LinkedList<T>();
    }

    /*****************************************************************************
                                      INSPECTION
    *****************************************************************************/
    /** @returns the size of the Stack - O(1) */
    public get size(): number {
        return this.list.size;
    }

    /** @returns true if stack is empty, false otherwise - O(1) */
    public get isEmpty(): boolean {
        return this.list.isEmpty;
    }

    /*****************************************************************************
                                      INSERTION/DELETION
    *****************************************************************************/
    /**
     * Pushes an element onto the Stack - O(1)
     * @param element - The element to push onto the Stack. */
    public push(element: T): void {
        this.list.addBack(element);
    }

    /**
     * Pops an element off the Stack - O(1)
     * @returns the element which was popped off. */
    public pop(): T | null {
        if (this.isEmpty) return null;

        return this.list.removeBack();
    }

    /** Deletes all the queued elements from the Stack. */
    public clear(): void {
        this.list.clear();
    }

    /*****************************************************************************
                                      ACCESSING
    *****************************************************************************/
    /**
     * Peeks at the top most element on the Stack - O(1)
     * @return the top most element. */
    public peek(): T | null {
        if (this.isEmpty) return null;

        return this.list.peekBack();
    }

    /*****************************************************************************
                                      SEARCHING
    *****************************************************************************/
    /**
     * Checks if the value is in the Stack - O(1)
     * @param element - The element to search for. */
    public contains(element: T): boolean {
        return this.list.contains(element);
    }

    /*****************************************************************************
                                      HELPERS
    *****************************************************************************/
    [Symbol.iterator](): Iterator<T> {
        return this.list[Symbol.iterator]();
    }
}

export default Stack;