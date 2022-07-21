<script lang="ts" setup>
import BackIcon from '../svg/BackIcon.vue';
const props = defineProps({
    title: {
        type: String,
    }
})
</script>

<template>
    <div class="flex flex-col">
        <div class="relative flex items-center justify-center h-16 bg-white drop-shadow">
            <div class="absolute left-3 flex items-center justify-center h-10 w-10 bg-transparent hover:bg-gray-100" @click="$router.back()">
                <BackIcon />
            </div>
            <div class="font-bold text-lg">{{props.title}}</div>
        </div>
        <slot class="flex-1"/>
    </div>
</template>