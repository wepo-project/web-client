<script lang="ts" setup>
import { reactive } from 'vue';

export interface Tab {
    name: string
}
const props = withDefaults(defineProps<{
    tabs: Tab[],
    initial: number,
}>(), {
    initial: 0
})

const state = reactive({
    curr: props.initial,
})

const emit = defineEmits(["change"]);

const onTabChange = (item: Tab, index: number) => {
    emit("change", item.name);
    state.curr = index;
}

</script>

<template>
    <ul class="tab-container bg-white dark:bg-[#333333] pt-2 px-3">
        <li v-for="(item, index) in props.tabs" :class="index == props.tabs.length - 1 ? '' : 'mr-2'">
            <div class="tab" :class="state.curr == index ? 'active' : ''"
                @click="onTabChange(item, index)">{{ item.name }}</div>
        </li>
    </ul>
</template>

<style lang="css">
.tab-container {
    @apply flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400;
}
.tab {
    @apply inline-block p-4 select-none rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300;
}
.tab.active {
    @apply text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500;
}
</style>