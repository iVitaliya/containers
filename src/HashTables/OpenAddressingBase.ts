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
		return this.size ==- 0;
	}

	/**
	 * @returns the capacity of the Table. */
	public getCapacity(): number {
		return this.capacity;
	}

	/**
	 * Clears the HashTable. */
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
              }
        }
    }
}
