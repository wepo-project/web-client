<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { reactive, toRef, toRefs, watch } from 'vue';
import HomeIcon from '../svg/tabs/HomeIcon.vue';
import UserIcon from '../svg/tabs/UserIcon.vue';
import NoticeIcon from '../svg/tabs/NoticeIcon.vue';
import Badge from './Badge.vue';
import { red } from '../utils/notificationTree';
const route = useRoute();
const tabs = [
    { name: "home", title: "HOME", icon: HomeIcon },
    { name: "notification", title: "NOTIFICATION", icon: NoticeIcon, tree: red.notification },
    { name: "me", title: "ME", icon: UserIcon },
];
const getIndex = () => tabs.findIndex((e) => route.name == e.name)
const state = reactive({
    currTab: getIndex(),
})
watch(route, () => {
    state.currTab = getIndex()
})
</script>
<template>
    <ul v-if="state.currTab != -1" class="relative z-50 flex flex-row flex-wrap bg-white list-none top-shadow pl-0">
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

<style lang="css">
.top-shadow {
    box-shadow: 0 0 1px #aaa;
}
</style>