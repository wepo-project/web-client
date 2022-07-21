class Utils {
    SECOND = 1000;
    MINUTE = this.SECOND * 60;
    HOUR = this.MINUTE * 60;
    DAY = this.HOUR * 24;
    WEEK = this.DAY * 7;
    MONTH = this.DAY * 30;
    YEAR = this.DAY * 365;

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

    #pad0(num: number): string {
        if (num < 10) {
            return `0${num}`
        }
        return num.toString()
    }
}


export default new Utils();