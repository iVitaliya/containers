import type { EqualsFunction } from "../typedefs/Utilities";

import LinkedList from "../LinkedList/Instance";

class Deque<T> implements Iterable<T> {
    private list: LinkedList<T>;

    constructor(equalsFunction?: EqualsFunction<T>) {
        if (equalsFunction) this.list = new LinkedList<T>(equalsFunction);
        else this.list = new LinkedList<T>();
    }

    /*****************************************************************************
                                      INSPECTION
    *****************************************************************************/
    /**
     * @returns the size of the Queue. - O(1) */
    public get size(): number {
        return this.list.size;
    }

    /** 
     * @returns `true` if the Queue has been found empty, `false` otherwise. - O(1) */
    public get isEmpty(): boolean {
        return this.list.isEmpty;
    }
    /*****************************************************************************
                                    INSERTION/DELETION
    *****************************************************************************/
    /**
     * Pushes an element into the front of the Queue. - O(1)
     * @param element - The element to be enqueued. */
    public pushFront(element: T): void {
        this.list.addFront(element);
    }

    /**
     * Pushes an element onto the back of the Queue. - O(1)
     * @param element - The element to be enqueued. */
    public pushBack(element: T): void {
        this.list.addBack(element);
    }

    /**
     * Pops an element from the front of the Queue. - O(1) */
    public popFront(): T | null {
        if (this.isEmpty) return null;

        return this.list.removeFront();
    }

    /**
     * Pops an element from the back of the Queue. - O(1) */
    public popBack(): T| null {
        if (this.isEmpty) return null;

        return this.list.removeBack();
    }

    /*****************************************************************************
                                      ACCESSING
    *****************************************************************************/
    /**
     * Peeks at the element at the front of the Queue. - O(1)
     * @returns the frontmost element. */
    public peekFront(): T | null {
        if (this.isEmpty) return null;

        return this.list.peekFront();
    }

    /**
     * Peeks at the element at the back of the Queue. - O(1)
     * @returns the backmost element. */
    public peekBack(): T | null {
        if (this.isEmpty) return null;

        return this.list.peekBack();
    }

    /*****************************************************************************
                                      SEARCHING
    *****************************************************************************/
    /**
     * Checks if the specified value exists in the Queue. - O(1)
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

export default Deque;