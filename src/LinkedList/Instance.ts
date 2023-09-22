import { List } from "../typedefs/LinkedList";
import LinkedListNode from "./Node";

class LinkedList<T> implements Iterable<T> {
    private list: List<T> | undefined;

    constructor() {
        this.list = undefined;
    }

    /*****************************************************************************
                                     INSPECTION
    *****************************************************************************/
    /** 
     * Returns the size of the Linked List - O(1)  */
    public get size(): number {
        if (this.list) return this.list.size;

        return 0;
    }

    /**
     * Returns `true` if the Linked List has been found empty, `false` otherwise - O(1) */
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
     * @returns The index of the first occurrence of the element, and -1
     * if the element doesn't seem to exist in the List. */
    public indexOf(value: T): number {
        // List is empty.
        if (!this.list) return -1;
    }
}