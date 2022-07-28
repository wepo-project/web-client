import { Component, createApp, onUnmounted, h } from "vue";
import Loading, { Props } from "../components/Loading.vue"
import TopTips from "../components/TopTips.vue"
import { deferred, Deferred } from "./deferred";


/**
 * 工具类
 */
class Utils {
    // ======== 方便计算时间的毫秒数定义 ========
    SECOND = 1000;
    MINUTE = this.SECOND * 60;
    HOUR = this.MINUTE * 60;
    DAY = this.HOUR * 24;
    WEEK = this.DAY * 7;
    MONTH = this.DAY * 30;
    YEAR = this.DAY * 365;
    // ======================================

    /**
     * 格式化时间 距离现在多久
     * @param delta 
     * @returns 
     */
    format_time_delta(delta: number): string {
        if (delta < this.MINUTE) {
            return "刚刚"
        } else if (delta < this.HOUR) {
            const mins = Math.ceil(delta/this.MINUTE);
            return `${mins}分钟`
        } else if (delta < this.DAY) {
            const hours = Math.floor(delta/this.HOUR);
            return `${hours}小时`
        } else if (delta < this.WEEK) {
            const days = Math.floor(delta/this.DAY);
            return `${days}天`
        } else if (delta < this.WEEK * 2) {
            return `上周`
        } else if (delta < this.MONTH) {
            const weeks = Math.floor(delta/this.WEEK);
            return `${weeks}周`
        } else if (delta < this.YEAR) {
            const months = Math.floor(delta/this.MONTH);
            return `${months}月`
        } else {
            const years = Math.floor(delta/this.YEAR);
            return `${years}年`
        }
    }

    /**
     * 格式化时间
     * @param time 
     * @param delta_limit 
     * @returns 
     */
    format_time(time: string, delta_limit = this.HOUR): string {
        let date = new Date(time);
        let now = new Date();
        let delta = now.valueOf() - date.valueOf();
        if (delta > delta_limit) {
            // 年份相同
            if (date.getFullYear() == now.getFullYear()) {
                const _month = this.#pad0(date.getMonth() + 1);
                const _date = this.#pad0(date.getDate());
                const _hour = this.#pad0(date.getHours());
                const _min = this.#pad0(date.getMinutes());
                return `${_month}/${_date} ${_hour}:${_min}`
            } else {
                return date.toLocaleString();
            }
        } else {
            return this.format_time_delta(delta);
        }
    }

    /**
     * 补0
     * @param num 
     * @returns 
     */
    #pad0(num: number): string {
        if (num < 10) {
            return `0${num}`
        }
        return num.toString()
    }

    /**
     * 动态创建组件
     * @param comp 
     * @param props 
     */
    dynamicMount<P = any>(comp: Component<P>, props?: Record<string, unknown>): Promise<any> {
        return new Promise(resolve => {
            let root = h(comp as any, {
                onClose: () => {
                    app.unmount();
                    document.body.removeChild(div);
                    resolve(null)
                }
            })
            const app = createApp(root, { ... props });
            const div = document.createElement('div');
            document.body.appendChild(div);
            app.mount(div);
        })
    }

    /**
     * 延迟 n ms
     * @param ms 
     * @returns 
     */
    delay(ms: number = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /** 延迟 promise */
    deferred<T>(): Deferred<T> {
        return deferred();
    }

    /**
     * 显示加载框
     * @param promise 
     * @returns 
     */
    showLoading(promise: Promise<any>) {
        return this.dynamicMount(Loading as any, { promise });
    }

    /**
     * 显示顶部提示
     */
    showTopTips(text: string) {
        return this.dynamicMount(TopTips, { text });
    }

    /**
     * 浅克隆
     * @param data 
     * @returns 
     */
    clone<T>(data: T): T {
        if (Array.isArray(data)) {
            return [...data] as unknown as T
        } else {
            return { ...data };
        }
    }

    /**
     * 深克隆 通过 JSON 序列化的方式
     * @param data 
     * @returns 
     */
    deepCloneByJSON(data: any): Record<string, any> {
        return JSON.parse(JSON.stringify(data))
    }

    /**
     * 节流集合
     */
    #throttle_set = new Set<Function>();
    
    /**
     * 节流
     * @param func 
     * @param interval 单位：秒
     * @returns { boolean } 返回 false 为不执行
     */
    throttle(func: Function, interval: number = 1): boolean {
        if (this.#throttle_set.has(func)) {
            return false;
        }
        this.#throttle_set.add(func);
        setTimeout(() => {
            this.#throttle_set.delete(func);
        }, interval * 1000)
        return true;
    }


}


export const utils = new Utils();

export default utils;