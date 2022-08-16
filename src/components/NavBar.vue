<script lang="ts" setup>
import { useRouter } from 'vue-router';
import BackIcon from '../svg/BackIcon.vue';
import MenuIcon from '../svg/MenuIcon.vue';
const props = withDefaults(defineProps<{
    title: string,
    hasBack?: boolean
    hasMenu?: boolean,
}>(), {
    hasBack: true,
    hasMenu: false,
})
const router = useRouter();

const emit = defineEmits(["menuOpen"]);

const onClick = () => {
    if (props.hasBack) {
        router.back()
    } else if (props.hasMenu) {
        emit("menuOpen")
    }
}

</script>

<template>
    <div class="flex flex-col">
        <div class="relative z-50 flex items-center justify-center h-11 bg-white dark:bg-[#202023] dark:text-white drop-shadow">
            <div v-if="hasBack || hasMenu"
                class="absolute left-3 flex items-center justify-center rounded-full h-8 w-8 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-700"
                @click="onClick">
                <BackIcon v-if="hasBack"/>
                <MenuIcon v-else-if="hasMenu"/>
            </div>
            <div class="font-bold w-full text-center text-lg select-none">{{props.title}}</div>
            <div class="absolute right-3">
                <slot name="action"></slot>
            </div>
        </div>
        <div class="flex-1 flex flex-col overflow-scroll hidden-scrollbar">
            <slot />
        </div>
    </div>
</template>