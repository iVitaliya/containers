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
     * Returns the size of the Linked List - O(1) 
     * @returns {number} */
    get size(): number {
        if (this.list) return this.list.size;

        return 0;
    }

    /**
     * Returns `true` if the Linked List has been found empty, `false` otherwise - O(1) */
    get isEmpty(): boolean {
        return !this.list;
    }

    /*****************************************************************************
                                  INSERTION
    *****************************************************************************/
    /**
     * Adds a [Node]({@link Node.ts}) to the head of the LinkedList - O(1)
     * @param value - The value to add to the List. */
    addFront(value: T): boolean {
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
    addBack(value: T): boolean {
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
    addAt(index: number, value: T): boolean {
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

    // https://github.com/jeffzh4ng/iruka/blob/master/src/data-structures/sequences/linked-list/linked-list.ts#L139
}