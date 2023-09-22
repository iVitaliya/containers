import type { List } from "../typedefs/LinkedList";
import type { EqualsFunction } from "../typedefs/Utilities";

import LinkedListNode from "./Node";
import { defaultEquals } from "../Utilities";

class LinkedList<T> implements Iterable<T> {
    private list: List<T> | undefined;
    private equalsF: EqualsFunction<T> = defaultEquals;

    constructor(equalsFunction?: EqualsFunction<T>) {
        this.list = undefined;

        if (equalsFunction) this.equalsF = equalsFunction;
    }

    /*****************************************************************************
                                     INSPECTION
    *****************************************************************************/
    /** 
     * @returns the size of the Linked List - O(1)  */
    public get size(): number {
        if (this.list) return this.list.size;

        return 0;
    }

    /**
     * @returns `true` if the Linked List has been found empty, `false` otherwise - O(1) */
    public get isEmpty(): boolean {
        return !this.list;
    }

    /*****************************************************************************
                                      INSERTION
    *****************************************************************************/
    /**
     * Adds a [Node]({@link Node.ts}) to the head of the LinkedList - O(1)
     * @param value - The value to add to the List. */
    public addFront(value: T): boolean {
        const newNode = new LinkedListNode<T>(value);

        if (this.list) {
            // Link old head backwards.
            this.list.head.previous = newNode;

            // Link new head forwards.
            newNode.next = this.list.head;

            this.list.head = newNode;
            this.list.size += 1;
        } else {
            this.list = {
                head: newNode,
                tail: newNode,
                size: 1
            };
        }

        return true;
    }

    /**
     * Adds a [Node]({@link Node.ts}) to the tail of the LinkedList - O(1)
     * @param value - The value to add to the list. */
    public addBack(value: T): boolean {
        const newNode = new LinkedListNode<T>(value);

        if (this.list) {
            // Link old tail forwards.
            this.list.tail.next = newNode;

            // Link new tail backwards.
            newNode.previous = this.list.tail;

            this.list.tail = newNode;
            this.list.size += 1;
        } else {
            this.list = {
                head: newNode,
                tail: newNode,
                size: 1,
            };
        }

        return true
    }

    /**
     * Adds a [Node]({@link Node.ts}) at specified index - O(1)
     * @param index - The index on where to add specified value.
     * @param value - The value to add at said index. */
    public addAt(index: number, value: T): boolean {
        if (index === 0) {
            return this.addFront(value);
        }

        if (index === this.size) {
            return this.addBack(value);
        }

        if (index < 0 || index >= this.size || !this.list) return false;

        let current = this.list.head;

        // Traverse to the index.
        for (let i = 0; i < index - 1; i++) {
            current = current.next!; // eslint-disable-line
        }

        const newNode = new LinkedListNode<T>(value);

        // Link the next Node.
        current.next!.previous = newNode; // eslint-disable-line
        newNode.next = current.next;

        // Link the previous Node.
        newNode.previous = current;
        current.next = newNode;

        this.list.size += 1;

        return true;
    }

    /*****************************************************************************
                                   ACCESSING
    *****************************************************************************/
    /** 
     * Gets the value of the head of the current [Node]({@link Node.ts}) - O(1) */
    public peekFront(): T | null {
        if (!this.list) return null;

        return this.list.head.value;
    }

    /**
     * Gets the value of the tail of the current [Node]({@link Node.ts}) - O(1) */
    public peekBack(): T | null {
        if (!this.list) return null;

        return this.list.tail.value;
    }

    /**
     * Gets the element at the specified index - O(1)
     * @param index - The index to use for getting the [Node]({@link Node.ts}) */
    public get(index: number): T | null {
        if (index < 0 || index >= this.size || !this.list) {
            return null;
        }

        let i = 0;
        let current = this.list.head;

        while (i < index) {
            current = current.next!;

            i++;
        }

        return current.value;
    }

    /*****************************************************************************
                                      SEARCHING
    *****************************************************************************/
    /**
     * Removes the first occurrence of the specified item in the LinkedList.
     * @param value - The value to search for.
     * @returns the index of the first occurrence of the element, and -1
     * if the element doesn't seem to exist in the List. */
    public indexOf(value: T): number {
        // List is empty.
        if (!this.list) return -1;

        let index = 0;
        let current = this.list.head;

        while (!this.equalsF(current.value!, value)) {
            // current.value === null means we reached end of list without finding element
            if (!current.next) return -1;

            current = current.next;
            index += 1;
        }

        return index;
    }

    /**
     * Checks if the value is in the LinkedList.
     * @param value - The value to search for.
     * @returns whether */
    public contains(value: T): boolean {
        const index = this.indexOf(value);

        return index !== -1;
    }

    /*****************************************************************************
                                      DELETION
    *****************************************************************************/
    /**
     * Removes head - O(1)
     * @returns the value of removed head. */
    public removeFront(): T | null {
        if (!this.list) return null;

        // Extract the value of the head so we can return it later.
        const value = this.list.head.value;

        if (this.list.head.next) {
            this.list.head.next.previous = null;

            // Move the head pointer forwards.
            this.list.head = this.list.head.next;

            this.list.size -= 1;
        } else {
            // List is size 1, clear the list.
            this.list = undefined;
        }

        return value;
    }

    /**
     * Removes tail - O(1)
     * @returns the value of removed tail. */
    public removeBack(): T | null {
        if (!this.list) return null;

        // Extract the value of the tail so we can return it later.
        const value = this.list.tail.value;

        if (this.list.tail.previous) {
            this.list.tail.previous.next = null;

            // Move the tail pointer backwards.
            this.list.tail = this.list.tail.previous;

            this.list.size -= 1;
        } else {
            this.list = undefined;
        }

        return value;
    }

    /**
     * Removes first occurence of the [Node]({@link Node.ts}) with specified value. Returns true if
     * the removal was successful, and false otherwise. - O(n)
     * @param value - The value to remove.
     * @returns the value of the removed [Node]({@link Node.ts}). */
    public remove(value: T): T | null {
        const index = this.indexOf(value); // O(n)

        if (index === -1) return null;

        return this.removeAt(index); // O(n)
    }

    /**
     * Removes the [Node]({@link Node.ts}) at the specified index.
     * @param index - The index to remove.
     * @returns the value of the removed [Node]({@link Node.ts}). */
    public removeAt(index: number): T | null {
        if (!this.list) return null;

        if (index === 0) {
            return this.removeFront();
        } else if (index === this.size - 1) {
            return this.removeBack();
        }

        if (index < 0 || index >= this.list.size) return null;

        let i = 0;
        let current = this.list.head;

        // Traverse to the Node to be deleted.
        while (i < index) {
            current = current.next!; // eslint-disable-line

            i += 1;
        }

        // Delete the Node.
        current.previous!.next = current.next; // eslint-disable-line
        current.next!.previous = current.previous; // eslint-disable-line

        this.list.size -= 1;

        return current.value;
    }

    /** Deletes all the registered [Nodes]({@link Node.ts}) - O(1) */
    public clear(): void {
        this.list = undefined;
    }

    /*****************************************************************************
                                      HELPERS
    *****************************************************************************/
    /** Appends values from an Array to the List - O(k) */
    public fromArray(array: T[]): LinkedList<T> {
        for (const element of array) {
            this.addBack(element);
        }

        return this;
    }

    *[Symbol.iterator](): Iterator<T> {
        if (!this.list) return;

        let current: LinkedListNode<T> | null

        for (current = this.list.head; current != null; current = current.next) {
            yield current.value!;
        }
    }
}

export default LinkedList;