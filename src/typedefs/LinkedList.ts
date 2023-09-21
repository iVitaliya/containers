import LinkedListNode from "../LinkedList/Node";

export interface List<T> {
    head: LinkedListNode<T>;
    tail: LinkedListNode<T>;
    size: number;
}