<script lang="ts" setup>
defineProps<{
    text: string
}>()
const emit = defineEmits(['close'])
const onEnd = (e: AnimationEvent) => { 
    if (e.animationName === "drop-in") {
        emit('close');
    }
}
</script>

<template>
    <div class="drop-in fixed left-1/2 top-[50px] -translate-x-1/2 z-[100] bg-red-900 px-2 py-1 text-white text-sm" @animationend="onEnd">
        <span>{{text}}</span>
    </div>
</template>

<style lang="css">
.box-shadow {
    box-shadow: 0.1rem 0.1rem 1rem #666;
}
.drop-in {
    animation: drop-in 3s ease-in-out forwards
}
@keyframes drop-in {
    0% {
        opacity: 0;
    }
    30% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>