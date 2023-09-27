import { Entry, Hashable } from "./Entry";
import LinkedList from "../LinkedList/Instance";

// Code is based off William Fiset's implementation.
class HashTableSeparateChaining<K extends Hashable, V> {
    private DEFAULT_CAPACITY = 3;

    private table: Array<LinkedList<Entry<K, V>>>;

    private sz: number;
    private capacity: number;
    private maxLoadFactor: number;
    private threshold: number;

    constructor(capacity: number, maxLoadFactor: number) {
        if (capacity < 0) throw new Error('Illegal capacity');
        if (maxLoadFactor <= 0) throw new Error('Illegal maxLoadFactor');

        this.sz = 0;
        this.capacity = Math.max(this.DEFAULT_CAPACITY, capacity);
        this.maxLoadFactor = maxLoadFactor;
        this.threshold = Math.trunc(this.capacity * this.maxLoadFactor);

        this.table = new Array(this.capacity);
    }

    /*****************************************************************************
                                      INSPECTION
    *****************************************************************************/
    /**
     * @returns the size of the HashTable. - O(1) */
    public get size(): number {
        return this.sz;
    }

    /**
     * @returns `true` if the HashTable has been found empty, `false` otherwise. - O(1) */
    public get isEmpty(): boolean {
        return this.size === 0;
    }

    /**
     * Deletes all the registered elements in the HashTable. */
    public clear(): void {
        this.table.length = 0;
        this.sz = 0;
    }

    /**
     * @param key - The key to check for.
     * @returns `true` if the HashTable contains the key, `false` otherwise. */
    public contains(key: K): boolean {
        const bucketIndex = this.normalizeIndex(key.hashCode())

        return this.bucketSeekEntry(bucketIndex, key) !== null;
    }

    /**
     * @returns a list of the HashTable's keys. */
    public keys(): Array<K> {
        const keys: Array<K> = [];

        for (const bucket of this.table) {
            if (bucket !== undefined) for (const entry of bucket) keys.push(entry.key);
        }

        return keys;
    }

    /**
     * @returns a list of the HashTable's values. */
    public values(): Array<V> {
        const values: Array<V> = [];

        for (const bucket of this.table) {
            if (bucket !== undefined) for (const entry of bucket) values.push(entry.value);
        }

        return values;
    }

    /*****************************************************************************
                                         MAIN
    ****************************************************************************/
    /**
     * @param key - The key to fetch the associated data for.
     * @returns a value associated with the provided key, and `null` if the key does not exist. - O(1) amortized */
    public get(key: K): V | null {
        const bucketIndex = this.normalizeIndex(key.hashCode());

        const entry = this.bucketSeekEntry(bucketIndex, key);
        if (entry !== null) return entry.value;

        return null;
    }

    /**
     * Adds the [K, V] pair to the hash table - O(1) amortized
     * @param key - The key to set the provided data for.
     * @param value - The value to associate with the key. */
    public set(key: K, value: V): V | null {
        const entry = new Entry<K, V>(key, value);
        const bucketIndex = this.normalizeIndex(key.hashCode());

        return this.bucketInsertEntry(bucketIndex, entry);
    }

    /**
     * Deletes the specified entry defined by the key K. - O(1) amortized
     * @param key - The key to delete. */
    public delete(key: K): V | null {
        const bucketIndex = this.normalizeIndex(key.hashCode());

        return this.bucketDeleteEntry(bucketIndex, key);
    }

    /*****************************************************************************
                                        HELPERS
    ******************************************************************************/
    /**
     * Converts a hash to an index by stripping the negative
     * sign and maps the hash to domain of `[0, capacity]`. */
    private normalizeIndex(hash: number): number {
        return (hash & 0x7fffffff) % this.capacity;
    }

    /**
     * Verifies if a key exists or not in the specified bucket.
     * @param index - The index of the bucket which to seek the provided key in.
     * @param key - The key to look for. */
    private bucketSeekEntry(bucketIndex: number, key: K): Entry<K, V> | null {
        const bucket = this.table[bucketIndex];

        if (bucket === undefined) return null;

        for (const entry of bucket) if (entry.key === key) return entry;

        return null;
    }

    private bucketInsertEntry(bucketIndex: number, entry: Entry<K, V>): V | null {
        const bucket = this.table[bucketIndex];

        if (bucket === undefined) this.table[bucketIndex] = new LinkedList<Entry<K, V>>();

        const exists = this.bucketSeekEntry(bucketIndex, entry.key);

        if (!exists) {
            bucket.addBack(entry);
            this.sz += 1;

            if (this.sz > this.threshold) this.resizeTable();

            return null; // Use null to indicate no previous entry.
        } else {
            const oldValue = exists.value;
            exists.value = entry.value;

            return oldValue;
        }
    }

    private bucketDeleteEntry(bucketIndex: number, key: K): V | null {
        const entry = this.bucketSeekEntry(bucketIndex, key);

        if (entry === null) return null;

        // O/W, entry with key, key exists in the bucket so remove it.
        const bucket = this.table[bucketIndex];
        bucket.remove(entry);

        this.sz -= 1;

        return entry.value;
    }

    private resizeTable(): void {
        this.capacity *= 2;
        this.threshold = Math.trunc(this.capacity * this.maxLoadFactor);

        const newTable: Array<LinkedList<Entry<K, V>>> = new Array(this.capacity);

        for (const bucket of this.table) {
            if (bucket !== undefined) {
                for (const entry of bucket) {
                    const newBucketIndex = this.normalizeIndex(entry.hash);
                    const newBucket = newTable[newBucketIndex];

                    if (!newBucket) newTable[newBucketIndex] = new LinkedList<Entry<K, V>>();

                    newBucket.addBack(entry);
                }
            }
        }
    }
}

export default HashTableSeparateChaining;