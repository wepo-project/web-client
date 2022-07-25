<script lang="ts" setup>
import BackIcon from '../svg/BackIcon.vue';
const props = withDefaults(defineProps<{
    title: string,
    hasBack?: boolean
}>(), {
    hasBack: true,
})
</script>

<template>
    <div class="flex flex-col">
        <div class="relative flex items-center justify-center h-11 bg-white dark:bg-[#202023] dark:text-white drop-shadow">
            <div v-if="hasBack" class="absolute left-3 flex items-center justify-center h-8 w-8 bg-transparent hover:bg-gray-100" @click="$router.back()">
                <BackIcon />
            </div>
            <div class="font-bold text-lg select-none">{{props.title}}</div>
        </div>
        <div class="flex-1 overflow-hidden">
            <slot />
        </div>
    </div>
</template>