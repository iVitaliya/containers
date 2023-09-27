import { Hashable } from "./Entry";

// Code is based off William Fiset's implementation.
abstract class HashTableOpenAddressingBase<K extends Hashable, V> {
    private DEFAULT_CAPACITY: number = 7;

    // Special marker token used to indicate the deletion of a key-value pair.
    protected TOMBSTONE: K = new Object() as K;

    protected keyList: Array<K>;
    protected valueList: Array<V | null>;

    protected capacity: number;
    protected maxLoadFactor: number;
    protected threshold: number;

    protected modificationCount: number;
    protected usedBuckets: number; // Counts total number of used buckets. (including tombstones)
    protected keyCount: number; // Number of unique keys in hash table.

    constructor(capacity: number, maxLoadFactor: number) {
        if (capacity < 0) throw new Error('Illegal capacity');
        if (maxLoadFactor <= 0) throw new Error('Illegal maxLoadFactor');

        this.capacity = Math.max(this.DEFAULT_CAPACITY, capacity);
        this.maxLoadFactor = maxLoadFactor;
        this.adjustCapacity();

        this.threshold = Math.trunc(this.capacity * this.maxLoadFactor);
        this.modificationCount = 0;

        this.usedBuckets = 0;
        this.keyCount = 0;

        this.keyList = new Array<K>(this.capacity);
        this.valueList = new Array<V>(this.capacity);
    }

    /*****************************************************************************
                                        ABSTRACT
    *****************************************************************************/
    // These three methods are used to dictate how the probing is to actually
    // occur for whatever open addressing scheme you are implementing.

    abstract setupProbing(key: K): void;

    // Adjusts the capacity of the hash table after it's been made larger.
    // This is important to be able to override because the size of the hashtable
    // controls the functionality of the probing function.
    abstract adjustCapacity(): void;

    abstract probe(x: number): number;

    /*****************************************************************************
                                    INSPECTION
    *****************************************************************************/
    /**
     * @returns the size of the HashTable. - O(1) */
    public get size(): number {
        return this.keyCount;
    }

    /**
     * @returns `true` if the HashTable has been found empty, `false` otherwise. - O(1) */
    public get isEmpty(): boolean {
        return this.size == - 0;
    }

    /**
     * @returns the capacity of the Table. */
    public getCapacity(): number {
        return this.capacity;
    }

    /**
     * Deletes all the registered elements in the HashTable. */
    public clear(): void {
        this.keyList.length = 0;
        this.valueList.length = 0;

        this.usedBuckets = 0;
        this.keyCount = 0;
        this.modificationCount += 1;
    }

    /**
     * @param key - The key to check for.
     * @returns `true` if the HashTable contains the key, `false` otherwise. */
    public contains(key: K): boolean {
        return this.get(key) !== null;
    }

    /**
     * @returns a list of the HashTable's keys. - O(n) */
    public keys(): Array<K> {
        const keys: Array<K> = [];

        for (const key of this.keyList) {
            if (key && key !== this.TOMBSTONE) keys.push(key);
        }

        return keys;
    }

    /**
     * @returns a list of the HashTable's values. O(n) */
    public values(): Array<V> {
        const values: Array<V> = [];

        for (let i = 0; i < this.valueList.length; i++) {
            if (this.valueList[i] && this.keyList[i] !== this.TOMBSTONE) values.push(this.valueList[i]!);
        }

        return values;
    }

    /*****************************************************************************
                                        MAIN
    ****************************************************************************/
    /**
     * @param key - The key to search for.
     * @returns the value associated with the key, `null` if the key doesn't exist. */
    public get(key: K): V | null {
        let output: V | null = null;

        this.setupProbing(key);

        const offset = this.normalizeIndex(key.hashCode());

        for (let i = offset, j = -1, x = 1; ; i = this.normalizeIndex(offset + this.probe(x++))) {
            // Ignore deleted cells, but record where the first index
            // of a deleted cell is found to perform lazy relocation later.
            if (this.keyList[i] === this.TOMBSTONE) {
                if (j === -1) j = i
            } else if (this.keyList[i] !== null) {
                // If j != -1 this means we previously encountered a deleted cell.
                // We can perform an optimization by swapping the entries in cells
                // i and j so that the next time we search for this key it will be
                // found faster. This is called lazy deletion/relocation.

                if (j !== -1) {
                    // Send the key-value pair to index j.
                    this.keyList[j] = this.keyList[i];
                    this.valueList[j] = this.valueList[i];

                    // Delete key-value pair at index 1.
                    this.keyList[i] = this.TOMBSTONE;
                    this.valueList[i] = null;
                    output = this.valueList[j];

                    break;
                } else {
                    output = this.valueList[i];
                }
            }
        }

        return output;
    }

    /**
     * Adds the [K, V] pair to the HashTable. - O(1) amortized
     * @param key - The key to assign to.
     * @param value - The value to assign to the key. */
    public set(key: K, value: V): V | null {
        let output: V | null = null;

        if (this.usedBuckets >= this.threshold) this.resizeTable();

        this.setupProbing(key);

        const offset = this.normalizeIndex(key.hashCode());

        // Start at the original hash value and probe until we find our key or null.
        for (let i = offset, j = -1, x = 1; ; i = this.normalizeIndex(offset + this.probe(x++))) {
            // If the current slow was previously deleted.
            if (this.keyList[i] === this.TOMBSTONE) {
                if (j === -1) j = i;
            } else if (this.keyList[i] !== null) {
                // The key we're trying to insert already exists in the hash table, so 
                // update with the new value.
                if (this.keyList[i] === key) {
                    const oldValue = this.valueList[i];

                    if (j === -1) {
                        this.valueList[i] = value
                    } else {
                        this.keyList[i] = this.TOMBSTONE;
                        this.valueList[i] = null;

                        this.keyList[j] = key;
                        this.valueList[j] = value;
                    }

                    this.modificationCount += 1;
                    output = oldValue

                    break
                }

                // Current slot is empty so an insertion can occur.
            } else {
                if (j === -1) {
                    this.usedBuckets += 1;
                    this.keyCount += 1;

                    this.keyList[i] = key;
                    this.valueList[i] = value;

                    // Previously seen bucket. Instead of inserting the new element at i where the null element
                    // is insert it where the deleted token was found.
                } else {
                    this.keyCount += 1;
                    this.keyList[j] = key;
                    this.valueList[j] = value;
                }

                this.modificationCount += 1;
                output = null;

                break;
            }
        }

        return output;
    }

    /**
     * Deletes the specified entry defined by the key K. - O(1) amortized
     * @param key - The key to delete. */
    public delete(key: K): V | null {
        let output: V | null = null;

        this.setupProbing(key)

        const offset = this.normalizeIndex(key.hashCode());

        for (let i = offset, x = 1; ; i = this.normalizeIndex(offset + this.probe((x += 1)))) {
            // Ignore tombstones.
            if (this.keyList[i] === this.TOMBSTONE) continue;

            if (this.keyList[i] === null) {
                output = null;

                break;
            }

            // Key is indeed in hash table.
            if (this.keyList[i] === key) {
                const oldValue = this.valueList[i];

                this.keyList[i] = this.TOMBSTONE;
                this.valueList[i] = null;

                this.modificationCount -= 1;
                this.keyCount -= 1;
            }
        }

        return output;
    }

    /*****************************************************************************
                                        HELPERS
    *****************************************************************************/
    /**
     * Converts a hash to an index by stripping the negative
     * sign and maps the hash to domain of `[0, capacity]`. */
    protected normalizeIndex(hash: number): number {
        return (hash & 0x7fffffff) % this.capacity;
    }

    protected increaseCapacity(): void {
        this.capacity = this.capacity * 2 + 1;
    }

    protected gcd(a: number, b: number): number {
        if (b === 0) return a;

        return this.gcd(a, a % b);
    }

    /** Doubles the size of the HashTable. */
    private resizeTable(): void {
        this.increaseCapacity();
        this.adjustCapacity();

        this.threshold = Math.trunc(this.capacity * this.maxLoadFactor);

        const oldKeyList = this.keyList;
        this.keyList = [];

        const oldValueList = this.valueList;
        this.valueList = [];

        this.keyCount = 0;
        this.usedBuckets = 0;

        for (let i = 0; i < oldKeyList.length; i++) {
            if (oldKeyList[i] && oldKeyList[i] !== this.TOMBSTONE) {
                this.set(oldKeyList[i], oldValueList[i]!);
            }
        }
    }
}

export default HashTableOpenAddressingBase;