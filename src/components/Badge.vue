<script lang="ts" setup>
import { DisplayProperty, PositionProperty } from 'csstype';
import { onUnmounted, reactive } from 'vue';
import { NotificationTree } from '../utils/notificationTree.js';

const props = withDefaults(defineProps<{
    tree?: NotificationTree
    position?: PositionProperty,
}>(), {
    position: 'absolute',
});

const state = reactive({
    value: props.tree?.value ?? 0,
})

const listener = (val: number) => {
    state.value = val;
}
    
const handler = props.tree?.listen(listener)

onUnmounted(() => {
    handler?.cancel()
})
</script>

<template>
    <div class="relative">
        <div v-if="state.value"
            class="inline-flex -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
            :style="{
                position: position,
            }">
            {{state.value}}
        </div>
        <slot></slot>
    </div>
</template>