<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { reactive, watch } from 'vue';
import HomeIcon from '../svg/tabs/HomeIcon.vue';
import UserIcon from '../svg/tabs/UserIcon.vue';
import NoticeIcon from '../svg/tabs/NoticeIcon.vue';
const route = useRoute();
const tabs = [
    { name: "home", title: "HOME", icon: HomeIcon },
    // { name: "send", title: "SEND" },
    { name: "notification", title: "NOTIFICATION", icon: NoticeIcon, },
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
    <ul v-if="state.currTab != -1" class="flex flex-row flex-wrap list-none border-b-0 pl-0">
        <li v-for="(item, index) in tabs" class="flex-auto flex items-center justify-center" role="presentation">
            <router-link :to="{ name: item.name }" class="
            w-full
            flex
            items-center
            justify-center
            font-medium
            text-center
            text-xs
            leading-tight
            uppercase
            border-x-0 border-t-0 border-b-2 border-transparent
            px-6
            py-4
            dark-white
            select-none
            hover:border-transparent hover:bg-gray-100
            focus:border-transparent
            dark:hover:bg-[#48484f]
            active
            " :class="state.currTab==index?'bg-gray-100 dark:bg-[#48484f]':''">
                <component :is="item.icon"/>
            </router-link>
        </li>
    </ul>
</template>