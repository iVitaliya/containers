import { Hashable } from "./Entry";
import HashTableOpenAddressingBase from "./OpenAddressingBase";

class HashTableLinearProbing<K extends Hashable, V> extends HashTableOpenAddressingBase<K, V> {
    private LINEAR_CONSTANT = 17;

    constructor(capacity: number, loadFactor: number) {
        super(capacity, loadFactor);
    }

    setupProbing(key: K): void { }

    public probe(x: number): number {
        return this.LINEAR_CONSTANT * x;
    }

    public adjustCapacity(): void {
        while (this.gcd(this.LINEAR_CONSTANT, this.capacity) !== 1) {
            this.capacity += 1;
        }
    }
}

export default HashTableLinearProbing;