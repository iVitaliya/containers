class LinkedListNode<T> {
    value: T | null;
    previous: LinkedListNode<T> | null;
    next: LinkedListNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.previous = null;
        this.next = null;    
    }
}

export default LinkedListNode;