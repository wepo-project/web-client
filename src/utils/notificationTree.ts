const ROOT_NAME = "@ROOT";
type SPLIT = "/";
type JoinType<A extends string, B extends string> = `${A}${SPLIT}${B}`
type Callback = (val: number) => void;

export type ExtractType<Type> = Type extends NotificationTree<infer P, infer C> ? NotificationTree<P, C> : never;
export type ExtractPrev<Type> = Type extends NotificationTree<infer P, string> ? P : never;
export type ExtractCurr<Type> = Type extends NotificationTree<string, infer C> ? C : never;

/**
 * NotificationTree
 * The `ROOT` instance can only be instantiated once.
 * Prev: ancestors path
 * Curr: children names
 */
export class NotificationTree<Prev extends string = string, Curr extends string = string> {
    static ROOT: NotificationTree | null = null;

    name: string;
    private parent: NotificationTree | null;
    private children: Record<Curr, NotificationTree>;
    private _value: number = 0;
    private listener: Map<Callback, { target: any, once: boolean }>;

    /**
     * @en
     * Create an root node of NotificationTree
     * also can create by constructor
     * @zh
     * 创建一个通知树的根结点，也可以通过构造函数来创造
     * @returns Root Node
     */
    static root<Name extends string = string>(children: Name[]): NotificationTree<typeof ROOT_NAME, Name> {
        if (this.ROOT) {
            console.error(`can not create root node duplicatly`)
            return this.ROOT
        } else {
            const _root = new NotificationTree(null, ROOT_NAME, children);
            this.ROOT = _root;
            return _root;
        }
    }

    private constructor(parent: NotificationTree<string, string> | null, name: Prev, childrenName: Curr[]) {
        this.parent = parent;
        this.name = name;
        this.expandChildren(childrenName);
        this.listener = new Map();
    }

    /**
     * @en
     * append children with name list
     * @zn
     * 通过名字列表添加子结点
     * @param childrenName 
     */
    private expandChildren(childrenName: Curr[]) {
        const children: typeof this.children = {} as any;
        for (const name of childrenName) {
            if (children[name] === void 0) {
                children[name] = new NotificationTree(this as any, name, []);
            } else {
                console.warn(`duplicate node name: ${name}`);
            }
        }
        this.children = children;
    }

    get value() {
        return this._value;
    }

    /**
     * @en
     * use private decorations to prevent external calls to value setters
     * @zn
     * 私有setter防止外部调用
     */
    private set value(newVal: number) {
        const delta = newVal - this._value;
        if (this.parent) {
            this.parent!.value += delta;
        }
        this._value = newVal;
        try {
            for (const [callback, { target, once }] of this.listener.entries()) {
                callback.call(target, newVal);
                if (once) {
                    this.unListen(callback);
                }
            }
        } catch (e) {
            // use try-catch to prevent break the setter chain
            console.error(e);
        }
    }

    /**
     * @en
     * append children to this node with specify name list
     * @zh
     * 拓展子节点，传入名字列表
     * @param which 
     * @param names 
     * @returns 
     */
    expand<Name extends string, WhichOne extends Curr>(which: WhichOne, names: Name[]): NotificationTree<JoinType<Prev, WhichOne>, Name> {
        this.children[which].expandChildren(names);
        return this.children[which];
    }

    /**
     * @en
     * set value, it will trigger ancestors' changed their value.
     * make sure it's leaf node otherwise value will out of sync.
     * @zh
     * 设置值，会触发所有父结点改变其值
     * 确保它是叶节点，否则值将不同步
     * @param value 
     */
    setValue(value: number) {
        if (Object.keys(this.children).length) {
            console.warn(`this node has children, set it's value can't keep the values consistent`)
        }
        this.value = value;
    }

    /**
     * @en
     * get children by name.
     * make children field private in order to prevent children modified external
     * @zh
     * 通过名称获取子结点
     * 为了防止外部修改，让children字段设置为私有
     * @param childName 
     * @returns 
     */
    getChild<N extends Curr, C extends string>(childName: N): Omit<NotificationTree<JoinType<Prev, N>, C>, 'getChild'> {
        if (childName in this.children) {
            return this.children[childName]
        } else {
            throw new Error(`${childName} is not [${this.name}]'s child`);
        }
    }

    /**
     * @en
     * subscribe value changed event
     * @zh
     * 订阅值改变的事件
     * @param callback 
     * @param options target: context, once: cancel once triggered
     * @returns a handler to unsubscribe event
     */
    listen(callback: Callback, options: {
        target?: any,
        once: boolean,
    } = { target: null, once: false }) {
        this.listener.set(callback, { target: options.target, once: options.once });
        return { cancel: () => this.unListen(callback) }
    }

    /**
     * @en
     * unsubscribe value changed event
     * @zh
     * 取消订阅
     * @param callback
     */
    unListen(callback: Callback) {
        this.listener.delete(callback);
    }

    /**
     * @en
     * dump value to console to show value intuitively in console
     * @zh
     * 在控制台以一棵树的形状打印所有值
     */
    dump() {
        console.groupCollapsed(`${this.name} -> ${this.value}`);
        for (const key in this.children) {
            const child = this.children[key];
            if (Object.keys(child.children).length) {
                child.dump();
            } else {
                console.log(`${child.name} -> ${child.value}`)
            }
        }
        console.groupEnd();
    }
}