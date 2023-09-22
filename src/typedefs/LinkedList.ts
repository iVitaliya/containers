import type LinkedListNode from "../LinkedList/Node";

export interface List<T> {
    head: LinkedListNode<T>;
    tail: LinkedListNode<T>;
    size: number;
}

export type LinkedListNodeType = typeof LinkedListNode;