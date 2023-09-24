import type { EqualsFunction } from "../typedefs/Utilities";

import { defaultEquals } from "../Utilities";

class CircularBuffer<T> {
    private list: T[];
    private sz: number;
    private capacity: number;

    private readIndex: number;
    private writeIndex: number;

    private equalsFunc: EqualsFunction<T>;

    constructor(capacity: number, equalsFunction: EqualsFunction<T>) {
        this.list = new Array<T>(capacity);
        this.sz = 0;
        this.capacity = capacity;

        this.readIndex = 0;
        this.writeIndex = 0;

        this.equalsFunc = equalsFunction ?? defaultEquals;
    }

    /*****************************************************************************
                                     INSPECTION
    *****************************************************************************/
    /**
     * @returns the size of the Queue. - O(1) */
    public get size(): number {
        return this.sz;
    }

    /** 
     * @returns `true` if the Queue has been found empty, `false` otherwise. - O(1) */
    public get isEmpty(): boolean {
        return this.size === 0;
    }

    /*****************************************************************************
                                    INSERTION/DELETION
    *****************************************************************************/
    /**
     * Enqueues an element into the CircularBuffer. - O(1)
     * @param element - The element to enqueue. */
    public enqueue(element: T): void {
        this.list[this.writeIndex] = element;

        const elementIsOverWritten = this.sz !== 0 && this.writeIndex === this.readIndex;
        if (elementIsOverWritten) {
            this.readIndex = (this.readIndex + 1) % this.capacity;
        }

        this.writeIndex = (this.writeIndex + 1) % this.capacity;

        this.sz += 1;
    }

    /**
     * Dequeues an element from the CiruclarBuffer. - O(1) */
    public dequeue(): T | null {
        if (this.isEmpty) return null;

        const removedValue = this.list[this.readIndex];

        this.readIndex = (this.readIndex + 1) % this.capacity;
        this.sz -= 1;

        return removedValue;
    }

    /**
     * Deletes all elements from the CiruclarBuffer. - O(capacity) */
    public clear(): void {
        this.list = new Array<T>(this.capacity);
        this.sz = 0;
    }

    /*****************************************************************************
                                      ACCESSING
    *****************************************************************************/
    /**
     * Peeks the element at the front of the CiruclarBuffer. - O(1)
     * @returns the frontmost element. */
    public peekFront(): T | null {
        if (this.isEmpty) return null;

        return this.list[this.readIndex];
    }

    /**
     * Peeks the element at the back of the CiruclarBuffer. - O(1)
     * @returns the backmost element. */
    public peekBack(): T | null {
        if (this.isEmpty) return null;

        let i = this.writeIndex - 1;
        if (i < 0) i = this.capacity - 1;

        return this.list[i];
    }

    /*****************************************************************************
                                      SEARCHING
    *****************************************************************************/
    /**
     * Check if the element is in the CircularBuffer.
     * @param element - the element to search for. */
    public contains(element: T): boolean {
        return this.list.some((value: T) => {
            return this.equalsFunc(value, element);
        });
    }
}

export default CircularBuffer;