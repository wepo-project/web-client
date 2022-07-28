<script lang="ts" setup>
import { VueElement } from 'vue';
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
            <div v-if="hasBack || hasMenu" class="absolute left-3 flex items-center justify-center h-8 w-8 bg-transparent hover:bg-gray-100" @click="onClick">
                <BackIcon v-if="hasBack"/>
                <MenuIcon v-else-if="hasMenu"/>
            </div>
            <!-- <slot name="menu"></slot> -->
            <div class="font-bold text-lg select-none">{{props.title}}</div>
        </div>
        <div class="flex-1 overflow-scroll hidden-scrollbar">
            <slot />
        </div>
    </div>
</template>