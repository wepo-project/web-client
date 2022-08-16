<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, reactive, toRef, toRefs, watch } from 'vue';
import HomeIcon from '../svg/tabs/HomeIcon.vue';
import UserIcon from '../svg/tabs/UserIcon.vue';
import NoticeIcon from '../svg/tabs/NoticeIcon.vue';
import Badge from './Badge.vue';
import { red } from '../utils/red';
const route = useRoute();
const tabs = [
    { name: "home", title: "HOME", icon: HomeIcon },
    { name: "notification", title: "NOTIFICATION", icon: NoticeIcon, tree: red.notification },
    { name: "me", title: "ME", icon: UserIcon },
];
const setIndex = () => {
    state.currTab = tabs.findIndex((e) => route.name == e.name)
    if (state.currTab != -1) {
        state.show = true;
        state.hidding = false;
    } else {
        state.hidding = true;
    }
}
const state = reactive({
    currTab: -1,
    show: false,
    hidding: false,
})
onMounted(() => {
    setIndex();
})
watch(route, async () => {
    setIndex();
})
const onAniEnd = (e: AnimationEvent) => {
    if (state.hidding) {
        state.hidding = false;
        state.show = false;
    }
}
</script>
<template>
    <ul v-if="state.show" class="relative z-50 h-14 flex flex-row flex-wrap bg-white list-none top-shadow pl-0" :class="state.hidding ? 'slide-out' :'slide-in'" @animationend="onAniEnd">
        <li v-for="(item, index) in tabs" class="flex-auto flex items-center justify-center" role="presentation">
            <div @click="$router.push({ name: item.name })"
                :class="state.currTab == index ? 'dark:bg-black' : 'dark:bg-[#292a2d]'"
                class="w-full flex items-center justify-center font-medium text-center text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-4 dark-white select-none hover:border-transparent focus:border-transparent active">
                <Badge :tree="item.tree">
                    <component :is="item.icon" :active="state.currTab == index" />
                </Badge>
            </div>
        </li>
    </ul>
</template>

<style lang="css" scoped>
.top-shadow {
    box-shadow: 0 0 1px #aaa;
}
.slide-in {
    animation: slide-in .3s forwards;
}
@keyframes slide-in {
    0%  {
        transform: translateY(100%);
    }
}
.slide-out {
    animation: slide-out .3s forwards;
}
@keyframes slide-out {
    100%  {
        transform: translateY(100%);
    }
}
</style>