type Serializer<T> = (value: T) => string;
type Deserializer<T> = (raw: string | null) => T | null;

export default class LocalStorageController<T> {
    key: string;
    value: T | null
    serializer: Serializer<T>;
    deserializer: Deserializer<T>;
    constructor(opt: {key: string, serializer: Serializer<T>, deserializer: Deserializer<T>}) {
        this.key = opt.key;
        this.serializer = opt.serializer;
        this.deserializer = opt.deserializer;
        this.value = this.get()
    }
    set(value: T): void {
        try {
            let new_value = this.serializer(value);
            localStorage.setItem(this.key, new_value);
            this.value = value;
        } catch(e) {
            console.error('serialize error');
        }
    }
    get(): T | null {
        let raw = localStorage.getItem(this.key);
        try {
            return this.deserializer(raw);
        } catch(e) {
            console.error('descrialize error');
            return null;
        }
    }
    remove() {
        localStorage.removeItem(this.key);
        this.value = null;
    }
}