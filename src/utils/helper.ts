type Serializer<T> = (value: T) => string;
type Deserializer<T> = (raw: string | null) => T | null;

/**
 * LocalStorage的帮助类
 * 可以防止多次字面量的使用，或额外的定义。
 * 支持序列化和反序列化
 */
export default class LocalStorageController<T> {
    key: string;
    value: T | null
    serializer: Serializer<T>;
    deserializer: Deserializer<T>;
    constructor(opt: {
        key: string, 
        default?: T,
        serializer: Serializer<T>, 
        deserializer: Deserializer<T>
    }) {
        this.key = opt.key;
        this.serializer = opt.serializer;
        this.deserializer = opt.deserializer;
        this.value = this.get()
        // 如果获取出来的是null，且默认值不为 undefined，则设置默认值
        if (this.value == null && opt.default != void 0) {
            this.set(opt.default)
        }
    }
    /**
     * 设置 value 值，并且同步到localStorage
     * @param value 
     */
    set(value: T): void {
        try {
            let new_value = this.serializer(value);
            localStorage.setItem(this.key, new_value);
            this.value = value;
        } catch(e) {
            console.error('serialize error');
        }
    }
    /**
     * 获取值
     * @returns 
     */
    get(): T | null {
        let raw = localStorage.getItem(this.key);
        try {
            return this.deserializer(raw);
        } catch(e) {
            console.error('descrialize error');
            return null;
        }
    }
    /**
     * 移除值，从存储中移除
     */
    remove() {
        localStorage.removeItem(this.key);
        this.value = null;
    }
}
/**
 * 字符串存储
 */
export class StorageString extends LocalStorageController<string> {
    constructor(key: string, defaultValue?: string) {
        super({
            key: key, 
            default: defaultValue, 
            serializer: (val) => val,
            deserializer: (val) => val,
        });
    }
}

/**
 * 字符串存储
 */
 export class StorageBoolean extends LocalStorageController<boolean> {
    constructor(key: string, defaultValue?: boolean) {
        super({
            key: key, 
            default: defaultValue, 
            serializer: (val) => val ? '1' : '',
            deserializer: (val) => !!val,
        });
    }

    change() {
        this.set(!this.value);
    }
}