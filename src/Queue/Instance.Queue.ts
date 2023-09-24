import type { EqualsFunction } from "../typedefs/Utilities";

import LinkedList from "../LinkedList/Instance";

class Queue<T> implements Iterable<T> {
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
     * Enqueues an element into the Queue.
     * @param element - The element to insert into the Queue. */
    public enqueue(element: T): void {
        this.list.addFront(element);
    }

    /**
     * Dequeues an element from the Queue.
     * @returns the dequeued element. */
    public dequeue(): T | null {
        if (this.isEmpty) return null;

        return this.list.removeBack();
    }
    
    /**
     * Deletes all the registered items from the Queue. */
    public clear(): void {
        this.list.clear();
    }

    /*****************************************************************************
                                      ACCESSING
    *****************************************************************************/
    /**
     * Peeks at the element at the front of the Queue. - O(1)
     * @returns the frontmost element. */
    public peekFront(): T | null {
        if (this.isEmpty) return null;

        return this.list.peekBack();
    }

    /**
     * Peeks at the element at the back of the Queue. - O(1)
     * @returns the backmost element. */
    public peekBack(): T | null {
        if (this.isEmpty) return null;

        return this.list.peekFront();
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

export default Queue;