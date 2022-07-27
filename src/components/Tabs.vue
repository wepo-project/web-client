<script lang="ts" setup>
import { reactive } from 'vue';

export interface Tab {
    emoji?: string
    name: string
}
const props = withDefaults(defineProps<{
    tabs: Tab[]
    initial: number
    horizontal?: boolean
}>(), {
    initial: 0,
    horizontal: true,
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
    <ul class="tab-container bg-white dark:bg-[#333333]" :class="horizontal ? 'pt-2 px-3' : 'vertical'">
        <li v-for="(item, index) in tabs" :class="horizontal ? index == tabs.length - 1 ? '' : 'mr-2' : 'w-full'">
            <div class="tab" :class="state.curr == index ? 'active' : ''"
                @click="onTabChange(item, index)">
                <span v-if="item.emoji" class="mr-1">{{item.emoji}} </span>
                <span>{{ item.name }}</span>
            </div>
        </li>
    </ul>
</template>

<style lang="css">
.tab-container {
    @apply flex overflow-scroll hidden-scrollbar items-end text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400;
}
.tab-container.vertical {
    @apply flex-col border-r h-full;
}
.tab {
    @apply flex p-4 select-none rounded-t-lg whitespace-nowrap hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300;
}
.tab.active {
    @apply text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500;
}
.tab-container.vertical .tab {
    @apply rounded-none flex items-center justify-start;
}
</style>