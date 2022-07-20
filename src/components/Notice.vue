<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import client from '../axios/client';
import { NoticeComment, PagingData, defaultPaging } from '../data';
import utils from '../utils/utils';

interface Tab {
    name: string
}

const comments_tab: Tab = { name: "Comments" };
const likes_tab: Tab = { name: "Likes" };
const hates_tab: Tab = { name: "Hates" };

const state = reactive<{
    comments: PagingData<NoticeComment>,
    tabs: Tab[],
    currTab: Tab,
}>({
    comments: defaultPaging(),
    tabs: [
        comments_tab,
        likes_tab,
        hates_tab,
    ],
    currTab: comments_tab,
})

onMounted(async () => {
    let resp = await client.post('msg', 'comments', {
        data: { page: 1 },
    })
    if (resp.data.list) {
        state.comments = resp.data;
    }
})

const onTabChange = (item: Tab) => {
    state.currTab = item;
}
</script>

<template>
    <div>
        <ul class="tab-container">
            <li v-for="(item, index) in state.tabs" :class="index == state.tabs.length - 1 ? '' : 'mr-2'">
                <a href="#" class="tab" :class="state.currTab.name == item.name ? 'active' :''" @click="onTabChange(item)">{{item.name}}</a>
            </li>
        </ul>
        <div v-if="state.currTab.name == comments_tab.name">
            <router-link :to="{ name: 'po', params: { id: item.post_id } }" v-for="(item) in state.comments.list" class="block border-b p-4">
                <div class="flex pb-2">
                    <img class="w-10 h-10 rounded" :src="item.sender.avatar_url" alt="avatar" />
                    <div class="flex flex-col ml-2">
                        <div class="dark-white">{{ item.sender.nick }}</div>
                        <div class="text-sm text-gray-500">{{ utils.format_time(item.create_time) }}</div>
                    </div>
                </div>
                <div class="mb-2 text-base dark-white whitespace-pre-line">{{ item.content }}</div>
                <router-link :to="{ name: 'po', params: { id: item.origin_id } }" class="block cursor-pointer border border-gray-400 rounded-md p-2 mb-2">
                    <div class="mb-1 text-base dark-white whitespace-pre-line">{{ item.origin }}</div>
                    <div class="text-xs text-gray-500">{{ utils.format_time(item.origin_create_time) }}</div>
                </router-link>
            </router-link>
        </div>
    </div>
</template>