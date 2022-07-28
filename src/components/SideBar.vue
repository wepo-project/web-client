<script lang="ts" setup>
import { reactive } from '@vue/runtime-dom';
import Tabs, { Tab } from './Tabs.vue';

withDefaults(defineProps<{
    tabs: Tab[]
    initial: number
    show: boolean
}>(), {
    initial: 0,
})

const emit = defineEmits(["change", "close"]);

const state = reactive({
    closing: false,
})

const onTabChange = (name: string) => {
     emit("change", name);
}

const onAniEnd = (e: AnimationEvent) => {
    if (e.animationName === "slide-out") {
        emit('close');
        state.closing = false
    }
}

</script>

<template>
    <Teleport v-if="show" to="body">
        <div class="fixed top-0 left-0 z-[51] w-full h-full">
            <div class="absolute bg-black opacity-40 w-full h-full" :class="state.closing ? 'fade-out' : 'fade-in'" @click="state.closing = true"></div>
            <div class="absolute h-full w-2/3 bg-white" :class="state.closing ? 'slide-out' : 'slide-in'" @animationend="onAniEnd">
                <slot />
                <Tabs :tabs="tabs" :initial="initial" :horizontal="false" @change="onTabChange" />
            </div>
        </div>
    </Teleport>
</template>

<style lang="css">
.slide-in {
    animation: slide-in .3s ease-out forwards;
}
@keyframes slide-in {
    from {
        transform: translateX(-100%);
    }
}
.slide-out {
    animation: slide-out .3s ease-in forwards;
}
@keyframes slide-out {
    to {
        transform: translateX(-100%);
    }
}
.fade-in {
    animation: fade-in .3s forwards;
}
@keyframes fade-in {
    from {
        opacity: 0;
    }
}
.fade-out {
    animation: fade-out .3s forwards;
}
@keyframes fade-out {
    to {
        opacity: 0;
    }
}
</style>