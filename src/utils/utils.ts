import { Component, createApp, onUnmounted, h } from "vue";
import Loading, { Props } from "../components/Loading.vue"

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

    /**
     * 显示加载框
     * @param promise 
     * @returns 
     */
    showLoading(promise: Promise<any>) {
        return this.dynamicMount(Loading as any, { promise });
    }

    /**
     * 浅克隆
     * @param data 
     * @returns 
     */
    clone<T>(data: T): T {
        return { ...data };
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
     * 是否滑动到底部
     * @param e 
     * @param offsetToBottom 
     * @returns 
     */
    isScrollToBottom(e: UIEvent, offsetToBottom: number = 0): boolean {
        const { target } = e;
        const { scrollTop, clientHeight, scrollHeight } = target as any;
        return scrollTop + clientHeight >= scrollHeight - offsetToBottom;
    }

    /**
     * 节流集合
     */
    #throttle_set = new Set<Function>();
    
    /**
     * 节流
     * @param func 
     * @param interval 
     * @returns 
     */
    throttle(func: Function, interval: number = 1000): boolean {
        if (this.#throttle_set.has(func)) {
            return true;
        }
        this.#throttle_set.add(func);
        setTimeout(() => {
            this.#throttle_set.delete(func);
        }, interval)
        return false;
    }
}


export const utils = new Utils();

export default utils;