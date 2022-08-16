<script lang="ts" setup>
import { onActivated, reactive, ref } from 'vue';
import { Deferred } from '../utils/deferred';
import utils from '../utils/utils';

const props = withDefaults(defineProps<{
    offsetToBottom?: number
}>(), {
    offsetToBottom: 200, // 默认距离底部200px触发事件
})

const scroll = ref<HTMLElement>();
let _scrollTop: number = 0;
let _startY: number;

// 触发敏感度
const Y_SENSITY = 5;
const Y_MAX = 80;

const emit = defineEmits<{
    (event: 'refresh', deferred: Deferred<any>): void
    (event: 'reach-bottom'): void
}>();

const onTouchStart = (e: TouchEvent) => {
    _startY = e.touches[0].pageY;
}

const state = reactive({
    /** 是否显示指示器 */
    indicatorShow: false,
    /** 指示器Y */
    indicatorY: 0,
    /** 指示器旋转 */
    indicatorRoate: 0,
    /** 松开刷新 */
    indicatorReady: false,
    /** 是否触发刷新 */
    indicatorActive: false
})

const onTouchMove = (e: TouchEvent) => {
    const currY = e.touches[0].pageY;
    if (state.indicatorActive) {
        return
    }
    if (currY > _startY + Y_SENSITY && _scrollTop === 0) {
        if (!state.indicatorShow) {
            state.indicatorShow = true
            state.indicatorReady = false
        } else {
            if (e.cancelable) {
                e.preventDefault()
            }
            const x = currY - _startY;
            state.indicatorY = Math.sqrt(x) * 5;
            // console.log(state.indicatorY)
            if (state.indicatorY > Y_MAX) {
                if (!state.indicatorReady) {
                    console.log("松开刷新")
                    state.indicatorReady = true
                }
            } else {
                state.indicatorRoate = x;
                if (state.indicatorReady) {
                    console.log("取消刷新")
                    state.indicatorReady = false
                }
            }
        }
    }
}

const onTouchEnd = async (_e: TouchEvent) => {
    if (state.indicatorReady) {
        state.indicatorReady = false
        state.indicatorActive = true
        try {
            const timer = setTimeout(() => {
                state.indicatorActive = false;
                console.log('超时了，自动关闭')
            }, 5000); // 最多5秒
            const deferred = utils.deferred();
            emit('refresh', deferred);
            await deferred;
            clearTimeout(timer); // 完成则清除
        } catch (e) {
            console.error(e);
        } finally {
            if (state.indicatorActive) {
                state.indicatorActive = false;
                state.indicatorShow = false;
            }
        }
    } else {
        state.indicatorShow = false;
    }
}

// 上拉加载
const onScroll = async (e: UIEvent) => {
    e.preventDefault();
    // 距离底部200px，且 2s 内不能重新请求
    if (scroll.value) {
        if (isScrollToBottom(scroll.value, props.offsetToBottom) && utils.throttle(onScroll, 2)) {
            emit('reach-bottom')
        }
    }
}

/**
 * 是否滑动到底部
 * @param target
 * @param offsetToBottom 
 * @returns 
 */
const isScrollToBottom = (target: HTMLElement, offsetToBottom: number = 0): boolean => {
    const { scrollTop, clientHeight, scrollHeight } = target;
    _scrollTop = scrollTop;
    return scrollTop + clientHeight >= scrollHeight - offsetToBottom;
}

onActivated(() => {
    // 回收的时候可以记得滚动的位置
    if (_scrollTop && scroll.value) {
        scroll.value!.scrollTo({
            top: _scrollTop,
        });
    }
})
</script>

<template>
    <div ref="scroll" class="flex flex-col flex-auto h-full relative overflow-scroll hidden-scrollbar" @touchstart="onTouchStart"
        @touchmove="onTouchMove" @touchend="onTouchEnd" @scroll="onScroll">
        <Transition name="zoom">
            <div v-if="state.indicatorShow || state.indicatorActive" role="status"
                class="absolute z-20 left-1/2 -ml-6 -mt-12 w-12 h-12 rounded-full flex items-center justify-center text-center bg-white shadow-md"
                :style="{ transform: `translateY(${state.indicatorY}px) rotate(${state.indicatorRoate}deg)` }">
                <svg :class="state.indicatorActive ? 'animate-spin fill-blue-600' : state.indicatorReady ? 'fill-blue-800' : 'fill-blue-200'"
                    aria-hidden="true" class="inline w-8 h-8 text-gray-200 dark:text-gray-600 transition-colors"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor" />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </Transition>
        <slot></slot>
    </div>
</template>

<style lang="css">
.zoom-leave-active {
    animation: zoom-out .3s ease-in forwards;
}

@keyframes zoom-out {
    60% {
        transform: scale(1.2);
    }

    to {
        transform: scale(0);
    }
}
</style>